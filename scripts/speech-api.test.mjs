/* api/speech.js against stubbed Firebase + ElevenLabs: nothing here touches the network. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const handler = createRequire(import.meta.url)("../api/speech.js");

const NOW = Date.now(), DAY = 86400000;
const profiles = {}, tokens = {}, calls = [];
let eleven = () => new Response(JSON.stringify({ text: "  I am coming   from Chicago. " }), { status: 200 });
globalThis.fetch = async (url, init) => {
  url = String(url);
  if (url.startsWith("https://identitytoolkit.googleapis.com/")) { const t = JSON.parse(init.body).idToken; return tokens[t] ? new Response(JSON.stringify({ users: [{ localId: tokens[t] }] })) : new Response("{}", { status: 400 }); }
  if (url.includes("firebasedatabase.app/users/")) { const uid = decodeURIComponent(url.split("/users/")[1].split(".json")[0]); return new Response(JSON.stringify(profiles[uid] ?? null)); }
  if (url === "https://api.elevenlabs.io/v1/speech-to-text") { calls.push(init); return eleven(); }
  throw new Error("unexpected fetch " + url);
};
let n = 0;
const jwt = (id, aud = "truck-talk-admin") => "h." + Buffer.from(JSON.stringify({ user_id: id, aud })).toString("base64url") + ".s";
const person = (p) => { const id = "s" + ++n; profiles[id] = p; const t = jwt(id); tokens[t] = id; return t; };
const approved = () => person({ status: "approved", role: "student", createdAt: NOW - 30 * DAY });
const AUDIO = Buffer.alloc(4000, 7);
async function call({ method = "POST", query = {}, token, type = "audio/webm;codecs=opus", body = AUDIO, env = { ELEVENLABS_API_KEY: "xi-secret" } } = {}) {
  delete process.env.ELEVENLABS_API_KEY; Object.assign(process.env, env);
  const headers = {}; let status = 0, out = null;
  const res = { setHeader: (k, v) => { headers[k.toLowerCase()] = v; }, set statusCode(v) { status = v; }, get statusCode() { return status; }, end: (b) => { out = b; } };
  const h = { "content-type": type }; if (token) h.authorization = "Bearer " + token;
  await handler({ method, query, headers: h, body }, res);
  return { status, json: out ? JSON.parse(out) : null, raw: out };
}

assert.equal((await call({ method: "GET", query: { health: "1" } })).json.configured, true);
assert.equal((await call({ method: "GET", query: { health: "1" }, env: {} })).json.configured, false);
assert.ok(!(await call({ method: "GET", query: { health: "1" } })).raw.includes("secret"));
const t = approved();
assert.equal((await call({ token: t, env: {} })).status, 503);
assert.equal((await call({})).status, 401);
assert.equal((await call({ token: t, type: "application/json" })).status, 415, "audio only");
assert.equal((await call({ token: "forged" })).status, 403);
assert.equal((await call({ token: person({ status: "pending", role: "student", createdAt: NOW - 5 * DAY }) })).status, 403, "trial over");
assert.equal((await call({ token: t, body: Buffer.alloc(2 * 1024 * 1024) })).status, 413);
assert.equal((await call({ token: t, body: Buffer.alloc(10) })).status, 400);
assert.equal(calls.length, 0, "nothing is sent upstream for refused requests");

let r = await call({ token: t });
assert.equal(r.status, 200); assert.equal(r.json.text, "I am coming from Chicago.");
const sent = calls.at(-1);
assert.equal(sent.headers["xi-api-key"], "xi-secret"); assert.equal(sent.body.get("model_id"), "scribe_v1"); assert.equal(sent.body.get("language_code"), "en");
assert.equal(sent.body.get("file").size, AUDIO.length); assert.equal(sent.body.get("file").type, "audio/webm");
assert.ok(!r.raw.includes("xi-secret"));

const logged = []; const orig = console.error; console.error = (...a) => logged.push(a.join(" "));
eleven = () => new Response("quota: secret detail", { status: 429 });
r = await call({ token: approved() });
console.error = orig;
assert.equal(r.status, 503); assert.equal(r.json.error, "upstream-429"); assert.ok(!r.raw.includes("secret")); assert.ok(logged[0].includes("secret detail"));
console.log("speech-api tests passed");
