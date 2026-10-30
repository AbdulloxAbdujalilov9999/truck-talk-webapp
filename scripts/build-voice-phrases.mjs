/* Builds api/_phrases.json: every English phrase the natural-voice endpoint (api/tts.js) is allowed to speak.
 * Run after editing lessons:  node scripts/build-voice-phrases.mjs   (scripts/audit.mjs fails if it is stale). */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { normalize } = createRequire(import.meta.url)("../api/tts.js");

function load(files) {
  const ctx = {}; vm.createContext(ctx);
  const src = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
  vm.runInContext(src + `
;this.__x={CURRICULUM:typeof CURRICULUM!=='undefined'?CURRICULUM:[],ORIENTATION:typeof ORIENTATION!=='undefined'?ORIENTATION:[],GRAMMAR:typeof GRAMMAR!=='undefined'?GRAMMAR:[]}`, ctx);
  return ctx.__x;
}
const set = new Set();
const add = (s) => { if (typeof s === "string") { const n = normalize(s); if (n && n.length <= 300) set.add(n); } };
const addAll = (v) => { if (typeof v === "string") add(v); else if (Array.isArray(v)) v.forEach(addAll); else if (v && typeof v === "object") Object.values(v).forEach(addAll); };

for (const files of [["trucktalk/curriculum.js", "trucktalk/grammar.js"], ["speakup/curriculum.js", "speakup/grammar.js"]]) {
  const x = load(files);
  for (const d of [...x.ORIENTATION, ...x.CURRICULUM]) {
    (d.v || []).forEach((r) => { add(r[0]); add(r[2]); });      // word / phrase, example sentence
    (d.dl || []).forEach((r) => add(r[1]));                       // conversation lines (English side)
    (d.qz || []).forEach((r) => { add(r[0]); addAll(r[1]); });    // quiz question + options
    if (Array.isArray(d.sp)) add(d.sp[0]);                        // speaking prompt (English side)
  }
  for (const g of x.GRAMMAR) { addAll(g.examples); addAll(g.teach); addAll(g.explain); add(g.mistakeWrong); add(g.mistakeRight); add(g.title); }
}
// fixed sentences the apps say themselves: any speak("...") literal in the app code
for (const f of ["trucktalk/app.js", "speakup/app.js"]) {
  for (const m of fs.readFileSync(path.join(root, f), "utf8").matchAll(/\bspeak(?:Once)?\(\s*"([^"\\]+)"/g)) add(m[1]);
}
const out = [...set].sort();
const file = path.join(root, "api", "_phrases.json");
fs.writeFileSync(file, JSON.stringify(out));
console.log(`api/_phrases.json: ${out.length} phrases, ${out.reduce((a, s) => a + s.length, 0)} characters`);
