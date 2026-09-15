/* Truck Talk English — app engine */
(function(){
"use strict";

const STORE_KEY = "tte_progress_v1";
const NOTES_KEY = "tte_notes_v1";
const SETTINGS_KEY = "tte_settings_v1";

function loadJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function saveJSON(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
}

let state = {
  progress: loadJSON(STORE_KEY, { completed:{}, xp:0, streak:0, lastDate:null, name:"" }),
  notes: loadJSON(NOTES_KEY, {}),
  settings: loadJSON(SETTINGS_KEY, { showUz:true, freeNav:false, rate:0.9, voiceURI:null }),
  currentDay: null,
  currentTab: "vocab",
  quizState: {}, // dayIndex -> {answers:{}, submitted:false}
  flippedCards: {},
};

function todayStr(){ return new Date().toISOString().slice(0,10); }

function saveProgress(){ saveJSON(STORE_KEY, state.progress); }
function saveNotes(){ saveJSON(NOTES_KEY, state.notes); }
function saveSettings(){ saveJSON(SETTINGS_KEY, state.settings); }

function dayByNum(n){ return CURRICULUM.find(d => d.d === n); }

function isUnlocked(dayNum){
  if (state.settings.freeNav) return true;
  if (dayNum === 1) return true;
  return !!state.progress.completed[dayNum - 1];
}

function isCompleted(dayNum){ return !!state.progress.completed[dayNum]; }

function completedCount(){ return Object.keys(state.progress.completed).length; }

function weekProgress(weekNum){
  const days = CURRICULUM.filter(d => d.w === weekNum);
  const done = days.filter(d => isCompleted(d.d)).length;
  return { done, total: days.length };
}

function markComplete(dayNum, score){
  const wasCompleted = isCompleted(dayNum);
  state.progress.completed[dayNum] = { date: todayStr(), score: score };
  if (!wasCompleted){
    state.progress.xp += 100 + (score || 0) * 5;
    // streak logic
    const last = state.progress.lastDate;
    const today = todayStr();
    if (last !== today){
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
      if (last === yesterday) state.progress.streak += 1;
      else if (last === null) state.progress.streak = 1;
      else state.progress.streak = 1;
      state.progress.lastDate = today;
    }
  }
  saveProgress();
}

// ---------- Speech ----------
let voices = [];
function loadVoices(){
  if (!window.speechSynthesis) return;
  voices = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("en"));
}
if (window.speechSynthesis){
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
function speak(text){
  if (!window.speechSynthesis) { toast("Speech is not supported in this browser."); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = state.settings.rate || 0.9;
  const preferred = voices.find(v => v.voiceURI === state.settings.voiceURI);
  if (preferred) u.voice = preferred;
  else {
    const enUS = voices.find(v => v.lang === "en-US");
    if (enUS) u.voice = enUS;
  }
  window.speechSynthesis.speak(u);
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
function speechSupported(){ return !!SR; }

function similarity(a, b){
  a = a.toLowerCase().replace(/[^a-z0-9 ]/g,"").trim();
  b = b.toLowerCase().replace(/[^a-z0-9 ]/g,"").trim();
  if (!a || !b) return 0;
  const wa = a.split(/\s+/), wb = b.split(/\s+/);
  const setB = new Set(wb);
  let hits = 0;
  wa.forEach(w => { if (setB.has(w)) hits++; });
  return Math.round((hits / Math.max(wa.length, wb.length)) * 100);
}

// ---------- Toast ----------
let toastTimer = null;
function toast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ---------- Rendering: shell/nav ----------
function render(){
  renderNav();
  const view = state.view || "dashboard";
  if (view === "dashboard") renderDashboard();
  else if (view === "lessons") renderLessonList();
  else if (view === "lesson") renderLesson(state.currentDay);
  else if (view === "glossary") renderGlossary();
  else if (view === "progress") renderProgressPage();
  else if (view === "settings") renderSettings();
}

function setView(v, extra){
  state.view = v;
  if (extra) Object.assign(state, extra);
  window.scrollTo(0,0);
  render();
}

function renderNav(){
  const nav = document.getElementById("mainNav");
  const items = [
    ["dashboard","Dashboard"],
    ["lessons","Lessons"],
    ["glossary","Glossary"],
    ["progress","Progress"],
    ["settings","Settings"],
  ];
  nav.innerHTML = items.map(([id,label]) =>
    `<button class="navbtn${state.view===id||(id==="lessons"&&state.view==="lesson")?" active":""}" data-nav="${id}">${label}</button>`
  ).join("");
  nav.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => setView(btn.dataset.nav));
  });
}

// ---------- Dashboard ----------
function renderDashboard(){
  const app = document.getElementById("app");
  const done = completedCount();
  const pct = Math.round((done/60)*100);
  const nextDay = CURRICULUM.find(d => !isCompleted(d.d)) || CURRICULUM[59];
  const weeks = [...new Set(CURRICULUM.map(d=>d.w))];

  const roadDots = CURRICULUM.map(d => {
    const cls = isCompleted(d.d) ? "dot done" : (isUnlocked(d.d) ? "dot unlocked" : "dot locked");
    const marker = d.rev ? " rev" : "";
    return `<button class="${cls}${marker}" data-day="${d.d}" title="Day ${d.d}: ${d.t}">${d.d}</button>`;
  }).join("");

  app.innerHTML = `
    <section class="hero-strip">
      <div class="hero-left">
        <p class="eyebrow">TRUCK TALK ENGLISH — TRIP LOG</p>
        <h1 class="hwy-title">${state.progress.name ? "Welcome back, " + escapeHtml(state.progress.name) : "Your 60-Day Route"}</h1>
        <p class="hero-sub">English for the trucking &amp; logistics road — ${done} of 60 days driven.</p>
        <div class="hero-actions">
          <button class="btn btn-accent" id="continueBtn">Continue — Day ${nextDay.d}: ${escapeHtml(nextDay.t)}</button>
          <button class="btn btn-ghost" id="setNameBtn">${state.progress.name ? "Edit name" : "Set your name"}</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-tile"><span class="stat-num">${done}<span class="stat-den">/60</span></span><span class="stat-label">Days complete</span></div>
        <div class="stat-tile"><span class="stat-num">${state.progress.streak}</span><span class="stat-label">Day streak</span></div>
        <div class="stat-tile"><span class="stat-num">${state.progress.xp}</span><span class="stat-label">XP earned</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>The Highway <span class="mono">(${pct}%)</span></h2>
        <p class="panel-sub">Every dot is one lesson day. Orange = today's target. Green = completed. Grey = locked.</p>
      </div>
      <div class="progressbar"><div class="progressbar-fill" style="width:${pct}%"></div></div>
      <div class="road">${roadDots}</div>
      <div class="legend">
        <span><i class="sw done"></i> Completed</span>
        <span><i class="sw unlocked"></i> Unlocked</span>
        <span><i class="sw locked"></i> Locked</span>
        <span><i class="sw rev"></i> Review day</span>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Weeks (Exits 1&ndash;12)</h2></div>
      <div class="week-grid">
        ${weeks.map(w => {
          const first = CURRICULUM.find(d=>d.w===w);
          const wp = weekProgress(w);
          const wpct = Math.round((wp.done/wp.total)*100);
          return `<button class="week-card" data-week="${w}">
            <span class="week-num">EXIT ${w}</span>
            <span class="week-title">${escapeHtml(first.wt)}</span>
            <span class="week-bar"><span style="width:${wpct}%"></span></span>
            <span class="week-count mono">${wp.done}/${wp.total} days</span>
          </button>`;
        }).join("")}
      </div>
    </section>
  `;

  document.getElementById("continueBtn").addEventListener("click", () => openLesson(nextDay.d));
  document.getElementById("setNameBtn").addEventListener("click", promptName);
  app.querySelectorAll("[data-day]").forEach(btn => {
    btn.addEventListener("click", () => {
      const n = Number(btn.dataset.day);
      if (isUnlocked(n)) openLesson(n);
      else toast("Day " + n + " is locked. Complete Day " + (n-1) + " first, or turn on Free Navigation in Settings.");
    });
  });
  app.querySelectorAll("[data-week]").forEach(btn => {
    btn.addEventListener("click", () => setView("lessons", { scrollWeek: Number(btn.dataset.week) }));
  });
}

function promptName(){
  const name = window.prompt("What's your name?", state.progress.name || "");
  if (name !== null){ state.progress.name = name.trim(); saveProgress(); render(); }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

// ---------- Lesson List ----------
function renderLessonList(){
  const app = document.getElementById("app");
  const weeks = [...new Set(CURRICULUM.map(d=>d.w))];
  app.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>All Lessons</h2>
        <p class="panel-sub">12 weeks &middot; 60 days &middot; trucking &amp; logistics English</p>
      </div>
      ${weeks.map(w => {
        const days = CURRICULUM.filter(d=>d.w===w);
        return `<div class="week-block" id="week-${w}">
          <h3 class="week-block-title">Week ${w}: ${escapeHtml(days[0].wt)}</h3>
          <div class="day-grid">
            ${days.map(d => {
              const locked = !isUnlocked(d.d);
              const done = isCompleted(d.d);
              return `<button class="day-card${done?" done":""}${locked?" locked":""}${d.rev?" rev":""}" data-day="${d.d}" ${locked?"disabled":""}>
                <span class="day-num mono">Day ${d.d}${d.rev?" · REVIEW":""}</span>
                <span class="day-title">${escapeHtml(d.t)}</span>
                <span class="day-status">${locked?"🔒 Locked":done?"✓ Completed":"Ready"}</span>
              </button>`;
            }).join("")}
          </div>
        </div>`;
      }).join("")}
    </section>
  `;
  app.querySelectorAll("[data-day]:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => openLesson(Number(btn.dataset.day)));
  });
  if (state.scrollWeek){
    const el = document.getElementById("week-" + state.scrollWeek);
    if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
    state.scrollWeek = null;
  }
}

function openLesson(dayNum){
  state.currentTab = "vocab";
  setView("lesson", { currentDay: dayNum });
}

// ---------- Lesson ----------
function renderLesson(dayNum){
  const d = dayByNum(dayNum);
  const app = document.getElementById("app");
  const idx = CURRICULUM.findIndex(x=>x.d===dayNum);
  const prev = CURRICULUM[idx-1];
  const next = CURRICULUM[idx+1];

  const tabs = d.rev
    ? [["quiz","Review Quiz"],["speak","Speaking Scenario"]]
    : [["vocab","Vocabulary"],["dialogue","Dialogue"],["grammar","Tip"],["quiz","Quiz"],["speak","Speaking"],["notes","Notes"]];

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backBtn">&larr; All lessons</button>
        <div class="lesson-pager">
          <button class="btn btn-ghost btn-sm" id="prevDayBtn" ${!prev?"disabled":""}>&larr; Day ${prev?prev.d:""}</button>
          <button class="btn btn-ghost btn-sm" id="nextDayBtn" ${!next?"disabled":""}>Day ${next?next.d:""} &rarr;</button>
        </div>
      </div>
      <p class="eyebrow">WEEK ${d.w} &middot; ${escapeHtml(d.wt)}${d.rev?" &middot; REVIEW DAY":""}</p>
      <h1 class="hwy-title">Day ${d.d}: ${escapeHtml(d.t)}</h1>
      ${state.settings.showUz ? `<p class="lesson-title-uz">${escapeHtml(d.tu)}</p>` : ""}
      ${isCompleted(d.d) ? `<span class="badge-complete">✓ Completed &middot; score ${state.progress.completed[d.d].score}%</span>` : ""}
    </section>

    <div class="tabbar">
      ${tabs.map(([id,label]) => `<button class="tabbtn${state.currentTab===id?" active":""}" data-tab="${id}">${label}</button>`).join("")}
    </div>

    <section class="panel lesson-body" id="lessonBody"></section>
  `;

  document.getElementById("backBtn").addEventListener("click", () => setView("lessons"));
  if (prev) document.getElementById("prevDayBtn").addEventListener("click", () => openLesson(prev.d));
  if (next) document.getElementById("nextDayBtn").addEventListener("click", () => openLesson(next.d));
  app.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => { state.currentTab = btn.dataset.tab; render(); });
  });

  renderLessonTab(d);
}

function renderLessonTab(d){
  const body = document.getElementById("lessonBody");
  const tab = state.currentTab;
  if (tab === "vocab") renderVocabTab(d, body);
  else if (tab === "dialogue") renderDialogueTab(d, body);
  else if (tab === "grammar") renderGrammarTab(d, body);
  else if (tab === "quiz") renderQuizTab(d, body);
  else if (tab === "speak") renderSpeakTab(d, body);
  else if (tab === "notes") renderNotesTab(d, body);
}

function renderVocabTab(d, body){
  body.innerHTML = `
    <p class="panel-sub">Tap a card to flip it. Tap the speaker to hear it spoken aloud.</p>
    <div class="flashcards">
      ${d.v.map((item,i) => {
        const [en, uz, ex] = item;
        const flipped = state.flippedCards[d.d+"-"+i];
        return `<div class="flashcard${flipped?" flipped":""}" data-idx="${i}">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front">
              <span class="fc-en">${escapeHtml(en)}</span>
              <button class="speak-btn" data-speak="${escapeHtml(en)}" title="Listen" aria-label="Listen">&#128266;</button>
            </div>
            <div class="flashcard-face flashcard-back">
              ${state.settings.showUz ? `<span class="fc-uz">${escapeHtml(uz)}</span>` : ""}
              <span class="fc-ex">&ldquo;${escapeHtml(ex)}&rdquo;</span>
            </div>
          </div>
        </div>`;
      }).join("")}
    </div>
  `;
  body.querySelectorAll(".flashcard").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".speak-btn")) return;
      const key = d.d + "-" + card.dataset.idx;
      state.flippedCards[key] = !state.flippedCards[key];
      card.classList.toggle("flipped");
    });
  });
  body.querySelectorAll("[data-speak]").forEach(btn => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); speak(btn.dataset.speak); });
  });
}

function renderDialogueTab(d, body){
  body.innerHTML = `
    <p class="panel-sub">A real-world conversation. Press play on any line to hear it.</p>
    <button class="btn btn-accent btn-sm" id="playAllBtn">&#9654; Play full dialogue</button>
    <div class="transcript">
      ${d.dl.map(([speaker,en,uz],i) => `
        <div class="transcript-line" data-idx="${i}">
          <span class="speaker-tag mono">${escapeHtml(speaker)}</span>
          <div class="line-text">
            <p class="line-en">${escapeHtml(en)}</p>
            ${state.settings.showUz ? `<p class="line-uz">${escapeHtml(uz)}</p>` : ""}
          </div>
          <button class="speak-btn" data-speak="${escapeHtml(en)}" title="Listen">&#128266;</button>
        </div>`).join("")}
    </div>
  `;
  body.querySelectorAll("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.dataset.speak));
  });
  document.getElementById("playAllBtn").addEventListener("click", () => {
    if (!window.speechSynthesis){ toast("Speech is not supported in this browser."); return; }
    window.speechSynthesis.cancel();
    let i = 0;
    function next(){
      if (i >= d.dl.length) return;
      const u = new SpeechSynthesisUtterance(d.dl[i][1]);
      u.lang = "en-US"; u.rate = state.settings.rate || 0.9;
      const enUS = voices.find(v=>v.voiceURI===state.settings.voiceURI) || voices.find(v=>v.lang==="en-US");
      if (enUS) u.voice = enUS;
      u.onend = () => { i++; next(); };
      window.speechSynthesis.speak(u);
    }
    next();
  });
}

function renderGrammarTab(d, body){
  body.innerHTML = `
    <div class="tip-card">
      <span class="tip-label mono">LANGUAGE TIP</span>
      <h3>${escapeHtml(d.g[0])}</h3>
      <p>${escapeHtml(d.g[1])}</p>
    </div>
  `;
}

function renderQuizTab(d, body){
  const qs = loadJSON("tte_quizstate_v1", {});
  if (!state.quizState[d.d]) state.quizState[d.d] = qs[d.d] || { answers:{}, submitted:false };
  const qState = state.quizState[d.d];

  body.innerHTML = `
    <p class="panel-sub">${d.rev ? "Cumulative review — answer all questions, then submit." : "Answer all questions, then submit to complete the day."}</p>
    <form id="quizForm">
      ${d.qz.map((q,qi) => `
        <fieldset class="quiz-q">
          <legend>${qi+1}. ${escapeHtml(q[0])}</legend>
          <div class="quiz-opts">
            ${q[1].map((opt,oi) => `
              <label class="quiz-opt">
                <input type="radio" name="q${qi}" value="${oi}" ${qState.answers[qi]===oi?"checked":""} ${qState.submitted?"disabled":""}>
                <span>${escapeHtml(opt)}</span>
              </label>`).join("")}
          </div>
          ${qState.submitted ? `<p class="quiz-feedback ${qState.answers[qi]===q[2]?"correct":"incorrect"}">${qState.answers[qi]===q[2]?"✓ Correct":"✗ Correct answer: " + escapeHtml(q[1][q[2]])}</p>` : ""}
        </fieldset>
      `).join("")}
      ${qState.submitted
        ? `<div class="quiz-result"><strong>Score: ${qState.score}%</strong> — ${qState.score>=70?"Great work!":"Review the material and try again."}</div>
           <button type="button" class="btn btn-ghost" id="retakeBtn">Retake quiz</button>`
        : `<button type="submit" class="btn btn-accent">Submit answers</button>`}
    </form>
  `;

  const form = document.getElementById("quizForm");
  form.addEventListener("change", (e) => {
    if (e.target.name && e.target.name.startsWith("q")){
      const qi = Number(e.target.name.slice(1));
      qState.answers[qi] = Number(e.target.value);
    }
  });
  if (!qState.submitted){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (Object.keys(qState.answers).length < d.qz.length){
        toast("Please answer every question before submitting.");
        return;
      }
      let correct = 0;
      d.qz.forEach((q,qi) => { if (qState.answers[qi] === q[2]) correct++; });
      qState.score = Math.round((correct / d.qz.length) * 100);
      qState.submitted = true;
      persistQuizState();
      if (!d.rev){
        markComplete(d.d, qState.score);
        toast(qState.score>=70 ? "Day " + d.d + " complete! +XP earned." : "Day " + d.d + " complete. Consider reviewing the material again.");
      } else {
        toast("Review quiz submitted — score " + qState.score + "%.");
      }
      render();
    });
  } else {
    const retake = document.getElementById("retakeBtn");
    if (retake) retake.addEventListener("click", () => {
      state.quizState[d.d] = { answers:{}, submitted:false };
      persistQuizState();
      render();
    });
  }
}

function persistQuizState(){
  const flat = {};
  Object.keys(state.quizState).forEach(k => { flat[k] = state.quizState[k]; });
  saveJSON("tte_quizstate_v1", flat);
}

function renderSpeakTab(d, body){
  const prompt = d.sp;
  const supported = speechSupported();
  body.innerHTML = `
    <div class="speak-panel">
      <span class="tip-label mono">SPEAKING PRACTICE</span>
      <p class="speak-prompt-en">${escapeHtml(prompt[0])}</p>
      ${state.settings.showUz ? `<p class="speak-prompt-uz">${escapeHtml(prompt[1])}</p>` : ""}
      ${d.dl ? `<div class="speak-target-wrap"><p class="speak-target-label mono">TRY SAYING A LINE FROM TODAY'S DIALOGUE:</p>
        <select id="targetSelect" class="select">
          ${d.dl.map((l,i)=>`<option value="${i}">${escapeHtml(l[1])}</option>`).join("")}
        </select></div>` : ""}
      <div class="radio-check">
        <button class="btn btn-accent" id="micBtn" ${!supported?"disabled":""}>&#127908; ${supported?"Start Radio Check":"Mic not supported in this browser"}</button>
        <div id="micResult" class="mic-result"></div>
      </div>
      ${!supported ? `<p class="hint">Speech recognition works best in Chrome-based browsers. You can still practice by reading the prompt aloud.</p>` : ""}
    </div>
  `;

  if (supported && d.dl){
    const micBtn = document.getElementById("micBtn");
    const resultEl = document.getElementById("micResult");
    micBtn.addEventListener("click", () => {
      const select = document.getElementById("targetSelect");
      const target = d.dl[Number(select.value)][1];
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      micBtn.textContent = "🎙 Listening...";
      micBtn.disabled = true;
      resultEl.innerHTML = "";
      rec.onresult = (event) => {
        const heard = event.results[0][0].transcript;
        const score = similarity(heard, target);
        resultEl.innerHTML = `
          <p class="mic-heard">You said: &ldquo;${escapeHtml(heard)}&rdquo;</p>
          <p class="mic-score ${score>=70?"good":score>=40?"okay":"low"}">Match: ${score}% ${score>=70?"— Nice work!":score>=40?"— Getting there, try again.":"— Try again, speak clearly."}</p>
        `;
      };
      rec.onerror = () => { resultEl.innerHTML = `<p class="mic-heard">Couldn't hear you clearly. Try again.</p>`; };
      rec.onend = () => { micBtn.textContent = "🎤 Start Radio Check"; micBtn.disabled = false; };
      rec.start();
    });
  } else if (supported){
    const micBtn = document.getElementById("micBtn");
    const resultEl = document.getElementById("micResult");
    micBtn.addEventListener("click", () => {
      const rec = new SR();
      rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
      micBtn.textContent = "🎙 Listening..."; micBtn.disabled = true;
      rec.onresult = (event) => {
        resultEl.innerHTML = `<p class="mic-heard">You said: &ldquo;${escapeHtml(event.results[0][0].transcript)}&rdquo;</p>`;
      };
      rec.onend = () => { micBtn.textContent = "🎤 Start Radio Check"; micBtn.disabled = false; };
      rec.start();
    });
  }
}

function renderNotesTab(d, body){
  const note = state.notes[d.d] || "";
  body.innerHTML = `
    <span class="tip-label mono">YOUR NOTES</span>
    <p class="panel-sub">Personal notes are saved on this device only.</p>
    <textarea id="noteArea" class="note-area" placeholder="Write anything you want to remember about today's lesson...">${escapeHtml(note)}</textarea>
    <button class="btn btn-ghost btn-sm" id="saveNoteBtn">Save note</button>
  `;
  document.getElementById("saveNoteBtn").addEventListener("click", () => {
    state.notes[d.d] = document.getElementById("noteArea").value;
    saveNotes();
    toast("Note saved.");
  });
}

// ---------- Glossary ----------
function buildGlossary(){
  const map = new Map();
  CURRICULUM.forEach(d => {
    if (d.v) d.v.forEach(([en,uz,ex]) => {
      const key = en.toLowerCase();
      if (!map.has(key)) map.set(key, { en, uz, ex, day: d.d, week: d.w });
    });
  });
  return Array.from(map.values()).sort((a,b)=>a.en.localeCompare(b.en));
}
let GLOSSARY_CACHE = null;

function renderGlossary(){
  if (!GLOSSARY_CACHE) GLOSSARY_CACHE = buildGlossary();
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>Trucking &amp; Logistics Glossary</h2>
        <p class="panel-sub">${GLOSSARY_CACHE.length} terms collected from all 60 days. Search to find a word fast.</p>
      </div>
      <input type="search" id="glossSearch" class="search-input" placeholder="Search a word, e.g. 'weigh station'...">
      <div class="gloss-list" id="glossList"></div>
    </section>
  `;
  const listEl = document.getElementById("glossList");
  function draw(filter){
    const f = filter.trim().toLowerCase();
    const items = GLOSSARY_CACHE.filter(g => !f || g.en.toLowerCase().includes(f) || g.uz.toLowerCase().includes(f));
    listEl.innerHTML = items.length ? items.map(g => `
      <div class="gloss-item">
        <div class="gloss-main">
          <span class="gloss-en">${escapeHtml(g.en)}</span>
          <button class="speak-btn" data-speak="${escapeHtml(g.en)}" title="Listen">&#128266;</button>
        </div>
        ${state.settings.showUz ? `<span class="gloss-uz">${escapeHtml(g.uz)}</span>` : ""}
        <span class="gloss-ex">&ldquo;${escapeHtml(g.ex)}&rdquo;</span>
        <button class="gloss-daylink mono" data-day="${g.day}">Day ${g.day}</button>
      </div>`).join("") : `<p class="panel-sub">No terms found.</p>`;
    listEl.querySelectorAll("[data-speak]").forEach(btn => btn.addEventListener("click", () => speak(btn.dataset.speak)));
    listEl.querySelectorAll("[data-day]").forEach(btn => btn.addEventListener("click", () => openLesson(Number(btn.dataset.day))));
  }
  draw("");
  document.getElementById("glossSearch").addEventListener("input", (e) => draw(e.target.value));
}

// ---------- Progress page ----------
function renderProgressPage(){
  const app = document.getElementById("app");
  const done = completedCount();
  const entries = Object.entries(state.progress.completed).map(([day,info]) => ({ day:Number(day), ...info })).sort((a,b)=>a.day-b.day);
  const avgScore = entries.length ? Math.round(entries.reduce((s,e)=>s+(e.score||0),0)/entries.length) : 0;
  const certReady = isCompleted(60);

  app.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h2>Your Progress</h2></div>
      <div class="hero-stats" style="margin-bottom:1.5rem;">
        <div class="stat-tile"><span class="stat-num">${done}<span class="stat-den">/60</span></span><span class="stat-label">Days complete</span></div>
        <div class="stat-tile"><span class="stat-num">${state.progress.streak}</span><span class="stat-label">Day streak</span></div>
        <div class="stat-tile"><span class="stat-num">${avgScore}%</span><span class="stat-label">Average quiz score</span></div>
        <div class="stat-tile"><span class="stat-num">${state.progress.xp}</span><span class="stat-label">Total XP</span></div>
      </div>
      ${certReady ? `<div class="cert-callout"><p>You completed the Final Road Test! 🎉</p><button class="btn btn-accent" id="certBtn">View / Print Certificate</button></div>` : `<p class="panel-sub">Complete Day 60 (the Final Road Test) to unlock your certificate.</p>`}
    </section>
    <section class="panel">
      <div class="panel-head"><h2>Completed Days</h2></div>
      ${entries.length ? `<div class="log-table">
        <div class="log-row log-head mono"><span>Day</span><span>Date</span><span>Score</span></div>
        ${entries.map(e => `<div class="log-row"><span>Day ${e.day}</span><span class="mono">${e.date}</span><span class="mono">${e.score}%</span></div>`).join("")}
      </div>` : `<p class="panel-sub">No lessons completed yet — head to the Lessons tab to start Day 1.</p>`}
    </section>
  `;
  if (certReady) document.getElementById("certBtn").addEventListener("click", showCertificate);
}

function showCertificate(){
  const name = state.progress.name || window.prompt("Enter your name for the certificate:", "") || "Truck Driver";
  if (!state.progress.name){ state.progress.name = name; saveProgress(); }
  const modal = document.getElementById("modalRoot");
  const date = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  modal.innerHTML = `
    <div class="modal-backdrop" id="certBackdrop">
      <div class="cert-sheet">
        <div class="cert-border">
          <p class="cert-eyebrow mono">TRUCK TALK ENGLISH &middot; 60-DAY COURSE</p>
          <h2 class="cert-title">Certificate of Completion</h2>
          <p class="cert-line">This certifies that</p>
          <p class="cert-name">${escapeHtml(name)}</p>
          <p class="cert-line">has successfully completed 60 days of English training in the trucking &amp; logistics field, covering pre-trip inspections, DOT stops, weigh stations, dispatch communication, emergencies, and professional conversation.</p>
          <div class="cert-footer">
            <div><span class="cert-date mono">${date}</span><span class="cert-foot-label">Date</span></div>
            <div><span class="cert-score mono">${state.progress.completed[60] ? state.progress.completed[60].score : "—"}%</span><span class="cert-foot-label">Final Road Test Score</span></div>
          </div>
        </div>
        <div class="cert-actions">
          <button class="btn btn-accent" id="printCertBtn">Print / Save as PDF</button>
          <button class="btn btn-ghost" id="closeCertBtn">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("closeCertBtn").addEventListener("click", closeModal);
  document.getElementById("certBackdrop").addEventListener("click", (e) => { if (e.target.id==="certBackdrop") closeModal(); });
  document.getElementById("printCertBtn").addEventListener("click", () => window.print());
}
function closeModal(){ document.getElementById("modalRoot").innerHTML = ""; }

// ---------- Settings ----------
function renderSettings(){
  const app = document.getElementById("app");
  const voiceOptions = voices.map(v => `<option value="${v.voiceURI}" ${state.settings.voiceURI===v.voiceURI?"selected":""}>${escapeHtml(v.name)} (${v.lang})</option>`).join("");
  app.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h2>Settings</h2></div>

      <div class="setting-row">
        <div>
          <h3>Show Uzbek translations</h3>
          <p class="panel-sub">Toggle bilingual text throughout the course.</p>
        </div>
        <label class="switch"><input type="checkbox" id="toggleUz" ${state.settings.showUz?"checked":""}><span class="slider"></span></label>
      </div>

      <div class="setting-row">
        <div>
          <h3>Free navigation</h3>
          <p class="panel-sub">Unlock all 60 days for teaching or preview, instead of sequential unlocking.</p>
        </div>
        <label class="switch"><input type="checkbox" id="toggleFreeNav" ${state.settings.freeNav?"checked":""}><span class="slider"></span></label>
      </div>

      <div class="setting-row">
        <div>
          <h3>Speech rate</h3>
          <p class="panel-sub">Slow down the pronunciation audio for beginners.</p>
        </div>
        <input type="range" id="rateRange" min="0.5" max="1.2" step="0.1" value="${state.settings.rate}">
      </div>

      ${voices.length ? `<div class="setting-row">
        <div>
          <h3>Voice</h3>
          <p class="panel-sub">Choose which English voice reads lessons aloud.</p>
        </div>
        <select id="voiceSelect" class="select">${voiceOptions}</select>
      </div>` : ""}

      <div class="setting-row">
        <div>
          <h3>Your name</h3>
          <p class="panel-sub">Used on the dashboard and your certificate.</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="editNameBtn2">${state.progress.name ? escapeHtml(state.progress.name) : "Set name"}</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Reset</h2></div>
      <div class="setting-row">
        <div>
          <h3>Reset all progress</h3>
          <p class="panel-sub">Clears completed days, XP, streak, and notes on this device. This cannot be undone.</p>
        </div>
        <button class="btn btn-danger btn-sm" id="resetBtn">Reset progress</button>
      </div>
    </section>
  `;
  document.getElementById("toggleUz").addEventListener("change", (e) => { state.settings.showUz = e.target.checked; saveSettings(); render(); });
  document.getElementById("toggleFreeNav").addEventListener("change", (e) => { state.settings.freeNav = e.target.checked; saveSettings(); render(); });
  document.getElementById("rateRange").addEventListener("input", (e) => { state.settings.rate = Number(e.target.value); saveSettings(); });
  document.getElementById("rateRange").addEventListener("change", () => speak("This is your new speaking speed."));
  const vs = document.getElementById("voiceSelect");
  if (vs) vs.addEventListener("change", (e) => { state.settings.voiceURI = e.target.value; saveSettings(); speak("This is the selected voice."); });
  document.getElementById("editNameBtn2").addEventListener("click", promptName);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (window.confirm("Are you sure? This will erase all your progress on this device.")){
      state.progress = { completed:{}, xp:0, streak:0, lastDate:null, name:"" };
      state.notes = {};
      state.quizState = {};
      saveProgress(); saveNotes(); saveJSON("tte_quizstate_v1", {});
      toast("Progress reset.");
      setView("dashboard");
    }
  });
}

// ---------- Init ----------
function init(){
  setView("dashboard");
  setTimeout(loadVoices, 300);
}

document.addEventListener("DOMContentLoaded", init);

})();
