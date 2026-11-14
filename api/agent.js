/* Starts a live voice conversation with the ElevenLabs teacher agent (Vercel serverless function).
 *
 *   GET  /api/agent?health=1   -> { configured }   (public; the app only offers the voice teacher when true)
 *   POST /api/agent            -> { signedUrl, maxSeconds, session, minutesLeft }   (needs a signed-in student's Firebase ID token)
 *   POST /api/agent {end, seconds} -> { ok }   the app reports how long call `end` (a session id from above) really lasted
 *
 * The agent is private: the browser can only talk to it with a short-lived signed link that this function asks
 * ElevenLabs for, and only for people the course lets in (see _auth.js: approved accounts, or students in the
 * 3-day trial; restricted, graduated and paused people get nothing). The API key never leaves the server.
 * Cost guards: the agent itself ends a call after 30 minutes and accepts at most 40 calls a day
 * (elevenlabs/teacher.agent.json), and each person gets a few sessions per hour/day here (best effort on serverless).
 *   ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID  (both required; the id is in elevenlabs/agents.json)
 * Voice minutes per plan (api/_plans.js: trial, paid, approved; staff unlimited) are counted in voiceUsage/{uid}, written
 * with the service account (api/_admin.js). Each call is granted at most the minutes left (402 no-minutes when none);
 * the app hangs up when they run out and reports the real length. Until FIREBASE_SERVICE_ACCOUNT is set, and for the
 * separate SpeakUp site's accounts, calls are not counted (the old behavior).
 */
"use strict";
const { checkCaller, makeLimiter } = require("./_auth.js");
const admin = require("./_admin.js");
const { voicePlan, voiceBalance } = require("./_plans.js");

const MAX_SECONDS = 1800;   // keep equal to conversation.max_duration_seconds in the agent's config
const underLimit = makeLimiter({ perWindow: 4, windowMs: 60 * 60 * 1000, perDay: 12 });

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "authorization, content-type");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}

async function handler(req, res) {
  const env = process.env;
  const now = Date.now();
  const configured = !!(env.ELEVENLABS_API_KEY && env.ELEVENLABS_AGENT_ID);
  if (req.method === "OPTIONS") return send(res, 204, {});
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  if (req.method === "GET") return send(res, 200, q.health ? { configured } : { error: "method" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!configured) return send(res, 503, { error: "not-configured" });

  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return send(res, 401, { error: "sign-in" });
  const caller = await checkCaller(token, now);
  if (!caller) return send(res, 403, { error: "not-allowed" });
  const counted = admin.configured() && caller.projectId === "truck-talk-admin";
  const body = req.body && typeof req.body === "object" ? req.body : (() => { try { return JSON.parse(String(req.body || "{}")); } catch (e) { return {}; } })();

  // the end of a call: record how long it really was (never more than granted, nor than the time since it started)
  if (body && typeof body.end === "string") {
    if (!counted || !/^[A-Za-z0-9_-]{6,40}$/.test(body.end)) return send(res, 200, { ok: true });
    try {
      const path = "voiceUsage/" + caller.uid + "/" + body.end;
      const s = await admin.dbGet(path);
      if (s && typeof s.used !== "number") {
        const secs = Math.max(0, Math.min(Number(body.seconds) || 0, Number(s.granted) || 0, Math.ceil((now - s.start) / 1000) + 5));
        await admin.dbUpdate(path, { used: Math.round(secs) });
      }
    } catch (e) { console.error("agent: end " + (e && e.message)); }
    return send(res, 200, { ok: true });
  }

  if (!underLimit(caller.who, now)) return send(res, 429, { error: "slow-down" });

  // how many seconds this person may still talk
  let grant = MAX_SECONDS, left = null;
  const plan = counted ? voicePlan(caller.profile, now) : null;
  if (plan) {
    let ledger = null;
    try { ledger = await admin.dbGet("voiceUsage/" + caller.uid); } catch (e) { console.error("agent: ledger " + (e && e.message)); return send(res, 503, { error: "ledger" }); }
    left = voiceBalance(plan, ledger, now).left;
    if (left < 30) return send(res, 402, { error: "no-minutes", minutesLeft: 0, minutes: plan.minutes });
    grant = Math.min(MAX_SECONDS, left);
  }

  let up;
  try {
    up = await fetch("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=" + encodeURIComponent(env.ELEVENLABS_AGENT_ID),
      { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } });
  } catch (e) { return send(res, 503, { error: "upstream-unreachable" }); }
  if (!up.ok) {
    let detail = "";
    try { detail = (await up.text()).slice(0, 300); } catch (e) {}
    console.error("agent: ElevenLabs answered " + up.status + " " + detail);
    return send(res, 503, { error: "upstream-" + up.status });
  }
  let signedUrl = "";
  try { signedUrl = (await up.json()).signed_url || ""; } catch (e) {}
  if (!/^wss:\/\//.test(signedUrl)) return send(res, 503, { error: "bad-link" });
  let session = null;
  if (plan) {
    session = now.toString(36) + Math.random().toString(36).slice(2, 8);
    try { await admin.dbUpdate("voiceUsage/" + caller.uid, { [session]: { start: now, granted: grant } }); }
    catch (e) { console.error("agent: ledger write " + (e && e.message)); return send(res, 503, { error: "ledger" }); }
  }
  send(res, 200, { signedUrl, maxSeconds: grant, session, minutesLeft: left == null ? null : Math.floor(left / 60) });
}

module.exports = handler;
