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
  progress: Object.assign({ completed:{}, grammarDone:{}, homeworkDone:{}, roleplay:{}, xp:0, streak:0, lastDate:null, name:"" }, loadJSON(STORE_KEY, {})),
  notes: loadJSON(NOTES_KEY, {}),
  settings: Object.assign({ showUz:true, freeNav:false, rate:0.92, voiceURI:null, theme:"system" }, loadJSON(SETTINGS_KEY, {})),
  currentDay: null,
  currentTab: "vocab",
  currentUnit: null,
  quizState: {}, // dayIndex -> {answers:{}, submitted:false}
  grammarQuizState: {}, // unitId -> {answers:{}, submitted:false}
  flippedCards: {},
};

function todayStr(){ return new Date().toISOString().slice(0,10); }

let _cloudSyncTimer = null;
function saveProgress(){
  saveJSON(STORE_KEY, state.progress);
  if (window.TTE_syncProgress){
    clearTimeout(_cloudSyncTimer);
    _cloudSyncTimer = setTimeout(() => window.TTE_syncProgress(state.progress), 1200);
  }
}
function saveNotes(){ saveJSON(NOTES_KEY, state.notes); }
function saveSettings(){ saveJSON(SETTINGS_KEY, state.settings); }

// "system" follows the phone's light/dark setting; "light"/"dark" force it.
// Also keeps the browser/status-bar colour (theme-color) in step.
function applyTheme(theme){
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
    if (!m.dataset.orig) m.dataset.orig = m.getAttribute("content");
    m.setAttribute("content", theme === "light" ? "#1A3D63" : theme === "dark" ? "#0D2140" : m.dataset.orig);
  });
}

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

function grammarUnitById(id){ return GRAMMAR.find(u => u.id === id); }
function isGrammarDone(id){ return !!state.progress.grammarDone[id]; }
function grammarDoneCount(){ return Object.keys(state.progress.grammarDone).length; }
function markGrammarComplete(id, score){
  const wasDone = isGrammarDone(id);
  state.progress.grammarDone[id] = { date: todayStr(), score: score };
  if (!wasDone) state.progress.xp += 60 + (score || 0) * 3;
  saveProgress();
}

// ---------- Speech: text-to-speech ----------
// Reliability notes (each of these was a real "sometimes nothing plays" cause):
//  - Chrome can garbage-collect a playing utterance and never fire `onend`,
//    so every utterance is held in a Set until it finishes.
//  - cancel() followed straight away by speak() is silently dropped by some
//    engines, so a watchdog retries (after a short pause) if nothing starts.
//  - A chosen/cloud voice that fails falls back to the device default voice.
//  - A paused engine (tab switch, Android) is resume()d before speaking.
let voices = [];
let autoVoiceURI = null;
const liveUtterances = new Set();
let speechToken = 0;
let voiceFailToasted = false;

function voiceQualityScore(v){
  const name = (v.name || "").toLowerCase();
  let score = 0;
  // Local (on-device) voices speak instantly; network/cloud voices have to
  // round-trip to a server first and noticeably lag on every tap — so a
  // local voice always outranks a cloud one, however "premium" it sounds.
  if (v.localService === true) score += 30;
  // Siri voices (macOS/iOS) are on-device neural voices — the closest
  // thing to a commercial assistant voice a website can actually use.
  if (name.includes("siri")) score += 13;
  if (name.includes("natural")) score += 10;
  if (name.includes("neural")) score += 10;
  if (name.includes("premium")) score += 8;
  if (name.includes("enhanced")) score += 8;
  if (v.lang === "en-US") score += 5;
  else if (v.lang && v.lang.startsWith("en")) score += 2;
  return score;
}

function loadVoices(){
  if (!window.speechSynthesis) return;
  voices = window.speechSynthesis.getVoices()
    .filter(v => v.lang && v.lang.replace("_","-").toLowerCase().startsWith("en"))
    .sort((a,b) => voiceQualityScore(b) - voiceQualityScore(a));
  if (voices.length) autoVoiceURI = voices[0].voiceURI;
}
if (window.speechSynthesis){
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => { loadVoices(); if (state.view === "settings") render(); };
  // Some browsers (iOS, older Chrome) fill the voice list late and never
  // announce it — poll briefly until it shows up.
  let voicePolls = 0;
  const voicePoll = setInterval(() => {
    if (voices.length || ++voicePolls > 20) return clearInterval(voicePoll);
    loadVoices();
  }, 250);
}
function bestVoice(){
  const chosen = voices.find(v => v.voiceURI === state.settings.voiceURI);
  if (chosen) return chosen;
  const auto = voices.find(v => v.voiceURI === autoVoiceURI);
  if (auto) return auto;
  return voices.find(v => v.lang === "en-US") || voices[0] || null;
}
// A second, different voice for the other person in a role-play, so the
// conversation sounds like two people. Falls back to the same voice at a
// lower pitch when the device only has one English voice.
function partnerVoice(){
  const me = bestVoice();
  const other = voices.find(v => (!me || v.voiceURI !== me.voiceURI) && v.localService === true && v.lang.replace("_","-").toLowerCase().startsWith("en"))
             || voices.find(v => !me || v.voiceURI !== me.voiceURI);
  return other ? { voice: other, pitch: 1 } : { voice: me, pitch: 0.78 };
}
function ttsSupported(){ return !!window.speechSynthesis && typeof SpeechSynthesisUtterance !== "undefined"; }

function stopSpeaking(){
  speechToken++;
  if (window.speechSynthesis){ try{ window.speechSynthesis.cancel(); }catch(e){} }
}
document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeaking(); });
window.addEventListener("pagehide", stopSpeaking);

// Speak one piece of text. Resolves true when it played, false if it failed
// or was interrupted. Never rejects.
function speakOnce(text, opts){
  opts = opts || {};
  return new Promise(resolve => {
    if (!ttsSupported()){
      if (!opts.quiet) toast("Speech is not supported in this browser.");
      return resolve(false);
    }
    const synth = window.speechSynthesis;
    const myToken = opts.token != null ? opts.token : speechToken;
    let done = false, started = false, attempts = 0, watchdog = null, current = null;

    const finish = (ok) => {
      if (done) return;
      done = true; clearTimeout(watchdog);
      if (current) liveUtterances.delete(current);
      resolve(ok);
    };
    const attempt = (useVoice) => {
      attempts++;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = opts.rate || state.settings.rate || 0.92;
      u.pitch = opts.pitch || 1;
      u.volume = 1;
      if (useVoice){ u.voice = useVoice; u.lang = useVoice.lang || "en-US"; }
      current = u;
      liveUtterances.add(u);
      u.onstart = () => { if (u !== current) return; started = true; if (opts.onstart) opts.onstart(); };
      u.onend = () => { if (u === current) finish(true); };
      u.onerror = (e) => {
        if (done || u !== current) return;
        if (e && (e.error === "canceled" || e.error === "interrupted")) return finish(false);
        retry();
      };
      try{ synth.resume(); }catch(e){}
      synth.speak(u);
      clearTimeout(watchdog);
      watchdog = setTimeout(() => { if (!started && !done) retry(); }, attempts === 1 ? 3000 : 2500);
    };
    const retry = () => {
      if (done) return;
      if (myToken !== speechToken) return finish(false);
      if (attempts >= 3){
        if (!voiceFailToasted && !opts.quiet){
          voiceFailToasted = true;
          toast("Couldn't play audio. Check your volume and silent mode, or pick another voice in Settings.");
        }
        return finish(false);
      }
      if (current){ liveUtterances.delete(current); current = null; }  // its cancel() event must not end this promise
      try{ synth.cancel(); }catch(e){}
      // attempt 2: same voice after a pause; attempt 3: the device default voice
      setTimeout(() => { if (!done && myToken === speechToken) attempt(attempts === 1 ? (opts.voice || bestVoice()) : null); }, 120);
    };

    if (opts.token == null || myToken === speechToken){
      // Only cancel what's already playing (a needless cancel() is what
      // makes some engines drop the very next speak()).
      if (synth.speaking || synth.pending){ try{ synth.cancel(); }catch(e){} }
      attempt(opts.voice || bestVoice());
    } else finish(false);
  });
}

function speak(text){
  stopSpeaking();
  return speakOnce(text, { token: speechToken });
}
// Speak a list one after another. Returns { stop() }; onItem(i) fires as each starts.
function speakQueue(items, opts){
  opts = opts || {};
  stopSpeaking();
  const token = speechToken;
  (async () => {
    for (let i = 0; i < items.length; i++){
      if (token !== speechToken) return;
      if (opts.onItem) opts.onItem(i);
      const it = typeof items[i] === "string" ? { text: items[i] } : items[i];
      const ok = await speakOnce(it.text, { token, quiet: i > 0, voice: it.voice, pitch: it.pitch });
      if (token !== speechToken) return;
      if (!ok && i === 0) return;
    }
    if (token === speechToken && opts.onDone) opts.onDone();
  })();
  return { stop: () => { if (token === speechToken) stopSpeaking(); } };
}

// ---------- Speech: recognition + scoring ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;
function speechSupported(){ return !!SR; }
function stopListening(){
  if (activeRec){ try{ activeRec.abort(); }catch(e){} activeRec = null; }
}

const NUM_WORDS = { zero:"0", one:"1", two:"2", three:"3", four:"4", five:"5", six:"6", seven:"7", eight:"8", nine:"9", ten:"10", eleven:"11", twelve:"12", thirteen:"13", fourteen:"14", fifteen:"15", sixteen:"16", seventeen:"17", eighteen:"18", nineteen:"19", twenty:"20", thirty:"30", forty:"40", fifty:"50" };
const CONTRACTIONS = {
  "i'm":"i am", "you're":"you are", "we're":"we are", "they're":"they are", "he's":"he is", "she's":"she is", "it's":"it is",
  "that's":"that is", "there's":"there is", "what's":"what is", "here's":"here is", "where's":"where is", "how's":"how is", "who's":"who is",
  "i'll":"i will", "you'll":"you will", "we'll":"we will", "they'll":"they will", "he'll":"he will", "she'll":"she will", "it'll":"it will",
  "i've":"i have", "you've":"you have", "we've":"we have", "they've":"they have", "i'd":"i would", "you'd":"you would", "we'd":"we would",
  "don't":"do not", "doesn't":"does not", "didn't":"did not", "can't":"cannot", "won't":"will not", "isn't":"is not", "aren't":"are not",
  "wasn't":"was not", "weren't":"were not", "haven't":"have not", "hasn't":"has not", "couldn't":"could not", "wouldn't":"would not",
  "shouldn't":"should not", "let's":"let us", "gonna":"going to", "wanna":"want to", "gotta":"got to",
};
// Text → normalised word list. Both the target and what was heard go
// through this, so "I'm" / "I am" and "six" / "6" / "a.m." / "AM" all compare equal.
function normalizeWords(text){
  let s = String(text || "").toLowerCase().replace(/[’‘`]/g, "'");
  s = s.replace(/([a-z])\.(?=[a-z])/g, "$1");           // a.m. → am.
  s = s.replace(/(\d),(\d)/g, "$1$2");                  // 1,000 → 1000
  const out = [];
  s.split(/\s+/).forEach(raw => {
    const tok = raw.replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, "");
    if (!tok) return;
    const expanded = CONTRACTIONS[tok] ? CONTRACTIONS[tok].split(" ") : [tok.replace(/'/g, "")];
    expanded.forEach(w => { const clean = w.replace(/[^a-z0-9]/g, ""); if (clean) out.push(NUM_WORDS[clean] || clean); });
  });
  return out;
}
function editDistance(a, b){
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++){
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
// Speech recognisers often hear an accented word as a near-miss ("truck" →
// "trucks"), so allow a small edit distance on longer words.
function wordsMatch(a, b){
  if (a === b) return true;
  const len = Math.min(a.length, b.length);
  if (len >= 7) return editDistance(a, b) <= 2;
  if (len >= 4) return editDistance(a, b) <= 1;
  return false;
}
// Compare what was heard to the target line. Returns { score 0-100, marks }
// where marks has one entry per whitespace-separated word of the target.
function scoreSpeech(target, heard){
  const displayWords = String(target).split(/\s+/).filter(Boolean);
  const flat = [];   // { w, owner }
  displayWords.forEach((dw, i) => normalizeWords(dw).forEach(w => flat.push({ w, owner: i })));
  const h = normalizeWords(heard);
  const n = flat.length, m = h.length;
  const marks = displayWords.map(word => ({ word, ok: false, has: false }));
  if (!n || !m) return { score: 0, marks: marks.map(k => ({ word: k.word, ok: !n })) };
  // longest common subsequence with fuzzy word equality
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++){
    dp[i][j] = wordsMatch(flat[i-1].w, h[j-1]) ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  }
  const hit = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0){
    if (wordsMatch(flat[i-1].w, h[j-1]) && dp[i][j] === dp[i-1][j-1] + 1){ hit[i-1] = true; i--; j--; }
    else if (dp[i-1][j] >= dp[i][j-1]) i--; else j--;
  }
  const matched = dp[n][m];
  flat.forEach((f, idx) => { marks[f.owner].has = true; if (hit[idx]) marks[f.owner].hits = (marks[f.owner].hits || 0) + 1; marks[f.owner].total = (marks[f.owner].total || 0) + 1; });
  const extra = Math.max(0, m - n);
  const score = Math.max(0, Math.min(100, Math.round((matched / (n + extra * 0.5)) * 100)));
  return { score, marks: marks.map(k => ({ word: k.word, ok: !k.has || k.hits === k.total })) };
}
// Kept for the older Speaking tab: percentage match of heard vs target.
function similarity(heard, target){ return scoreSpeech(target, heard).score; }

// Ask for the microphone up front (so the browser shows its permission
// prompt on a clear button tap, not mid-sentence). Resolves {ok, reason}.
async function ensureMic(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return { ok: speechSupported(), reason: "unsupported" };
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    return { ok: true };
  }catch(err){
    const name = err && err.name;
    if (name === "NotAllowedError" || name === "SecurityError") return { ok: false, reason: "denied" };
    if (name === "NotFoundError") return { ok: false, reason: "nomic" };
    return { ok: false, reason: "error" };
  }
}
// One listening session. callbacks: onInterim(text), onDone({alts}|{error})
function listenOnce(cb){
  stopListening();
  let rec;
  try{ rec = new SR(); }catch(e){ cb.onDone({ error: "unsupported" }); return null; }
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.maxAlternatives = 3;
  rec.continuous = false;
  let alts = null, err = null, finished = false;
  rec.onresult = (event) => {
    const res = event.results[event.results.length - 1];
    if (res.isFinal){ alts = Array.from(res).map(a => a.transcript); }
    else if (cb.onInterim) cb.onInterim(res[0].transcript);
  };
  rec.onerror = (event) => { err = event.error || "error"; };
  rec.onend = () => {
    if (finished) return; finished = true;
    if (activeRec === rec) activeRec = null;
    if (alts && alts.length) cb.onDone({ alts }); else cb.onDone({ error: err || "no-speech" });
  };
  activeRec = rec;
  try{ rec.start(); }catch(e){ finished = true; activeRec = null; cb.onDone({ error: "unsupported" }); return null; }
  return rec;
}

// ---------- Icons (inline SVG, not emoji) ----------
const ICON_PATHS = {
  dashboard: '<circle cx="12" cy="12" r="9"/><path d="M15.3 8.7l-2 5-5 2 2-5z"/>',
  lessons: '<path d="M2 5.5C2 4.7 2.7 4 3.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3.5A1.5 1.5 0 0 1 2 16.5z"/><path d="M22 5.5c0-.8-.7-1.5-1.5-1.5H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  glossary: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  grammar: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  progress: '<path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/>',
  settings: '<line x1="4" y1="6" x2="20" y2="6"/><circle cx="14" cy="6" r="2"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="8" cy="12" r="2"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="18" r="2"/>',
  speaker: '<path d="M4 9v6h4l5 5V4L8 9z"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M19 5a9 9 0 0 1 0 14"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>',
  play: '<polygon points="6,3 20,12 6,21"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H4v2a4 4 0 0 0 4 3"/><path d="M16 5h4v2a4 4 0 0 1-4 3"/><path d="M12 13v4"/><path d="M9 21h6"/><path d="M10 17h4v4h-4z"/>',
  homework: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 13l2 2 4-4"/>',
  chevronRight: '<polyline points="9,6 15,12 9,18"/>',
};
function icon(name, size){
  size = size || 20;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
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
  stopSpeaking(); stopListening();
  renderNav();
  const view = state.view || "dashboard";
  if (view === "dashboard") renderDashboard();
  else if (view === "lessons") renderLessonList();
  else if (view === "weekDetail") renderWeekDetail(state.currentWeek);
  else if (view === "lesson") renderLesson(state.currentDay);
  else if (view === "progress") renderProgressPage();
  else if (view === "settings") renderSettings();
  else if (view === "grammar") renderGrammarBook();
  else if (view === "grammarCategory") renderGrammarCategory(state.currentCategory);
  else if (view === "grammarUnit") renderGrammarUnit(state.currentUnit);
  else if (view === "homework") renderHomework();
  else if (view === "homeworkSession") renderHomeworkSession(state.currentSession);
}

function setView(v, extra){
  state.view = v;
  if (extra) Object.assign(state, extra);
  window.scrollTo(0,0);
  render();
}

const NAV_ACTIVE_GROUPS = {
  lessons: ["lessons","weekDetail","lesson"],
  grammar: ["grammar","grammarCategory","grammarUnit"],
  homework: ["homework","homeworkSession"],
};
function renderNav(){
  const nav = document.getElementById("mainNav");
  const items = [
    ["dashboard","Home","dashboard"],
    ["lessons","Lessons","lessons"],
    ["grammar","Grammar","grammar"],
    ["homework","Homework","homework"],
    ["progress","Progress","progress"],
    ["settings","Settings","settings"],
  ];
  nav.innerHTML = items.map(([id,label,iconName]) => {
    const activeGroup = NAV_ACTIVE_GROUPS[id];
    const isActive = activeGroup ? activeGroup.includes(state.view) : state.view === id;
    return `<button class="navbtn${isActive?" active":""}" data-nav="${id}"><span class="nav-icon">${icon(iconName,20)}</span><span class="nav-label">${label}</span></button>`;
  }).join("");
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
        <p class="panel-sub">Every dot is one lesson day. Blue outline = unlocked. Green = completed. Grey = locked. Dashed = review day.</p>
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
    btn.addEventListener("click", () => setView("weekDetail", { currentWeek: Number(btn.dataset.week) }));
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
  app.querySelectorAll("[data-week]").forEach(btn => {
    btn.addEventListener("click", () => setView("weekDetail", { currentWeek: Number(btn.dataset.week) }));
  });
}

function renderWeekDetail(weekNum){
  const app = document.getElementById("app");
  const days = CURRICULUM.filter(d => d.w === weekNum);
  if (!days.length) { setView("lessons"); return; }
  const wp = weekProgress(weekNum);

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backToLessonsBtn">&larr; All Lessons</button>
      </div>
      <p class="eyebrow">WEEK ${weekNum} OF 12</p>
      <h1 class="hwy-title">${escapeHtml(days[0].wt)}</h1>
      <p class="hero-sub">${wp.done}/${wp.total} days complete.</p>
    </section>
    <section class="panel">
      <div class="day-grid">
        ${days.map(d => {
          const locked = !isUnlocked(d.d);
          const done = isCompleted(d.d);
          return `<button class="day-card${done?" done":""}${locked?" locked":""}${d.rev?" rev":""}" data-day="${d.d}" ${locked?"disabled":""}>
            <span class="day-num mono">Day ${d.d}${d.rev?" · REVIEW":""}</span>
            <span class="day-title">${escapeHtml(d.t)}</span>
            <span class="day-status">${locked?icon("lock",13)+" Locked":done?"✓ Completed":"Ready"}</span>
          </button>`;
        }).join("")}
      </div>
    </section>
  `;
  document.getElementById("backToLessonsBtn").addEventListener("click", () => setView("lessons"));
  app.querySelectorAll("[data-day]:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => openLesson(Number(btn.dataset.day)));
  });
}

function openLesson(dayNum){
  const d = dayByNum(dayNum);
  state.currentTab = d && d.rev ? "quiz" : "vocab";
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
    ? [["practice","Practice"],["roleplay","Role-play"],["quiz","Review Quiz"],["speak","Speaking Scenario"]]
    : [["vocab","Vocabulary"],["dialogue","Dialogue"],["roleplay","Role-play"],["practice","Practice"],["grammar","Tip"],["quiz","Quiz"],["speak","Speaking"],["notes","Notes"]];
  const timeEstimate = d.rev ? "30–45 min" : "60–90 min";

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backBtn">&larr; Week ${d.w}</button>
        <div class="lesson-pager">
          <button class="btn btn-ghost btn-sm" id="prevDayBtn" ${!prev?"disabled":""}>&larr; Day ${prev?prev.d:""}</button>
          <button class="btn btn-ghost btn-sm" id="nextDayBtn" ${!next?"disabled":""}>Day ${next?next.d:""} &rarr;</button>
        </div>
      </div>
      <p class="eyebrow">WEEK ${d.w} &middot; ${escapeHtml(d.wt)}${d.rev?" &middot; REVIEW DAY":""}</p>
      <h1 class="hwy-title">Day ${d.d}: ${escapeHtml(d.t)}</h1>
      ${state.settings.showUz ? `<p class="lesson-title-uz">${escapeHtml(d.tu)}</p>` : ""}
      <div class="lesson-badges">
        <span class="badge-time mono">${icon("clock",14)} ${timeEstimate}</span>
        ${isCompleted(d.d) ? `<span class="badge-complete">✓ Completed &middot; score ${state.progress.completed[d.d].score}%</span>` : ""}
      </div>
    </section>

    <div class="tabbar">
      ${tabs.map(([id,label]) => `<button class="tabbtn${state.currentTab===id?" active":""}" data-tab="${id}">${label}</button>`).join("")}
    </div>

    <section class="panel lesson-body" id="lessonBody"></section>
  `;

  document.getElementById("backBtn").addEventListener("click", () => setView("weekDetail", { currentWeek: d.w }));
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
  else if (tab === "roleplay") renderRolePlayTab(d, body);
  else if (tab === "practice") renderPracticeTab(d, body);
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
              <button class="speak-btn" data-speak="${escapeHtml(en)}" title="Listen" aria-label="Listen">${icon("speaker",18)}</button>
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
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-accent btn-sm" id="playAllBtn">${icon("play",14)} Play full dialogue</button>
      <button class="btn btn-ghost btn-sm" id="toRoleplayBtn">${icon("mic",14)} Now you try — role-play</button>
    </div>
    <div class="transcript">
      ${d.dl.map(([speaker,en,uz],i) => `
        <div class="transcript-line" data-idx="${i}">
          <span class="speaker-tag mono">${escapeHtml(speaker)}</span>
          <div class="line-text">
            <p class="line-en">${escapeHtml(en)}</p>
            ${state.settings.showUz ? `<p class="line-uz">${escapeHtml(uz)}</p>` : ""}
          </div>
          <button class="speak-btn" data-speak="${escapeHtml(en)}" title="Listen">${icon("speaker",18)}</button>
        </div>`).join("")}
    </div>
  `;
  body.querySelectorAll("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.dataset.speak));
  });
  document.getElementById("toRoleplayBtn").addEventListener("click", () => { state.currentTab = "roleplay"; render(); });
  document.getElementById("playAllBtn").addEventListener("click", () => {
    if (!ttsSupported()){ toast("Speech is not supported in this browser."); return; }
    // Two voices so it sounds like two people: the first speaker gets your
    // chosen voice, everyone else the partner voice.
    const first = d.dl[0][0], pv = partnerVoice();
    const lines = body.querySelectorAll(".transcript-line");
    speakQueue(d.dl.map(l => l[0] === first ? { text: l[1] } : { text: l[1], voice: pv.voice, pitch: pv.pitch }), {
      onItem: (i) => { lines.forEach((el, k) => el.classList.toggle("now", k === i)); if (lines[i]) lines[i].scrollIntoView({ block: "nearest", behavior: "smooth" }); },
      onDone: () => lines.forEach(el => el.classList.remove("now")),
    });
  });
}

// ---------- Role-play: an interactive dialogue you speak into the mic ----------
// You play one person in the day's conversation and the app plays the
// other (spoken aloud, in a different voice). On your turn your line is
// shown on screen — read it out, and the mic checks how close you were,
// word by word. Nothing here is a free-form chatbot: the answers are the
// lesson's own dialogue lines, so a beginner can always just read them.
const RP_PASS = 70;

function rpWeekDays(d){ return CURRICULUM.filter(x => x.w === d.w && x.dl); }
function rpDialogue(d, rp){
  if (!d.rev) return d.dl || [];
  const src = dayByNum(rp.sourceDay);
  return (src && src.dl) || [];
}
function rpSpeakers(dl){ return [...new Set(dl.map(l => l[0]))]; }
function rpDefaultRole(dl){
  const sp = rpSpeakers(dl);
  return sp.find(s => /driver|trainee|customer|caller/i.test(s)) || sp[1] || sp[0];
}
function ensureRP(d){
  if (!state.rolePlay) state.rolePlay = {};
  if (!state.rolePlay[d.d]){
    const first = d.rev ? (rpWeekDays(d)[0] || {}).d : d.d;
    state.rolePlay[d.d] = { phase:"intro", sourceDay:first, role:null, hideText:false, mode:"mic", run:0 };
  }
  return state.rolePlay[d.d];
}
function rpReset(d, rp, role){
  Object.assign(rp, { phase:"intro", role: role || null, idx:0, messages:[], results:{}, status:"idle", typing:false,
    speakingIdx:null, attempts:0, best:null, feedback:null, live:"", note:"" });
  rp.run++;
}
// iOS Safari only lets speech start from a real tap. The mic-permission
// prompt eats that tap, so "unlock" the speech engine synchronously first.
function unlockSpeech(){
  if (!ttsSupported()) return;
  try{ const u = new SpeechSynthesisUtterance(" "); u.volume = 0; window.speechSynthesis.speak(u); }catch(e){}
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function renderRolePlayTab(d, body){
  const rp = ensureRP(d);
  if (rp.phase === "intro") return renderRPIntro(d, body, rp);
  if (rp.status === "listening") rp.status = "idle";   // the mic session ended when we left the tab
  rpRender(d, body, rp);
  if (rp.phase === "play" && rp.status === "partner") rpAdvance(d, body, rp);   // pick the conversation back up
}

function renderRPIntro(d, body, rp){
  const dl = rpDialogue(d, rp);
  if (!dl.length){ body.innerHTML = `<p class="panel-sub">No dialogue available for this day.</p>`; return; }
  const speakers = rpSpeakers(dl);
  if (!rp.role || !speakers.includes(rp.role)) rp.role = rpDefaultRole(dl);
  const prev = state.progress.roleplay && state.progress.roleplay[d.d];
  const canScore = speechSupported();
  body.innerHTML = `
    <div class="rp rp-intro">
      <div>
        <span class="tip-label mono">ROLE-PLAY</span>
        <p class="panel-sub" style="margin-top:6px;">Have the conversation yourself. The app plays the other person and speaks to you; when it's your turn your line appears on screen — read it out loud and the microphone checks how you did.</p>
      </div>
      ${d.rev ? `<div>
        <p class="speak-target-label mono">CHOOSE A CONVERSATION FROM THIS WEEK</p>
        <select id="rpSource" class="select">
          ${rpWeekDays(d).map(x => `<option value="${x.d}" ${x.d===rp.sourceDay?"selected":""}>Day ${x.d}: ${escapeHtml(x.t)}</option>`).join("")}
        </select>
      </div>` : ""}
      <div>
        <p class="speak-target-label mono">YOU PLAY</p>
        <div class="rp-roles">
          ${speakers.map(s => `<button class="rp-role${s===rp.role?" active":""}" data-role="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}
        </div>
      </div>
      <div class="rp-options">
        <label class="rp-check"><input type="checkbox" id="rpHide" ${rp.hideText?"checked":""}> Challenge mode — hide my lines until I need them</label>
      </div>
      <div class="rp-mic-note">${canScore
        ? `${icon("mic",16)} We'll ask to use your microphone when you start. Your voice is only used to check your answer.`
        : `Speech checking isn't available in this browser (it works in Chrome, Edge and Safari). You can still practise: read your lines out loud and tap “I said it”.`}</div>
      <button class="btn btn-accent btn-lg" id="rpStart">${icon("play",16)} Start role-play</button>
      ${prev ? `<p class="hint">Your best score on this day: <strong>${prev.best ? prev.best + "%" : "completed"}</strong></p>` : ""}
    </div>`;
  const src = document.getElementById("rpSource");
  if (src) src.addEventListener("change", () => { rp.sourceDay = Number(src.value); rp.role = null; renderRPIntro(d, body, rp); });
  body.querySelectorAll("[data-role]").forEach(b => b.addEventListener("click", () => { rp.role = b.dataset.role; rp.hideText = document.getElementById("rpHide").checked; renderRPIntro(d, body, rp); }));
  document.getElementById("rpStart").addEventListener("click", async () => {
    rp.hideText = document.getElementById("rpHide").checked;
    unlockSpeech();
    const btn = document.getElementById("rpStart");
    btn.disabled = true;
    let mode = "mic", note = "";
    if (!speechSupported()){ mode = "self"; }
    else {
      const r = await ensureMic();
      if (!r.ok){
        mode = "self";
        note = r.reason === "denied"
          ? "The microphone is blocked for this site. Allow it in your browser's site settings to get scored — for now, read your lines aloud and tap “I said it”."
          : r.reason === "nomic" ? "No microphone was found on this device." : "The microphone couldn't start.";
      }
    }
    Object.assign(rp, { phase:"play", mode, note, ttsFailed:false, idx:0, messages:[], results:{}, status:"idle", typing:false, speakingIdx:null, attempts:0, best:null, feedback:null, live:"" });
    rpRender(d, body, rp);
    rpAdvance(d, body, rp);
  });
}

// Walk the script: play the other person's lines, stop at each of yours.
async function rpAdvance(d, body, rp){
  const run = ++rp.run;
  const dl = rpDialogue(d, rp);
  const alive = () => rp.run === run && body.isConnected && state.view === "lesson" && state.currentDay === d.d && state.currentTab === "roleplay";
  const pv = partnerVoice();
  while (rp.idx < dl.length){
    const [speaker, en, uz] = dl[rp.idx];
    if (speaker === rp.role){
      rp.status = "idle"; rp.attempts = 0; rp.best = null; rp.feedback = null; rp.live = ""; rp.typing = false; rp.speakingIdx = null;
      rpRender(d, body, rp);
      return;
    }
    rp.status = "partner"; rp.typing = true; rpRender(d, body, rp);
    await sleep(500);
    if (!alive()) return;
    rp.typing = false;
    rp.messages.push({ who: speaker, en, uz, mine: false });
    rp.idx++;
    rp.speakingIdx = rp.messages.length - 1;
    rpRender(d, body, rp);
    if (!rp.ttsFailed){
      stopSpeaking();
      const played = await speakOnce(en, { token: speechToken, voice: pv.voice, pitch: pv.pitch });
      if (alive() && !played) rp.ttsFailed = true;   // audio isn't working here — don't stall on every line
    }
    if (!alive()) return;
    rp.speakingIdx = null;
    await sleep(250);
    if (!alive()) return;
  }
  // finished
  const scored = Object.values(rp.results).filter(r => r.score != null);
  const avg = scored.length ? Math.round(scored.reduce((a, r) => a + r.score, 0) / scored.length) : null;
  rp.summary = { avg };
  rp.phase = "done"; rp.status = "idle"; rp.typing = false; rp.speakingIdx = null;
  const prev = state.progress.roleplay[d.d];
  if (!prev) state.progress.xp += 30;
  state.progress.roleplay[d.d] = { best: Math.max((prev && prev.best) || 0, avg || 0), date: todayStr() };
  saveProgress();
  rpRender(d, body, rp);
}

function rpRender(d, body, rp){
  const dl = rpDialogue(d, rp);
  const showUz = state.settings.showUz;
  const myTurn = rp.phase === "play" && rp.status !== "partner" && rp.idx < dl.length && dl[rp.idx][0] === rp.role;
  const pct = Math.round((Math.min(rp.idx, dl.length) / dl.length) * 100);

  const chat = rp.messages.map((m, i) => `
    <div class="rp-msg ${m.mine ? "me" : "them"}${rp.speakingIdx === i ? " speaking" : ""}">
      <span class="rp-who">${escapeHtml(m.who)}${m.mine ? " · you" : ""}</span>
      <div class="rp-line"><p>${escapeHtml(m.en)}</p><button class="speak-btn" data-rpspeak="${i}" aria-label="Listen">${icon("speaker",16)}</button></div>
      ${showUz && m.uz ? `<p class="rp-uz">${escapeHtml(m.uz)}</p>` : ""}
      ${m.mine && m.score != null ? `<span class="rp-score-chip">${m.score}%</span>` : ""}
    </div>`).join("") + (rp.typing ? `<div class="rp-typing" aria-label="Typing"><i></i><i></i><i></i></div>` : "");

  let turn = "";
  if (myTurn){
    const [, en, uz] = dl[rp.idx];
    const fb = rp.feedback;
    const hidden = rp.hideText && !fb && !rp.revealed;
    const words = fb
      ? fb.marks.map(k => `<span class="w ${k.ok ? "ok" : "miss"}">${escapeHtml(k.word)}</span>`).join(" ")
      : escapeHtml(en);
    const listening = rp.status === "listening";
    turn = `
      <div class="rp-turn" id="rpTurn">
        <span class="rp-turn-label">YOUR TURN · ${escapeHtml(rp.role.toUpperCase())}</span>
        <p class="rp-say${hidden ? " hidden-text" : ""}" id="rpSay">${words}</p>
        ${showUz ? `<p class="rp-say-uz">${escapeHtml(uz)}</p>` : ""}
        ${rp.hideText && !fb ? `<button class="btn btn-ghost btn-sm" id="rpReveal" style="align-self:flex-start;">${hidden ? "Show my line" : "Hide my line"}</button>` : ""}
        ${rp.note ? `<div class="rp-mic-note">${escapeHtml(rp.note)}</div>` : ""}
        <p class="rp-live" aria-live="polite" id="rpLive">${listening ? (rp.live ? "“" + escapeHtml(rp.live) + "”" : "Listening… speak now") : escapeHtml(rp.live || "")}</p>
        ${fb ? rpFeedbackHtml(rp, fb) : `
          <div class="rp-turn-actions">
            <button class="btn btn-ghost" id="rpHear">${icon("speaker",16)} Hear it</button>
            ${rp.mode === "mic"
              ? `<button class="rp-mic${listening ? " listening" : ""}" id="rpMic" aria-label="${listening ? "Stop listening" : "Tap to speak"}">${icon("mic",30)}</button>
                 <span class="rp-mic-hint">${listening ? "Tap again to stop" : "Tap the mic and say your line"}</span>`
              : `<button class="btn btn-accent" id="rpSaid">I said it &rarr;</button>`}
          </div>`}
      </div>`;
  }

  let summary = "";
  if (rp.phase === "done"){
    const avg = rp.summary && rp.summary.avg;
    const lines = Object.values(rp.results);
    summary = `
      <div class="rp-summary">
        <span class="tip-label mono">CONVERSATION COMPLETE</span>
        <div class="rp-summary-score">${avg != null ? avg + "%" : "Done!"}</div>
        <p class="panel-sub">${avg == null ? "Nice work — you read every line. Use a browser with a microphone (Chrome, Safari) to get scored." : avg >= 85 ? "Excellent — that sounded confident." : avg >= RP_PASS ? "Good job. Try once more for a cleaner run." : "Keep practising — listen to each line, then say it again slowly."}</p>
        ${lines.length ? `<div class="rp-summary-lines">${lines.map(r => `<div class="rp-summary-line"><span>${escapeHtml(r.en)}</span><span>${r.score != null ? r.score + "%" : "—"}</span></div>`).join("")}</div>` : ""}
        <div class="rp-fb-actions" style="justify-content:center;">
          <button class="btn btn-accent" id="rpAgain">${icon("refresh",16)} Play again</button>
          <button class="btn btn-ghost" id="rpSwitch">Switch roles</button>
        </div>
      </div>`;
  }

  body.innerHTML = `
    <div class="rp">
      <div class="rp-progress">
        <div class="progressbar"><div class="progressbar-fill" style="width:${rp.phase === "done" ? 100 : pct}%"></div></div>
        <span class="rp-progress-label mono">You: ${escapeHtml(rp.role)}</span>
        <button class="btn btn-ghost btn-sm" id="rpQuit">End</button>
      </div>
      <div class="rp-chat" aria-live="polite">${chat}</div>
      ${turn}
      ${summary}
    </div>`;

  // wiring
  body.querySelectorAll("[data-rpspeak]").forEach(b => b.addEventListener("click", () => {
    const m = rp.messages[Number(b.dataset.rpspeak)];
    if (m.mine) speak(m.en); else { const pv = partnerVoice(); stopSpeaking(); speakOnce(m.en, { token: speechToken, voice: pv.voice, pitch: pv.pitch }); }
  }));
  const $q = (id) => document.getElementById(id);
  $q("rpQuit").addEventListener("click", () => { stopSpeaking(); stopListening(); rpReset(d, rp, rp.role); renderRolePlayTab(d, body); });
  if ($q("rpAgain")) $q("rpAgain").addEventListener("click", () => { const r = rp.role; rpReset(d, rp, r); renderRolePlayTab(d, body); });
  if ($q("rpSwitch")) $q("rpSwitch").addEventListener("click", () => {
    const others = rpSpeakers(dl).filter(s => s !== rp.role);
    rpReset(d, rp, others[0] || rp.role); renderRolePlayTab(d, body);
  });
  if (rp.phase === "done"){ const sm = body.querySelector(".rp-summary"); if (sm) sm.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  if (myTurn){
    const [, en] = dl[rp.idx];
    if ($q("rpHear")) $q("rpHear").addEventListener("click", () => speak(en));
    if ($q("rpReveal")) $q("rpReveal").addEventListener("click", () => { rp.revealed = !rp.revealed; rp.hideText = true; rpRender(d, body, rp); });
    if ($q("rpSay") && rp.hideText && !rp.feedback) $q("rpSay").addEventListener("click", () => { rp.revealed = true; rpRender(d, body, rp); });
    if ($q("rpMic")) $q("rpMic").addEventListener("click", () => rpListen(d, body, rp));
    if ($q("rpSaid")) $q("rpSaid").addEventListener("click", () => rpAccept(d, body, rp, null));
    if ($q("rpRetry")) $q("rpRetry").addEventListener("click", () => { rp.feedback = null; rp.live = ""; rpRender(d, body, rp); });
    if ($q("rpNext")) $q("rpNext").addEventListener("click", () => rpAccept(d, body, rp, rp.best));
    const t = $q("rpTurn");
    if (t && !rp._noScroll) t.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function rpFeedbackHtml(rp, fb){
  const good = fb.score >= RP_PASS;
  const cls = fb.score >= RP_PASS ? "good" : fb.score >= 50 ? "okay" : "low";
  const title = fb.score >= 90 ? "Excellent!" : good ? "Good — that works!" : fb.score >= 50 ? "Almost there" : "Let's try that again";
  const tip = !good && rp.attempts >= 2 ? `<p class="rp-heard">Tip: tap “Hear it”, then say the line slowly, one word at a time.</p>` : "";
  return `
    <div class="rp-feedback ${cls}">
      <p class="rp-fb-title">${title} <span class="mono">${fb.score}%</span></p>
      <p class="rp-heard">You said: <b>&ldquo;${escapeHtml(fb.heard)}&rdquo;</b></p>
      ${fb.marks.some(k => !k.ok) ? `<p class="rp-heard">Green words were clear; the underlined red ones need another try.</p>` : ""}
      ${tip}
      <div class="rp-fb-actions">
        ${good
          ? `<button class="btn btn-accent" id="rpNext">Continue &rarr;</button><button class="btn btn-ghost" id="rpRetry">Try again</button>`
          : `<button class="btn btn-accent" id="rpRetry">${icon("mic",16)} Try again</button><button class="btn btn-ghost" id="rpNext">Continue anyway</button>`}
      </div>
    </div>`;
}

function rpAccept(d, body, rp, score){
  const dl = rpDialogue(d, rp);
  const [, en, uz] = dl[rp.idx];
  rp.messages.push({ who: rp.role, en, uz, mine: true, score });
  rp.results[rp.idx] = { score, en, attempts: rp.attempts };
  rp.idx++; rp.feedback = null; rp.revealed = false; rp.live = "";
  rpAdvance(d, body, rp);
}

function rpListen(d, body, rp){
  const dl = rpDialogue(d, rp);
  if (rp.status === "listening"){ stopListening(); return; }
  stopSpeaking();
  const target = dl[rp.idx][1];
  rp.status = "listening"; rp.live = ""; rp.feedback = null; rp.note = rp.note || "";
  rp._noScroll = true; rpRender(d, body, rp); rp._noScroll = false;
  const run = rp.run;
  const alive = () => rp.run === run && body.isConnected && state.currentTab === "roleplay" && state.currentDay === d.d;
  listenOnce({
    onInterim: (t) => { rp.live = t; const el = document.getElementById("rpLive"); if (el) el.textContent = "“" + t + "”"; },
    onDone: (res) => {
      if (!alive()) return;
      rp.status = "idle";
      if (res.error){
        const e = res.error;
        if (e === "not-allowed" || e === "service-not-allowed" || e === "unsupported"){
          rp.mode = "self";
          rp.note = "Speech checking is blocked or unavailable here (allow the microphone in your browser's site settings, or use Chrome/Safari in a normal tab). You can still read your line and tap “I said it”.";
          rp.live = "";
        } else if (e === "no-speech") rp.live = "I didn't hear anything — tap the mic and speak a little louder, close to your phone.";
        else if (e === "audio-capture") rp.live = "No microphone was found.";
        else if (e === "network") rp.live = "Speech checking needs an internet connection.";
        else if (e === "aborted") rp.live = "";
        else rp.live = "Couldn't hear that clearly — tap the mic and try again.";
        rp._noScroll = true; rpRender(d, body, rp); rp._noScroll = false;
        return;
      }
      // choose the best-matching of the recogniser's alternatives
      let best = null;
      res.alts.forEach(t => { const r = scoreSpeech(target, t); if (!best || r.score > best.score) best = { score: r.score, marks: r.marks, heard: t }; });
      rp.attempts++;
      rp.best = Math.max(rp.best || 0, best.score);
      rp.feedback = best; rp.live = "";
      rpRender(d, body, rp);
    },
  });
}

// ---------- Practice generation helpers ----------
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weekVocabPool(weekNum){
  const pool = [];
  CURRICULUM.filter(x => x.w === weekNum && !x.rev && x.v).forEach(x => pool.push(...x.v));
  return pool;
}

function uniqueByEn(pool){
  const seen = new Set(), out = [];
  pool.forEach(item => { if (!seen.has(item[0])){ seen.add(item[0]); out.push(item); } });
  return out;
}

function primaryForm(en){ return en.replace(/\.\.\.$/, "").trim(); }
function blankableVariants(en){ return primaryForm(en).split("/").map(s => s.trim()).filter(Boolean); }

function generateVocabQuestions(pool, count){
  const uniq = uniqueByEn(pool);
  const chosen = shuffle(uniq).slice(0, Math.min(count, uniq.length));
  return chosen.map(([en, uz]) => {
    const distractors = shuffle(uniq.filter(p => p[1] !== uz)).slice(0, 3).map(p => p[1]);
    const opts = shuffle([uz, ...distractors]);
    return [`What does "${en}" mean?`, opts, opts.indexOf(uz)];
  });
}

function generateFillBlank(pool, count){
  const uniq = uniqueByEn(pool);
  const allTerms = uniq.map(([en]) => primaryForm(en).split("/")[0].trim());
  const candidates = [];
  shuffle(uniq).forEach(([en, uz, ex]) => {
    if (candidates.length >= count) return;
    for (const variant of blankableVariants(en)){
      const idx = ex.toLowerCase().indexOf(variant.toLowerCase());
      if (idx !== -1){
        const matched = ex.substr(idx, variant.length);
        const sentence = ex.slice(0, idx) + "&#9612;&#9612;&#9612;&#9612;" + ex.slice(idx + variant.length);
        const distractors = shuffle(allTerms.filter(t => t.toLowerCase() !== matched.toLowerCase())).slice(0, 5);
        candidates.push({ sentence, answer: matched, uz, bank: shuffle([matched, ...distractors]) });
        break;
      }
    }
  });
  return candidates;
}

function generateMatchingPairs(pool, count){
  const uniq = uniqueByEn(pool);
  return shuffle(uniq).slice(0, Math.min(count, uniq.length)).map(([en, uz]) => [en, uz]);
}

function buildPracticeSet(d){
  const pool = d.rev ? weekVocabPool(d.w) : d.v;
  const pairs = generateMatchingPairs(pool, 8);
  return {
    fb: generateFillBlank(pool, 6),
    match: { pairs, shuffledUz: shuffle(pairs.map(p => p[1])), matchedEn: [], selectedEn: null, selectedUz: null, wrong: false }
  };
}

function ensurePracticeState(d){
  if (!state.practiceState) state.practiceState = {};
  if (!state.practiceState[d.d]) state.practiceState[d.d] = buildPracticeSet(d);
  return state.practiceState[d.d];
}

function renderPracticeTab(d, body){
  const ps = ensurePracticeState(d);
  const fbDone = ps.fb.filter(f => f.selected).length;
  const fbCorrect = ps.fb.filter(f => f.selected && f.selected.toLowerCase() === f.answer.toLowerCase()).length;
  const matchDone = ps.match.matchedEn.length;

  body.innerHTML = `
    <div class="practice-header">
      <p class="panel-sub">${d.rev ? "Auto-generated from this whole week's vocabulary" : "Auto-generated from today's 20 vocabulary words"} — a fresh set every time.</p>
      <button class="btn btn-ghost btn-sm" id="newSetBtn">${icon("refresh",14)} New practice set</button>
    </div>

    <div class="practice-block">
      <span class="tip-label mono">FILL IN THE BLANK &middot; ${fbCorrect}/${ps.fb.length} correct</span>
      ${ps.fb.map((item, i) => `
        <div class="fib-item">
          <p class="fib-sentence">${item.sentence.replace("&#9612;&#9612;&#9612;&#9612;", item.selected ? `<span class="fib-filled ${item.selected.toLowerCase()===item.answer.toLowerCase()?"correct":"incorrect"}">${escapeHtml(item.selected)}</span>` : `<span class="fib-blank">____</span>`)}</p>
          ${state.settings.showUz ? `<p class="fib-uz">${escapeHtml(item.uz)}</p>` : ""}
          <div class="fib-bank">
            ${item.bank.map(word => `<button class="fib-chip${item.selected===word?(word.toLowerCase()===item.answer.toLowerCase()?" correct":" incorrect"):""}" data-fb="${i}" data-word="${escapeHtml(word)}" ${item.selected?"disabled":""}>${escapeHtml(word)}</button>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div class="practice-block">
      <span class="tip-label mono">MATCH THE WORDS &middot; ${matchDone}/${ps.match.pairs.length} matched</span>
      <p class="panel-sub">Tap an English word, then tap its match.</p>
      <div class="match-grid">
        <div class="match-col">
          ${ps.match.pairs.map(([en]) => {
            const matched = ps.match.matchedEn.includes(en);
            const selected = ps.match.selectedEn === en;
            const wrong = ps.match.wrong && selected;
            return `<button class="match-btn${matched?" matched":""}${selected?" selected":""}${wrong?" wrong":""}" data-en="${escapeHtml(en)}" ${matched?"disabled":""}>${escapeHtml(en)}</button>`;
          }).join("")}
        </div>
        <div class="match-col">
          ${ps.match.shuffledUz.map(uz => {
            const pairEn = ps.match.pairs.find(p => p[1] === uz)[0];
            const matched = ps.match.matchedEn.includes(pairEn);
            const selected = ps.match.selectedUz === uz;
            const wrong = ps.match.wrong && selected;
            return `<button class="match-btn${matched?" matched":""}${selected?" selected":""}${wrong?" wrong":""}" data-uz="${escapeHtml(uz)}" ${matched?"disabled":""}>${escapeHtml(uz)}</button>`;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("newSetBtn").addEventListener("click", () => {
    state.practiceState[d.d] = buildPracticeSet(d);
    renderPracticeTab(d, body);
  });

  body.querySelectorAll("[data-fb]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.fb);
      ps.fb[i].selected = btn.dataset.word;
      renderPracticeTab(d, body);
    });
  });

  body.querySelectorAll("[data-en]").forEach(btn => {
    btn.addEventListener("click", () => {
      ps.match.selectedEn = btn.dataset.en;
      attemptMatch(d, body, ps);
    });
  });
  body.querySelectorAll("[data-uz]").forEach(btn => {
    btn.addEventListener("click", () => {
      ps.match.selectedUz = btn.dataset.uz;
      attemptMatch(d, body, ps);
    });
  });
}

function attemptMatch(d, body, ps){
  if (!ps.match.selectedEn || !ps.match.selectedUz){ renderPracticeTab(d, body); return; }
  const pair = ps.match.pairs.find(p => p[0] === ps.match.selectedEn);
  if (pair && pair[1] === ps.match.selectedUz){
    ps.match.matchedEn.push(ps.match.selectedEn);
    ps.match.selectedEn = null; ps.match.selectedUz = null; ps.match.wrong = false;
    renderPracticeTab(d, body);
    if (ps.match.matchedEn.length === ps.match.pairs.length) toast("Matching complete! Nice work.");
  } else {
    ps.match.wrong = true;
    renderPracticeTab(d, body);
    setTimeout(() => {
      ps.match.selectedEn = null; ps.match.selectedUz = null; ps.match.wrong = false;
      renderPracticeTab(d, body);
    }, 700);
  }
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

function buildQuizQuestions(d){
  const core = d.qz.map(q => q.slice());
  const pool = d.rev ? weekVocabPool(d.w) : d.v;
  const generated = generateVocabQuestions(pool, 8);
  return shuffle(core.concat(generated));
}

function renderQuizTab(d, body){
  const qs = loadJSON("tte_quizstate_v1", {});
  if (!state.quizState[d.d]) state.quizState[d.d] = qs[d.d] || {};
  const qState = state.quizState[d.d];
  if (!qState.questions || !qState.questions.length){
    qState.questions = buildQuizQuestions(d);
    qState.answers = {};
    qState.submitted = false;
  }
  const questions = qState.questions;

  body.innerHTML = `
    <p class="panel-sub">${questions.length} questions &middot; ${d.rev ? "cumulative review of this week's vocabulary, plus core comprehension" : "core comprehension plus auto-generated vocabulary practice"}. Answer all, then submit${d.rev?"":" to complete the day"}.</p>
    <form id="quizForm">
      ${questions.map((q,qi) => `
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
           <button type="button" class="btn btn-ghost" id="retakeBtn">Retake with a fresh set</button>`
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
      if (Object.keys(qState.answers).length < questions.length){
        toast("Please answer every question before submitting.");
        return;
      }
      let correct = 0;
      questions.forEach((q,qi) => { if (qState.answers[qi] === q[2]) correct++; });
      qState.score = Math.round((correct / questions.length) * 100);
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
      state.quizState[d.d] = { answers:{}, submitted:false, questions: buildQuizQuestions(d) };
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
        <button class="btn btn-accent" id="micBtn" ${!supported?"disabled":""}>${icon("mic",16)} <span class="mic-btn-label">${supported?"Start Radio Check":"Mic not supported in this browser"}</span></button>
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
      micBtn.innerHTML = `${icon("mic",16)} <span class="mic-btn-label">Listening…</span>`;
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
      rec.onend = () => { micBtn.innerHTML = `${icon("mic",16)} <span class="mic-btn-label">Start Radio Check</span>`; micBtn.disabled = false; };
      rec.start();
    });
  } else if (supported){
    const micBtn = document.getElementById("micBtn");
    const resultEl = document.getElementById("micResult");
    micBtn.addEventListener("click", () => {
      const rec = new SR();
      rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
      micBtn.innerHTML = `${icon("mic",16)} <span class="mic-btn-label">Listening…</span>`; micBtn.disabled = true;
      rec.onresult = (event) => {
        resultEl.innerHTML = `<p class="mic-heard">You said: &ldquo;${escapeHtml(event.results[0][0].transcript)}&rdquo;</p>`;
      };
      rec.onend = () => { micBtn.innerHTML = `${icon("mic",16)} <span class="mic-btn-label">Start Radio Check</span>`; micBtn.disabled = false; };
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


// ---------- Homework ----------
const HW_SESSION_SIZE = 20;
let HOMEWORK_SESSIONS_CACHE = null;
function homeworkSessions(){
  if (HOMEWORK_SESSIONS_CACHE) return HOMEWORK_SESSIONS_CACHE;
  if (!GLOSSARY_CACHE) GLOSSARY_CACHE = buildGlossary();
  const chunks = [];
  for (let i = 0; i < GLOSSARY_CACHE.length; i += HW_SESSION_SIZE) chunks.push(GLOSSARY_CACHE.slice(i, i + HW_SESSION_SIZE));
  HOMEWORK_SESSIONS_CACHE = chunks;
  return chunks;
}
function isHomeworkDone(n){ return !!state.progress.homeworkDone[n]; }
function homeworkDoneCount(){ return Object.keys(state.progress.homeworkDone).length; }
function markHomeworkComplete(n, score){
  const wasDone = isHomeworkDone(n);
  state.progress.homeworkDone[n] = { date: todayStr(), score: score };
  if (!wasDone) state.progress.xp += 80 + (score || 0) * 3;
  saveProgress();
}

function renderHomework(){
  const app = document.getElementById("app");
  const sessions = homeworkSessions();
  const done = homeworkDoneCount();
  const pct = Math.round((done / sessions.length) * 100);
  const totalWords = sessions.reduce((s,c) => s+c.length, 0);
  if (!state.hwExpanded) state.hwExpanded = {};

  app.innerHTML = `
    <section class="hero-strip">
      <div class="hero-left">
        <p class="eyebrow">HOMEWORK</p>
        <h1 class="hwy-title">Vocabulary Homework</h1>
        <p class="hero-sub">Every word from the 60-day course, split into ${sessions.length} sessions of ${HW_SESSION_SIZE} words each. Expand a session to study its words, then pass the quiz — that's the only way to mark it complete.</p>
      </div>
      <div class="hero-stats">
        <div class="stat-tile"><span class="stat-num">${done}<span class="stat-den">/${sessions.length}</span></span><span class="stat-label">Sessions complete</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Glossary — Study &amp; Quiz</h2>
        <p class="panel-sub">${totalWords} words total. Search to jump to a word, or expand any session below to study its 20 words.</p>
      </div>
      <input type="search" id="hwSearch" class="search-input" placeholder="Search a word, e.g. 'weigh station'..." value="${escapeHtml(state.hwSearchQuery||"")}">
      <div class="progressbar" id="hwProgressbar"><div class="progressbar-fill" style="width:${pct}%"></div></div>
      <div id="hwBody"></div>
    </section>
  `;

  const searchInput = document.getElementById("hwSearch");
  searchInput.addEventListener("input", (e) => {
    state.hwSearchQuery = e.target.value;
    drawHomeworkBody();
  });
  drawHomeworkBody();

  function drawHomeworkBody(){
    const bodyEl = document.getElementById("hwBody");
    const progressEl = document.getElementById("hwProgressbar");
    const query = (state.hwSearchQuery || "").trim().toLowerCase();

    if (query){
      progressEl.hidden = true;
      const matches = [];
      sessions.forEach((words, i) => {
        words.forEach(w => {
          if (w.en.toLowerCase().includes(query) || w.uz.toLowerCase().includes(query)) matches.push({ ...w, session: i });
        });
      });
      bodyEl.innerHTML = matches.length ? `
        <div class="gloss-list">
          ${matches.map(w => `
            <div class="gloss-item">
              <div class="gloss-main">
                <span class="gloss-en">${escapeHtml(w.en)}</span>
                <button class="speak-btn" data-speak="${escapeHtml(w.en)}" title="Listen">${icon("speaker",18)}</button>
              </div>
              ${state.settings.showUz ? `<span class="gloss-uz">${escapeHtml(w.uz)}</span>` : ""}
              <span class="gloss-ex">&ldquo;${escapeHtml(w.ex)}&rdquo;</span>
              <button class="gloss-daylink mono" data-jump="${w.session}">Session ${w.session+1}</button>
            </div>`).join("")}
        </div>` : `<p class="panel-sub">No words found.</p>`;
      bodyEl.querySelectorAll("[data-speak]").forEach(btn => btn.addEventListener("click", () => speak(btn.dataset.speak)));
      bodyEl.querySelectorAll("[data-jump]").forEach(btn => btn.addEventListener("click", () => {
        const target = Number(btn.dataset.jump);
        state.hwSearchQuery = "";
        state.hwExpanded[target] = true;
        setView("homework");
        const el = document.getElementById("hw-session-" + target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }));
      return;
    }

    progressEl.hidden = false;
    bodyEl.innerHTML = `
      <div class="accordion">
        ${sessions.map((words, i) => {
          const n = i + 1;
          const doneInfo = state.progress.homeworkDone[n];
          const expanded = !!state.hwExpanded[i];
          return `
          <div class="accordion-item${expanded?" open":""}" id="hw-session-${i}">
            <button class="accordion-header" data-toggle="${i}">
              <span class="accordion-title">
                <span class="accordion-num mono">Session ${n}</span>
                <span>${escapeHtml(words[0].en)} &ndash; ${escapeHtml(words[words.length-1].en)}</span>
              </span>
              <span class="accordion-right">
                ${doneInfo ? `<span class="grammar-card-badge">✓ ${doneInfo.score}%</span>` : `<span class="grammar-card-badge muted">${words.length} words</span>`}
                <span class="accordion-chevron">${icon("chevronRight",16)}</span>
              </span>
            </button>
            ${expanded ? `
            <div class="accordion-body">
              <div class="practice-header">
                <p class="panel-sub">${words.length} words in this session.</p>
                <button class="btn btn-ghost btn-sm" data-playsession="${i}">${icon("play",14)} Play all</button>
              </div>
              <div class="transcript">
                ${words.map(w => `
                  <div class="transcript-line" style="grid-template-columns:1fr 34px;">
                    <div class="line-text">
                      <p class="line-en">${escapeHtml(w.en)}</p>
                      ${state.settings.showUz ? `<p class="line-uz">${escapeHtml(w.uz)}</p>` : ""}
                      <p class="fib-uz" style="font-style:italic;">&ldquo;${escapeHtml(w.ex)}&rdquo;</p>
                    </div>
                    <button class="speak-btn" data-speak="${escapeHtml(w.en)}" title="Listen">${icon("speaker",18)}</button>
                  </div>`).join("")}
              </div>
              <button class="btn btn-accent" data-quiz="${i}" style="margin-top:14px;">${doneInfo ? "Retake the Quiz" : "Take the Quiz"}</button>
            </div>` : ""}
          </div>`;
        }).join("")}
      </div>
    `;

    bodyEl.querySelectorAll("[data-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.toggle);
        state.hwExpanded[i] = !state.hwExpanded[i];
        drawHomeworkBody();
      });
    });
    bodyEl.querySelectorAll("[data-speak]").forEach(btn => btn.addEventListener("click", (e) => { e.stopPropagation(); speak(btn.dataset.speak); }));
    bodyEl.querySelectorAll("[data-quiz]").forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setView("homeworkSession", { currentSession: Number(btn.dataset.quiz) });
    }));
    bodyEl.querySelectorAll("[data-playsession]").forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const words = sessions[Number(btn.dataset.playsession)];
      if (!ttsSupported()){ toast("Speech is not supported in this browser."); return; }
      speakQueue(words.map(w => w.en));
    }));
  }
}

function renderHomeworkSession(sessionIndex){
  const app = document.getElementById("app");
  const sessions = homeworkSessions();
  const words = sessions[sessionIndex];
  if (!words) { setView("homework"); return; }
  const n = sessionIndex + 1;
  const prevOk = sessionIndex > 0;
  const nextOk = sessionIndex < sessions.length - 1;
  const doneInfo = state.progress.homeworkDone[n];

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backToHomeworkBtn">&larr; Homework</button>
        <div class="lesson-pager">
          <button class="btn btn-ghost btn-sm" id="prevSessionBtn" ${!prevOk?"disabled":""}>&larr; Prev</button>
          <button class="btn btn-ghost btn-sm" id="nextSessionBtn" ${!nextOk?"disabled":""}>Next &rarr;</button>
        </div>
      </div>
      <p class="eyebrow">HOMEWORK &middot; SESSION ${n} OF ${sessions.length}</p>
      <h1 class="hwy-title">${words.length} Words to Learn</h1>
      <div class="lesson-badges">
        ${doneInfo ? `<span class="badge-complete">✓ Completed &middot; score ${doneInfo.score}%</span>` : `<span class="badge-time mono">${icon("clock",14)} Study, then quiz below</span>`}
      </div>
    </section>

    <section class="panel">
      <div class="practice-header">
        <p class="panel-sub">Read through all ${words.length} words, then scroll down for the quiz.</p>
        <button class="btn btn-accent btn-sm" id="playAllWordsBtn">${icon("play",14)} Play all words</button>
      </div>
      <div class="transcript">
        ${words.map(w => `
          <div class="transcript-line" style="grid-template-columns:1fr 34px;">
            <div class="line-text">
              <p class="line-en">${escapeHtml(w.en)}</p>
              ${state.settings.showUz ? `<p class="line-uz">${escapeHtml(w.uz)}</p>` : ""}
              <p class="fib-uz" style="font-style:italic;">&ldquo;${escapeHtml(w.ex)}&rdquo;</p>
            </div>
            <button class="speak-btn" data-speak="${escapeHtml(w.en)}" title="Listen">${icon("speaker",18)}</button>
          </div>`).join("")}
      </div>
    </section>

    <section class="panel" id="hwQuizPanel">
      <div class="panel-head"><h2>Quiz — Finish This to Complete the Homework</h2></div>
      <div id="hwQuizBody"></div>
    </section>
  `;

  document.getElementById("backToHomeworkBtn").addEventListener("click", () => setView("homework"));
  if (prevOk) document.getElementById("prevSessionBtn").addEventListener("click", () => setView("homeworkSession", { currentSession: sessionIndex - 1 }));
  if (nextOk) document.getElementById("nextSessionBtn").addEventListener("click", () => setView("homeworkSession", { currentSession: sessionIndex + 1 }));
  app.querySelectorAll("[data-speak]").forEach(btn => btn.addEventListener("click", () => speak(btn.dataset.speak)));
  document.getElementById("playAllWordsBtn").addEventListener("click", () => {
    if (!ttsSupported()){ toast("Speech is not supported in this browser."); return; }
    speakQueue(words.map(w => w.en));
  });

  renderHomeworkQuiz(sessionIndex, words);
}

function buildHomeworkQuiz(words){
  return shuffle(generateVocabQuestions(words.map(w => [w.en, w.uz]), words.length));
}

function renderHomeworkQuiz(sessionIndex, words){
  const n = sessionIndex + 1;
  const body = document.getElementById("hwQuizBody");
  const saved = loadJSON("tte_hwquiz_v1", {});
  if (!state.homeworkQuizState) state.homeworkQuizState = {};
  if (!state.homeworkQuizState[n]) state.homeworkQuizState[n] = saved[n] || {};
  const qState = state.homeworkQuizState[n];
  if (!qState.questions || !qState.questions.length){
    qState.questions = buildHomeworkQuiz(words);
    qState.answers = {};
    qState.submitted = false;
  }
  const questions = qState.questions;

  body.innerHTML = `
    <p class="panel-sub">${questions.length} questions — one for every word above. Answer all, then submit to complete this session.</p>
    <form id="hwQuizForm">
      ${questions.map((q,qi) => `
        <fieldset class="quiz-q">
          <legend>${qi+1}. ${escapeHtml(q[0])}</legend>
          <div class="quiz-opts">
            ${q[1].map((opt,oi) => `
              <label class="quiz-opt">
                <input type="radio" name="hq${qi}" value="${oi}" ${qState.answers[qi]===oi?"checked":""} ${qState.submitted?"disabled":""}>
                <span>${escapeHtml(opt)}</span>
              </label>`).join("")}
          </div>
          ${qState.submitted ? `<p class="quiz-feedback ${qState.answers[qi]===q[2]?"correct":"incorrect"}">${qState.answers[qi]===q[2]?"✓ Correct":"✗ Correct answer: " + escapeHtml(q[1][q[2]])}</p>` : ""}
        </fieldset>
      `).join("")}
      ${qState.submitted
        ? `<div class="quiz-result"><strong>Score: ${qState.score}%</strong> — ${qState.score>=70?"Great work! Homework complete.":"Homework complete — consider reviewing the words you missed."}</div>
           <button type="button" class="btn btn-ghost" id="hwRetakeBtn">Retake quiz</button>`
        : `<button type="submit" class="btn btn-accent">Submit and finish homework</button>`}
    </form>
  `;

  const form = document.getElementById("hwQuizForm");
  form.addEventListener("change", (e) => {
    if (e.target.name && e.target.name.startsWith("hq")){
      qState.answers[Number(e.target.name.slice(2))] = Number(e.target.value);
    }
  });
  if (!qState.submitted){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (Object.keys(qState.answers).length < questions.length){
        toast("Please answer every question before submitting.");
        return;
      }
      let correct = 0;
      questions.forEach((q,qi) => { if (qState.answers[qi] === q[2]) correct++; });
      qState.score = Math.round((correct / questions.length) * 100);
      qState.submitted = true;
      persistHomeworkQuizState();
      markHomeworkComplete(n, qState.score);
      toast("Session " + n + " homework complete! +XP earned.");
      render();
    });
  } else {
    const retake = document.getElementById("hwRetakeBtn");
    if (retake) retake.addEventListener("click", () => {
      state.homeworkQuizState[n] = { answers:{}, submitted:false, questions: buildHomeworkQuiz(words) };
      persistHomeworkQuizState();
      renderHomeworkQuiz(sessionIndex, words);
    });
  }
}

function persistHomeworkQuizState(){
  saveJSON("tte_hwquiz_v1", state.homeworkQuizState || {});
}

// ---------- Grammar Book ----------
function grammarCategories(){ return [...new Set(GRAMMAR.map(u => u.cat))]; }
function categoryProgress(cat){
  const units = GRAMMAR.filter(u => u.cat === cat);
  const done = units.filter(u => isGrammarDone(u.id)).length;
  return { done, total: units.length };
}

function renderGrammarBook(){
  const app = document.getElementById("app");
  const cats = grammarCategories();
  const done = grammarDoneCount();

  app.innerHTML = `
    <section class="hero-strip">
      <div class="hero-left">
        <p class="eyebrow">GRAMMAR BOOK</p>
        <h1 class="hwy-title">English Grammar for the Road</h1>
        <p class="hero-sub">${GRAMMAR.length} units built specifically for Uzbek speakers, grouped into ${cats.length} topics — each one calls out exactly where English and Uzbek grammar pull in different directions. Browse in any order, any time — nothing here is locked.</p>
      </div>
      <div class="hero-stats">
        <div class="stat-tile"><span class="stat-num">${done}<span class="stat-den">/${GRAMMAR.length}</span></span><span class="stat-label">Units complete</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Topics</h2></div>
      <div class="week-grid">
        ${cats.map(cat => {
          const cp = categoryProgress(cat);
          const pct = Math.round((cp.done/cp.total)*100);
          return `<button class="week-card" data-cat="${escapeHtml(cat)}">
            <span class="week-num">${cp.total} UNIT${cp.total===1?"":"S"}</span>
            <span class="week-title">${escapeHtml(cat)}</span>
            <span class="week-bar"><span style="width:${pct}%"></span></span>
            <span class="week-count mono">${cp.done}/${cp.total} complete</span>
          </button>`;
        }).join("")}
      </div>
    </section>
  `;

  app.querySelectorAll("[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => setView("grammarCategory", { currentCategory: btn.dataset.cat }));
  });
}

function renderGrammarCategory(cat){
  const app = document.getElementById("app");
  const units = GRAMMAR.filter(u => u.cat === cat);
  if (!units.length) { setView("grammar"); return; }
  const cp = categoryProgress(cat);

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backToGrammarBtn">&larr; Grammar Book</button>
      </div>
      <p class="eyebrow">GRAMMAR BOOK</p>
      <h1 class="hwy-title">${escapeHtml(cat)}</h1>
      <p class="hero-sub">${cp.total} unit${cp.total===1?"":"s"} in this topic &middot; ${cp.done} complete.</p>
    </section>
    <section class="panel">
      <div class="grammar-grid">
        ${units.map(u => `
          <button class="grammar-card${isGrammarDone(u.id)?" done":""}" data-unit="${u.id}">
            <span class="grammar-card-title">${escapeHtml(u.title)}</span>
            <span class="grammar-card-uz">${escapeHtml(u.titleUz)}</span>
            ${isGrammarDone(u.id) ? `<span class="grammar-card-badge">✓ Complete · ${state.progress.grammarDone[u.id].score}%</span>` : `<span class="grammar-card-badge muted">Not started</span>`}
          </button>
        `).join("")}
      </div>
    </section>
  `;

  document.getElementById("backToGrammarBtn").addEventListener("click", () => setView("grammar"));
  app.querySelectorAll("[data-unit]").forEach(btn => {
    btn.addEventListener("click", () => setView("grammarUnit", { currentUnit: btn.dataset.unit, currentCategory: cat }));
  });
}

function renderGrammarUnit(unitId){
  const u = grammarUnitById(unitId);
  const app = document.getElementById("app");
  if (!u) { setView("grammar"); return; }
  const catUnits = GRAMMAR.filter(x => x.cat === u.cat);
  const idx = catUnits.findIndex(x => x.id === unitId);
  const prev = catUnits[idx - 1];
  const next = catUnits[idx + 1];

  app.innerHTML = `
    <section class="lesson-head">
      <div class="lesson-head-top">
        <button class="btn btn-ghost btn-sm" id="backToGrammarBtn">&larr; ${escapeHtml(u.cat)}</button>
        <div class="lesson-pager">
          <button class="btn btn-ghost btn-sm" id="prevUnitBtn" ${!prev?"disabled":""}>&larr; Prev</button>
          <button class="btn btn-ghost btn-sm" id="nextUnitBtn" ${!next?"disabled":""}>Next &rarr;</button>
        </div>
      </div>
      <p class="eyebrow">${escapeHtml(u.cat).toUpperCase()}</p>
      <h1 class="hwy-title">${escapeHtml(u.title)}</h1>
      ${state.settings.showUz ? `<p class="lesson-title-uz">${escapeHtml(u.titleUz)}</p>` : ""}
      ${state.settings.showUz ? `<p class="grammar-rule-uz">${escapeHtml(u.ruleUz)}</p>` : ""}
      ${isGrammarDone(u.id) ? `<div class="lesson-badges"><span class="badge-complete">✓ Completed &middot; score ${state.progress.grammarDone[u.id].score}%</span></div>` : ""}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Explanation</h2></div>
      ${u.explain.map(p => `<p class="grammar-explain">${escapeHtml(p)}</p>`).join("")}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Examples</h2></div>
      <div class="transcript">
        ${u.examples.map(([en,uz]) => `
          <div class="transcript-line" style="grid-template-columns:1fr 34px;">
            <div class="line-text">
              <p class="line-en">${escapeHtml(en)}</p>
              ${state.settings.showUz ? `<p class="line-uz">${escapeHtml(uz)}</p>` : ""}
            </div>
            <button class="speak-btn" data-speak="${escapeHtml(en)}" title="Listen">${icon("speaker",18)}</button>
          </div>`).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Common Mistake for Uzbek Speakers</h2></div>
      <div class="mistake-box">
        <p class="mistake-line wrong">✗ ${escapeHtml(u.mistakeWrong)}</p>
        <p class="mistake-line right">✓ ${escapeHtml(u.mistakeRight)}</p>
        <p class="mistake-why">${escapeHtml(u.mistakeWhy)}</p>
      </div>
    </section>

    <section class="panel" id="grammarQuizPanel">
      <div class="panel-head"><h2>Quiz</h2></div>
      <div id="grammarQuizBody"></div>
    </section>
  `;

  document.getElementById("backToGrammarBtn").addEventListener("click", () => setView("grammarCategory", { currentCategory: u.cat }));
  if (prev) document.getElementById("prevUnitBtn").addEventListener("click", () => setView("grammarUnit", { currentUnit: prev.id, currentCategory: u.cat }));
  if (next) document.getElementById("nextUnitBtn").addEventListener("click", () => setView("grammarUnit", { currentUnit: next.id, currentCategory: u.cat }));
  app.querySelectorAll("[data-speak]").forEach(btn => btn.addEventListener("click", () => speak(btn.dataset.speak)));

  renderGrammarQuiz(u);
}

function renderGrammarQuiz(u){
  const body = document.getElementById("grammarQuizBody");
  const saved = loadJSON("tte_grammarquiz_v1", {});
  if (!state.grammarQuizState[u.id]) state.grammarQuizState[u.id] = saved[u.id] || { answers:{}, submitted:false };
  const qState = state.grammarQuizState[u.id];

  body.innerHTML = `
    <form id="grammarQuizForm">
      ${u.quiz.map((q,qi) => `
        <fieldset class="quiz-q">
          <legend>${qi+1}. ${escapeHtml(q[0])}</legend>
          <div class="quiz-opts">
            ${q[1].map((opt,oi) => `
              <label class="quiz-opt">
                <input type="radio" name="gq${qi}" value="${oi}" ${qState.answers[qi]===oi?"checked":""} ${qState.submitted?"disabled":""}>
                <span>${escapeHtml(opt)}</span>
              </label>`).join("")}
          </div>
          ${qState.submitted ? `<p class="quiz-feedback ${qState.answers[qi]===q[2]?"correct":"incorrect"}">${qState.answers[qi]===q[2]?"✓ Correct":"✗ Correct answer: " + escapeHtml(q[1][q[2]])}</p>` : ""}
        </fieldset>
      `).join("")}
      ${qState.submitted
        ? `<div class="quiz-result"><strong>Score: ${qState.score}%</strong> — ${qState.score>=70?"Great work!":"Review the explanation above and try again."}</div>
           <button type="button" class="btn btn-ghost" id="grammarRetakeBtn">Retake quiz</button>`
        : `<button type="submit" class="btn btn-accent">Submit answers</button>`}
    </form>
  `;

  const form = document.getElementById("grammarQuizForm");
  form.addEventListener("change", (e) => {
    if (e.target.name && e.target.name.startsWith("gq")){
      qState.answers[Number(e.target.name.slice(2))] = Number(e.target.value);
    }
  });
  if (!qState.submitted){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (Object.keys(qState.answers).length < u.quiz.length){
        toast("Please answer every question before submitting.");
        return;
      }
      let correct = 0;
      u.quiz.forEach((q,qi) => { if (qState.answers[qi] === q[2]) correct++; });
      qState.score = Math.round((correct / u.quiz.length) * 100);
      qState.submitted = true;
      persistGrammarQuizState();
      markGrammarComplete(u.id, qState.score);
      toast(qState.score>=70 ? "Unit complete! +XP earned." : "Unit complete. Consider reviewing the explanation again.");
      render();
    });
  } else {
    const retake = document.getElementById("grammarRetakeBtn");
    if (retake) retake.addEventListener("click", () => {
      state.grammarQuizState[u.id] = { answers:{}, submitted:false };
      persistGrammarQuizState();
      renderGrammarQuiz(u);
    });
  }
}

function persistGrammarQuizState(){
  const flat = {};
  Object.keys(state.grammarQuizState).forEach(k => { flat[k] = state.grammarQuizState[k]; });
  saveJSON("tte_grammarquiz_v1", flat);
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
      ${certReady ? `<div class="cert-callout">${icon("trophy",22)}<p>You completed the Final Road Test!</p><button class="btn btn-accent" id="certBtn">View / Print Certificate</button></div>` : `<p class="panel-sub">Complete Day 60 (the Final Road Test) to unlock your certificate.</p>`}
    </section>
    <section class="panel">
      <div class="panel-head">
        <h2>Grammar Book</h2>
        <p class="panel-sub">${grammarDoneCount()} of ${GRAMMAR.length} units complete.</p>
      </div>
      <div class="progressbar"><div class="progressbar-fill" style="width:${Math.round((grammarDoneCount()/GRAMMAR.length)*100)}%"></div></div>
      <button class="btn btn-ghost btn-sm" id="openGrammarBtn">${icon("grammar",14)} Open Grammar Book</button>
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
  document.getElementById("openGrammarBtn").addEventListener("click", () => setView("grammar"));
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
  const current = bestVoice();
  const voiceOptions = voices.map(v => {
    const isAuto = v.voiceURI === autoVoiceURI;
    return `<option value="${v.voiceURI}" ${current && current.voiceURI===v.voiceURI?"selected":""}>${escapeHtml(v.name)} (${v.lang})${isAuto?" — recommended":""}</option>`;
  }).join("");
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
          <h3>Appearance</h3>
          <p class="panel-sub">Navy light or dark. “Auto” follows your phone's setting.</p>
        </div>
        <div class="seg" id="themeSeg" role="group" aria-label="Appearance">
          ${[["system","Auto"],["light","Light"],["dark","Dark"]].map(([v,l]) => `<button data-theme-opt="${v}" class="${(state.settings.theme||"system")===v?"active":""}">${l}</button>`).join("")}
        </div>
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
          <p class="panel-sub">
            We auto-select the best voice already installed on your device — these play instantly. Network-based "online" voices sound slightly smoother but noticeably lag on every tap, so we skip them by default; pick one yourself below if you'd rather have that trade-off.
            ${current && (current.name||"").toLowerCase().includes("siri") ? `<br><strong>Using your device's Siri voice</strong> — the same neural voice quality as Apple's assistant.` : `<br>Apple devices ship a Siri voice we'll pick up automatically if you install one: Settings &rarr; Accessibility &rarr; Spoken Content &rarr; Voices &rarr; English. A true "Alexa" voice can't be used here — Amazon doesn't expose it to websites — Siri (on Apple devices) or a "Natural"/"Neural" voice (Windows, Android) are the closest a browser can get.`}
          </p>
        </div>
        <select id="voiceSelect" class="select">${voiceOptions}</select>
      </div>` : `<div class="setting-row"><div><h3>Voice</h3><p class="panel-sub">No voices detected yet — try switching to the Vocabulary tab to trigger a speech request, or use Chrome/Edge for the best voice selection.</p></div></div>`}

      <div class="setting-row">
        <div>
          <h3>Your name</h3>
          <p class="panel-sub">Used on the dashboard and your certificate.</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="editNameBtn2">${state.progress.name ? escapeHtml(state.progress.name) : "Set name"}</button>
      </div>
    </section>

    ${window.TTE_user ? `<section class="panel">
      <div class="panel-head"><h2>Account</h2></div>
      <div class="setting-row">
        <div>
          <h3>${escapeHtml(window.TTE_user.name || "")}${window.TTE_user.role && window.TTE_user.role !== "student" ? ` <span class="badge-admin">${escapeHtml(window.TTE_user.role.toUpperCase())}</span>` : ""}</h3>
          <p class="panel-sub">Signed in as ${escapeHtml(window.TTE_user.email || "")}</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="signOutBtn">Sign out</button>
      </div>
      ${window.TTE_adminUrl ? `<div class="setting-row">
        <div>
          <h3>Admin dashboard</h3>
          <p class="panel-sub">Manage users, students, progress, and calendars.</p>
        </div>
        <a class="btn btn-ghost btn-sm" href="${escapeHtml(window.TTE_adminUrl)}" target="_blank" rel="noopener">Open admin dashboard</a>
      </div>` : ""}
    </section>` : ""}

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
  document.querySelectorAll("[data-theme-opt]").forEach(b => b.addEventListener("click", () => {
    state.settings.theme = b.dataset.themeOpt; saveSettings(); applyTheme(state.settings.theme); render();
  }));
  document.getElementById("rateRange").addEventListener("input", (e) => { state.settings.rate = Number(e.target.value); saveSettings(); });
  document.getElementById("rateRange").addEventListener("change", () => speak("This is your new speaking speed."));
  const vs = document.getElementById("voiceSelect");
  if (vs) vs.addEventListener("change", (e) => { state.settings.voiceURI = e.target.value; saveSettings(); speak("This is the selected voice."); });
  document.getElementById("editNameBtn2").addEventListener("click", promptName);
  const signOutBtn = document.getElementById("signOutBtn");
  if (signOutBtn) signOutBtn.addEventListener("click", () => { if (window.TTE_signOut) window.TTE_signOut(); });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (window.confirm("Are you sure? This will erase all your progress on this device.")){
      state.progress = { completed:{}, grammarDone:{}, homeworkDone:{}, roleplay:{}, xp:0, streak:0, lastDate:null, name:"" };
      state.notes = {};
      state.quizState = {};
      state.grammarQuizState = {};
      state.homeworkQuizState = {};
      saveProgress(); saveNotes(); saveJSON("tte_quizstate_v1", {}); saveJSON("tte_grammarquiz_v1", {}); saveJSON("tte_hwquiz_v1", {});
      toast("Progress reset.");
      setView("dashboard");
    }
  });
}

// ---------- Init ----------
function init(){
  applyTheme(state.settings.theme);
  setView("dashboard");
  setTimeout(loadVoices, 300);
}

// Mounted by shared/auth-gate.js once the signed-in user is approved as a student.
window.TTE_mount = init;
window.TTE_refresh = renderNav;

})();
