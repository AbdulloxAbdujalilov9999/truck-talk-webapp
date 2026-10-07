/* Builds SpeakUp's 60-lesson curriculum from the original 90-lesson one.
 *
 *   node scripts/merge-speakup-curriculum.mjs
 *
 * Reads  scripts/data/speakup-curriculum-90day.js   (the untouched original)
 * Writes speakup/curriculum.js                       (12 weeks x 5 = 60 days)
 *        the old->new day map inside speakup/shared/progress-merge.js
 *
 * Nothing is removed: where two lessons are merged, the new lesson carries
 * BOTH lessons' vocabulary, both dialogues (kept separate, see dlAt), both
 * grammar tips, both quizzes, both speaking prompts and both live-session
 * extras. Where two review days are merged, both reviews' questions are kept.
 * The audit at the end re-reads the output and fails if any word, dialogue
 * line, question, tip or prompt of the original is missing.
 *
 * Shape: every 3 old weeks (12 lessons + 3 reviews) become 2 new weeks
 * (8 lessons + 2 reviews). Merges are always between neighbouring lessons on
 * closely related topics, and no lesson is moved earlier than the lessons it
 * builds on, so the grammar order is unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OLD = new Function(fs.readFileSync(path.join(root, "scripts/data/speakup-curriculum-90day.js"), "utf8") + "; return CURRICULUM;")();
const oldDay = (n) => OLD.find((x) => x.d === n);

// ---- the plan: per new week, its 4 lessons (lists of old day numbers) and its review (old review day(s)) ----
const WEEKS = [
  { wt: "First Steps in English",            wtUz: "Ingliz tiliga birinchi qadam",
    items: [[1, 2], [3], [4], [6, 7]],       review: [5] },
  { wt: "My World & What I Can Do",          wtUz: "Mening dunyom va men nima qila olaman",
    items: [[8, 9], [11], [12], [13, 14]],   review: [10, 15] },
  { wt: "My Daily Routine",                  wtUz: "Mening kundalik hayotim",
    items: [[16, 17], [18], [19], [21, 22]], review: [20] },
  { wt: "Questions, Quantities & Wants",     wtUz: "Savollar, miqdor va istaklar",
    items: [[23, 24], [26, 27], [28], [29]], review: [25, 30] },
  { wt: "Describing Things & Yesterday",     wtUz: "Narsalarni tasvirlash va kecha",
    items: [[31], [32, 33], [34], [36, 37]], review: [35] },
  { wt: "The Past, Rules & Plans",           wtUz: "O'tmish, qoidalar va rejalar",
    items: [[38], [39], [41, 42], [43, 44]], review: [40, 45] },
  { wt: "My Experiences & \"If...\"",        wtUz: "Mening tajribalarim va \"Agar...\"",
    items: [[46, 47], [48], [49], [51, 52]], review: [50] },
  { wt: "Imagining & Interesting Facts",     wtUz: "Tasavvur va qiziqarli faktlar",
    items: [[53, 54], [56, 57], [58], [59]], review: [55, 60] },
  { wt: "People, Jobs & Food",               wtUz: "Odamlar, kasblar va ovqat",
    items: [[61, 62], [63], [64], [66, 67]], review: [65] },
  { wt: "Health, Animals & Nature",          wtUz: "Salomatlik, hayvonlar va tabiat",
    items: [[68, 69], [71, 72], [73], [74]], review: [70, 75] },
  { wt: "Town, Travel & Free Time",          wtUz: "Shahar, sayohat va bo'sh vaqt",
    items: [[76, 77], [78], [79], [81, 82]], review: [80] },
  { wt: "Friends, Our World & the Future",   wtUz: "Do'stlar, dunyomiz va kelajak",
    items: [[83, 84], [86], [87], [88, 89]], review: [85, 90] },
];

// titles for the merged lessons / merged reviews (single lessons keep their own)
const MERGED_TITLES = {
  "1+2":   ["Greetings & the Alphabet", "Salomlashish va alifbo"],
  "6+7":   ["Numbers, Plurals & This / That", "Sonlar, ko'plik va This / That"],
  "8+9":   ["Have / Has & Possessives", "Have / Has va egalik olmoshlari"],
  "13+14": ["There Is / There Are & Classroom Objects", "There is / There are va sinf buyumlari"],
  "16+17": ["Present Simple — Every Person", "Present Simple — barcha shaxslar"],
  "21+22": ["Prepositions of Place & Time", "Joy va vaqt predloglari"],
  "23+24": ["Question Words & How Much / How Many", "So'roq so'zlari va How much / How many"],
  "26+27": ["Some / Any & Like / Want", "Some / Any va Like / Want"],
  "32+33": ["Comparatives, Superlatives & As...As", "Solishtirish, eng ustunlik va As...As"],
  "36+37": ["Past Simple — Was / Were & Regular Verbs", "Past Simple — Was / Were va oddiy fe'llar"],
  "41+42": ["Modals — Must, Should, May, Could", "Modallar — Must, Should, May, Could"],
  "43+44": ["Future — Going To & Will", "Kelajak — Going To va Will"],
  "46+47": ["Present Perfect — Ever, Already, Yet, Just", "Present Perfect — Ever, Already, Yet, Just"],
  "51+52": ["Zero & First Conditionals", "Zero va First Conditional"],
  "53+54": ["Second Conditional & Giving Advice", "Second Conditional va maslahat berish"],
  "56+57": ["The Passive Voice — Present & Past", "Majhul nisbat — hozirgi va o'tgan zamon"],
  "61+62": ["Family & Describing People", "Oila va odamlarni tasvirlash"],
  "66+67": ["Food, Drinks & Ordering at a Cafe", "Ovqat, ichimliklar va kafeda buyurtma"],
  "68+69": ["Body, Feelings & Healthy Habits", "Tana, his-tuyg'ular va sog'lom odatlar"],
  "71+72": ["Animals & Nature", "Hayvonlar va tabiat"],
  "76+77": ["Places in Town & Asking for Directions", "Shahardagi joylar va yo'l so'rash"],
  "81+82": ["Hobbies & Technology", "Hobbi va texnologiya"],
  "83+84": ["Friendship & Making Plans", "Do'stlik va do'stlar bilan rejalar"],
  "88+89": ["Careers & Giving Opinions", "Kasblar va fikr bildirish"],
};
// review titles by week number; anything not listed is "Week N Review"
const REVIEW_TITLES = {
  2:  ["Week 2 Review — Foundations Check", "2-hafta Takrorlash — Boshlang'ich tekshiruv"],
  4:  ["Week 4 Review — Term 1 Final Check", "4-hafta Takrorlash — 1-chorak Yakuniy Tekshiruvi"],
  8:  null,   // keeps old day 60's own title (Grammar Foundations Complete!)
  12: null,   // keeps old day 90's own title (Final Test — SpeakUp Graduation)
};

const join = (a, b) => a + "\n\n" + b;
function mergeLessons(days, wk, d, w) {
  const [A, B] = days;
  const key = A.d + "+" + B.d;
  const [t, tu] = MERGED_TITLES[key];
  return {
    d, w, wt: wk.wt, wtUz: wk.wtUz, t, tu,
    v: [...A.v, ...B.v],
    dl: [...A.dl, ...B.dl], dlAt: A.dl.length,
    g: [
      A.g[0] + " + " + B.g[0],
      `1) ${A.g[0]}\n${A.g[1]}\n\n2) ${B.g[0]}\n${B.g[1]}`,
      A.g[2] + " + " + B.g[2],
      `1) ${A.g[2]}\n${A.g[3]}\n\n2) ${B.g[2]}\n${B.g[3]}`,
    ],
    qz: [...A.qz, ...B.qz],
    sp: [join(A.sp[0], B.sp[0]), join(A.sp[1], B.sp[1])],
    ls: [join(A.ls[0], B.ls[0]), join(A.ls[1], B.ls[1]), join(A.ls[2], B.ls[2]), join(A.ls[3], B.ls[3])],
  };
}
function single(A, wk, d, w) {
  const o = { d, w, wt: wk.wt, wtUz: wk.wtUz };
  for (const k of Object.keys(A)) if (!["d", "w", "wt", "wtUz"].includes(k)) o[k] = A[k];
  return o;
}
function reviewDay(days, wk, d, w) {
  const last = days[days.length - 1];
  let t, tu, o;
  if (REVIEW_TITLES[w]) [t, tu] = REVIEW_TITLES[w];
  else if (REVIEW_TITLES[w] === null) { t = last.t; tu = last.tu; }
  else { t = `Week ${w} Review`; tu = `${w}-hafta Takrorlash`; }
  o = { d, w, wt: wk.wt, wtUz: wk.wtUz, rev: true };
  if (days.some((x) => x.final)) o.final = true;
  Object.assign(o, { t, tu });
  o.qz = days.flatMap((x) => x.qz);
  o.sp = [days.map((x) => x.sp[0]).join("\n\n"), days.map((x) => x.sp[1]).join("\n\n")];
  o.ls = [0, 1, 2, 3].map((i) => days.map((x) => x.ls[i]).join("\n\n"));
  return o;
}

// ---- build ----
const NEW = [], MAP = {}; // MAP: new day -> [old days]
WEEKS.forEach((wk, wi) => {
  const w = wi + 1;
  wk.items.forEach((olds, i) => {
    const d = (w - 1) * 5 + i + 1;
    const days = olds.map(oldDay);
    NEW.push(days.length === 2 ? mergeLessons(days, wk, d, w) : single(days[0], wk, d, w));
    MAP[d] = olds;
  });
  const d = w * 5;
  NEW.push(reviewDay(wk.review.map(oldDay), wk, d, w));
  MAP[d] = wk.review;
});

// ---- coverage: every old day used exactly once ----
const used = Object.values(MAP).flat();
if (used.length !== 90 || new Set(used).size !== 90 || OLD.some((x) => !used.includes(x.d))) throw new Error("plan does not cover every old day exactly once");
if (NEW.length !== 60) throw new Error("expected 60 days, got " + NEW.length);

// ---- write curriculum.js ----
const j = JSON.stringify;
function emit(d) {
  const L = [`{d:${d.d},w:${d.w},wt:${j(d.wt)},wtUz:${j(d.wtUz)}${d.rev ? ",rev:true" : ""}${d.final ? ",final:true" : ""},`, `t:${j(d.t)},tu:${j(d.tu)},`];
  const arr = (k) => `${k}:[\n${d[k].map((x) => j(x)).join(",\n")}\n],`;
  if (d.v) L.push(arr("v"));
  if (d.dl) L.push(arr("dl"));
  if (d.dlAt) L.push(`dlAt:${d.dlAt},`);
  if (d.g) L.push(`g:${j(d.g)},`);
  L.push(arr("qz"));
  L.push(`sp:${j(d.sp)},`);
  L.push(`ls:${j(d.ls)}}`);
  return L.join("\n");
}
const header = `// SpeakUp curriculum — 60 days, 12 weeks, built on the deduplicated
// Round-Up 1/2/3 grammar sequence in grammar.js (see that file's header).
//
// Condensed from the original 90-day course: every lesson of the original is
// still here, but closely related neighbouring lessons were merged into one
// (for example "Greetings" + "The Alphabet", or "Present Simple" + "He / She -s"),
// and the review days of the merged weeks into one review. A merged lesson keeps
// ALL of both lessons' vocabulary, both dialogues, both grammar tips, both quizzes
// and both speaking / live-session prompts. It is generated, not hand-edited:
// see scripts/merge-speakup-curriculum.mjs (and scripts/data/ for the original).
//
// Every week is 4 lessons + 1 review day. All 34 grammar points are introduced by
// Day 40; Days 41-60 apply that complete toolkit to thematic vocabulary and
// fluency practice rather than introducing new grammar.
//
// Day schema (normal day): {d,w,wt,wtUz,t,tu,v,dl,[dlAt],g,qz,sp,ls}
//   v: vocabulary, [en, uz, exampleSentenceContainingWord]
//   dl: dialogue lines, [speaker, en, uz]. A merged lesson has two conversations
//       back to back; dlAt is the index of the first line of the second.
//   g: grammar/pattern tip, [titleEn, bodyEn, titleUz, bodyUz]. A merged lesson
//       holds both tips ("1) ... 2) ...") in the one tip.
//   qz: quiz, [question, [4 choices], correctIndex]
//   sp: speaking prompt, [en, uz]
//   ls: live-session extras, [warmupEn, warmupUz, pairworkEn, pairworkUz]
// Review day (every 5th day): {d,w,wt,wtUz,rev:true,[final:true],t,tu,qz,sp,ls} (no v/dl/g)

const CURRICULUM = [

`;
fs.writeFileSync(path.join(root, "speakup/curriculum.js"), header + NEW.map(emit).join(",\n\n") + "\n\n];\n");

// ---- old -> new day map, embedded in progress-merge.js ----
const mapSrc = `/* DAY_MAP:BEGIN (generated by scripts/merge-speakup-curriculum.mjs) */
  const DAY_MAP = ${j(MAP)};
  /* DAY_MAP:END */`;
const pm = path.join(root, "speakup/shared/progress-merge.js");
let pmSrc = fs.readFileSync(pm, "utf8");
if (!pmSrc.includes("DAY_MAP:BEGIN")) throw new Error("progress-merge.js has no DAY_MAP markers yet");
pmSrc = pmSrc.replace(/\/\* DAY_MAP:BEGIN[\s\S]*?DAY_MAP:END \*\//, mapSrc);
fs.writeFileSync(pm, pmSrc);

// ---- audit: re-read the output and prove nothing of the original is missing ----
const built = new Function(fs.readFileSync(path.join(root, "speakup/curriculum.js"), "utf8") + "; return CURRICULUM;")();
const has = (hay, needle) => hay.includes(needle);
let problems = 0, counts = { v: [0, 0], dl: [0, 0], qz: [0, 0], g: [0, 0], sp: [0, 0], ls: [0, 0] };
const fail = (m) => { problems++; console.error("MISSING:", m); };
for (const [nd, olds] of Object.entries(MAP)) {
  const nw = built.find((x) => x.d === Number(nd));
  for (const od of olds) {
    const o = oldDay(od);
    const nkeys = (k) => JSON.stringify(nw[k] || []);
    (o.v || []).forEach((e) => { counts.v[0]++; if (has(nkeys("v"), JSON.stringify(e))) counts.v[1]++; else fail(`vocab ${e[0]} (old day ${od})`); });
    (o.dl || []).forEach((e) => {
      counts.dl[0]++;
      // the line must be present with the same speaker and text
      if ((nw.dl || []).some((l) => JSON.stringify(l) === JSON.stringify(e))) counts.dl[1]++; else fail(`dialogue line ${e[1]} (old day ${od})`);
    });
    (o.qz || []).forEach((e) => { counts.qz[0]++; if (has(nkeys("qz"), JSON.stringify(e))) counts.qz[1]++; else fail(`question ${e[0]} (old day ${od})`); });
    if (o.g) o.g.forEach((s, i) => { counts.g[0]++; if (nw.g[i].includes(s)) counts.g[1]++; else fail(`grammar tip part ${i} (old day ${od})`); });
    o.sp.forEach((s, i) => { counts.sp[0]++; if (nw.sp[i].includes(s)) counts.sp[1]++; else fail(`speaking prompt ${i} (old day ${od})`); });
    o.ls.forEach((s, i) => { counts.ls[0]++; if (nw.ls[i].includes(s)) counts.ls[1]++; else fail(`live-session text ${i} (old day ${od})`); });
    // titles of merged lessons: the old title must still be findable (in the grammar tip title or lesson title)
  }
  // a merged lesson's two conversations must split exactly where dlAt says
  if (nw.dlAt) {
    const [a, b] = olds.map(oldDay);
    if (nw.dlAt !== a.dl.length || nw.dl.length !== a.dl.length + b.dl.length) fail(`dlAt of day ${nd}`);
  }
}
// order of all vocabulary is unchanged (homework sessions are built from it)
const flat = (arr) => arr.flatMap((x) => (x.v || []).map((e) => e[0]));
if (flat(OLD).join("|") !== flat(built).join("|")) fail("vocabulary order changed");
// structural checks
built.forEach((x, i) => {
  if (x.d !== i + 1) fail("numbering at " + i);
  if (x.w !== Math.ceil(x.d / 5)) fail("week of day " + x.d);
  if ((x.d % 5 === 0) !== !!x.rev) fail("review placement at day " + x.d);
});
if (!built[59].final) fail("final flag not on day 60");
console.log(`new lessons: ${built.length} (old: ${OLD.length})   merged lessons: ${Object.values(MAP).filter((o) => o.length === 2).length} (${built.filter((x) => !x.rev && x.dlAt).length} content + ${built.filter((x) => x.rev && MAP[x.d].length === 2).length} review)`);
for (const [k, [t, ok]] of Object.entries(counts)) console.log(`  ${k.padEnd(3)} old ${String(t).padStart(4)}  present in new ${String(ok).padStart(4)}`);
if (problems) { console.error(problems + " problem(s)"); process.exit(1); }
console.log("audit passed: nothing from the original 90 lessons is missing");
