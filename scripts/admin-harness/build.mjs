/* Test rig for the two admin dashboards: runs the REAL admin/admin.js and speakup/admin/admin.js against an
 * in-memory fake Firebase with sample users, so the user list, student/progress views and the account page get
 * exercised with data (an empty list hides whole classes of bugs).
 *
 *   node scripts/admin-harness/build.mjs      -> writes scripts/admin-harness/out/ (git-ignored)
 *   then serve the repo root and open  /scripts/admin-harness/out/tt/index.html  (or  /speakup/index.html)
 *
 * Nothing here talks to the real database. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const out = path.join(here, "out");
fs.rmSync(out, { recursive: true, force: true });

const NOW = "Date.now()";
const fakeRtdb = `
// in-memory Realtime Database: just enough of the modular API for the admin dashboards
const root = { data: {}, listeners: [] };
export const db = { __fake: true };
const parts = (p) => String(p || "").split("/").filter(Boolean);
export const ref = (_db, p) => ({ path: parts(p).join("/") });
const get1 = (path) => { let n = root.data; for (const k of parts(path)) { if (n == null || typeof n !== "object") return null; n = n[k]; } return n === undefined ? null : n; };
const set1 = (path, v) => {
  const ks = parts(path); if (!ks.length) { root.data = v || {}; return; }
  let n = root.data; for (let i = 0; i < ks.length - 1; i++) { if (n[ks[i]] == null || typeof n[ks[i]] !== "object") n[ks[i]] = {}; n = n[ks[i]]; }
  if (v === null || v === undefined) delete n[ks[ks.length - 1]]; else n[ks[ks.length - 1]] = v;
};
const snap = (path) => { const v = get1(path); return { val: () => (v == null ? null : JSON.parse(JSON.stringify(v))), exists: () => v != null, key: parts(path).pop() || null }; };
const notify = () => root.listeners.slice().forEach((l) => { try { l.cb(snap(l.path)); } catch (e) { console.error(e); } });
export const onValue = (r, cb) => { const l = { path: r.path, cb }; root.listeners.push(l); setTimeout(() => cb(snap(r.path)), 0); return () => { root.listeners = root.listeners.filter((x) => x !== l); }; };
export const set = async (r, v) => { set1(r.path, v); notify(); };
export const update = async (r, v) => { for (const [k, val] of Object.entries(v)) set1([r.path, k].filter(Boolean).join("/"), val); notify(); };
export const remove = async (r) => { set1(r.path, null); notify(); };
let seq = 0;
export const push = (r, v) => { const id = "-id" + (++seq); const nr = { path: [r.path, id].filter(Boolean).join("/") }; if (v !== undefined) { set1(nr.path, v); notify(); return Object.assign(Promise.resolve(nr), nr); } return nr; };
export const serverTimestamp = () => ${NOW};
export const get = async (r) => snap(r.path);
export const off = (r) => { root.listeners = root.listeners.filter((l) => l.path !== r.path); };
export const __seed = (data) => { root.data = JSON.parse(JSON.stringify(data)); };
`;
const fakeAuth = `
export const sendPasswordResetEmail = async () => {}; export const verifyBeforeUpdateEmail = async () => {}; export const linkWithCredential = async () => {};
export const reauthenticateWithCredential = async () => {}; export const createUserWithEmailAndPassword = async () => ({ user: { uid: "new-" + Date.now() } });
export const signInAnonymously = async () => ({ user: { uid: "anon-1" } }); export const signOut = async () => {}; export const getAuth = () => ({}); export const EmailAuthProvider = { credential: () => ({}) };
`;
const fakeApp = `export const initializeApp = () => ({}); export const deleteApp = async () => {};`;
const DAY = 86400000;
const fakeFirebase = `
import { db as fdb, __seed } from "./fake-rtdb.js";
export const db = fdb;
export const auth = { currentUser: { uid: "owner", email: "abdujalilov7707@gmail.com", providerData: [{ providerId: "google.com" }] } };
export const firebaseConfig = { apiKey: "x", projectId: "fake" };
const now = Date.now(), DAY = ${DAY};
__seed({
  users: {
    owner:  { name: "Abdulloh Abdujalilov", email: "abdujalilov7707@gmail.com", role: "owner", status: "approved", createdAt: now - 90 * DAY, provider: "google.com" },
    mgr1:   { name: "Maria Manager", email: "maria@example.com", role: "manager", status: "approved", createdAt: now - 60 * DAY, provider: "password" },
    t1:     { name: "Tom Teacher", email: "tom@example.com", role: "teacher", status: "approved", createdAt: now - 50 * DAY, provider: "google.com" },
    s1:     { name: "New Trial Student", email: "newbie@example.com", phone: "+14155550101", role: "student", status: "pending", createdAt: now - 1 * DAY, provider: "password" },
    s2:     { name: "Expired Trial", email: "old@example.com", role: "student", status: "pending", createdAt: now - 10 * DAY, provider: "google.com" },
    s3:     { name: "Approved Student", email: "stu@example.com", phone: "+998901234567", role: "student", status: "approved", teacherId: "t1", createdAt: now - 20 * DAY, provider: "password", ttAccess: true },
    p1:     { name: "Phone Person", email: "p14155550102@phone.trucktalk.invalid", phone: "+14155550102", role: "student", status: "pending", createdAt: now - 2 * DAY, provider: "phone" },
    r1:     { name: "Restricted Person", email: "bad@example.com", role: "student", status: "restricted", createdAt: now - 30 * DAY, provider: "password" },
  },
  teacherStudents: { t1: { s3: true } },
  progress: { s3: { completed: { 1: { score: 90, date: "2026-10-01" }, 2: { score: 80, date: "2026-10-02" } }, grammarDone: {}, homeworkDone: {}, roleplay: {}, xp: 500, streak: 3 } },
  speakup: { progress: { s3: { schema: 2, completed: { 1: { score: 95, date: "2026-10-01" } }, grammarDone: {}, homeworkDone: {}, roleplay: {}, xp: 100, streak: 1 } } },
  events: {},
});
`;
const fakeGate = (hook, userVar) => `
export function initAuthGate(opts){
  window.${userVar} = { uid: "owner", name: "Abdulloh Abdujalilov", email: "abdujalilov7707@gmail.com", role: "owner", teacherId: null, hasPassword: true, isPhone: false };
  window.TTE_adminUrl = "/admin/"; window.TTE_teachersUrl = "/teachers/"; window.TTE_mainUrl = opts && opts.mainUrl || "/trucktalk/";
  window.TTE_signOut = window.SU_signOut = () => {};
  const a = document.getElementById("authRoot"), s = document.getElementById("appShell");
  if (a) a.hidden = true; if (s) s.hidden = false;
  setTimeout(() => { window.${hook} && window.${hook}(); }, 0);
}
`;

// point a source file's Firebase imports at the in-memory fakes
const rewrite = (src) => src
  .replace(/"\.\.\/shared\/firebase\.js"/g, '"./fake-firebase.js"').replace(/"\.\.\/shared\/firebase-config\.js"/g, '"./fake-firebase.js"')
  .replace(/"\.\.\/shared\/auth-gate\.js"/g, '"./fake-gate.js"').replace(/"\.\.\/(\.\.\/)?shared\/phone-login\.js"/g, '"/shared/phone-login.js"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[^"]*firebase-database\.js"/g, '"./fake-rtdb.js"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[^"]*firebase-auth\.js"/g, '"./fake-auth.js"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[^"]*firebase-app\.js"/g, '"./fake-app.js"');

function build(name, mainJs, html, assetPrefix, extra = [], hook = null) {
  const dir = path.join(out, name); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "fake-rtdb.js"), fakeRtdb);
  fs.writeFileSync(path.join(dir, "fake-auth.js"), fakeAuth);
  fs.writeFileSync(path.join(dir, "fake-app.js"), fakeApp);
  fs.writeFileSync(path.join(dir, "fake-firebase.js"), fakeFirebase);
  const su = name === "speakup";
  fs.writeFileSync(path.join(dir, "fake-gate.js"), fakeGate(su ? "SU_mount" : "TTE_mount", su ? "SU_user" : "TTE_user"));
  for (const x of [mainJs, ...extra]) fs.writeFileSync(path.join(dir, path.basename(x)), rewrite(fs.readFileSync(path.join(root, x), "utf8")));
  const page = fs.readFileSync(path.join(root, html), "utf8").replace(/(src|href)="\.\.\//g, `$1="${assetPrefix}`);
  fs.writeFileSync(path.join(dir, "index.html"), page);
}
build("tt", "admin/admin.js", "admin/index.html", "/");
build("speakup", "speakup/admin/admin.js", "speakup/admin/index.html", "/speakup/");
build("teachers", "teachers/teachers.js", "teachers/index.html", "/", ["teachers/live.js", "teachers/slides.js"]);

// A course page (Truck Talk or SpeakUp) with sign-in skipped, to exercise the learner app itself (voice, lessons...)
function buildCourse(name, dir, userVar, mountHook) {
  const outDir = path.join(out, name); fs.mkdirSync(outDir, { recursive: true });
  let page = fs.readFileSync(path.join(root, dir, "index.html"), "utf8")
    .replace(/<script type="module">[\s\S]*?<\/script>/, '<script type="module" src="course-gate.js"></script>')
    .replace(/navigator\.serviceWorker\.register\([^)]*\)/, "Promise.resolve()")
    .replace(/(src|href)="\.\.\//g, '$1="/')
    .replace(/(src|href)="(?!\/|https?:|data:|#|course-gate)([^"]+)"/g, `$1="/${dir}/$2"`);
  fs.writeFileSync(path.join(outDir, "index.html"), page);
  fs.writeFileSync(path.join(outDir, "course-gate.js"), `
window.${userVar} = { uid: "rig-student", name: "Rig Student", email: "rig@example.com", role: new URLSearchParams(location.search).get("role") || "student", status: "approved", hasPassword: true };
window.TTE_adminUrl = window.TTE_teachersUrl = "#"; window.TTE_signOut = window.SU_signOut = () => {};
window.TTE_syncProgress = window.SU_syncProgress = () => {}; window.TTE_syncState = window.SU_syncState = () => ({});
const _a = document.getElementById("authRoot"), _s = document.getElementById("appShell"); if (_a) _a.hidden = true; if (_s) _s.hidden = false;
const go = () => window.${mountHook} && window.${mountHook}();
if (document.readyState === "complete") go(); else window.addEventListener("load", go);
`);
}
buildCourse("ttapp", "trucktalk", "TTE_user", "TTE_mount");
buildCourse("suapp", "speakup", "SU_user", "SU_mount");
console.log("harness written to scripts/admin-harness/out/  (tt, speakup, teachers)");
