// Run: node scripts/sync-queue.test.mjs
// Simulates the progress-saving of many students at once against a fake cloud (virtual time, so the
// "minutes" below run instantly): rapid tapping, a flaky network that fails writes at random, a whole
// offline period, and tabs closed right after the last change. It checks that nothing is lost, that
// writes are batched, and that no student ever has two writes in flight.
import assert from "node:assert/strict";
import { createSyncQueue } from "../shared/sync-queue.js";

// ---- virtual clock ----
function makeClock(){
  let t = 0, seq = 0; const timers = [];
  const tick = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
  return {
    now: () => t,
    setTimer(fn, ms){ const id = ++seq; timers.push({ id, at: t + ms, fn }); return id; },
    clearTimer(id){ const i = timers.findIndex((x) => x.id === id); if (i >= 0) timers.splice(i, 1); },
    async advance(ms){
      const end = t + ms;
      for (;;){
        timers.sort((a, b) => a.at - b.at || a.id - b.id);
        if (!timers.length || timers[0].at > end) break;
        const nx = timers.shift(); t = Math.max(t, nx.at); nx.fn(); await tick();
      }
      t = end; await tick();
    },
  };
}
// tiny deterministic RNG
function rng(seed){ let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ---- fake cloud shared by all students ----
function makeCloud(clock, rand, { failRate = 0, latency = [50, 400] } = {}){
  const store = new Map(); const stats = { writes: 0, failed: 0, maxInflightPerUser: 0 };
  const inflight = new Map(); let down = false;
  return {
    store, stats,
    setDown(v){ down = v; },
    setFailRate(v){ failRate = v; },
    writer(uid){
      return (value) => new Promise((resolve, reject) => {
        const n = (inflight.get(uid) || 0) + 1; inflight.set(uid, n); stats.maxInflightPerUser = Math.max(stats.maxInflightPerUser, n);
        const lat = latency[0] + Math.floor(rand() * (latency[1] - latency[0]));
        clock.setTimer(() => {
          inflight.set(uid, inflight.get(uid) - 1);
          if (down || rand() < failRate){ stats.failed++; reject(new Error("network")); return; }
          stats.writes++; store.set(uid, JSON.parse(JSON.stringify(value))); resolve();
        }, lat);
      });
    },
  };
}

const sig = (v) => JSON.stringify(v);
function makeStudent(uid, clock, cloud){
  const progress = { done: 0, uid };
  const q = createSyncQueue({ write: cloud.writer(uid), now: clock.now, setTimer: clock.setTimer, clearTimer: clock.clearTimer, signature: sig });
  return { uid, progress, q, tap(){ progress.done++; q.schedule(() => JSON.parse(JSON.stringify(progress))); } };
}

async function scenarioBatching(){
  const clock = makeClock(), rand = rng(1), cloud = makeCloud(clock, rand);
  const students = Array.from({ length: 100 }, (_, i) => makeStudent("u" + i, clock, cloud));
  // 10 minutes of studying: each student changes their progress (answers a question, finishes a step...)
  // about every other second, all 100 at once
  for (let sec = 0; sec < 600; sec++) {
    for (const s of students) if (rand() < 0.5) s.tap();
    await clock.advance(1000);
  }
  const flushes = students.map((s) => s.q.flush());   // everyone closes their tab at once
  await clock.advance(5000); await Promise.all(flushes);
  const totalTaps = students.reduce((a, s) => a + s.progress.done, 0);
  for (const s of students) assert.equal(cloud.store.get(s.uid).done, s.progress.done, "lost update for " + s.uid);
  assert.equal(cloud.store.size, 100);
  assert.ok(cloud.stats.maxInflightPerUser === 1, "two writes in flight for one student");
  assert.ok(cloud.stats.writes < totalTaps / 3, `not batched: ${cloud.stats.writes} writes for ${totalTaps} taps`);
  console.log(`  batching: 100 students studying at once, ${totalTaps} changes over 10 min -> ${cloud.stats.writes} cloud writes (${(cloud.stats.writes / 100).toFixed(1)} per student), 0 lost`);
}

async function scenarioFlaky(){
  const clock = makeClock(), rand = rng(2), cloud = makeCloud(clock, rand, { failRate: 0.5 });
  const students = Array.from({ length: 100 }, (_, i) => makeStudent("u" + i, clock, cloud));
  for (let i = 0; i < 60; i++) { for (const s of students) if (rand() < 0.3) s.tap(); await clock.advance(2000); }
  cloud.setFailRate(0);                       // the network recovers
  await clock.advance(5 * 60 * 1000);          // retries catch up on their own
  for (const s of students) assert.equal((cloud.store.get(s.uid) || {}).done, s.progress.done, "lost under failures: " + s.uid);
  assert.ok(cloud.stats.failed > 500, "the test should have produced many failures");
  console.log(`  flaky network (50% of writes fail): ${cloud.stats.failed} failures, all 100 students fully saved after recovery`);
}

async function scenarioOffline(){
  const clock = makeClock(), rand = rng(3), cloud = makeCloud(clock, rand);
  const students = Array.from({ length: 100 }, (_, i) => makeStudent("u" + i, clock, cloud));
  cloud.setDown(true);                         // everyone loses signal for 3 minutes while studying
  for (let i = 0; i < 90; i++) { for (const s of students) if (rand() < 0.2) s.tap(); await clock.advance(2000); }
  assert.ok(students.every((s) => s.q.isPending() || s.progress.done === 0));
  cloud.setDown(false);                        // signal returns: the gate flushes everyone at once
  const flushes = students.map((s) => s.q.flush());
  await clock.advance(5000); await Promise.all(flushes);
  for (const s of students) assert.equal((cloud.store.get(s.uid) || { done: 0 }).done, s.progress.done, "lost offline: " + s.uid);
  console.log("  3 minutes fully offline, then back online: every student saved, nothing lost");
}

async function scenarioClose(){
  const clock = makeClock(), rand = rng(4), cloud = makeCloud(clock, rand);
  const s = makeStudent("u1", clock, cloud);
  s.tap(); s.tap(); s.tap();
  await clock.advance(100);                    // tab closed 100 ms after the last change: debounce still waiting
  assert.equal(cloud.store.get("u1"), undefined);
  const f = s.q.flush();                       // what the pagehide / visibilitychange handler does
  await clock.advance(1000); await f;
  assert.equal(cloud.store.get("u1").done, 3);
  console.log("  tab closed right after the last change: flush() saves it");
}

async function scenarioMaxWait(){
  const clock = makeClock(), rand = rng(5), cloud = makeCloud(clock, rand);
  const s = makeStudent("u1", clock, cloud);
  for (let i = 0; i < 600; i++) { s.tap(); await clock.advance(100); }   // non-stop activity for 60 s
  assert.ok(cloud.stats.writes >= 2, "must save during continuous activity (maxWait), saw " + cloud.stats.writes);
  assert.ok(cloud.stats.writes <= 6, "should still batch, saw " + cloud.stats.writes);
  console.log(`  non-stop activity for 60 s: saved ${cloud.stats.writes} times (never starved by the debounce)`);
}

async function scenarioNoop(){
  const clock = makeClock(), rand = rng(6), cloud = makeCloud(clock, rand);
  const s = makeStudent("u1", clock, cloud);
  s.tap(); await clock.advance(10000);
  const before = cloud.stats.writes;
  s.q.schedule(() => JSON.parse(JSON.stringify(s.progress)));    // nothing actually changed
  await clock.advance(10000);
  assert.equal(cloud.stats.writes, before, "identical content must not be written again");
  console.log("  unchanged progress is not re-written");
}

(async () => {
  console.log("sync-queue simulation:");
  await scenarioBatching(); await scenarioFlaky(); await scenarioOffline(); await scenarioClose(); await scenarioMaxWait(); await scenarioNoop();
  console.log("sync-queue: all scenarios passed");
})().catch((e) => { console.error(e); process.exit(1); });
