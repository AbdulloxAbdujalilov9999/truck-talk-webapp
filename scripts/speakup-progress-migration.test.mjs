// Run: node scripts/speakup-progress-migration.test.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const M = createRequire(import.meta.url)("../speakup/shared/progress-merge.js");

const rec = (score, at) => ({ date: "2026-10-01", score, at });
// A student part-way through the old 90-day course: old days 1-9 done (day 5 is the week-1 review)
const old = { completed: {}, roleplay: { 1: { best: 80, at: 5 }, 2: { best: 60, at: 6 } }, grammarDone: { "personal-pronouns": rec(90, 1) }, homeworkDone: { 1: rec(70, 1) }, xp: 1000, streak: 3 };
for (let d = 1; d <= 9; d++) old.completed[d] = rec(80 + d, 100 + d);

const m = M.migrate(old);
assert.equal(m.schema, 2);
// new 1 = old 1+2, new 2 = old 3, new 3 = old 4, new 4 = old 6+7, new 5 = review old 5, new 6 = old 8+9 (week 2, but old 9 done / 8 done -> yes)
assert.deepEqual(Object.keys(m.completed).map(Number).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6]);
assert.equal(m.completed[1].score, Math.round((81 + 82) / 2));          // merged lesson: average of the two scores
assert.equal(m.completed[1].at, 102);                                    // ...and the later timestamp
assert.equal(m.roleplay[1].best, 70);                                    // roleplay of old 1+2 averaged
assert.equal(m.roleplay[2], undefined);                                  // old 3 had no role-play
assert.deepEqual(m.grammarDone, old.grammarDone);                        // grammar units are keyed by id: untouched
assert.deepEqual(m.homeworkDone, old.homeworkDone);                      // homework sessions: untouched
assert.equal(m.xp, 1000);

// a merged lesson with only one of its two old lessons done is NOT complete
const partial = M.migrate({ completed: { 6: rec(90, 1) } });            // old 6 done, 7 not -> new 4 not complete
assert.deepEqual(partial.completed, {});

// migrating twice changes nothing (schema 2 is left alone)
assert.deepEqual(M.migrate(m), m);
assert.deepEqual(M.migrate(old), m);

// a teacher's reset of ONE old lesson (tombstone) resets the merged lesson
const reset = M.migrate({ completed: { 1: rec(90, 1), 2: rec(90, 1) }, removed: { completed: { 2: 500 } } });
assert.equal(reset.removed.completed[1], 500);

// new-format progress passes through untouched, and merging old + new is order-independent
const fresh = { schema: 2, completed: { 3: rec(100, 900) }, roleplay: {}, grammarDone: {}, homeworkDone: {}, xp: 0, streak: 0 };
const a = M.merge(old, fresh), b = M.merge(fresh, old);
assert.deepEqual(Object.keys(a.completed).sort(), Object.keys(b.completed).sort());
assert.equal(a.schema, 2);
assert.ok(a.completed[3]);                                               // the fresh day-3 completion survives (old day 3 -> new 2 is separate)
// the day map covers every old day exactly once
const used = Object.values(M.DAY_MAP).flat();
assert.equal(used.length, 90); assert.equal(new Set(used).size, 90);
assert.equal(Object.keys(M.DAY_MAP).length, 60);
console.log("speakup progress migration: all assertions passed");
