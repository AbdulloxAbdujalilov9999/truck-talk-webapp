/* Pronunciation check on the server (Vercel serverless function): turns a short recording of the student into text with
 * ElevenLabs speech-to-text, so the app can score it against the line they tried to say. Works on every phone, including
 * iPhones whose browser has no speech recognition, and hears accented English better than the phone's own recognizer.
 *
 *   GET  /api/speech?health=1   -> { configured }   (public; the app falls back to the phone's recognizer when false)
 *   POST /api/speech            body: the recording (audio/webm, audio/mp4, audio/ogg or audio/wav, at most 1 MB)
 *                               -> { text }        (needs a signed-in student's Firebase ID token, like the other AI endpoints)
 *
 * Who may use it: see _auth.js (approved accounts, paid students, students inside the trial). Cost guards: 1 MB / about
 * 20 seconds per recording and a per-person rate limit. The audio is passed straight through and never stored here.
 *   ELEVENLABS_API_KEY   required      SPEECH_MODEL   optional (default scribe_v1)
 */
"use strict";
const { checkUser, makeLimiter } = require("./_auth.js");

const MAX_BYTES = 1024 * 1024;
const TYPES = /^audio\/(webm|mp4|m4a|x-m4a|aac|ogg|wav|x-wav|mpeg)\b/;
const underLimit = makeLimiter({ perWindow: 40, windowMs: 10 * 60 * 1000, perDay: 400 });

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "authorization, content-type");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}

// The raw request body as a Buffer (Vercel leaves audio bodies unparsed), refusing anything over the limit.
async function readAudio(req) {
  if (Buffer.isBuffer(req.body)) return req.body.length > MAX_BYTES ? null : req.body;
  if (req.body instanceof Uint8Array) return req.body.length > MAX_BYTES ? null : Buffer.from(req.body);
  if (typeof req.on !== "function") return Buffer.alloc(0);
  return new Promise((resolve) => {
    const chunks = []; let size = 0, done = false;
    req.on("data", (c) => { if (done) return; size += c.length; if (size > MAX_BYTES) { done = true; resolve(null); return; } chunks.push(c); });
    req.on("end", () => { if (!done) { done = true; resolve(Buffer.concat(chunks)); } });
    req.on("error", () => { if (!done) { done = true; resolve(Buffer.alloc(0)); } });
  });
}

async function handler(req, res) {
  const env = process.env;
  const now = Date.now();
  if (req.method === "OPTIONS") return send(res, 204, {});
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  if (req.method === "GET") return send(res, 200, q.health ? { configured: !!env.ELEVENLABS_API_KEY } : { error: "method" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!env.ELEVENLABS_API_KEY) return send(res, 503, { error: "not-configured" });

  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return send(res, 401, { error: "sign-in" });
  const type = String((req.headers && req.headers["content-type"]) || "").toLowerCase();
  if (!TYPES.test(type)) return send(res, 415, { error: "audio-type" });
  const uid = await checkUser(token, now);
  if (!uid) return send(res, 403, { error: "not-allowed" });
  if (!underLimit(uid, now)) return send(res, 429, { error: "slow-down" });

  const audio = await readAudio(req);
  if (audio === null) return send(res, 413, { error: "too-long" });
  if (audio.length < 200) return send(res, 400, { error: "empty" });

  const form = new FormData();
  form.append("model_id", env.SPEECH_MODEL || "scribe_v1");
  form.append("language_code", "en");
  form.append("tag_audio_events", "false");
  form.append("file", new Blob([audio], { type: type.split(";")[0] }), "answer." + (type.match(/audio\/(?:x-)?(\w+)/) || [, "webm"])[1]);
  let up;
  try {
    up = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY }, body: form });
  } catch (e) { return send(res, 503, { error: "upstream-unreachable" }); }
  if (!up.ok) {
    let detail = "";
    try { detail = (await up.text()).slice(0, 300); } catch (e) {}
    console.error("speech: ElevenLabs answered " + up.status + " " + detail);
    return send(res, 503, { error: "upstream-" + up.status });
  }
  let text = "";
  try { text = String((await up.json()).text || ""); } catch (e) {}
  send(res, 200, { text: text.replace(/\s+/g, " ").trim().slice(0, 500) });
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
