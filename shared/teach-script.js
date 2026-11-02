/* The teacher's presentation for a lesson, built from the lesson's own data (words + Uzbek meanings, dialogue +
 * translations, grammar rule in Uzbek). Pure data, no screen: shared/teach-ui.js plays it, and
 * scripts/build-voice-phrases.mjs lists every spoken Uzbek line so api/tts.js may speak exactly those (nothing
 * else), which also keeps the ElevenLabs cost bounded: each line is generated once and cached.
 *
 *   TTTeachScript.enabled(course, dayNum)    -> is there a presentation for this lesson yet?
 *   TTTeachScript.build(course, dayNum)      -> { title, sub, slides: [{ kind, ...visual, steps: [...] }] } | null
 *
 * A step is one of: { k:"uz", t } the teacher speaks Uzbek | { k:"en", t, gender, rate } an English word or sentence
 * | { k:"line", i, t, gender } a dialogue line (highlights line i) | { k:"pause", ms } time for the student to repeat
 * | { k:"reveal" } show the hidden answer.
 * Needs the page's CURRICULUM / ORIENTATION / GRAMMAR globals. */
(function (root) {
  "use strict";

  // Lessons that have a presentation so far. Truck Talk 1-5 are the trial: add days here once they sound right.
  var ENABLED = { "Truck Talk": [1, 2, 3, 4, 5] };

  var ONES = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
  var TENS = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
  function uzNumber(n) {
    n = Math.floor(n);
    if (n < 1 || n > 99) return String(n);
    return [TENS[Math.floor(n / 10)], ONES[n % 10]].filter(Boolean).join(" ");
  }
  function uzOrdinal(n) { var w = uzNumber(n); return /[aeiou]$/.test(w) ? w + "nchi" : w + "inchi"; }   // birinchi, ikkinchi, yigirmanchi

  // A hand-written Uzbek explanation for lessons whose grammar point has no unit in the Grammar Book yet.
  var GRAMMAR_UZ = {
    "Truck Talk:3": "Radioda harflarni aniq aytish uchun NATO alifbosi ishlatiladi. Har bir harfning o'z so'zi bor: A harfi uchun Alpha, B uchun Bravo, C uchun Charlie. Shunda shovqinli radioda ham sizni to'g'ri tushunishadi.",
  };

  var tidy = function (s) { return String(s == null ? "" : s).replace(/\s*\.\.\.\s*$/, "").replace(/\s+/g, " ").trim(); };
  var meaning = function (s) { return tidy(s).replace(/\.+$/, ""); };

  function enabled(course, dayNum) { return (ENABLED[course] || []).indexOf(Number(dayNum)) !== -1; }

  function build(course, dayNum) {
    if (!enabled(course, dayNum)) return null;
    // the lesson data are top-level `const`s in curriculum.js / grammar.js: visible by name, but not as properties of window
    var C = typeof CURRICULUM !== "undefined" ? CURRICULUM : root.CURRICULUM || [];
    var G = typeof GRAMMAR !== "undefined" ? GRAMMAR : root.GRAMMAR || [];
    var O = typeof ORIENTATION !== "undefined" ? ORIENTATION : root.ORIENTATION || [];
    var d = C.concat(O).filter(function (x) { return x.d === Number(dayNum); })[0];
    if (!d) return null;
    var slides = [];

    // 1. welcome
    var words = (d.v || []).map(function (r) { return { en: tidy(r[0]), uz: meaning(r[1]), ex: tidy(r[2]) }; }).filter(function (w) { return w.en; });
    var hello = "Salom! ";
    slides.push({
      kind: "intro", title: d.tu || d.t, sub: d.t,
      steps: [{ k: "uz", t: d.rev
        ? hello + "Bugun " + uzOrdinal(d.w) + " hafta takrorlash kuni. Men inglizcha so'z aytaman, siz o'zbekcha ma'nosini o'ylab ko'ring. Keyin javobni eshitasiz. Boshladik!"
        : hello + "Bugun " + uzOrdinal(d.d) + " dars. Mavzu: " + (d.tu || d.t) + ". Bugun " + uzNumber(words.length) + " ta yangi so'z va bitta qisqa suhbat o'rganamiz. Men so'zni ingliz tilida aytaman, siz menga takrorlaysiz. Boshladik!" }],
    });

    // 2. the words, one at a time: say it, what it means, say it with me, an example
    words.forEach(function (w) {
      slides.push({
        kind: "word", word: w.en, meaning: w.uz, example: w.ex,
        steps: [
          { k: "en", t: w.en, gender: "female", rate: 0.85 },
          { k: "uz", t: "Bu — " + w.uz + " degani." },
          { k: "uz", t: "Takrorlang." },
          { k: "pause", ms: 3500 },
        ].concat(w.ex ? [{ k: "uz", t: "Misol." }, { k: "en", t: w.ex, gender: "female", rate: 0.9 }] : []),
      });
    });

    // 3. the conversation, two voices, translation on screen
    if (d.dl && d.dl.length) {
      var lines = d.dl.map(function (r) { return { who: r[0], en: tidy(r[1]), uz: tidy(r[2]) }; });
      var first = lines[0].who;
      slides.push({
        kind: "dialogue", lines: lines,
        steps: [{ k: "uz", t: "Endi qisqa suhbatni tinglang. Tarjimasini ekranda ko'rasiz." }]
          .concat(lines.map(function (l, i) { return { k: "line", i: i, t: l.en, gender: l.who === first ? "female" : "male", rate: 0.95 }; }))
          .concat([{ k: "uz", t: "Endi siz ham shunday gapirib ko'ring." }]),
      });
    }

    // 4. the grammar point, in Uzbek
    var unit = d.gu ? G.filter(function (g) { return g.id === d.gu; })[0] : null;
    var rule = unit ? tidy(unit.ruleUz) : GRAMMAR_UZ[course + ":" + d.d];
    if (rule) {
      var exs = unit && unit.examples ? unit.examples.slice(0, 2).map(function (e) { return { en: tidy(e[0]), uz: tidy(e[1]) }; }) : [];
      var gsteps = [{ k: "uz", t: "Endi grammatika. " + rule }];
      exs.forEach(function (e) { gsteps.push({ k: "uz", t: "Masalan." }, { k: "en", t: e.en, gender: "female", rate: 0.9 }, { k: "uz", t: "Ya'ni: " + e.uz }); });
      slides.push({ kind: "grammar", title: unit ? tidy(unit.titleUz) : tidy(d.g && d.g[0]), rule: rule, examples: exs, steps: gsteps });
    }

    // 5. a review day has no words of its own: quick questions on the week's words
    if (d.rev) {
      var recap = [];
      C.filter(function (x) { return x.w === d.w && !x.rev && x.v; }).forEach(function (x) {
        x.v.slice(0, 4).forEach(function (r) { var en = tidy(r[0]); if (en) recap.push({ en: en, uz: meaning(r[1]) }); });
      });
      recap.forEach(function (w) {
        slides.push({
          kind: "recall", word: w.en, meaning: w.uz,
          steps: [{ k: "en", t: w.en, gender: "female", rate: 0.9 }, { k: "uz", t: "Bu nima degani?" }, { k: "pause", ms: 3500 }, { k: "reveal" }, { k: "uz", t: w.uz + "." }],
        });
      });
    }

    // 6. goodbye + on to the quiz
    slides.push({
      kind: "outro",
      steps: [{ k: "uz", t: "Barakalla! Bugungi darsni tugatdingiz. Endi test bo'limiga o'tib, o'zingizni sinab ko'ring." }],
    });
    return { course: course, day: d.d, title: d.tu || d.t, sub: d.t, slides: slides };
  }

  root.TTTeachScript = { enabled: enabled, build: build, enabledDays: function (course) { return (ENABLED[course] || []).slice(); }, uzNumber: uzNumber, uzOrdinal: uzOrdinal };
})(typeof window !== "undefined" ? window : globalThis);
