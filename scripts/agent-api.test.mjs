/* api/agent.js against stubbed Firebase + ElevenLabs: nothing here touches the network. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const handler = createRequire(import.meta.url)("../api/agent.js");

const NOW = Date.now(), DAY = 86400000;
const profiles = {}, tokens = {}, calls = { eleven: [] };
let eleven = () => new Response(JSON.stringify({ signed_url: "wss://api.elevenlabs.io/v1/convai/conversation?agent_id=a&conversation_signature=sig" }), { status: 200 });
globalThis.fetch = async (url, init) => {
  url = String(url);
  if (url.startsWith("https://identitytoolkit.googleapis.com/")) { const t = JSON.parse(init.body).idToken; return tokens[t] ? new Response(JSON.stringify({ users: [{ localId: tokens[t] }] })) : new Response("{}", { status: 400 }); }
  if (url.includes("firebasedatabase.app/users/")) { const uid = decodeURIComponent(url.split("/users/")[1].split(".json")[0]); return new Response(JSON.stringify(profiles[uid] ?? null)); }
  if (url.startsWith("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url")) { calls.eleven.push({ url, init }); return eleven(); }
  throw new Error("unexpected fetch " + url);
};
let n = 0;
const person = (p) => { const id = "a" + ++n; profiles[id] = p; tokens["tok" + id] = id; return "tok" + id; };
const approved = () => person({ status: "approved", role: "student", createdAt: NOW - 30 * DAY });
const ENV = { ELEVENLABS_API_KEY: "xi-secret", ELEVENLABS_AGENT_ID: "agent_123" };
async function call({ method = "POST", query = {}, token, env = ENV } = {}) {
  delete process.env.ELEVENLABS_API_KEY; delete process.env.ELEVENLABS_AGENT_ID; Object.assign(process.env, env);
  const headers = {}; let status = 0, out = null;
  const res = { setHeader: (k, v) => { headers[k.toLowerCase()] = v; }, set statusCode(v) { status = v; }, get statusCode() { return status; }, end: (b) => { out = b; } };
  await handler({ method, query, headers: token ? { authorization: "Bearer " + token } : {} }, res);
  return { status, headers, json: out ? JSON.parse(out) : null, raw: out };
}

// health needs both the key and the agent id, and never leaks them
assert.equal((await call({ method: "GET", query: { health: "1" } })).json.configured, true);
assert.equal((await call({ method: "GET", query: { health: "1" }, env: { ELEVENLABS_API_KEY: "k" } })).json.configured, false, "agent id missing");
assert.equal((await call({ method: "GET", query: { health: "1" }, env: { ELEVENLABS_AGENT_ID: "a" } })).json.configured, false, "key missing");
assert.ok(!(await call({ method: "GET", query: { health: "1" } })).raw.includes("secret"));

// who may start a conversation
const t = approved();
assert.equal((await call({ token: t, env: {} })).status, 503, "not configured");
assert.equal((await call({})).status, 401, "no token");
assert.equal((await call({ token: "forged" })).status, 403);
assert.equal((await call({ token: person({ status: "restricted", role: "student", createdAt: NOW, statusReason: "graduated" }) })).status, 403, "graduated/paused/left people are restricted");
assert.equal((await call({ token: person({ status: "pending", role: "student", createdAt: NOW - 5 * DAY }) })).status, 403, "trial over");
assert.equal((await call({ token: person(null) })).status, 403);
assert.equal(calls.eleven.length, 0, "nothing is requested from ElevenLabs for refused people");
assert.equal((await call({ method: "PUT", token: t })).status, 405);

// happy path: a signed link only, key in the header, never in the answer
let r = await call({ token: t });
assert.equal(r.status, 200); assert.match(r.json.signedUrl, /^wss:\/\//); assert.equal(r.json.maxSeconds, 300);
assert.equal(calls.eleven.at(-1).init.headers["xi-api-key"], "xi-secret"); assert.ok(calls.eleven.at(-1).url.includes("agent_id=agent_123"));
assert.ok(!r.raw.includes("xi-secret")); assert.equal(r.headers["cache-control"], "no-store");
r = await call({ token: person({ status: "pending", role: "student", createdAt: NOW - DAY }) });
assert.equal(r.status, 200, "student inside the 3-day trial");

// per-person limit: 4 an hour
const busy = approved(); let last;
for (let i = 0; i < 5; i++) last = await call({ token: busy });
assert.equal(last.status, 429); assert.equal((await call({ token: approved() })).status, 200, "someone else is unaffected");

// failures are logged for diagnosis, never returned, never cached
const logged = []; const orig = console.error; console.error = (...a) => logged.push(a.join(" "));
for (const st of [401, 404, 429, 500]) {
  eleven = () => new Response("quota exceeded: secret detail", { status: st });
  r = await call({ token: approved() });
  assert.equal(r.status, 503); assert.equal(r.json.error, "upstream-" + st); assert.ok(!r.raw.includes("secret"));
}
console.error = orig;
assert.equal(logged.length, 4); assert.ok(logged[0].includes("secret detail") && !logged.join(" ").includes("xi-secret"));
eleven = () => { throw new Error("offline"); };
assert.equal((await call({ token: approved() })).status, 503);
eleven = () => new Response(JSON.stringify({ signed_url: "https://evil.example/x" }), { status: 200 });
assert.equal((await call({ token: approved() })).status, 503, "only wss links are accepted");
eleven = () => new Response("not json", { status: 200 });
assert.equal((await call({ token: approved() })).status, 503);

console.log("agent-api tests passed");
