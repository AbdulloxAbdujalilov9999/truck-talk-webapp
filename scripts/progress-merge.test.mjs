// node scripts/progress-merge.test.mjs — the device/cloud progress merge (shared/progress-merge.js)
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const M = createRequire(import.meta.url)("../shared/progress-merge.js");
const empty = () => ({ completed: {}, grammarDone: {}, homeworkDone: {}, roleplay: {}, appliedResets: {}, xp: 0, streak: 0, lastDate: null, name: "" });

// a new phone (empty) never wipes the cloud: the cloud's lessons come back
const cloud = Object.assign(empty(), { completed: { 1: { score: 90, date: "2026-11-01", at: 1000 }, 2: { score: 80, date: "2026-11-02", at: 2000 } }, xp: 1050, streak: 2, lastDate: "2026-11-02", name: "Aziz" });
let m = M.merge(empty(), cloud);
assert.deepEqual(Object.keys(m.completed).sort(), ["1", "2"]); assert.equal(m.xp, 1050); assert.equal(m.name, "Aziz");

// both devices did different lessons: the merge keeps both, and the XP is recounted
const phone = Object.assign(empty(), { completed: { 3: { score: 100, date: "2026-11-03", at: 3000 } }, xp: 600, streak: 3, lastDate: "2026-11-03" });
m = M.merge(phone, cloud);
assert.deepEqual(Object.keys(m.completed).sort(), ["1", "2", "3"]); assert.equal(m.xp, 100 + 90 * 5 + 100 + 80 * 5 + 100 + 100 * 5); assert.equal(m.streak, 3);

// order does not matter (except the name, where the first copy wins)
assert.equal(M.signature(M.merge(phone, cloud)), M.signature(Object.assign(M.merge(cloud, phone), { name: m.name })));

// a teacher's reset (tombstone) beats an old copy of the record elsewhere, but a retake after the reset survives
const reset = Object.assign(empty(), { removed: { completed: { 2: 2500 } } });
m = M.merge(reset, cloud); assert.ok(!m.completed[2] && m.completed[1], "reset lesson stays reset");
const retake = Object.assign(empty(), { completed: { 2: { score: 95, at: 2600 } }, removed: { completed: { 2: 2500 } } });
m = M.merge(retake, cloud); assert.equal(m.completed[2].score, 95, "retake after the reset counts");

// "start over" (epoch) erases everything older on every device
m = M.merge(Object.assign(empty(), { epoch: 2500 }), cloud);
assert.deepEqual(Object.keys(m.completed), [], "start over wins over older records");

// Realtime Database hands back arrays for number-keyed objects; that is read the same
m = M.merge(empty(), Object.assign(empty(), { completed: [null, { score: 70, at: 5 }] }));
assert.equal(m.completed[1].score, 70);

// old records without a timestamp still merge
m = M.merge(Object.assign(empty(), { completed: { 4: { score: 60, date: "2026-10-01" } } }), cloud);
assert.ok(m.completed[4] && m.completed[1]);
// smart-review cards: newest copy of each card wins; start over clears them
m = M.merge(Object.assign(empty(), { review: { "3_1": { box: 2, due: 5, at: 200 }, "4_0": { box: 0, due: 1, at: 50 } } }),
            Object.assign(empty(), { review: { "3_1": { box: 0, due: 1, at: 100 }, "5_2": { box: 1, due: 9, at: 300 } } }));
assert.equal(m.review["3_1"].box, 2); assert.ok(m.review["4_0"] && m.review["5_2"]);
m = M.merge(Object.assign(empty(), { epoch: 250 }), Object.assign(empty(), { review: { "3_1": { box: 1, at: 200 }, "5_2": { box: 1, at: 300 } } }));
assert.deepEqual(Object.keys(m.review), ["5_2"], "start over clears older review cards");
// roadside check: best of both, newest last score
m = M.merge(Object.assign(empty(), { roadside: { best: 70, last: 70, at: 100 } }), Object.assign(empty(), { roadside: { best: 85, last: 60, at: 200 } }));
assert.deepEqual(m.roadside, { best: 85, last: 60, at: 200 });
// diff(): only what changed goes to the cloud, and applying it to the cloud copy gives the merged progress
function apply(base, patch) {
  const out = JSON.parse(JSON.stringify(M.normalize(base)));
  for (const [path, v] of Object.entries(patch)) {
    const ks = path.split("/"); let o = out;
    for (const k of ks.slice(0, -1)) o = o[k] = (o[k] && typeof o[k] === "object") ? o[k] : {};
    if (v === null) delete o[ks.at(-1)]; else o[ks.at(-1)] = v;
  }
  return out;
}
const big = Object.assign(empty(), { review: {}, completed: {}, xp: 9000, streak: 5, lastDate: "2026-11-18", name: "Aziz", updatedAt: 1 });
for (let d = 1; d <= 60; d++) { big.completed[d] = { score: 90, at: d }; for (let i = 0; i < 20; i++) big.review[d + "_" + i] = { box: 2, due: 1e12 + d, at: 1e12 }; }
const device = JSON.parse(JSON.stringify(big)); device.review["60_3"] = { box: 3, due: 2e12, at: 2e12 }; device.xp = 9015; device.lastDate = "2026-11-19"; device.streak = 6;
let patch = M.diff(big, M.merge(device, big));
assert.deepEqual(Object.keys(patch).sort(), ["lastDate", "review/60_3", "streak", "xp"], "only the changed card and counters");
assert.ok(JSON.stringify(patch).length < 200 && JSON.stringify(big).length > 50000, "a save is bytes, not the whole 50 KB+ progress");
assert.equal(M.signature(apply(big, patch)), M.signature(M.merge(device, big)));
// a reset removes the entry from the cloud (null) and records the tombstone
const afterReset = M.merge(Object.assign(JSON.parse(JSON.stringify(big)), { removed: { completed: { 7: 5e12 } } }), big);
patch = M.diff(big, afterReset);
assert.equal(patch["completed/7"], null); assert.equal(patch["removed/completed/7"], 5e12);
assert.equal(M.signature(apply(big, patch)), M.signature(afterReset));
// nothing changed -> nothing to send (updatedAt and RTDB's array form don't count)
assert.deepEqual(M.diff(Object.assign({}, big, { updatedAt: 99, completed: Object.assign([], big.completed) }), M.merge(big, big)), {});
// a brand-new cloud copy gets everything
patch = M.diff(null, M.merge(device, null));
assert.equal(M.signature(apply(null, patch)), M.signature(M.merge(device, null)));
console.log("progress-merge tests passed");
