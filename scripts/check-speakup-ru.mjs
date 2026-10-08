/* Checks the hand-written Russian for SpeakUp's original 90 days (scripts/data/speakup-ru/part*.js)
 * against the English curriculum: every list must be the same length (they are matched by position).
 *   node scripts/check-speakup-ru.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export function loadOld(){ return new Function(fs.readFileSync(path.join(root, "scripts/data/speakup-curriculum-90day.js"), "utf8") + ";return CURRICULUM")(); }
export function loadRu(){
  const dir = path.join(root, "scripts/data/speakup-ru");
  const R = {}, GR = {};
  for (const f of fs.readdirSync(dir).filter((x) => /^part\d+\.js$/.test(x)).sort()) new Function("R", "GR", fs.readFileSync(path.join(dir, f), "utf8"))(R, GR);
  return { R, GR };
}
export function check(){
  const OLD = loadOld(), { R } = loadRu();
  const problems = [];
  let days = 0;
  for (const d of OLD) {
    const r = R[d.d];
    if (!r) { problems.push(`day ${d.d}: no Russian yet`); continue; }
    days++;
    if (!r.t) problems.push(`day ${d.d}: no title`);
    if (!r.sp) problems.push(`day ${d.d}: no speaking prompt`);
    if (d.v) {
      if ((r.v || []).length !== d.v.length) problems.push(`day ${d.d}: v ${(r.v || []).length} vs ${d.v.length}`);
      if ((r.x || []).length !== d.v.length) problems.push(`day ${d.d}: x ${(r.x || []).length} vs ${d.v.length}`);
    }
    if (d.dl && (r.dl || []).length !== d.dl.length) problems.push(`day ${d.d}: dl ${(r.dl || []).length} vs ${d.dl.length}`);
    if (!d.rev && (r.q || []).length !== d.qz.length) problems.push(`day ${d.d}: q ${(r.q || []).length} vs ${d.qz.length}`);
    for (const k of ["v", "x", "dl", "q"]) (r[k] || []).forEach((s, i) => { if (!s || typeof s !== "string") problems.push(`day ${d.d}: ${k}[${i}] empty`); });
  }
  return { days, problems };
}
if (process.argv[1] && process.argv[1].endsWith("check-speakup-ru.mjs")) {
  const { days, problems } = check();
  const real = problems.filter((p) => !/no Russian yet/.test(p));
  console.log(`days with Russian: ${days} / 90; problems: ${real.length}`);
  real.forEach((p) => console.log("  " + p));
  const todo = problems.filter((p) => /no Russian yet/.test(p)).length;
  if (todo) console.log(`(still to translate: ${todo} days)`);
  process.exit(real.length ? 1 : 0);
}
