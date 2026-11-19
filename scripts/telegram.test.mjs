/* Telegram bot, sign-in codes and daily reminders against stubbed Telegram, Google and Firebase (no network).
 * Run: node scripts/telegram.test.mjs */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const DAY = 86400000;
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ client_email: "sa@test.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) });
process.env.TELEGRAM_BOT_TOKEN = "123:bot-secret"; process.env.TELEGRAM_BOT_USERNAME = "TruckTalkBot"; process.env.CRON_SECRET = "cron-secret";

const db = {};
const getAt = (path) => path.split("/").filter(Boolean).reduce((o, k) => (o == null ? null : o[k] ?? null), db);
function setAt(path, value) {
  const keys = path.split("/").filter(Boolean); let o = db;
  for (const k of keys.slice(0, -1)) o = o[k] = (o[k] && typeof o[k] === "object") ? o[k] : {};
  if (value === null) delete o[keys.at(-1)]; else o[keys.at(-1)] = value;
}
const tokens = {}, sent = [], locked = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url === "https://oauth2.googleapis.com/token") return new Response(JSON.stringify({ access_token: "ya29.test", expires_in: 3600 }));
  if (url.endsWith("/accounts:update")) { assert.equal(init.headers.authorization, "Bearer ya29.test"); locked.push(JSON.parse(init.body)); return new Response("{}"); }
  if (url.startsWith("https://identitytoolkit.googleapis.com/v1/accounts:lookup")) { const t = JSON.parse(init.body).idToken; return tokens[t] ? new Response(JSON.stringify({ users: [{ localId: tokens[t] }] })) : new Response("{}", { status: 400 }); }
  if (url.startsWith("https://api.telegram.org/bot123:bot-secret/")) { const p = JSON.parse(init.body); sent.push({ method: url.split("/").pop(), ...p }); return new Response(JSON.stringify({ ok: true, result: true })); }
  const m = /^https:\/\/truck-talk-admin-default-rtdb[^/]+\/(.*)\.json(\?.*)?$/.exec(url);
  if (m) {
    const path = decodeURIComponent(m[1]).replace(/\/$/, "");
    const isAdmin = (init.headers || {}).authorization === "Bearer ya29.test";
    if (!isAdmin && !/^users\/[^/]+$/.test(path)) return new Response("denied", { status: 401 });
    if (!init.method || init.method === "GET") return new Response(JSON.stringify(getAt(path)));
    if (init.method === "PATCH") { for (const [k, v] of Object.entries(JSON.parse(init.body))) setAt((path ? path + "/" : "") + k, v); return new Response(init.body); }
  }
  throw new Error("unexpected fetch " + url);
};
const jwt = (id) => "h." + Buffer.from(JSON.stringify({ user_id: id, aud: "truck-talk-admin" })).toString("base64url") + ".s";
function person(id, profile) { setAt("users/" + id, profile); const t = jwt(id); tokens[t] = id; return t; }
function mkres() { const r = { status: 0, headers: {}, body: null, setHeader(k, v) { r.headers[k.toLowerCase()] = v; }, end(b) { r.body = b ? JSON.parse(b) : null; } }; Object.defineProperty(r, "statusCode", { set(v) { r.status = v; }, get() { return r.status; } }); return r; }
const bot = require("../api/telegram.js"), tgApi = require("../api/tg.js"), reminders = require("../api/reminders.js"), T = require("../api/_telegram.js");
async function call(h, { method = "POST", query = {}, headers = {}, body } = {}) { const r = mkres(); await h({ method, query, headers: { "x-forwarded-for": "1.2.3.4", ...headers }, body }, r); return r; }
const update = (text, from = { id: 5550001, first_name: "Aziz", last_name: "K" }) => call(bot, { headers: { "x-telegram-bot-api-secret-token": T.webhookSecret() }, body: { message: { chat: { id: from.id }, from, text } } });

// the webhook only accepts Telegram (secret header) and setup points it at the site with that secret
assert.equal((await call(bot, { body: { message: { chat: { id: 1 }, text: "TRUCK" } } })).status, 401);
let r = await call(bot, { method: "GET", query: { setup: "1" } });
assert.equal(r.status, 200); assert.equal(sent[0].method, "setWebhook"); assert.equal(sent[0].secret_token, T.webhookSecret()); assert.match(sent[0].url, /\/api\/telegram$/);
assert.ok(!T.webhookSecret().includes("bot-secret"));

// video funnel: TRUCK and a number answer with the free lesson page
sent.length = 0;
await update("TRUCK"); assert.match(sent[0].reply_markup.inline_keyboard[0][0].url, /\/free\/1$/);
await update("truck 7"); assert.match(sent[1].reply_markup.inline_keyboard[0][0].url, /\/free\/7$/);
await update("12"); assert.match(sent[2].reply_markup.inline_keyboard[0][0].url, /\/free\/12$/);
await update("99"); assert.match(sent[3].reply_markup.inline_keyboard[0][0].url, /\/free\/60$/, "clamped to the course");

// sign-in: start -> bot sends code -> app checks it -> custom token for a new tg account
r = await call(tgApi, { body: { action: "login-start" } });
assert.equal(r.status, 200); const nonce = r.body.nonce; assert.equal(r.body.link, "https://t.me/TruckTalkBot?start=login_" + nonce);
assert.equal((await call(tgApi, { body: { action: "login-check", nonce, code: "000000" } })).status, 409, "bot not opened yet");
sent.length = 0;
await update("/start login_" + nonce);
const code = /<b>(\d{6})<\/b>/.exec(sent[0].text)[1];
const wrong = code === "111111" ? "222222" : "111111";
assert.equal((await call(tgApi, { body: { action: "login-check", nonce, code: wrong } })).status, 401);
r = await call(tgApi, { body: { action: "login-check", nonce, code } });
assert.equal(r.status, 200); assert.equal(r.body.uid, "tg5550001"); assert.equal(r.body.name, "Aziz K");
const [h, p, s] = r.body.token.split(".");
const claims = JSON.parse(Buffer.from(p, "base64url"));
assert.equal(claims.uid, "tg5550001"); assert.equal(claims.claims.tg, "5550001"); assert.match(claims.aud, /identitytoolkit/);
assert.ok(crypto.verify("RSA-SHA256", Buffer.from(h + "." + p), publicKey, Buffer.from(s, "base64url")), "signed with the service account");
assert.equal((await call(tgApi, { body: { action: "login-check", nonce, code } })).status, 410, "a code works once");
// the new Telegram account gets a pending student profile (3-day trial from now) with reminders on
const made = getAt("users/tg5550001");
assert.equal(made.role, "student"); assert.equal(made.status, "pending"); assert.equal(made.email, "tg5550001@telegram.trucktalk.invalid");
assert.equal(made.name, "Aziz K"); assert.ok(Date.now() - made.createdAt < 5000); assert.deepEqual(made.telegram, { tgId: "5550001", reminders: true });

// too many wrong tries locks the attempt; expired links do nothing
r = await call(tgApi, { body: { action: "login-start" } }); const n2 = r.body.nonce;
await update("/start login_" + n2);
for (let i = 0; i < 5; i++) await call(tgApi, { body: { action: "login-check", nonce: n2, code: "999999" === getAt("telegram/login/" + n2).code ? "888888" : "999999" } });
assert.equal((await call(tgApi, { body: { action: "login-check", nonce: n2, code: getAt("telegram/login/" + n2).code } })).status, 429);
setAt("telegram/login/oldnonceoldnonceoldnonce", { at: Date.now() - DAY });
sent.length = 0; await update("/start login_oldnonceoldnonceoldnonce"); assert.match(sent[0].text, /eskirgan/);

// linking a phone account: reminders on, its derived password replaced, Telegram then signs in as that student
const t = person("ph1", { name: "Bobur Driver", email: "p14155550199@phone.trucktalk.invalid", role: "student", status: "approved" });
assert.equal((await call(tgApi, { body: { action: "link" } })).status, 401);
const staffT = person("teach1", { name: "Teacher", email: "t@x.co", role: "teacher", status: "approved" });
assert.equal((await call(tgApi, { headers: { authorization: "Bearer " + staffT }, body: { action: "link" } })).status, 403, "staff can't tie Telegram sign-in");
r = await call(tgApi, { headers: { authorization: "Bearer " + t }, body: { action: "link" } });
const linkCode = r.body.link.split("start=link_")[1];
await update("/start link_" + linkCode, { id: 7770002, first_name: "Bobur" });
assert.deepEqual(getAt("users/ph1/telegram"), { tgId: "7770002", reminders: true });
assert.equal(getAt("telegram/users/7770002").uid, "ph1"); assert.equal(locked[0].localId, "ph1"); assert.ok(locked[0].password.length >= 30);
assert.equal(getAt("telegram/link/" + linkCode), null, "a link code works once");
r = await call(tgApi, { body: { action: "login-start" } }); const n3 = r.body.nonce;
await update("/start login_" + n3, { id: 7770002, first_name: "Bobur" });
r = await call(tgApi, { body: { action: "login-check", nonce: n3, code: getAt("telegram/login/" + n3).code } });
assert.equal(r.body.uid, "ph1", "Telegram signs in as the linked student");

// /stop and /reminders
await update("/stop", { id: 7770002 }); assert.equal(getAt("users/ph1/telegram/reminders"), false);
await update("/reminders", { id: 7770002 }); assert.equal(getAt("users/ph1/telegram/reminders"), true);

// daily reminders: only with the cron secret; skips who studied recently, restricted and finished students
assert.equal((await call(reminders, { method: "GET" })).status, 401);
person("st2", { name: "Sardor", role: "student", status: "approved" }); setAt("telegram/users/1001", { uid: "st2", chatId: 1001, reminders: true });
setAt("progress/st2/completed", { 1: { score: 90 }, 2: { score: 80 } });
person("st3", { name: "Recent", role: "student", status: "approved" }); setAt("telegram/users/1002", { uid: "st3", chatId: 1002, reminders: true }); setAt("usage/st3/last", { at: Date.now() - 3600000 });
person("st4", { name: "Paused", role: "student", status: "restricted" }); setAt("telegram/users/1003", { uid: "st4", chatId: 1003, reminders: true });
person("st5", { name: "Off", role: "student", status: "approved" }); setAt("telegram/users/1004", { uid: "st5", chatId: 1004, reminders: false });
setAt("progress/ph1/completed", Object.fromEntries(Array.from({ length: 60 }, (_, i) => [i + 1, { score: 90 }])));
sent.length = 0;
r = await call(reminders, { method: "GET", headers: { authorization: "Bearer cron-secret" } });
assert.equal(r.status, 200);
const to = sent.map((x) => x.chat_id);
assert.ok(to.includes(1001) && !to.includes(1002) && !to.includes(1003) && !to.includes(1004) && !to.includes(7770002), JSON.stringify(to));
assert.match(sent.find((x) => x.chat_id === 1001).text, /3-kun/, "next lesson is the first not finished");
assert.equal(reminders.nextDay({ 1: {}, 3: {} }), 2);
console.log("telegram tests passed");
