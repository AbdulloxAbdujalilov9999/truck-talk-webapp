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
console.log("progress-merge tests passed");
