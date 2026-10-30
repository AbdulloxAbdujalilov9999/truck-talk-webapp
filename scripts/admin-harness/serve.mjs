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
let mode = "ok", upstream = 0;

function tone(seconds = 0.4, hz = 440) {          // 16-bit mono 22.05 kHz WAV
  const rate = 22050, n = Math.floor(rate * seconds), buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.sin(2 * Math.PI * hz * i / rate) * 8000), 44 + i * 2);
  return buf;
}
globalThis.fetch = async () => {
  upstream++;
  if (mode === "quota") return new Response("quota", { status: 429 });
  if (mode === "slow") await new Promise((r) => setTimeout(r, 9000));
  return new Response(tone(), { status: 200 });
};
process.env.ELEVENLABS_API_KEY = "rig-key";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/__rig/mode") { mode = u.searchParams.get("m") || "ok"; res.end(mode); return; }
  if (u.pathname === "/__rig/stats") { res.end(JSON.stringify({ upstream, mode })); return; }
  if (u.pathname === "/api/tts") { req.query = Object.fromEntries(u.searchParams); return handler(req, res); }
  let p = path.join(root, decodeURIComponent(u.pathname));
  if (!p.startsWith(root)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end("not found"); }
  res.setHeader("content-type", types[path.extname(p)] || "application/octet-stream");
  res.setHeader("cache-control", "no-store");
  fs.createReadStream(p).pipe(res);
}).listen(port, () => console.log("rig on http://localhost:" + port));
