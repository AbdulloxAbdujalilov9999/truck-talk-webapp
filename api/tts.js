/* Natural-voice endpoint (Vercel serverless function).
 *
 *   GET /api/tts?g=female|male&t=<English phrase>   -> audio/mpeg
 *   GET /api/tts?health=1                           -> { configured, provider, ... }  (never reveals a key)
 *
 * The courses call this instead of the phone's robotic built-in voice. It is safe to leave public because
 *  - it only ever speaks phrases that exist in the courses (api/_phrases.json, built by
 *    scripts/build-voice-phrases.mjs), so nobody can use it as a free text-to-speech service, and
 *  - a successful answer is cached forever (CDN + the student's device), so each phrase is generated once.
 * Any failure answers 503 *without* caching, and the app quietly falls back to the device voice.
 *
 * Keys live only in Vercel Environment Variables, never in the repo or the browser:
 *   ELEVENLABS_API_KEY            (preferred)   optional: ELEVENLABS_VOICE_FEMALE / _MALE (voice ids), ELEVENLABS_MODEL
 *   OPENAI_API_KEY                (alternative) optional: OPENAI_TTS_MODEL, OPENAI_VOICE_FEMALE / _MALE
 */
"use strict";

const PHRASES = new Set(require("./_phrases.json"));

// One normalisation, shared with the build script, so "Hello / Hi", "Hello / Hi " and "Hello / Hi..." are one entry.
function normalize(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim().replace(/\.\.\.$/, "").trim();
}

// Make a course phrase sound natural when read aloud ("Hello / Hi" -> "Hello, Hi").
function spoken(text) {
  return text.replace(/\s*\/\s*/g, ", ").replace(/\s*\.\.\.\s*/g, "… ").trim();
}

const ELEVEN_DEFAULTS = { female: "21m00Tcm4TlvDq8ikWAM", male: "pNInz6obpgDQGGz4jX7d" }; // Rachel, Adam (premade US voices)
const OPENAI_DEFAULTS = { female: "nova", male: "onyx" };

function provider(env) {
  if (env.ELEVENLABS_API_KEY) return "elevenlabs";
  if (env.OPENAI_API_KEY) return "openai";
  return null;
}

async function synth(prov, env, gender, text) {
  if (prov === "elevenlabs") {
    const voice = (gender === "male" ? env.ELEVENLABS_VOICE_MALE : env.ELEVENLABS_VOICE_FEMALE) || ELEVEN_DEFAULTS[gender];
    return fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voice) + "?output_format=mp3_44100_64", {
      method: "POST",
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: env.ELEVENLABS_MODEL || "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, use_speaker_boost: true },
      }),
    });
  }
  const voice = (gender === "male" ? env.OPENAI_VOICE_MALE : env.OPENAI_VOICE_FEMALE) || OPENAI_DEFAULTS[gender];
  return fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { authorization: "Bearer " + env.OPENAI_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ model: env.OPENAI_TTS_MODEL || "tts-1-hd", voice, input: text, response_format: "mp3" }),
  });
}

function send(res, status, headers, body) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");   // the Android/iOS wrappers call this from their own origin
  for (const k of Object.keys(headers)) res.setHeader(k, headers[k]);
  res.end(body);
}
const json = (res, status, obj) => send(res, status, { "content-type": "application/json", "cache-control": "no-store" }, JSON.stringify(obj));

async function handler(req, res) {
  const env = process.env;
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  const prov = provider(env);

  if (q.health) {
    return json(res, 200, { configured: !!prov, provider: prov, phrases: PHRASES.size });
  }
  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "method" });

  const gender = q.g === "male" ? "male" : "female";
  const text = normalize(q.t);
  if (!text || text.length > 300) return json(res, 400, { error: "bad-text" });
  if (!PHRASES.has(text)) return json(res, 404, { error: "not-in-course" });
  if (!prov) return json(res, 503, { error: "not-configured" });

  let up;
  try {
    up = await synth(prov, env, gender, spoken(text));
  } catch (e) {
    return json(res, 503, { error: "upstream-unreachable" });
  }
  if (!up.ok) {
    // 401 bad key / 402-429 quota or rate limit / 4xx voice id... — never cache, the app falls back to the device voice
    return json(res, 503, { error: "upstream-" + up.status });
  }
  const audio = Buffer.from(await up.arrayBuffer());
  if (!audio.length) return json(res, 503, { error: "empty-audio" });
  send(res, 200, {
    "content-type": "audio/mpeg",
    "content-length": String(audio.length),
    // identical forever for this URL: CDN and browser both keep it
    "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
  }, audio);
}

module.exports = handler;
module.exports.normalize = normalize;
module.exports.spoken = spoken;
