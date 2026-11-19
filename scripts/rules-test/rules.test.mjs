// Tests for database.rules.json, run against the Realtime Database emulator: npm test (from this folder; needs Java).
// The rules are the real security boundary of the site, so each important "who may do what" is checked here.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { ref, get, set, update } from "firebase/database";

const rules = fs.readFileSync(fileURLToPath(new URL("../../database.rules.json", import.meta.url)), "utf8");
const [host, port] = (process.env.FIREBASE_DATABASE_EMULATOR_HOST || "127.0.0.1:9000").split(":");
const env = await initializeTestEnvironment({ projectId: "demo-trucktalk", database: { rules, host, port: Number(port) } });

const OWNER = "abdujalilov7707@gmail.com";
const now = Date.now(), DAY = 86400000;
const seed = {
  users: {
    owner: { name: "Owner", email: OWNER, role: "owner", status: "approved", createdAt: now - 90 * DAY },
    mgr: { name: "Manager", email: "m@x.com", role: "manager", status: "approved", createdAt: now - 60 * DAY },
    t1: { name: "Teacher One", email: "t1@x.com", role: "teacher", status: "approved", createdAt: now - 50 * DAY },
    t2: { name: "Teacher Two", email: "t2@x.com", role: "teacher", status: "approved", createdAt: now - 50 * DAY },
    s1: { name: "Student One", email: "s1@x.com", role: "student", status: "approved", teacherId: "t1", createdAt: now - 20 * DAY },
    s2: { name: "Student Two", email: "s2@x.com", role: "student", status: "approved", teacherId: "t2", createdAt: now - 20 * DAY },
  },
  teacherStudents: { t1: { s1: true }, t2: { s2: true } },
  progress: { s1: { completed: { 1: { score: 90, at: 1 } }, xp: 550 }, s2: { completed: {}, xp: 0 } },
};
await env.withSecurityRulesDisabled(async (ctx) => { await set(ref(ctx.database()), seed); });

const as = (uid, email) => env.authenticatedContext(uid, { email: email || seed.users[uid]?.email || uid + "@x.com" }).database();
const anon = env.unauthenticatedContext().database();
let n = 0;
async function check(name, p){ await p; n++; process.stdout.write("  ok  " + name + "\n"); }

// --- profiles
await check("a new sign-up may create their own pending student profile", assertSucceeds(set(ref(as("new1", "new1@x.com"), "users/new1"), { name: "New", email: "new1@x.com", role: "student", status: "pending", createdAt: now })));
await check("...but not an approved one", assertFails(set(ref(as("new2", "new2@x.com"), "users/new2"), { name: "New", email: "new2@x.com", role: "student", status: "approved", createdAt: now })));
await check("...nor a teacher", assertFails(set(ref(as("new3", "new3@x.com"), "users/new3"), { name: "New", email: "new3@x.com", role: "teacher", status: "pending", createdAt: now })));
await check("...nor one with a back-dated sign-up time (a longer free trial)", assertFails(set(ref(as("new4", "new4@x.com"), "users/new4"), { name: "New", email: "new4@x.com", role: "student", status: "pending", createdAt: now - 10 * DAY })));
await check("...nor one with lessons already unlocked", assertFails(set(ref(as("new5", "new5@x.com"), "users/new5"), { name: "New", email: "new5@x.com", role: "student", status: "pending", createdAt: now, unlockFrom: 1, unlockTo: 60 })));
await check("nobody creates a profile for someone else", assertFails(set(ref(as("new6", "new6@x.com"), "users/other"), { name: "X", email: "new6@x.com", role: "student", status: "pending", createdAt: now })));
await check("a student can't make themselves a teacher", assertFails(update(ref(as("s1"), "users/s1"), { role: "teacher" })));
await check("a student can change their own name", assertSucceeds(set(ref(as("s1"), "users/s1/name"), "Student 1")));
await check("a student can't unlock lessons for themselves", assertFails(set(ref(as("s1"), "users/s1/unlockTo"), 60)));
await check("a phone number must look like one", assertFails(set(ref(as("owner"), "users/s1/phone"), "call me")));
await check("signed-out visitors read nothing", assertFails(get(ref(anon, "users/s1"))));
await check("a student reads their own profile", assertSucceeds(get(ref(as("s1"), "users/s1"))));
await check("...but not another student's", assertFails(get(ref(as("s1"), "users/s2"))));
await check("...nor the user list", assertFails(get(ref(as("s1"), "users"))));
await check("a teacher reads their own student", assertSucceeds(get(ref(as("t1"), "users/s1"))));
await check("...but not another teacher's student", assertFails(get(ref(as("t1"), "users/s2"))));
await check("a teacher opens lessons for their own student", assertSucceeds(update(ref(as("t1"), "users/s1"), { unlockFrom: 1, unlockTo: 5 })));
await check("...but not for another teacher's student", assertFails(set(ref(as("t1"), "users/s2/unlockTo"), 5)));
await check("a teacher makes their student teacher-paced", assertSucceeds(set(ref(as("t1"), "users/s1/pacing"), "teacher")));
await check("...but a student can't change their own pacing", assertFails(set(ref(as("s1"), "users/s1/pacing"), null)));
await check("pacing is only ever \"teacher\"", assertFails(set(ref(as("owner"), "users/s1/pacing"), "fast")));

// --- paid access (Whop): only the owner/manager (or the server) set it
await check("a student can't give themselves paid access", assertFails(set(ref(as("s1"), "users/s1/paidUntil"), now + 30 * DAY)));
await check("...nor pick a plan", assertFails(set(ref(as("s1"), "users/s1/plan"), "quarter")));
await check("a teacher can't set paid access either", assertFails(set(ref(as("t1"), "users/s1/paidUntil"), now + 30 * DAY)));
await check("a manager can", assertSucceeds(set(ref(as("mgr"), "users/s1/paidUntil"), now + 30 * DAY)));
await check("a new sign-up can't arrive already paid", assertFails(set(ref(as("newbie", "newbie@x.com"), "users/newbie"), { name: "New", email: "newbie@x.com", role: "student", status: "pending", createdAt: now, paidUntil: now + 90 * DAY })));
await check("a student reads their own voice minutes", assertSucceeds(get(ref(as("s1"), "voiceUsage/s1"))));
await check("...but can't write them", assertFails(set(ref(as("s1"), "voiceUsage/s1/x"), { start: now, granted: 99999 })));
await check("...nor read someone else's", assertFails(get(ref(as("s1"), "voiceUsage/s2"))));
await check("students can't read the payment log", assertFails(get(ref(as("s1"), "payments"))));
await check("the owner can", assertSucceeds(get(ref(as("owner"), "payments"))));

// --- Telegram (sign-in codes, chat links and reminder settings are written only by the server's service account)
const tgCtx = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: "custom" }, tg: "5550001" }).database();
await check("nobody reads Telegram sign-in codes", assertFails(get(ref(as("s1"), "telegram/login/abc"))));
await check("...not even the owner", assertFails(get(ref(as("owner"), "telegram"))));
await check("a student can't tie someone's Telegram to themselves", assertFails(set(ref(as("s1"), "telegram/users/5550001"), { uid: "s1", chatId: 1 })));
await check("a student can't fake being linked", assertFails(set(ref(as("s1"), "users/s1/telegram"), { tgId: "1", reminders: true })));
await check("a Telegram sign-in can't create its own profile (the server does)", assertFails(set(ref(tgCtx("tg5550001"), "users/tg5550001"), { name: "X", email: "tg5550001@telegram.trucktalk.invalid", role: "student", status: "pending", createdAt: now })));

// --- usage ("Where students stop")
await check("a student records reaching a step", assertSucceeds(update(ref(as("s1"), "usage/s1"), { last: { at: now, day: 3, step: "quiz" }, "days/3/quiz": now })));
await check("...only known steps", assertFails(update(ref(as("s1"), "usage/s1"), { "days/3/hack": now })));
await check("...only real days", assertFails(update(ref(as("s1"), "usage/s1"), { "days/61/open": now })));
await check("...not for someone else", assertFails(update(ref(as("s2"), "usage/s1"), { "days/3/open": now })));
await check("their teacher sees it", assertSucceeds(get(ref(as("t1"), "usage/s1"))));
await check("another teacher doesn't", assertFails(get(ref(as("t2"), "usage/s1"))));
await check("the manager sees everyone's", assertSucceeds(get(ref(as("mgr"), "usage"))));
await check("a manager lists everyone", assertSucceeds(get(ref(as("mgr"), "users"))));
await check("a manager approves a student", assertSucceeds(update(ref(as("mgr"), "users/new1"), { status: "approved" })));
await check("a manager can't touch the owner", assertFails(update(ref(as("mgr"), "users/owner"), { status: "restricted" })));
await check("a manager can't make someone a manager", assertFails(update(ref(as("mgr"), "users/s1"), { role: "manager" })));
await check("the owner can do anything to a profile", assertSucceeds(update(ref(as("owner"), "users/mgr"), { status: "restricted" })));

// --- progress
await check("a student saves their own progress", assertSucceeds(set(ref(as("s1"), "progress/s1"), { completed: { 1: { score: 95, at: 2 } }, xp: 575 })));
await check("...but not someone else's", assertFails(set(ref(as("s1"), "progress/s2"), { completed: {}, xp: 99999 })));
await check("...and can't read someone else's", assertFails(get(ref(as("s1"), "progress/s2"))));
await check("a teacher reads their student's progress", assertSucceeds(get(ref(as("t1"), "progress/s1"))));
await check("...but not another teacher's student's", assertFails(get(ref(as("t1"), "progress/s2"))));
await check("a teacher can't write a student's progress", assertFails(set(ref(as("t1"), "progress/s1"), { xp: 1 })));

// small saves: the app sends only what changed (shared/progress-merge.js diff) as one multi-path update
{
  const { createRequire } = await import("node:module");
  const M = createRequire(import.meta.url)("../../shared/progress-merge.js");
  const cloud = (await get(ref(as("s1"), "progress/s1"))).val();
  const local = Object.assign({}, cloud, { xp: 700, review: { "1_0": { box: 1, due: now + DAY, at: now } }, removed: { completed: { 1: now } } });
  const patch = M.diff(cloud, M.merge(local, cloud)); patch.updatedAt = now;
  await check("a student saves just the changed parts of their progress", assertSucceeds(update(ref(as("s1"), "progress/s1"), patch)));
  const after = (await get(ref(as("s1"), "progress/s1"))).val();
  if (M.signature(after) !== M.signature(M.merge(local, cloud))) throw new Error("partial save mismatch " + JSON.stringify({ patch, after, want: M.merge(local, cloud) }));
  await check("...not into someone else's", assertFails(update(ref(as("s1"), "progress/s2"), { xp: 5 })));
}

// --- resets
await check("a teacher asks to reset their student's lesson", assertSucceeds(set(ref(as("t1"), "resets/s1/r1"), { kind: "lesson", key: "1", by: "t1", at: now })));
await check("the student stamps it applied", assertSucceeds(set(ref(as("s1"), "resets/s1/r1/appliedAt"), now)));
await check("...but can't delete it", assertFails(set(ref(as("s1"), "resets/s1/r1"), null)));
await check("a teacher can't reset another teacher's student", assertFails(set(ref(as("t1"), "resets/s2/r1"), { kind: "lesson", key: "1", by: "t1", at: now })));

// --- calendar and teacher index
await check("a teacher edits their own calendar", assertSucceeds(set(ref(as("t1"), "events/t1/e1"), { title: "Class", at: now })));
await check("...but not another teacher's", assertFails(set(ref(as("t1"), "events/t2/e1"), { title: "x" })));
await check("only owner/manager change who teaches whom", assertFails(set(ref(as("t1"), "teacherStudents/t1/s2"), true)));

// --- live classes
await check("a teacher opens a live class they host", assertSucceeds(set(ref(as("t1"), "liveClasses/ABCDE"), { hostUid: "t1", status: "lobby", cursor: 0 })));
await check("a student can't open one", assertFails(set(ref(as("s1"), "liveClasses/FGHIJ"), { hostUid: "s1", status: "lobby" })));
await check("a player joins under their own id", assertSucceeds(set(ref(as("p1"), "liveClasses/ABCDE/participants/p1"), { name: "Driver", joinedAt: now })));
await check("...but can't join as someone else", assertFails(set(ref(as("p1"), "liveClasses/ABCDE/participants/p2"), { name: "Driver", joinedAt: now })));
await check("a player can't move the slides", assertFails(set(ref(as("p1"), "liveClasses/ABCDE/cursor"), 5)));
await check("a player answers for themselves", assertSucceeds(set(ref(as("p1"), "liveClasses/ABCDE/answers/0/p1"), { choice: 1, at: now })));

// --- SpeakUp is gone: nothing there is readable any more
await check("the old SpeakUp data is closed", assertFails(get(ref(as("s1"), "speakup/progress/s1"))));

await env.cleanup();
console.log(`database rules: ${n} checks passed`);
