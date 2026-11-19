/* Roadside English check: practice for the English-proficiency (ELP) check a police or DOT officer can do at a
 * stop or inspection. Classic script loaded before app.js. The question and sign
 * lists are plain globals (scripts/build-voice-phrases.mjs reads them); the screen itself is made by
 * window.TT_makeRoadside(ctx), which app.js calls with the helpers it needs (app.js keeps its own scope).
 *
 *   1. Officer questions: the officer asks real roadside questions out loud; the driver answers by voice (or types).
 *      Each answer is graded by the helper (api/tutor.js, mode "officer") when it is set up, otherwise by a simple
 *      check on this phone, and the driver sees a better way to say it.
 *   2. Road signs: what does this sign mean? (drawn here as SVG, no image files)
 *   3. Ready score out of 100, saved in progress.roadside (best and last).
 *   4. Live officer: a real voice call with the ElevenLabs officer agent, shown only once it is set up.
 */
"use strict";

// [question, Uzbek, Russian, keywords that show the answer is on topic, a model answer]
const RS_QUESTIONS = [
  ["Do you know why I stopped you?", "Sizni nima uchun to'xtatganimni bilasizmi?", "Вы знаете, почему я вас остановил?", ["speed", "fast", "lane", "light", "no", "don't", "inspection", "weigh"], "No, officer. Why did you stop me?"],
  ["Where are you coming from?", "Qayerdan kelyapsiz?", "Откуда вы едете?", ["from", "coming"], "I am coming from Chicago, Illinois."],
  ["Where are you going?", "Qayerga ketyapsiz?", "Куда вы едете?", ["to", "going", "deliver"], "I am going to Dallas, Texas, to deliver my load."],
  ["What are you hauling?", "Nima tashiyapsiz?", "Что вы везёте?", ["haul", "load", "carry", "food", "freight", "general", "empty", "pallet", "produce", "steel", "paper"], "I am hauling general freight, paper products."],
  ["How much does your load weigh?", "Yukingiz qancha og'irlikda?", "Сколько весит ваш груз?", ["pound", "pounds", "thousand", "ton", "weigh", "lbs"], "It weighs about forty thousand pounds."],
  ["Who do you drive for?", "Qaysi kompaniyada ishlaysiz?", "На какую компанию вы работаете?", ["drive", "company", "work", "for", "logistics", "trucking", "inc", "llc"], "I drive for Blue Line Logistics."],
  ["How long have you been driving today?", "Bugun qancha vaqtdan beri haydayapsiz?", "Сколько часов вы сегодня за рулём?", ["hour", "hours", "since", "morning", "minutes"], "I have been driving for six hours today."],
  ["When did you take your last break?", "Oxirgi marta qachon dam oldingiz?", "Когда у вас был последний перерыв?", ["break", "ago", "hour", "hours", "rest", "stop", "morning", "o'clock"], "I took a thirty-minute break two hours ago."],
  ["Can I see your license, medical card, and registration?", "Guvohnomangiz, tibbiy kartangiz va ro'yxatdan o'tish hujjatini ko'rsam bo'ladimi?", "Можно ваши права, медкарту и регистрацию?", ["yes", "here", "sure", "okay", "ok", "license", "card"], "Yes, officer. Here is my license, medical card, and registration."],
  ["Can I see your logbook?", "Yo'l jurnalingizni (ELD) ko'rsam bo'ladimi?", "Можно ваш журнал (ELD)?", ["yes", "here", "eld", "log", "tablet", "screen", "sure"], "Yes. Here is my ELD. You can see my logs on this screen."],
  ["Do you have your bill of lading?", "Yuk xatingiz (bill of lading) bormi?", "У вас есть накладная (bill of lading)?", ["yes", "here", "bill", "paper", "papers"], "Yes, here is the bill of lading."],
  ["Are you carrying any hazardous materials?", "Xavfli yuk tashiyapsizmi?", "Вы везёте опасные грузы?", ["no", "yes", "hazmat", "hazardous", "not"], "No, officer. No hazardous materials."],
  ["Is your load secured?", "Yukingiz mahkamlanganmi?", "Груз закреплён?", ["yes", "secured", "straps", "strap", "chain", "checked", "sealed", "seal"], "Yes, it is secured. I checked the straps at my last stop."],
  ["How tall is your truck?", "Yuk mashinangizning balandligi qancha?", "Какая высота вашего грузовика?", ["feet", "foot", "inches", "thirteen", "fourteen", "13", "14"], "My truck is thirteen feet six inches tall."],
  ["When did you do your pre-trip inspection?", "Yo'lga chiqishdan oldingi ko'rikni qachon qildingiz?", "Когда вы делали предрейсовый осмотр?", ["morning", "today", "before", "inspection", "o'clock", "am", "hours"], "I did my pre-trip inspection this morning at six a.m."],
  ["Please step out of the truck.", "Iltimos, mashinadan tushing.", "Пожалуйста, выйдите из машины.", ["okay", "ok", "yes", "sure", "coming"], "Okay, officer. I am coming out now."],
];

// Road signs: id, English meaning (answer), Uzbek and Russian meaning, SVG
const RS_SIGN_SVG = {
  stop: '<polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="#C8102E" stroke="#fff" stroke-width="4"/><text x="50" y="62" font-size="28" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">STOP</text>',
  yield: '<polygon points="4,8 96,8 50,92" fill="#fff" stroke="#C8102E" stroke-width="12" stroke-linejoin="round"/><text x="50" y="40" font-size="15" font-weight="800" fill="#C8102E" text-anchor="middle" font-family="Arial,sans-serif">YIELD</text>',
  noentry: '<circle cx="50" cy="50" r="46" fill="#C8102E"/><rect x="18" y="42" width="64" height="16" fill="#fff"/><text x="50" y="32" font-size="11" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">DO NOT</text><text x="50" y="76" font-size="11" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">ENTER</text>',
  speed: '<rect x="14" y="2" width="72" height="96" rx="6" fill="#fff" stroke="#111" stroke-width="4"/><text x="50" y="26" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">SPEED</text><text x="50" y="42" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">LIMIT</text><text x="50" y="84" font-size="38" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">55</text>',
  weigh: '<rect x="2" y="18" width="96" height="64" rx="6" fill="#00703C" stroke="#fff" stroke-width="3"/><text x="50" y="42" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">WEIGH</text><text x="50" y="58" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">STATION</text><text x="50" y="74" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">NEXT RIGHT</text>',
  clearance: '<polygon points="50,2 98,50 50,98 2,50" fill="#FFD100" stroke="#111" stroke-width="3"/><text x="50" y="42" font-size="10" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">LOW</text><text x="50" y="54" font-size="9" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">CLEARANCE</text><text x="50" y="70" font-size="14" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">13\'6"</text>',
  notrucks: '<rect x="4" y="4" width="92" height="92" rx="6" fill="#fff" stroke="#111" stroke-width="3"/><rect x="22" y="40" width="34" height="22" fill="#111"/><rect x="56" y="46" width="18" height="16" fill="#111"/><circle cx="32" cy="66" r="5" fill="#111"/><circle cx="66" cy="66" r="5" fill="#111"/><circle cx="50" cy="52" r="38" fill="none" stroke="#C8102E" stroke-width="7"/><line x1="23" y1="25" x2="77" y2="79" stroke="#C8102E" stroke-width="7"/>',
  oneway: '<rect x="2" y="30" width="96" height="40" fill="#111"/><polygon points="10,44 62,44 62,36 88,50 62,64 62,56 10,56" fill="#fff"/><text x="36" y="54" font-size="9" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">ONE WAY</text>',
  grade: '<polygon points="50,2 98,50 50,98 2,50" fill="#FFD100" stroke="#111" stroke-width="3"/><polygon points="24,64 76,40 76,64" fill="#111"/><rect x="38" y="38" width="20" height="12" fill="#111" transform="rotate(-25 48 44)"/><text x="50" y="80" font-size="12" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">7%</text>',
  rail: '<g transform="rotate(45 50 50)"><rect x="8" y="42" width="84" height="16" fill="#fff" stroke="#111" stroke-width="2"/></g><g transform="rotate(-45 50 50)"><rect x="8" y="42" width="84" height="16" fill="#fff" stroke="#111" stroke-width="2"/></g><text x="50" y="32" font-size="7" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif" transform="rotate(45 50 50)">RAILROAD</text><text x="50" y="72" font-size="7" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif" transform="rotate(-45 50 50)">CROSSING</text>',
  rightlane: '<rect x="10" y="4" width="80" height="92" rx="6" fill="#fff" stroke="#111" stroke-width="3"/><text x="50" y="30" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">TRUCKS</text><text x="50" y="48" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">USE</text><text x="50" y="66" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">RIGHT</text><text x="50" y="84" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">LANE</text>',
  roadwork: '<polygon points="50,2 98,50 50,98 2,50" fill="#F47B20" stroke="#111" stroke-width="3"/><text x="50" y="42" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">ROAD</text><text x="50" y="56" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">WORK</text><text x="50" y="70" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial,sans-serif">AHEAD</text>',
};
const RS_SIGNS = [
  ["stop", "Stop completely, then go when it is safe.", "To'liq to'xtang, xavfsiz bo'lganda yuring.", "Полностью остановитесь, потом езжайте, когда безопасно."],
  ["yield", "Slow down and let other traffic go first.", "Sekinlang va boshqa transportga yo'l bering.", "Сбавьте скорость и уступите дорогу."],
  ["noentry", "Do not drive into this road.", "Bu yo'lga kirmang.", "Не въезжайте на эту дорогу."],
  ["speed", "The maximum speed is 55 miles per hour.", "Eng yuqori tezlik soatiga 55 mil.", "Максимальная скорость 55 миль в час."],
  ["weigh", "Trucks must exit at the next right to be weighed.", "Yuk mashinalari keyingi o'ngdan chiqib tortilishi kerak.", "Грузовики должны съехать направо на взвешивание."],
  ["clearance", "A bridge or tunnel ahead is only 13 feet 6 inches high.", "Oldindagi ko'prik yoki tunnel balandligi atigi 13 fut 6 dyuym.", "Мост или тоннель впереди высотой всего 13 футов 6 дюймов."],
  ["notrucks", "Trucks are not allowed on this road.", "Bu yo'lda yuk mashinalariga ruxsat yo'q.", "Грузовикам сюда нельзя."],
  ["oneway", "Traffic goes only in the direction of the arrow.", "Harakat faqat strelka tomonga.", "Движение только в сторону стрелки."],
  ["grade", "Steep hill down ahead: use a low gear.", "Oldinda tik qiyalik: past uzatmada yuring.", "Впереди крутой спуск: включите пониженную передачу."],
  ["rail", "Railroad tracks cross the road: look, listen, and be ready to stop.", "Temir yo'l kesishmasi: qarang, tinglang, to'xtashga tayyor bo'ling.", "Железнодорожный переезд: смотрите, слушайте, будьте готовы остановиться."],
  ["rightlane", "Trucks must drive in the right lane.", "Yuk mashinalari o'ng qatorda yurishi kerak.", "Грузовики должны ехать в правом ряду."],
  ["roadwork", "There is road construction ahead: slow down.", "Oldinda yo'l ta'mirlanmoqda: sekinlang.", "Впереди дорожные работы: сбавьте скорость."],
];
const RS_INTERVIEW_COUNT = 6, RS_SIGN_COUNT = 6;

window.TT_makeRoadside = function (ctx) {
  const { state, tr, escapeHtml, icon, shuffle, speak, speakOnce, stopSpeaking, stopListening, speechSupported, listenOnce, partnerVoice, render, setView, saveProgress } = ctx;

  function rsHelp(row){ return (window.TT_lang && window.TT_lang() === "ru") ? row[2] : row[1]; }
  function rsSignMeaning(row){ return (window.TT_lang && window.TT_lang() === "ru") ? row[3] : row[2]; }
  function rsSignSvg(id, size){ return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${tr("Road sign")}">${RS_SIGN_SVG[id]}</svg>`; }

  // Grading on the phone when the helper is not available: on topic + a real English sentence.
  function rsLocalGrade(q, answer){
    const words = String(answer || "").toLowerCase().match(/[a-z0-9']+/g) || [];
    const english = words.filter(w => /[a-z]/.test(w));
    const onTopic = q[3].some(k => words.indexOf(k) !== -1);
    const score = english.length >= 3 && onTopic ? 2 : english.length >= 2 || onTopic ? 1 : 0;
    const tip = score === 2 ? tr("Clear answer. An officer would understand you.") : score === 1 ? tr("Say a full sentence, like the example below.") : tr("Answer in English with a short sentence, like the example below.");
    return { score, better: q[4], tip };
  }

  function rsNewRun(){
    return {
      step: "intro",
      qs: [RS_QUESTIONS[0]].concat(shuffle(RS_QUESTIONS.slice(1)).slice(0, RS_INTERVIEW_COUNT - 1)),   // a stop always opens with "why I stopped you"
      qi: 0, answers: [],
      signs: shuffle(RS_SIGNS.slice()).slice(0, RS_SIGN_COUNT), si: 0, signAnswers: [],
    };
  }

  function roadsideScore(run){
    const iv = run.answers.reduce((n, a) => n + (a.score || 0), 0) / (run.qs.length * 2);
    const sg = run.signAnswers.filter(Boolean).length / run.signs.length;
    return Math.round((iv * 0.6 + sg * 0.4) * 100);
  }

  function saveRoadside(score){
    if (ctx.isStaff()) return;
    const prev = state.progress.roadside || {};
    state.progress.roadside = { best: Math.max(prev.best || 0, score), last: score, at: Date.now() };
    saveProgress();
  }

  function renderRoadside(){
    const app = document.getElementById("app");
    if (!state.roadsideRun) state.roadsideRun = rsNewRun();
    const run = state.roadsideRun;
    const rs = state.progress.roadside;
    const officerLive = !!(window.TTHelper && window.TTHelper.officerAvailable && window.TTHelper.officerAvailable());

    if (run.step === "intro"){
      app.innerHTML = `
        <section class="panel rs-intro">
          <p class="eyebrow">${tr("ROADSIDE ENGLISH CHECK")}</p>
          <h1 class="hwy-title">${tr("Are you ready for an officer?")}</h1>
          <p class="hero-sub">${tr("Since 2025, an officer can put a driver out of service if they cannot answer questions or read road signs in English. Practice the real check here.")}</p>
          <ol class="rs-steps">
            <li>${tr("{n} officer questions, out loud", { n: RS_INTERVIEW_COUNT })}</li>
            <li>${tr("{n} road signs", { n: RS_SIGN_COUNT })}</li>
            <li>${tr("Your ready score out of 100")}</li>
          </ol>
          ${rs ? `<p class="rs-best">${tr("Your best: {b}/100 · last: {l}/100", { b: rs.best, l: rs.last })}</p>` : ""}
          <div class="rs-actions">
            <button class="btn btn-accent btn-lg" id="rsStart">${tr("Start the check")} ${icon("chevronRight",18)}</button>
            ${officerLive ? `<button class="btn btn-ghost" id="rsLive">${icon("mic",16)} ${tr("Live call with an officer")}</button>` : ""}
          </div>
        </section>`;
      document.getElementById("rsStart").addEventListener("click", () => { run.step = "q"; render(); });
      const live = document.getElementById("rsLive");
      if (live) live.addEventListener("click", () => window.TTHelper.openOfficer());
      return;
    }

    if (run.step === "q"){
      const q = run.qs[run.qi], done = run.answers[run.qi];
      const canMic = speechSupported();
      app.innerHTML = `
        <section class="panel rs-q">
          <p class="eyebrow">${tr("OFFICER QUESTION {a} OF {b}", { a: run.qi + 1, b: run.qs.length })}</p>
          <div class="rs-officer">
            <span class="rs-badge">${icon("truck",22)}</span>
            <div class="rs-bubble">
              <p class="rs-say">${escapeHtml(q[0])}</p>
              <button class="speak-btn" id="rsHear" aria-label="${tr("Listen")}">${icon("speaker",18)}</button>
            </div>
          </div>
          <details class="rs-help"><summary>${tr("Help: what did the officer say?")}</summary><p>${escapeHtml(rsHelp(q))}</p></details>
          ${done ? `
            <div class="rs-result s${done.score}">
              <p class="rs-heard">${tr("You said: “{a}”", { a: escapeHtml(done.answer || "…") })}</p>
              <p class="rs-score">${done.score === 2 ? tr("✓ Clear") : done.score === 1 ? tr("Almost") : tr("Not understood")}</p>
              ${done.tip ? `<p class="rs-tip">${escapeHtml(done.tip)}</p>` : ""}
              <p class="rs-better"><span class="mono">${tr("SAY IT LIKE THIS")}</span> ${escapeHtml(done.better || q[4])}
                <button class="speak-btn" id="rsHearBetter" aria-label="${tr("Listen")}">${icon("speaker",16)}</button></p>
            </div>
            <div class="rs-actions">
              <button class="btn btn-ghost" id="rsRetry">${tr("Try again")}</button>
              <button class="btn btn-accent" id="rsNext">${run.qi < run.qs.length - 1 ? tr("Next question") : tr("Go to road signs")} &rarr;</button>
            </div>` : `
            <div class="rs-answer">
              ${canMic ? `<button class="btn btn-accent btn-lg" id="rsMic">${icon("mic",18)} <span>${tr("Answer out loud")}</span></button>` : ""}
              <div class="rs-type"><input class="input" id="rsText" placeholder="${tr("Or type your answer in English")}" autocomplete="off"><button class="btn btn-ghost" id="rsSend">${tr("Send")}</button></div>
              <p class="rs-status" id="rsStatus" aria-live="polite"></p>
            </div>`}
        </section>`;
      const hear = () => { const pv = partnerVoice(); stopSpeaking(); speakOnce(q[0], { token: ctx.token(), voice: pv.voice, pitch: pv.pitch, gender: "male" }); };
      document.getElementById("rsHear").addEventListener("click", hear);
      if (done){
        document.getElementById("rsHearBetter").addEventListener("click", () => speak(done.better || q[4]));
        document.getElementById("rsRetry").addEventListener("click", () => { run.answers[run.qi] = null; render(); });
        document.getElementById("rsNext").addEventListener("click", () => {
          if (run.qi < run.qs.length - 1) run.qi++; else run.step = "signs";
          render(); window.scrollTo({ top: 0, behavior: "smooth" });
        });
        return;
      }
      hear();
      const status = document.getElementById("rsStatus");
      const submit = (answer) => {
        answer = String(answer || "").trim();
        status.textContent = tr("Checking…");
        const local = () => rsLocalGrade(q, answer);
        const useHelper = answer && window.TTHelper && window.TTHelper.canGrade && window.TTHelper.canGrade();
        (useHelper ? window.TTHelper.grade(q[0], answer).then(g => g && typeof g.score === "number" ? g : local(), local) : Promise.resolve(local()))
          .then(g => { if (state.view !== "roadside" || run.qs[run.qi] !== q) return; run.answers[run.qi] = { answer, score: g.score, better: g.better, tip: g.tip }; render(); });
      };
      document.getElementById("rsSend").addEventListener("click", () => { const v = document.getElementById("rsText").value; if (v.trim()) submit(v); });
      document.getElementById("rsText").addEventListener("keydown", (e) => { if (e.key === "Enter"){ e.preventDefault(); document.getElementById("rsSend").click(); } });
      const mic = document.getElementById("rsMic");
      let listening = false;
      if (mic) mic.addEventListener("click", () => {
        if (listening){ stopListening(); return; }   // (server check: finishes the recording and checks it)
        stopSpeaking();
        listening = true;
        status.textContent = tr("Listening… answer the officer.");
        listenOnce({
          onInterim: (t) => { status.textContent = t; },
          onDone: (res) => {
            listening = false;
            if (state.view !== "roadside" || run.qs[run.qi] !== q) return;
            if (res.error){ status.textContent = res.error === "aborted" ? "" : tr("Couldn't hear you clearly. Try again."); return; }
            submit(res.alts[0]);
          },
        });
      });
      return;
    }

    if (run.step === "signs"){
      const row = run.signs[run.si], picked = run.signAnswers[run.si];
      if (!run.signOpts || run.signOpts.id !== row[0]){
        const others = shuffle(RS_SIGNS.filter(r => r[0] !== row[0])).slice(0, 3);
        run.signOpts = { id: row[0], opts: shuffle([row].concat(others)) };
      }
      const answered = picked !== undefined;
      app.innerHTML = `
        <section class="panel rs-sign">
          <p class="eyebrow">${tr("ROAD SIGN {a} OF {b}", { a: run.si + 1, b: run.signs.length })}</p>
          <h2>${tr("What does this sign mean?")}</h2>
          <div class="rs-sign-img">${rsSignSvg(row[0], 150)}</div>
          <div class="rs-opts">
            ${run.signOpts.opts.map((o, k) => {
              const cls = !answered ? "" : o[0] === row[0] ? " correct" : (run.signPick === k ? " incorrect" : "");
              return `<button class="quiz-opt rs-opt${cls}" data-opt="${k}" ${answered ? "disabled" : ""}><span>${escapeHtml(o[1])}</span>${state.settings.showUz ? `<small>${escapeHtml(rsSignMeaning(o))}</small>` : ""}</button>`;
            }).join("")}
          </div>
          ${answered ? `<div class="rs-actions"><button class="btn btn-accent" id="rsNextSign">${run.si < run.signs.length - 1 ? tr("Next sign") : tr("See my score")} &rarr;</button></div>` : ""}
        </section>`;
      app.querySelectorAll("[data-opt]").forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.opt), ok = run.signOpts.opts[k][0] === row[0];
        run.signPick = k; run.signAnswers[run.si] = ok;
        speak(row[1]);
        render();
      }));
      const nx = document.getElementById("rsNextSign");
      if (nx) nx.addEventListener("click", () => {
        run.signPick = null;
        if (run.si < run.signs.length - 1) run.si++;
        else { run.step = "done"; run.score = roadsideScore(run); saveRoadside(run.score); }
        render(); window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    // done
    const score = run.score != null ? run.score : roadsideScore(run);
    const weak = run.qs.filter((q, i) => !run.answers[i] || run.answers[i].score < 2);
    const missedSigns = run.signs.filter((s, i) => !run.signAnswers[i]);
    const verdict = score >= 80 ? tr("Ready. You can handle a roadside check.") : score >= 60 ? tr("Almost ready. Practice the phrases below a few more times.") : tr("Not ready yet. Keep practicing every day; it gets easier fast.");
    app.innerHTML = `
      <section class="panel rs-done">
        <p class="eyebrow">${tr("ROADSIDE ENGLISH CHECK")}</p>
        <div class="rs-score-big ${score >= 80 ? "good" : score >= 60 ? "okay" : "low"}"><b>${score}</b><small>/100</small></div>
        <p class="hero-sub">${verdict}</p>
        ${weak.length ? `<h3>${tr("Practice these answers")}</h3><ul class="rs-list">${weak.map(q => `<li><span>${escapeHtml(q[0])}</span><b>${escapeHtml(q[4])}</b><button class="speak-btn" data-say="${escapeHtml(q[4])}" aria-label="${tr("Listen")}">${icon("speaker",16)}</button></li>`).join("")}</ul>` : ""}
        ${missedSigns.length ? `<h3>${tr("Signs to learn")}</h3><ul class="rs-list rs-signs">${missedSigns.map(s => `<li>${rsSignSvg(s[0], 48)}<b>${escapeHtml(s[1])}</b></li>`).join("")}</ul>` : ""}
        <div class="rs-actions">
          <button class="btn btn-ghost" id="rsHome">${tr("Back to home")}</button>
          <button class="btn btn-accent" id="rsAgain">${tr("Take it again")}</button>
        </div>
      </section>`;
    app.querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => speak(b.dataset.say)));
    document.getElementById("rsHome").addEventListener("click", () => setView("dashboard", { roadsideRun: null }));
    document.getElementById("rsAgain").addEventListener("click", () => { state.roadsideRun = rsNewRun(); state.roadsideRun.step = "q"; render(); });
  }

  return { render: renderRoadside };
};
