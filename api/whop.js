/* Whop webhook: a payment opens (or extends) the student's access by itself (Vercel serverless function).
 *
 *   POST /api/whop   called by Whop only; every request must carry a valid signature.
 *
 * Set up in the Whop dashboard (Developer > Webhooks): URL https://www.trucktalk.courses/api/whop, events
 * payment.succeeded and membership.activated. Env on Vercel:
 *   WHOP_WEBHOOK_SECRET        the webhook's secret (ws_...), shown once when the webhook is created
 *   FIREBASE_SERVICE_ACCOUNT   see api/_admin.js
 *   WHOP_PLAN_MONTH / WHOP_PLAN_QUARTER   the plan ids (used when a payment carries no plan of its own)
 *
 * What a payment does to users/{uid}: paidUntil moves forward by the plan's days (from now, or from the end of a
 * period still running), plan is noted, Truck Talk is opened (ttAccess) with all 60 lessons (unlockFrom/unlockTo).
 * Each payment is counted once (payments/log/{paymentId}); Whop retries and duplicates are harmless.
 *
 * Whose payment is it? The checkout made by api/pay.js carries the uid in its metadata, and Whop copies that onto the
 * membership. A payment that can't be tied to anybody yet (a renewal arriving before we've seen its membership, or a
 * purchase through a plain Whop link) waits in payments/unmatched for the membership event, or for the owner to apply
 * it by hand in the admin. Signature scheme: Standard Webhooks (webhook-id, webhook-timestamp, webhook-signature;
 * HMAC-SHA256 over "id.timestamp.body", base64, "v1,<sig>"), replay window 5 minutes. */
"use strict";
const crypto = require("crypto");
const admin = require("./_admin.js");
const { extendPaid, PAID_PLANS } = require("./_plans.js");

const TOLERANCE_S = 5 * 60;
const COURSE_DAYS = 60;
const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;   // same as shared/auth-gate.js

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}

// The exact bytes Whop signed. Vercel parses bodies lazily, so the stream is still unread unless something touched req.body.
async function rawBody(req) {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (req.rawBody != null) return String(req.rawBody);
  if (typeof req.on !== "function") return req.body && typeof req.body === "object" ? JSON.stringify(req.body) : "";
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Whop's docs say to use the ws_ secret as given; Standard Webhooks libraries base64-decode what follows the prefix.
// Both are derived from the same secret, so either matching proves the sender knows it.
function secretKeys(secret) {
  const keys = [Buffer.from(secret, "utf8")];
  const m = /^(?:ws|whsec)_(.+)$/.exec(secret);
  if (m && /^[A-Za-z0-9+/=_-]+$/.test(m[1])) { try { const b = Buffer.from(m[1], "base64"); if (b.length >= 16) keys.push(b); } catch (e) {} }
  return keys;
}
function header(req, name) {
  const h = req.headers || {};
  const v = h[name] != null ? h[name] : h[name.toLowerCase()];
  return Array.isArray(v) ? v[0] : (v == null ? "" : String(v));
}
function verify(req, body, secret, nowS) {
  const id = header(req, "webhook-id"), ts = header(req, "webhook-timestamp"), sigs = header(req, "webhook-signature");
  if (!id || !/^\d+$/.test(ts) || !sigs) return false;
  if (Math.abs(nowS - Number(ts)) > TOLERANCE_S) return false;
  const signed = Buffer.from(id + "." + ts + "." + body, "utf8");
  const given = sigs.split(" ").map((s) => s.split(",")).filter((p) => p[0] === "v1" && p[1]).map((p) => Buffer.from(p[1], "base64"));
  for (const key of secretKeys(secret)) {
    const want = crypto.createHmac("sha256", key).update(signed).digest();
    if (given.some((g) => g.length === want.length && crypto.timingSafeEqual(g, want))) return true;
  }
  return false;
}

const safeKey = (s) => (typeof s === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(s) ? s : null);
const pick = (...xs) => xs.find((x) => x != null && x !== "");
function planOf(meta, whopPlanId, env) {
  if (meta && Object.prototype.hasOwnProperty.call(PAID_PLANS, meta.plan)) return meta.plan;
  if (whopPlanId && whopPlanId === env.WHOP_PLAN_QUARTER) return "quarter";
  return "month";
}

// The pieces we use from a payment or a membership, whichever field names this API version uses.
function readPayment(d) {
  const membership = d.membership && typeof d.membership === "object" ? d.membership : {};
  const plan = d.plan && typeof d.plan === "object" ? d.plan : {};
  const user = d.user && typeof d.user === "object" ? d.user : {};
  const meta = Object.assign({}, membership.metadata || {}, d.checkout_configuration && d.checkout_configuration.metadata || {}, d.metadata || {});
  return {
    id: safeKey(d.id),
    uid: safeKey(meta.uid),
    meta,
    membershipId: safeKey(pick(d.membership_id, membership.id, typeof d.membership === "string" ? d.membership : null)),
    whopUserId: safeKey(pick(d.user_id, user.id)),
    whopPlanId: pick(d.plan_id, plan.id, typeof d.plan === "string" ? d.plan : null) || null,
    amount: pick(d.final_amount, d.total, d.amount, d.subtotal, d.usd_total) ?? null,
    currency: pick(d.currency, d.currency_code) || null,
    email: pick(user.email, d.email) || null,
  };
}

async function applyPayment(p, uid, env, now) {
  const profile = await admin.dbGet("users/" + uid);
  if (!profile) return false;
  const plan = planOf(p.meta, p.whopPlanId, env);
  // starts after anything already running: a paid period, or what's left of the free trial
  const trialEnd = profile.status === "pending" && typeof profile.createdAt === "number" ? profile.createdAt + TRIAL_MS : 0;
  const paidUntil = extendPaid(Math.max(typeof profile.paidUntil === "number" ? profile.paidUntil : 0, trialEnd), plan, now);
  const u = "users/" + uid + "/";
  const updates = {
    [u + "paidUntil"]: paidUntil,
    [u + "plan"]: plan,
    [u + "updatedAt"]: now,
    ["payments/log/" + p.id]: { uid, plan, amount: p.amount, currency: p.currency, membership: p.membershipId, at: now, paidUntil },
    ["payments/unmatched/" + p.id]: null,
  };
  if (profile.role === "student") Object.assign(updates, { [u + "ttAccess"]: true, [u + "unlockFrom"]: 1, [u + "unlockTo"]: COURSE_DAYS });
  if (p.membershipId) updates["payments/memberships/" + p.membershipId] = uid;
  if (p.whopUserId) updates["payments/whopUsers/" + p.whopUserId] = uid;
  await admin.dbUpdate("", updates);
  return true;
}

async function onPayment(d, env, now) {
  const p = readPayment(d);
  if (!p.id) return "ignored";
  if (await admin.dbGet("payments/log/" + p.id)) return "duplicate";
  let uid = p.uid;
  if (!uid && p.membershipId) uid = safeKey(await admin.dbGet("payments/memberships/" + p.membershipId));
  if (!uid && p.whopUserId) uid = safeKey(await admin.dbGet("payments/whopUsers/" + p.whopUserId));
  if (uid && await applyPayment(p, uid, env, now)) return "applied";
  await admin.dbUpdate("", { ["payments/unmatched/" + p.id]: {
    membership: p.membershipId, whopUser: p.whopUserId, plan: planOf(p.meta, p.whopPlanId, env), amount: p.amount, currency: p.currency,
    email: p.email, uidHint: uid || null, at: now, meta: JSON.stringify(p.meta).slice(0, 500),
  } });
  return "unmatched";
}

// A membership (new or renewed) tells us whose it is; remember that, and settle payments that were waiting for it.
async function onMembership(d, env, now) {
  const m = readPayment(d);
  const membershipId = safeKey(d.id) || m.membershipId;
  const uid = m.uid || (membershipId && safeKey(await admin.dbGet("payments/memberships/" + membershipId)));
  if (!uid || !(await admin.dbGet("users/" + uid))) return "ignored";
  const links = {};
  if (membershipId) links["payments/memberships/" + membershipId] = uid;
  if (m.whopUserId) links["payments/whopUsers/" + m.whopUserId] = uid;
  if (Object.keys(links).length) await admin.dbUpdate("", links);
  const waiting = (await admin.dbGet("payments/unmatched")) || {};
  let settled = 0;
  for (const [payId, w] of Object.entries(waiting)) {
    if (!w || !((membershipId && w.membership === membershipId) || (m.whopUserId && w.whopUser === m.whopUserId))) continue;
    if (await admin.dbGet("payments/log/" + payId)) continue;
    const meta = { plan: w.plan };
    if (await applyPayment({ id: payId, meta, membershipId: w.membership, whopUserId: w.whopUser, whopPlanId: null, amount: w.amount, currency: w.currency }, uid, env, now)) settled++;
  }
  return settled ? "settled-" + settled : "linked";
}

async function handler(req, res) {
  const env = process.env;
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!env.WHOP_WEBHOOK_SECRET || !admin.configured()) { console.error("whop: WHOP_WEBHOOK_SECRET or FIREBASE_SERVICE_ACCOUNT missing"); return send(res, 503, { error: "not-configured" }); }
  let body;
  try { body = await rawBody(req); } catch (e) { return send(res, 400, { error: "body" }); }
  const now = Date.now();
  if (!verify(req, body, env.WHOP_WEBHOOK_SECRET, Math.floor(now / 1000))) return send(res, 401, { error: "signature" });
  let event;
  try { event = JSON.parse(body); } catch (e) { return send(res, 400, { error: "json" }); }
  const type = String(event && event.type || "").replace(/_/g, ".");
  const data = event && event.data && typeof event.data === "object" ? event.data : {};
  try {
    let result = "ignored";
    if (type === "payment.succeeded") result = await onPayment(data, env, now);
    else if (type === "membership.activated" || type === "membership.went.valid") result = await onMembership(data, env, now);
    console.log("whop: " + type + " -> " + result);
    send(res, 200, { ok: true, result });
  } catch (e) {
    console.error("whop: " + type + " failed: " + (e && e.message));
    send(res, 500, { error: "retry" });   // Whop retries for about three days
  }
}

module.exports = handler;
module.exports._verify = verify;
