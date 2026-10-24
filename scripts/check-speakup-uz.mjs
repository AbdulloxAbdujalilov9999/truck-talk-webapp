/* Checks the hand-written UZBEK for SpeakUp's original 90 days (scripts/data/speakup-uz/part*.js).
 * Each entry is "first 8 characters of the English§Uzbek" — the prefix proves the Uzbek is attached to the
 * right English sentence; the generator (build-speakup-content-uz.mjs) re-checks it.
 *   node scripts/check-speakup-uz.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export function loadOld(){ return new Function(fs.readFileSync(path.join(root, "scripts/data/speakup-curriculum-90day.js"), "utf8") + ";return CURRICULUM")(); }
export function loadUz(){
  const dir = path.join(root, "scripts/data/speakup-uz");
  const X = {}, Q = {}, GQ = {};
  for (const f of fs.readdirSync(dir).filter((x) => /^part\d+\.js$/.test(x)).sort()) new Function("X", "Q", "GQ", fs.readFileSync(path.join(dir, f), "utf8"))(X, Q, GQ);
  return { X, Q, GQ };
}
const PREFIX = 8;
/** entries ("prefix§uz") against the English strings: returns {uz:[...], problems:[...]} */
export function resolve(label, entries, english){
  const problems = [], uz = [];
  if (!entries) return { uz, problems: [`${label}: missing`] };
  if (entries.length !== english.length) problems.push(`${label}: ${entries.length} entries for ${english.length} English strings`);
  entries.forEach((e, i) => {
    const k = e.indexOf("§");
    if (k < 0) { problems.push(`${label}[${i}]: no § separator`); return; }
    const pre = e.slice(0, k), text = e.slice(k + 1);
    if (!text.trim()) problems.push(`${label}[${i}]: empty Uzbek`);
    if (english[i] !== undefined && !english[i].startsWith(pre) && english[i].slice(0, PREFIX) !== pre) problems.push(`${label}[${i}]: prefix "${pre}" ≠ English "${(english[i] || "").slice(0, PREFIX)}…"`);
    uz.push(text);
  });
  return { uz, problems };
}
export function check(){
  const OLD = loadOld(), { X, Q, GQ } = loadUz(); const problems = []; let days = 0;
  const GRAMMAR = new Function(fs.readFileSync(path.join(root, "speakup/grammar.js"), "utf8") + ";return GRAMMAR")();
  for (const d of OLD) {
    if (d.rev) continue;
    if (!X[d.d] && !Q[d.d]) { problems.push(`day ${d.d}: no Uzbek yet`); continue; }
    days++;
    problems.push(...resolve(`day ${d.d} X`, X[d.d], d.v.map((v) => v[2])).problems);
    problems.push(...resolve(`day ${d.d} Q`, Q[d.d], d.qz.map((q) => q[0])).problems);
  }
  for (const u of GRAMMAR) { if (!GQ[u.id]) { problems.push(`grammar ${u.id}: no Uzbek yet`); continue; } problems.push(...resolve(`grammar ${u.id} Q`, GQ[u.id], u.quiz.map((q) => q[0])).problems); }
  return { days, problems };
}
if (process.argv[1] && process.argv[1].endsWith("check-speakup-uz.mjs")) {
  const { days, problems } = check();
  const real = problems.filter((p) => !/no Uzbek yet/.test(p));
  console.log(`content days with Uzbek: ${days} / 72; problems: ${real.length}`);
  real.slice(0, 40).forEach((p) => console.log("  " + p));
  const todo = problems.filter((p) => /no Uzbek yet/.test(p)).length;
  if (todo) console.log(`(still to translate: ${todo})`);
  process.exit(real.length ? 1 : 0);
}
