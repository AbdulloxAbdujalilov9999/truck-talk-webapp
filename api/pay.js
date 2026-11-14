/* Starts a Whop checkout for the signed-in student (Vercel serverless function).
 *
 *   GET  /api/pay?health=1  -> { configured }
 *   POST /api/pay {plan: "month"|"quarter"}  -> { url }   (needs the student's Firebase ID token)
 *
 * The checkout is created for this one account: its metadata carries the uid, so when Whop reports the payment
 * (api/whop.js) we know whose access to open. Anybody signed in to Truck Talk may start one, including people whose
 * trial ended (that's who pays); restricted accounts may not.
 *   WHOP_API_KEY        a company API key from the Whop dashboard (Developer > API keys)
 *   WHOP_PLAN_MONTH     the Whop plan id (plan_...) of the $149 monthly plan
 *   WHOP_PLAN_QUARTER   the Whop plan id of the $399 three-month plan
 *   SITE_URL            optional, where Whop sends the buyer back (default https://www.trucktalk.courses)
 */
"use strict";
const { identify, makeLimiter } = require("./_auth.js");

const underLimit = makeLimiter({ perWindow: 10, windowMs: 60 * 60 * 1000, perDay: 30 });

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "authorization, content-type");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}
async function readJson(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string" || Buffer.isBuffer(req.body)) { try { return JSON.parse(String(req.body)); } catch (e) { return {}; } }
  return {};
}
function plans(env) { return { month: env.WHOP_PLAN_MONTH || "", quarter: env.WHOP_PLAN_QUARTER || "" }; }

async function handler(req, res) {
  const env = process.env;
  const now = Date.now();
  const planIds = plans(env);
  const configured = !!(env.WHOP_API_KEY && (planIds.month || planIds.quarter));
  if (req.method === "OPTIONS") return send(res, 204, {});
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  if (req.method === "GET") return send(res, 200, q.health ? { configured } : { error: "method" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!configured) return send(res, 503, { error: "not-configured" });

  const body = await readJson(req);
  const plan = body && typeof body.plan === "string" && Object.prototype.hasOwnProperty.call(planIds, body.plan) ? body.plan : null;
  if (!plan || !planIds[plan]) return send(res, 400, { error: "plan" });

  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return send(res, 401, { error: "sign-in" });
  const caller = await identify(token);
  // Truck Talk's own accounts only (the separate SpeakUp site isn't sold here), with a profile, not switched off
  if (!caller || caller.projectId !== "truck-talk-admin" || !caller.profile || caller.profile.status === "restricted") return send(res, 403, { error: "not-allowed" });
  if (!underLimit(caller.who, now)) return send(res, 429, { error: "slow-down" });

  const site = (env.SITE_URL || "https://www.trucktalk.courses").replace(/\/$/, "");
  let up;
  try {
    up = await fetch("https://api.whop.com/api/v1/checkout_configurations", {
      method: "POST",
      headers: { authorization: "Bearer " + env.WHOP_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        plan_id: planIds[plan],
        mode: "payment",
        metadata: { uid: caller.uid, plan, app: "trucktalk" },
        redirect_url: site + "/trucktalk/?paid=1",
      }),
    });
  } catch (e) { return send(res, 503, { error: "upstream-unreachable" }); }
  if (!up.ok) {
    let detail = "";
    try { detail = (await up.text()).slice(0, 300); } catch (e) {}
    console.error("pay: Whop answered " + up.status + " " + detail);
    return send(res, 503, { error: "upstream-" + up.status });
  }
  let url = "";
  try { url = String((await up.json()).purchase_url || ""); } catch (e) {}
  if (url.startsWith("/")) url = "https://whop.com" + url;
  if (!/^https:\/\/([a-z0-9-]+\.)*whop\.com\//i.test(url)) { console.error("pay: unexpected purchase_url " + url.slice(0, 120)); return send(res, 503, { error: "bad-link" }); }
  send(res, 200, { url });
}

module.exports = handler;
