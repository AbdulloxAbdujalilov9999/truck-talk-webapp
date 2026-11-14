/* Payments and voice minutes against stubbed Whop, Google and Firebase: nothing here touches the network.
 * Run: node scripts/payments.test.mjs */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const DAY = 86400000, NOW = Date.now();
const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ client_email: "sa@test.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) });
process.env.WHOP_WEBHOOK_SECRET = "ws_" + crypto.randomBytes(24).toString("hex");
process.env.WHOP_API_KEY = "whop-key"; process.env.WHOP_PLAN_MONTH = "plan_M"; process.env.WHOP_PLAN_QUARTER = "plan_Q";
process.env.ELEVENLABS_API_KEY = "xi"; process.env.ELEVENLABS_AGENT_ID = "agent";

// ---- an in-memory Realtime Database behind the REST API, plus Google sign-in and Whop/ElevenLabs stubs
const db = {};
const getAt = (path) => path.split("/").filter(Boolean).reduce((o, k) => (o == null ? null : o[k] ?? null), db);
function setAt(path, value) {
  const keys = path.split("/").filter(Boolean); let o = db;
  for (const k of keys.slice(0, -1)) o = o[k] = (o[k] && typeof o[k] === "object") ? o[k] : {};
  if (value === null) delete o[keys.at(-1)]; else o[keys.at(-1)] = value;
}
const tokens = {}; const calls = { whop: [], tokenGrants: 0 };
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url === "https://oauth2.googleapis.com/token") { calls.tokenGrants++; assert.match(String(init.body), /assertion=[\w-]+\.[\w-]+\.[\w-]+/); return new Response(JSON.stringify({ access_token: "ya29.test", expires_in: 3600 })); }
  if (url.startsWith("https://identitytoolkit.googleapis.com/")) { const t = JSON.parse(init.body).idToken; return tokens[t] ? new Response(JSON.stringify({ users: [{ localId: tokens[t] }] })) : new Response("{}", { status: 400 }); }
  const m = /^https:\/\/truck-talk-admin-default-rtdb[^/]+\/(.*)\.json(\?.*)?$/.exec(url);
  if (m) {
    const path = decodeURIComponent(m[1]);
    const admin = (init.headers || {}).authorization === "Bearer ya29.test";
    if (!admin && !/^users\/[^/]+$/.test(path)) return new Response("denied", { status: 401 });
    if (!init.method || init.method === "GET") return new Response(JSON.stringify(getAt(path)));
    if (init.method === "PATCH") { const v = JSON.parse(init.body); for (const [k, val] of Object.entries(v)) setAt((path ? path + "/" : "") + k, val); return new Response(init.body); }
  }
  if (url === "https://api.whop.com/api/v1/checkout_configurations") { calls.whop.push(JSON.parse(init.body)); return new Response(JSON.stringify({ id: "ch_1", purchase_url: "https://whop.com/checkout/ch_1/" })); }
  if (url.startsWith("https://api.elevenlabs.io/")) return new Response(JSON.stringify({ signed_url: "wss://x/y" }));
  throw new Error("unexpected fetch " + url);
};
let n = 0;
const jwt = (id) => "h." + Buffer.from(JSON.stringify({ user_id: id, aud: "truck-talk-admin" })).toString("base64url") + ".s";
function person(profile) { const id = "u" + ++n; if (profile) setAt("users/" + id, profile); const t = jwt(id); tokens[t] = id; return { id, t }; }

function res() {
  const r = { status: 0, headers: {}, body: null, setHeader(k, v) { r.headers[k.toLowerCase()] = v; }, end(b) { r.body = b ? JSON.parse(b) : null; } };
  Object.defineProperty(r, "statusCode", { set(v) { r.status = v; }, get() { return r.status; } });
  return r;
}
async function call(handler, { method = "POST", token, body, headers = {}, query = {} } = {}) {
  const r = res();
  await handler({ method, query, headers: Object.assign(token ? { authorization: "Bearer " + token } : {}, headers), body }, r);
  return r;
}

// ---- plans
const plans = require("../api/_plans.js");
assert.equal(plans.extendPaid(null, "month", NOW), NOW + 30 * DAY);
assert.equal(plans.extendPaid(NOW + 5 * DAY, "quarter", NOW), NOW + 95 * DAY, "extends a running period");
assert.equal(plans.extendPaid(NOW - 5 * DAY, "month", NOW), NOW + 30 * DAY, "a lapsed one starts from now");
assert.equal(plans.voicePlan({ role: "teacher", status: "approved" }, NOW), null, "staff unlimited");
assert.equal(plans.voicePlan({ role: "student", status: "pending", paidUntil: NOW + DAY }, NOW), plans.VOICE.paid);
assert.equal(plans.voicePlan({ role: "student", status: "pending", paidUntil: NOW - DAY }, NOW), plans.VOICE.trial);
const led = { a: { start: NOW - 60000, granted: 600 }, b: { start: NOW - 2 * DAY, granted: 900, used: 120 }, old: { start: NOW - 40 * DAY, granted: 900, used: 900 } };
assert.equal(plans.voiceBalance(plans.VOICE.paid, led, NOW).used, 60 + 120, "open call counts its time so far; 30-day window");
assert.equal(plans.voiceBalance(plans.VOICE.trial, led, NOW).used, 60 + 120 + 900, "trial counts everything");

// ---- /api/pay
const pay = require("../api/pay.js");
const expired = person({ role: "student", status: "pending", createdAt: NOW - 10 * DAY, name: "Ali" });
assert.equal((await call(pay, { method: "GET", query: { health: "1" } })).body.configured, true);
assert.equal((await call(pay, { body: { plan: "month" } })).status, 401);
assert.equal((await call(pay, { token: expired.t, body: { plan: "year" } })).status, 400);
assert.equal((await call(pay, { token: person({ role: "student", status: "restricted" }).t, body: { plan: "month" } })).status, 403);
let r = await call(pay, { token: expired.t, body: JSON.stringify({ plan: "quarter" }) });
assert.equal(r.status, 200, "a student whose trial ended can pay"); assert.equal(r.body.url, "https://whop.com/checkout/ch_1/");
assert.deepEqual(calls.whop.at(-1).metadata, { uid: expired.id, plan: "quarter", app: "trucktalk" }); assert.equal(calls.whop.at(-1).plan_id, "plan_Q");

// ---- /api/whop
const whop = require("../api/whop.js");
function signed(event, { secret = process.env.WHOP_WEBHOOK_SECRET, ts = Math.floor(Date.now() / 1000), id = "msg_" + Math.random().toString(36).slice(2) } = {}) {
  const body = JSON.stringify(event);
  const sig = crypto.createHmac("sha256", Buffer.from(secret, "utf8")).update(id + "." + ts + "." + body).digest("base64");
  return { body, headers: { "webhook-id": id, "webhook-timestamp": String(ts), "webhook-signature": "v1," + sig } };
}
const send = (event, o) => { const s = signed(event, o); return call(whop, { body: s.body, headers: s.headers }); };
const paid = (id, data) => ({ type: "payment.succeeded", data: Object.assign({ id }, data) });

assert.equal((await send(paid("pay_x", { metadata: { uid: expired.id } }), { secret: "ws_wrong" })).status, 401, "bad signature");
assert.equal((await send(paid("pay_x", { metadata: { uid: expired.id } }), { ts: Math.floor(Date.now() / 1000) - 3600 })).status, 401, "replay");
assert.equal(getAt("users/" + expired.id + "/paidUntil"), null);

r = await send(paid("pay_1", { metadata: { uid: expired.id, plan: "quarter" }, membership: { id: "mem_1" }, user: { id: "user_1" }, total: 399, currency: "usd" }));
assert.equal(r.status, 200); assert.equal(r.body.result, "applied");
let u = getAt("users/" + expired.id);
assert.ok(Math.abs(u.paidUntil - (NOW + 90 * DAY)) < 60000, "90 days from now");
assert.equal(u.plan, "quarter"); assert.equal(u.ttAccess, true); assert.equal(u.unlockFrom, 1); assert.equal(u.unlockTo, 60);
assert.equal(getAt("payments/log/pay_1/amount"), 399); assert.equal(getAt("payments/memberships/mem_1"), expired.id);
const first = u.paidUntil;
assert.equal((await send(paid("pay_1", { metadata: { uid: expired.id, plan: "quarter" } }))).body.result, "duplicate", "a retry is counted once");
assert.equal(getAt("users/" + expired.id + "/paidUntil"), first);

// a renewal with no metadata finds its owner through the membership
r = await send(paid("pay_2", { membership_id: "mem_1", plan_id: "plan_M" }));
assert.equal(r.body.result, "applied"); assert.ok(Math.abs(getAt("users/" + expired.id + "/paidUntil") - (first + 30 * DAY)) < 1000, "renewal extends");

// paying during the free trial keeps the trial days
const trial = person({ role: "student", status: "pending", createdAt: NOW - DAY });
await send(paid("pay_t", { metadata: { uid: trial.id, plan: "month" } }));
assert.ok(Math.abs(getAt("users/" + trial.id + "/paidUntil") - (NOW - DAY + 3 * DAY + 30 * DAY)) < 60000);

// a payment nobody can be tied to waits; the membership event settles it
const later = person({ role: "student", status: "pending", createdAt: NOW - 9 * DAY });
r = await send(paid("pay_3", { membership: { id: "mem_9" }, user: { id: "user_9", email: "d@x.com" }, plan_id: "plan_M" }));
assert.equal(r.body.result, "unmatched"); assert.equal(getAt("payments/unmatched/pay_3/email"), "d@x.com");
r = await send({ type: "membership.activated", data: { id: "mem_9", user_id: "user_9", metadata: { uid: later.id } } });
assert.equal(r.body.result, "settled-1"); assert.equal(getAt("payments/unmatched/pay_3"), null);
assert.ok(getAt("users/" + later.id + "/paidUntil") > NOW + 29 * DAY);
// metadata naming an account that doesn't exist is not applied
assert.equal((await send(paid("pay_4", { metadata: { uid: "nobody" } }))).body.result, "unmatched");

// ---- the gate on the AI servers: a paid student is let in, an expired one is not
const { mayUse } = require("../api/_auth.js");
assert.equal(mayUse({ role: "student", status: "pending", createdAt: NOW - 10 * DAY, paidUntil: NOW + DAY }, NOW), true);
assert.equal(mayUse({ role: "student", status: "pending", createdAt: NOW - 10 * DAY, paidUntil: NOW - 1 }, NOW), false);
assert.equal(mayUse({ role: "student", status: "restricted", paidUntil: NOW + DAY }, NOW), false, "restricted beats paid");

// ---- voice minutes on /api/agent
const agent = require("../api/agent.js");
const tr = person({ role: "student", status: "pending", createdAt: NOW - 1000 });
r = await call(agent, { token: tr.t });
assert.equal(r.status, 200); assert.equal(r.body.maxSeconds, 600, "trial: 10 minutes"); assert.ok(r.body.session);
const sess = r.body.session;
assert.equal(getAt("voiceUsage/" + tr.id + "/" + sess + "/granted"), 600);
await call(agent, { token: tr.t, body: { end: sess, seconds: 99999 } });
assert.ok(getAt("voiceUsage/" + tr.id + "/" + sess + "/used") <= 6, "the reported length is capped by the time since the start");
setAt("voiceUsage/" + tr.id + "/" + sess + "/used", 590);
r = await call(agent, { token: tr.t });
assert.equal(r.status, 402); assert.equal(r.body.error, "no-minutes");
const paidStudent = person({ role: "student", status: "pending", createdAt: NOW - 20 * DAY, paidUntil: NOW + 10 * DAY });
assert.equal((await call(agent, { token: paidStudent.t })).body.maxSeconds, 1800, "paid: a full 30-minute call");
assert.equal((await call(agent, { token: person({ role: "teacher", status: "approved" }).t })).body.session, null, "staff aren't counted");

console.log("payments: all assertions passed");
