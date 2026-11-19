/* Makes every course recording once, so no student ever waits for a phrase to be generated.
 * Asks the live site for every phrase in api/_phrases.json (both voices) and api/_phrases_uz.json. With a Blob store
 * connected (see api/tts.js) each recording is then kept for good; without one this only warms the CDN until the next deploy.
 *
 *   node scripts/warm-voice.mjs                         # https://www.trucktalk.courses, 4 at a time
 *   node scripts/warm-voice.mjs --site https://... --only uz --limit 50 --concurrency 2
 *
 * Cost: each phrase not made before uses ElevenLabs characters once (about 135k characters per English voice and
 * 62k for Uzbek). Run it again any time: recordings that already exist are skipped by the server for free. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, dflt) => { const i = process.argv.indexOf("--" + name); return i > 0 ? process.argv[i + 1] : dflt; };
const site = String(arg("site", "https://www.trucktalk.courses")).replace(/\/$/, "");
const only = arg("only", "all"), limit = Number(arg("limit", 0)) || Infinity, conc = Math.max(1, Number(arg("concurrency", 4)) || 4);
const UZ_VOICE_VERSION = "2";   // keep equal to shared/neural-voice.js

const jobs = [];
if (only !== "uz") for (const t of JSON.parse(fs.readFileSync(path.join(root, "api/_phrases.json"), "utf8"))) for (const g of ["female", "male"]) jobs.push(`${site}/api/tts?g=${g}&t=${encodeURIComponent(t)}`);
if (only !== "en") for (const t of JSON.parse(fs.readFileSync(path.join(root, "api/_phrases_uz.json"), "utf8"))) jobs.push(`${site}/api/tts?g=female&l=uz&v=${UZ_VOICE_VERSION}&t=${encodeURIComponent(t)}`);
const todo = jobs.slice(0, limit);
let done = 0, failed = 0, next = 0;
async function worker() {
  while (next < todo.length) {
    const url = todo[next++];
    try { const r = await fetch(url); await r.arrayBuffer(); if (!r.ok) { failed++; if (failed <= 5) console.error(r.status, decodeURIComponent(url.split("&t=")[1]).slice(0, 60)); } }
    catch (e) { failed++; }
    if (++done % 200 === 0) console.log(`${done}/${todo.length} (${failed} failed)`);
  }
}
await Promise.all(Array.from({ length: conc }, worker));
console.log(`done: ${done} recordings, ${failed} failed`);
process.exit(failed ? 1 : 0);
