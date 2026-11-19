/* Starts a live voice conversation with the ElevenLabs teacher agent (Vercel serverless function).
 *
 *   GET  /api/agent?health=1   -> { configured, officer }   (public; the app only offers each voice call when true)
 *   POST /api/agent            -> { signedUrl, maxSeconds }   (needs a signed-in student's Firebase ID token)
 *        body { kind: "officer" } -> the mock roadside officer instead of the teacher
 *
 * The agent is private: the browser can only talk to it with a short-lived signed link that this function asks
 * ElevenLabs for, and only for people the course lets in (see _auth.js: approved accounts, or students in the
 * 3-day trial; restricted, graduated and paused people get nothing). The API key never leaves the server.
 * Cost guards: the agent itself ends a call after 30 minutes and accepts at most 40 calls a day
 * (elevenlabs/teacher.agent.json), and each person gets a few sessions per hour/day here (best effort on serverless).
 *   ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID  (both required; the id is in elevenlabs/agents.json)
 *   ELEVENLABS_OFFICER_AGENT_ID  optional: the roadside officer agent (elevenlabs/officer.agent.json)
 */
"use strict";
const { checkUser, makeLimiter } = require("./_auth.js");

const MAX_SECONDS = 1800;   // keep equal to conversation.max_duration_seconds in the agent's config
const OFFICER_MAX_SECONDS = 300;   // the officer agent's config ends a call after 5 minutes
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
  const officer = !!(env.ELEVENLABS_API_KEY && env.ELEVENLABS_OFFICER_AGENT_ID);
  if (req.method === "GET") return send(res, 200, q.health ? { configured, officer } : { error: "method" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const isOfficer = !!(body && typeof body === "object" && body.kind === "officer");
  if (isOfficer ? !officer : !configured) return send(res, 503, { error: "not-configured" });
  const agentId = isOfficer ? env.ELEVENLABS_OFFICER_AGENT_ID : env.ELEVENLABS_AGENT_ID;

  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return send(res, 401, { error: "sign-in" });
  const uid = await checkUser(token, now);
  if (!uid) return send(res, 403, { error: "not-allowed" });
  if (!underLimit(uid, now)) return send(res, 429, { error: "slow-down" });

  let up;
  try {
    up = await fetch("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=" + encodeURIComponent(agentId),
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
  send(res, 200, { signedUrl, maxSeconds: isOfficer ? OFFICER_MAX_SECONDS : MAX_SECONDS });
}

module.exports = handler;
