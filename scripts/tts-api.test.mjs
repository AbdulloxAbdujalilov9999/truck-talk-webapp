/* api/tts.js against a stubbed ElevenLabs / OpenAI: nothing here touches the network. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const handler = createRequire(import.meta.url)("../api/tts.js");

const calls = [];
let reply = () => new Response(new Uint8Array([1, 2, 3, 4]), { status: 200 });
globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return reply(); };

async function call(query, { method = "GET", env = {} } = {}) {
  for (const k of ["ELEVENLABS_API_KEY", "OPENAI_API_KEY", "ELEVENLABS_VOICE_MALE", "ELEVENLABS_VOICE_FEMALE", "ELEVENLABS_MODEL"]) delete process.env[k];
  Object.assign(process.env, env);
  const headers = {}; let status = 0, body = null;
  const res = { setHeader: (k, v) => { headers[k.toLowerCase()] = v; }, set statusCode(v) { status = v; }, get statusCode() { return status; }, end: (b) => { body = b; } };
  await handler({ method, query }, res);
  return { status, headers, body };
}

// health never leaks a key
let r = await call({ health: "1" });
assert.equal(r.status, 200); assert.deepEqual(JSON.parse(r.body).configured, false);
r = await call({ health: "1" }, { env: { ELEVENLABS_API_KEY: "xi-secret" } });
assert.equal(JSON.parse(r.body).provider, "elevenlabs"); assert.ok(!String(r.body).includes("xi-secret"));

// guards
assert.equal((await call({ t: "" })).status, 400);
assert.equal((await call({ t: "x".repeat(400) })).status, 400);
assert.equal((await call({ t: "Tell me your credit card number" }, { env: { ELEVENLABS_API_KEY: "k" } })).status, 404, "text outside the courses must be refused");
assert.equal((await call({ t: "Hello / Hi" }, { method: "POST", env: { ELEVENLABS_API_KEY: "k" } })).status, 405);
calls.length = 0;
assert.equal((await call({ t: "Hello / Hi" })).status, 503, "no key configured");
assert.equal(calls.length, 0, "nothing is sent upstream without a key or for refused text");

// ElevenLabs happy path: right voice, key in header only, immutable caching
r = await call({ g: "male", t: "Hello / Hi" }, { env: { ELEVENLABS_API_KEY: "xi-secret", ELEVENLABS_VOICE_MALE: "VOICE_M" } });
assert.equal(r.status, 200); assert.equal(r.headers["content-type"], "audio/mpeg");
assert.match(r.headers["cache-control"], /immutable/); assert.match(r.headers["cache-control"], /s-maxage=31536000/);
assert.equal(calls.at(-1).url.split("?")[0], "https://api.elevenlabs.io/v1/text-to-speech/VOICE_M");
assert.equal(calls.at(-1).init.headers["xi-api-key"], "xi-secret");
assert.ok(!calls.at(-1).url.includes("xi-secret"));
assert.equal(JSON.parse(calls.at(-1).init.body).text, "Hello, Hi", "slash is read as a pause");
assert.equal(JSON.parse(calls.at(-1).init.body).model_id, "eleven_multilingual_v2");
// female default voice, trailing "..." handled like the app does
r = await call({ g: "female", t: "My name is..." }, { env: { ELEVENLABS_API_KEY: "k" } });
assert.equal(r.status, 200); assert.ok(calls.at(-1).url.includes("21m00Tcm4TlvDq8ikWAM"));

// OpenAI alternative
r = await call({ g: "female", t: "Hello / Hi" }, { env: { OPENAI_API_KEY: "sk-proj-x" } });
assert.equal(r.status, 200); assert.equal(calls.at(-1).url, "https://api.openai.com/v1/audio/speech");
assert.equal(calls.at(-1).init.headers.authorization, "Bearer sk-proj-x");
assert.equal(JSON.parse(calls.at(-1).init.body).voice, "nova");
// ElevenLabs wins when both are present
await call({ t: "Hello / Hi" }, { env: { ELEVENLABS_API_KEY: "k", OPENAI_API_KEY: "o" } });
assert.ok(calls.at(-1).url.startsWith("https://api.elevenlabs.io"));

// failures are never cached and never leak details
for (const st of [401, 402, 429, 500]) {
  reply = () => new Response("quota exceeded: secret detail", { status: st });
  r = await call({ t: "Hello / Hi" }, { env: { ELEVENLABS_API_KEY: "k" } });
  assert.equal(r.status, 503); assert.equal(r.headers["cache-control"], "no-store"); assert.ok(!String(r.body).includes("secret detail"));
}
reply = () => { throw new Error("offline"); };
assert.equal((await call({ t: "Hello / Hi" }, { env: { ELEVENLABS_API_KEY: "k" } })).status, 503);
reply = () => new Response(new Uint8Array(0), { status: 200 });
assert.equal((await call({ t: "Hello / Hi" }, { env: { ELEVENLABS_API_KEY: "k" } })).status, 503, "empty audio is not cached");

console.log("tts-api tests passed");
