/* Builds speakup/shared/content-ru.js — SpeakUp's Russian lesson content — for the 60-lesson
 * curriculum, from the hand-written Russian of the ORIGINAL 90 days (scripts/data/speakup-ru/).
 *
 *   node scripts/build-speakup-content-ru.mjs
 *
 * It follows exactly the same merges as scripts/merge-speakup-curriculum.mjs (the old->new day map
 * lives in speakup/shared/progress-merge.js), so every list is index-aligned with
 * speakup/curriculum.js; the script fails loudly if any list length differs. Format = Truck Talk's
 * shared/content-ru.js: window.TT_CONTENT.ru = { days, grammar }. */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { loadOld, loadRu } from "./check-speakup-ru.mjs";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { DAY_MAP } = createRequire(import.meta.url)("../speakup/shared/progress-merge.js");
const NEW = new Function(fs.readFileSync(path.join(root, "speakup/curriculum.js"), "utf8") + ";return CURRICULUM")();
const OLD = loadOld();
const { R, GR } = loadRu();
const GRAMMAR = new Function(fs.readFileSync(path.join(root, "speakup/grammar.js"), "utf8") + ";return GRAMMAR")();

const MERGED_TITLES = {
  "1+2": "Приветствие и алфавит", "6+7": "Числа, множественное число и This / That", "8+9": "Have / Has и притяжательные местоимения",
  "13+14": "There Is / There Are и предметы в классе", "16+17": "Present Simple — все лица", "21+22": "Предлоги места и времени",
  "23+24": "Вопросительные слова и How Much / How Many", "26+27": "Some / Any и Like / Want",
  "32+33": "Сравнительная, превосходная степень и As...As", "36+37": "Past Simple — Was / Were и правильные глаголы",
  "41+42": "Модальные глаголы — Must, Should, May, Could", "43+44": "Будущее — Going To и Will",
  "46+47": "Present Perfect — Ever, Already, Yet, Just", "51+52": "Условные предложения нулевого и первого типа",
  "53+54": "Условные предложения второго типа и советы", "56+57": "Страдательный залог — настоящее и прошедшее время",
  "61+62": "Семья и описание людей", "66+67": "Еда, напитки и заказ в кафе", "68+69": "Тело, чувства и здоровые привычки",
  "71+72": "Животные и природа", "76+77": "Места в городе и вопрос о дороге", "81+82": "Хобби и технологии",
  "83+84": "Дружба и планы с друзьями", "88+89": "Карьера и высказывание мнения",
};
const REVIEW_TITLES = { 2: "Повторение 2-й недели — проверка основ", 4: "Повторение 4-й недели — итоговая проверка 1-й четверти", 8: "Основы грамматики пройдены!", 12: "Итоговый тест — выпускной SpeakUp" };

// English question -> Russian, from every content day + the few review-only extras
const qmap = new Map();
for (const d of OLD) if (!d.rev) d.qz.forEach((q, i) => qmap.set(q[0], R[d.d].q[i]));
for (const [k, v] of Object.entries(R.extraQ || {})) qmap.set(k, v);

const problems = [];
const days = {};
for (const nd of NEW) {
  const olds = DAY_MAP[nd.d];
  const rs = olds.map((o) => R[o]);
  const out = {};
  if (nd.rev) {
    out.t = REVIEW_TITLES[nd.w] || `Повторение ${nd.w}-й недели`;
    out.q = nd.qz.map((q) => { const r = qmap.get(q[0]); if (!r) problems.push(`day ${nd.d}: no Russian for question "${q[0]}"`); return r || ""; });
    out.sp = rs.map((r) => r.sp).join("\n\n");
  } else {
    out.t = olds.length === 2 ? MERGED_TITLES[olds.join("+")] : rs[0].t;
    if (!out.t) problems.push(`day ${nd.d}: no title for ${olds.join("+")}`);
    for (const k of ["v", "x", "dl", "q"]) out[k] = rs.flatMap((r) => r[k] || []);
    out.sp = rs.map((r) => r.sp).join("\n\n");
    if (out.v.length !== nd.v.length || out.x.length !== nd.v.length) problems.push(`day ${nd.d}: v/x ${out.v.length}/${out.x.length} vs ${nd.v.length}`);
    if (out.dl.length !== nd.dl.length) problems.push(`day ${nd.d}: dl ${out.dl.length} vs ${nd.dl.length}`);
    if (out.q.length !== nd.qz.length) problems.push(`day ${nd.d}: q ${out.q.length} vs ${nd.qz.length}`);
  }
  if (nd.rev && out.q.length !== nd.qz.length) problems.push(`day ${nd.d}: q ${out.q.length} vs ${nd.qz.length}`);
  days[nd.d] = out;
}
const grammar = {};
for (const u of GRAMMAR) {
  const g = GR[u.id];
  if (!g) { problems.push(`grammar ${u.id}: no Russian`); continue; }
  if (g.explain.length !== u.explain.length) problems.push(`grammar ${u.id}: explain ${g.explain.length} vs ${u.explain.length}`);
  if (g.ex.length !== u.examples.length) problems.push(`grammar ${u.id}: ex ${g.ex.length} vs ${u.examples.length}`);
  if (g.q.length !== u.quiz.length) problems.push(`grammar ${u.id}: q ${g.q.length} vs ${u.quiz.length}`);
  for (const k of ["title", "rule", "why"]) if (!g[k]) problems.push(`grammar ${u.id}: no ${k}`);
  grammar[u.id] = g;
}
const extra = Object.keys(GR).filter((id) => !GRAMMAR.some((u) => u.id === id));
if (extra.length) problems.push("Russian for unknown grammar units: " + extra.join(", "));
// the quiz question text of one grammar unit may equal a day's question: they must agree
for (const u of GRAMMAR) u.quiz.forEach((q, i) => { const a = qmap.get(q[0]), b = grammar[u.id] && grammar[u.id].q[i]; if (a && b && a !== b) problems.push(`question "${q[0]}": day says "${a}", grammar ${u.id} says "${b}"`); });
if (problems.length) { console.error(problems.length + " problem(s):\n  " + problems.join("\n  ")); process.exit(1); }

const j = (x) => JSON.stringify(x);
let js = `/* SpeakUp — Russian translations of course content (word meanings, example sentences, dialogues,
 * quiz questions, speaking prompts, lesson titles and the Grammar Book), for the 60-lesson curriculum.
 * GENERATED by scripts/build-speakup-content-ru.mjs from scripts/data/speakup-ru/ — do not edit by hand.
 * Loaded on demand by app.js when the interface language is Russian; lists are index-matched to
 * curriculum.js / grammar.js. */
(function(){
var R={},GR={};
`;
for (const nd of NEW) {
  const d = days[nd.d];
  const parts = [`t:${j(d.t)}`];
  for (const k of ["v", "x", "dl", "q"]) if (d[k]) parts.push(`${k}:${j(d[k])}`);
  parts.push(`sp:${j(d.sp)}`);
  js += `R[${nd.d}]={${parts.join(",\n")}};\n`;
}
for (const u of GRAMMAR) js += `GR[${j(u.id)}]=${j(grammar[u.id])};\n`;
js += `
window.TT_CONTENT = window.TT_CONTENT || {};
window.TT_CONTENT.ru = { days: R, grammar: GR };
})();
`;
fs.writeFileSync(path.join(root, "speakup/shared/content-ru.js"), js);
console.log(`speakup/shared/content-ru.js: ${NEW.length} days, ${GRAMMAR.length} grammar units, ${qmap.size} distinct questions, ${(js.length / 1024).toFixed(0)} KB`);
