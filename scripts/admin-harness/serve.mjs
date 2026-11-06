/* Local rig server: serves the repo root AND runs the real api/tts.js, with the voice provider replaced by a
 * stub that "records" a short tone. Lets the natural-voice path be tested in a browser without any API key.
 *   node scripts/admin-harness/serve.mjs [port]      (default 8766)
 * Query the stub's behaviour with  /__rig/mode?m=ok|quota|slow   (default ok). Counts: /__rig/stats */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const port = Number(process.argv[2]) || 8766;
const handler = createRequire(import.meta.url)("../../api/tts.js");
const tutorHandler = createRequire(import.meta.url)("../../api/tutor.js");
const agentHandler = createRequire(import.meta.url)("../../api/agent.js");
let agentMode = "ok", agentCalls = 0;
let mode = "ok", upstream = 0, tutorMode = "ok", tutorCalls = [];

function tone(seconds = 0.4, hz = 440) {          // 16-bit mono 22.05 kHz WAV
  const rate = 22050, n = Math.floor(rate * seconds), buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.sin(2 * Math.PI * hz * i / rate) * 8000), 44 + i * 2);
  return buf;
}
const json = (o, status = 200) => new Response(JSON.stringify(o), { status });
globalThis.fetch = async (url, init) => {
  url = String(url);
  if (url.startsWith("https://identitytoolkit.googleapis.com/")) return json({ users: [{ localId: "rigstudent" }] });
  if (url.includes("firebasedatabase.app/users/")) return json({ status: "approved", role: "student", createdAt: Date.now() });
  if (url.startsWith("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url")) {
    agentCalls++; if (agentMode === "busy") return new Response("no", { status: 429 });
    return json({ signed_url: "wss://api.elevenlabs.io/v1/convai/conversation?agent_id=rig&conversation_signature=rig" });
  }
  if (url === "https://api.anthropic.com/v1/messages") {
    const b = JSON.parse(init.body); tutorCalls.push(b);
    if (tutorMode === "busy") return new Response("overloaded", { status: 529 });
    const text = b.system.includes("ONLY a JSON object")
      ? JSON.stringify(b.messages.length === 1
          ? { say: "Assalomu alaykum! Men sizning ingliz tili o'qituvchingizman. Birinchi so'zimiz: salom. Inglizchasini takrorlang.", en: "Hello" }
          : { say: "Barakalla! Endi o'zingizni tanishtiring: my name is, deb ayting. (rig teacher, turn " + b.messages.length + ")", en: "My name is" })
      : b.system.includes("TODAY'S LESSON")
      ? (b.messages.length === 1 ? "Salom! Bugun biz o'rganamiz. Let's learn the first words. Say: Hello. (rig teacher)" : "Good! Better: Hello, my name is Aziz. Next word... (rig teacher, turn " + b.messages.length + ")")
      : b.system.includes("tutor") ? "Nice try! Better: I drive a truck. (haydovchi) Where do you drive?" : "Salom (rig translation of: " + b.messages[0].content + ")";
    return json({ content: [{ type: "text", text }] });
  }
  upstream++;
  if (mode === "quota") return new Response("quota", { status: 429 });
  if (mode === "slow") await new Promise((r) => setTimeout(r, 9000));
  return new Response(tone(), { status: 200 });
};
process.env.ELEVENLABS_API_KEY = "rig-key";
process.env.ANTHROPIC_API_KEY = "rig-anthropic-key";
process.env.ELEVENLABS_AGENT_ID = "agent_rig";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/__rig/mode") { mode = u.searchParams.get("m") || "ok"; res.end(mode); return; }
  if (u.pathname === "/__rig/stats") { res.end(JSON.stringify({ upstream, mode, tutorMode, tutorCalls: tutorCalls.length })); return; }
  if (u.pathname === "/__rig/agent") { agentMode = u.searchParams.get("m") || "ok"; res.end(agentMode); return; }
  if (u.pathname === "/__rig/agentstats") { res.end(JSON.stringify({ agentCalls, agentMode })); return; }
  if (u.pathname === "/api/agent") { req.query = Object.fromEntries(u.searchParams); return agentHandler(req, res); }
  if (u.pathname === "/__rig/last") { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(tutorCalls.at(-1) || null)); return; }
  if (u.pathname === "/__rig/tutor") { tutorMode = u.searchParams.get("m") || "ok"; res.end(tutorMode); return; }
  if (u.pathname === "/api/tutor") {
    req.query = Object.fromEntries(u.searchParams);
    if (req.method === "POST") { const chunks = []; for await (const c of req) chunks.push(c); try { req.body = JSON.parse(Buffer.concat(chunks).toString()); } catch (e) { req.body = null; } }
    return tutorHandler(req, res);
  }
  if (u.pathname === "/api/tts") { req.query = Object.fromEntries(u.searchParams); return handler(req, res); }
  let p = path.join(root, decodeURIComponent(u.pathname));
  if (!p.startsWith(root)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end("not found"); }
  res.setHeader("content-type", types[path.extname(p)] || "application/octet-stream");
  res.setHeader("cache-control", "no-store");
  fs.createReadStream(p).pipe(res);
}).listen(port, () => console.log("rig on http://localhost:" + port));
