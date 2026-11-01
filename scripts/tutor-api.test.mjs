/* api/tutor.js against stubbed Firebase + Anthropic: nothing here touches the network. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const handler = createRequire(import.meta.url)("../api/tutor.js");

const NOW = Date.now(), DAY = 86400000;
const profiles = {};                       // uid -> profile served by the stub database
const tokens = {};                         // token -> uid (valid tokens)
const calls = { anthropic: [], db: [], lookup: 0 };
let anthropic = () => new Response(JSON.stringify({ content: [{ type: "text", text: "Salom" }] }), { status: 200 });

globalThis.fetch = async (url, init) => {
  url = String(url);
  if (url.startsWith("https://identitytoolkit.googleapis.com/")) {
    calls.lookup++;
    const t = JSON.parse(init.body).idToken;
    return tokens[t] ? new Response(JSON.stringify({ users: [{ localId: tokens[t] }] })) : new Response("{}", { status: 400 });
  }
  if (url.includes("firebasedatabase.app/users/")) {
    calls.db.push(url);
    const uid = decodeURIComponent(url.split("/users/")[1].split(".json")[0]);
    return new Response(JSON.stringify(profiles[uid] ?? null), { status: 200 });
  }
  if (url === "https://api.anthropic.com/v1/messages") { calls.anthropic.push(init); return anthropic(); }
  throw new Error("unexpected fetch " + url);
};

let n = 0;
function person(profile) { const id = "u" + ++n; profiles[id] = profile; tokens["tok" + id] = id; return "tok" + id; }
async function call({ method = "POST", query = {}, token, body, env = { ANTHROPIC_API_KEY: "sk-ant-secret" } } = {}) {
  delete process.env.ANTHROPIC_API_KEY; delete process.env.TUTOR_MODEL; Object.assign(process.env, env);
  const headers = {}; let status = 0, out = null;
  const res = { setHeader: (k, v) => { headers[k.toLowerCase()] = v; }, set statusCode(v) { status = v; }, get statusCode() { return status; }, end: (b) => { out = b; } };
  await handler({ method, query, headers: token ? { authorization: "Bearer " + token } : {}, body }, res);
  return { status, headers, json: out ? JSON.parse(out) : null, raw: out };
}
const approved = () => person({ status: "approved", role: "student", createdAt: NOW - 30 * DAY });

// health
assert.equal((await call({ method: "GET", query: { health: "1" } })).json.configured, true);
assert.equal((await call({ method: "GET", query: { health: "1" }, env: {} })).json.configured, false);
assert.ok(!(await call({ method: "GET", query: { health: "1" } })).raw.includes("secret"));

// not configured / who may use it
let t = approved();
assert.equal((await call({ token: t, body: { mode: "translate", text: "Hello" }, env: {} })).status, 503);
assert.equal((await call({ body: { mode: "translate", text: "Hello" } })).status, 401, "no token");
assert.equal((await call({ token: "forged", body: { mode: "translate", text: "Hello" } })).status, 403, "unknown token");
assert.equal((await call({ token: person({ status: "restricted", role: "student", createdAt: NOW }), body: { mode: "translate", text: "Hello" } })).status, 403, "restricted");
assert.equal((await call({ token: person({ status: "pending", role: "student", createdAt: NOW - 5 * DAY }), body: { mode: "translate", text: "Hello" } })).status, 403, "trial over");
assert.equal((await call({ token: person({ status: "pending", role: "teacher", createdAt: NOW }), body: { mode: "translate", text: "Hello" } })).status, 403, "pending non-student");
assert.equal((await call({ token: person(null), body: { mode: "translate", text: "Hello" } })).status, 403, "no profile");
assert.equal(calls.anthropic.length, 0, "nothing reaches Anthropic for people who may not use it");
let r = await call({ token: person({ status: "pending", role: "student", createdAt: NOW - DAY }), body: { mode: "translate", text: "Hello" } });
assert.equal(r.status, 200, "student inside the 3-day trial");

// translate
r = await call({ token: t, body: { mode: "translate", text: "  Where is the weigh station?  ", to: "ru" } });
assert.equal(r.status, 200); assert.equal(r.json.reply, "Salom");
let sent = JSON.parse(calls.anthropic.at(-1).body);
assert.equal(calls.anthropic.at(-1).headers["x-api-key"], "sk-ant-secret");
assert.equal(sent.model, "claude-haiku-5-5"); assert.ok(sent.max_tokens <= 300);
assert.match(sent.system, /Russian/); assert.deepEqual(sent.messages, [{ role: "user", content: "Where is the weigh station?" }]);
await call({ token: t, body: { mode: "translate", text: "Hello", to: "uz" } });
assert.match(JSON.parse(calls.anthropic.at(-1).body).system, /Uzbek/);
await call({ token: t, body: { mode: "translate", text: "Hi" }, env: { ANTHROPIC_API_KEY: "k", TUTOR_MODEL: "my-model" } });
assert.equal(JSON.parse(calls.anthropic.at(-1).body).model, "my-model");
assert.equal((await call({ token: t, body: { mode: "translate", text: "" } })).status, 400);
assert.equal((await call({ token: t, body: { mode: "translate", text: "x".repeat(401) } })).status, 400);
assert.equal((await call({ token: t, body: { mode: "nope" } })).status, 400);
assert.equal((await call({ token: t, body: null })).status, 400);

// tutor
r = await call({ token: t, body: { mode: "tutor", context: "Day 3: Spelling", messages: [{ role: "assistant", content: "Hi!" }, { role: "user", content: "I am drive truck" }] } });
assert.equal(r.status, 200);
sent = JSON.parse(calls.anthropic.at(-1).body);
assert.deepEqual(sent.messages, [{ role: "user", content: "I am drive truck" }], "a leading assistant turn is dropped (the API needs user first)");
assert.match(sent.system, /Day 3: Spelling/); assert.match(sent.system, /Better:/);
assert.equal((await call({ token: t, body: { mode: "tutor", messages: [{ role: "user", content: "a" }, { role: "assistant", content: "b" }] } })).status, 400, "must end with the learner's turn");
assert.equal((await call({ token: t, body: { mode: "tutor", messages: [] } })).status, 400);
assert.equal((await call({ token: t, body: { mode: "tutor", messages: Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x" })).concat([{ role: "user", content: "y" }]) } })).status, 200);
assert.ok(JSON.parse(calls.anthropic.at(-1).body).messages.length <= 12, "history is capped");
const roles = JSON.parse(calls.anthropic.at(-1).body).messages.map((m) => m.role);
assert.equal(roles[0], "user");
r = await call({ token: t, body: { mode: "tutor", messages: [{ role: "user", content: "z".repeat(900) }] } });
assert.equal(r.status, 200); assert.equal(JSON.parse(calls.anthropic.at(-1).body).messages[0].content.length, 500, "one message is clipped");

// verified tokens are remembered for a few minutes (no database hit on every chat turn)
const dbBefore = calls.db.length; await call({ token: t, body: { mode: "translate", text: "Hello" } }); assert.equal(calls.db.length, dbBefore);

// lesson teacher: teaches from the lesson on the learner's screen
const lesson = { course: "Truck Talk", day: "3", title: "The Alphabet & Spelling on the Radio", review: false,
  words: [["Alpha", "Alfa"], ["Bravo", "Bravo"]], dialogue: [["Dispatcher", "Can you spell your last name for me?", "Familiyangizni harflab bera olasizmi?"]], grammar: "Using the NATO alphabet: say Alpha for A." };
r = await call({ token: t, body: { mode: "lesson", lesson, to: "ru", messages: [{ role: "user", content: "Let's start the lesson." }] } });
assert.equal(r.status, 200, "lesson reply");
sent = JSON.parse(calls.anthropic.at(-1).body);
assert.match(sent.system, /TODAY'S LESSON/); assert.match(sent.system, /The Alphabet & Spelling on the Radio/);
assert.match(sent.system, /Alpha = Alfa/); assert.match(sent.system, /Can you spell your last name/); assert.match(sent.system, /NATO alphabet/);
assert.match(sent.system, /Russian/); assert.ok(sent.max_tokens <= 400);
await call({ token: t, body: { mode: "lesson", lesson, messages: [{ role: "user", content: "ok" }] } });
assert.match(JSON.parse(calls.anthropic.at(-1).body).system, /Uzbek/, "explanations default to Uzbek");
// review day (no words of its own) is still teachable
r = await call({ token: t, body: { mode: "lesson", lesson: { title: "Week 1 Review", review: true, words: [], dialogue: [] }, messages: [{ role: "user", content: "start" }] } });
assert.equal(r.status, 200); assert.match(JSON.parse(calls.anthropic.at(-1).body).system, /review day/);
// guards
assert.equal((await call({ token: t, body: { mode: "lesson", messages: [{ role: "user", content: "hi" }] } })).status, 400, "no lesson");
assert.equal((await call({ token: t, body: { mode: "lesson", lesson: { words: [["a", "b"]] }, messages: [{ role: "user", content: "hi" }] } })).status, 400, "lesson without a title");
assert.equal((await call({ token: t, body: { mode: "lesson", lesson, messages: [{ role: "assistant", content: "Hello" }] } })).status, 400, "must end with the learner");
// a runaway lesson payload is trimmed, not forwarded
const huge = { title: "T".repeat(500), words: Array.from({ length: 200 }, (_, i) => ["w".repeat(300) + i, "m".repeat(300)]), dialogue: Array.from({ length: 100 }, () => ["X".repeat(100), "y".repeat(900), "z".repeat(900)]), grammar: "g".repeat(5000) };
r = await call({ token: t, body: { mode: "lesson", lesson: huge, messages: [{ role: "user", content: "hi" }] } });
assert.equal(r.status, 200); assert.ok(JSON.parse(calls.anthropic.at(-1).body).system.length < 10000, "lesson context is bounded (a deliberately huge payload still stays around 2,500 tokens)");
// a long lesson conversation keeps a longer memory than the plain tutor, and the teacher's own long replies are kept whole enough
const convo = Array.from({ length: 40 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "m" + i })).concat([{ role: "user", content: "last" }]);
r = await call({ token: t, body: { mode: "lesson", lesson, messages: convo } });
assert.equal(r.status, 200); const kept = JSON.parse(calls.anthropic.at(-1).body).messages;
assert.ok(kept.length > 12 && kept.length <= 16, "lesson history is 16 turns"); assert.equal(kept[0].role, "user"); assert.equal(kept.at(-1).content, "last");

// rate limit: 30 per 10 minutes per person
const busy = approved(); let last;
for (let i = 0; i < 31; i++) last = await call({ token: busy, body: { mode: "translate", text: "Hello" } });
assert.equal(last.status, 429);
assert.equal((await call({ token: approved(), body: { mode: "translate", text: "Hello" } })).status, 200, "someone else is unaffected");

// failures never leak details
for (const st of [401, 429, 500, 529]) {
  anthropic = () => new Response("overloaded: secret detail", { status: st });
  r = await call({ token: t, body: { mode: "translate", text: "Hello" } });
  assert.equal(r.status, 503); assert.ok(!r.raw.includes("secret"));
}
anthropic = () => { throw new Error("offline"); };
assert.equal((await call({ token: t, body: { mode: "translate", text: "Hello" } })).status, 503);
anthropic = () => new Response(JSON.stringify({ content: [] }), { status: 200 });
assert.equal((await call({ token: t, body: { mode: "translate", text: "Hello" } })).status, 503, "empty reply");

console.log("tutor-api tests passed");
