// Run: node scripts/tt-access.test.mjs
import assert from "node:assert/strict";
import { TT_LOCK_FROM, SPEAKUP_DAYS, speakupFinished, lockedFromTruckTalk } from "../shared/tt-access.js";

const fresh = { role: "student", createdAt: TT_LOCK_FROM + 1000 };
const old = { role: "student", createdAt: TT_LOCK_FROM - 1000 };
const done = (n, schema = 2) => ({ schema, completed: Object.fromEntries(Array.from({ length: n }, (_, i) => [i + 1, { score: 90 }])) });

// new students: locked until they finish SpeakUp or a teacher opens it
assert.equal(lockedFromTruckTalk(fresh, false), true);
assert.equal(lockedFromTruckTalk(fresh, true), false);
assert.equal(lockedFromTruckTalk({ ...fresh, ttAccess: true }, false), false);
assert.equal(lockedFromTruckTalk({ ...fresh, ttAccess: false }, false), true);
// old accounts, accounts with no sign-up date, and staff are never locked
assert.equal(lockedFromTruckTalk(old, false), false);
assert.equal(lockedFromTruckTalk({ role: "student" }, false), false);
for (const role of ["teacher", "manager", "owner"]) assert.equal(lockedFromTruckTalk({ role, createdAt: TT_LOCK_FROM + 5 }, false), false, role);
assert.equal(lockedFromTruckTalk(null, false), false);
// finishing SpeakUp: all 60 lessons, in the 60-lesson numbering
assert.equal(speakupFinished(done(SPEAKUP_DAYS)), true);
assert.equal(speakupFinished(done(SPEAKUP_DAYS - 1)), false);
assert.equal(speakupFinished(done(SPEAKUP_DAYS, 1)), false);        // an old 90-day save doesn't count
assert.equal(speakupFinished({ completed: done(SPEAKUP_DAYS).completed }), false);   // no schema
assert.equal(speakupFinished(null), false);
assert.equal(speakupFinished({ schema: 2 }), false);
// Realtime Database hands numeric-keyed objects back as arrays with holes
const arr = [null, ...Array.from({ length: SPEAKUP_DAYS }, () => ({ score: 80 }))];
assert.equal(speakupFinished({ schema: 2, completed: arr }), true);
console.log("tt-access: all assertions passed");
