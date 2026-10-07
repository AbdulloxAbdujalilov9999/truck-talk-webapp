/* Truck Talk Teachers — lesson guidebook + live, Kahoot-style classroom
 * sessions, built for owners/managers/teachers to hold a lesson from a
 * shared screen while drivers answer quiz questions live on their phones.
 *
 * Separate app from the course (index.html) and the admin dashboard
 * (admin/), sharing only the Firebase project, curriculum.js/grammar.js
 * content, and shared/ (auth gate, tokens, theme) — gated the same way the
 * admin dashboard is (owner/manager/teacher only, see shared/auth-gate.js's
 * "teachers" appKind).
 */
import { initAuthGate } from "../shared/auth-gate.js";
import { findSource, buildSlides, slideLabel } from "./slides.js";
import * as Live from "./live.js";

function $(id){ return document.getElementById(id); }
function escapeHtml(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function me(){ return window.TTE_user; }
const ROLE_LABEL = { owner: "Owner", manager: "Manager", teacher: "Teacher" };

let toastTimer = null;
function toast(msg){
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------------- Icons ---------------- */
function icon(name, size){
  const paths = {
    chevron: '<path d="M9 6l6 6-6 6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    play: '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
    users: '<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.5"/><path d="M20 20v-1.2a3.2 3.2 0 0 0-2.4-3.1"/><path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1.2-5.5a8.38 8.38 0 0 1-1-4A8.5 8.5 0 0 1 12 2a8.38 8.38 0 0 1 9 8.5z"/>',
    grammar: '<path d="M4 6h16M4 12h10M4 18h13"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.6-1.4c0 1.9-2.6 1.9-2.6 4"/><path d="M12 16.5h.01"/>',
    mic: '<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5a3 3 0 0 0 3 4"/><path d="M16 5h3a3 3 0 0 1-3 4"/><path d="M10 14v2h4v-2"/><path d="M8 20h8"/><path d="M12 16v4"/>',
  };
  return `<svg width="${size||18}" height="${size||18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
}

/* ---------------- Text to speech ---------------- */
function speak(text){
  if (!window.speechSynthesis) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }catch(e){ /* speech synthesis is a nicety, never worth surfacing an error for */ }
}

/* ---------------- State ---------------- */
let state = {
  mode: "library",           // "library" | "stage"
  libTab: "curriculum",      // "curriculum" | "grammar"
  selected: null,            // { kind:"day"|"grammar", ref }
  openGroups: new Set(["w1"]),
  // stage:
  code: null,
  room: null,
  slides: [],
  unsubRoom: null,
  tickTimer: null,
  autoRevealedFor: null,     // `${code}:${slideIndex}` once auto-reveal has fired, to avoid double-firing
};

const RESUME_KEY = "tt_teacher_room";

/* ---------------- Shell ---------------- */
function renderShell(){
  const shell = $("appShell");
  shell.innerHTML = `
    <div class="t-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">
            <img class="brand-logo" src="../icons/icon-192.png" alt="" width="34" height="34">
            <div class="brand-text">
              <span class="brand-mark">TRUCK TALK</span>
              <span class="brand-sub">TEACHERS</span>
            </div>
          </div>
          <div class="topbar-user">
            <span class="admin-user-name">${escapeHtml(me().name || me().email)}</span>
            <span class="admin-role-pill">${escapeHtml(ROLE_LABEL[me().role] || me().role)}</span>
            <button class="btn btn-ghost btn-sm" id="teacherSignOut">Sign out</button>
          </div>
        </div>
      </header>
      <main id="teacherApp" class="t-content"></main>
    </div>`;
  $("teacherSignOut").addEventListener("click", () => window.TTE_signOut && window.TTE_signOut());
  renderApp();
}

function renderApp(){
  const main = $("teacherApp");
  if (!main) return;
  if (state.mode === "stage" && state.room) renderStage(main);
  else renderLibrary(main);
}

/* ---------------- Library tree data ---------------- */
function curriculumWeeks(){
  const weeks = [];
  const byWeek = new Map();
  (typeof CURRICULUM !== "undefined" ? CURRICULUM : []).forEach((d) => {
    if (!byWeek.has(d.w)) { const w = { w: d.w, wt: d.wt, days: [] }; byWeek.set(d.w, w); weeks.push(w); }
    byWeek.get(d.w).days.push(d);
  });
  return weeks;
}
function grammarCats(){
  const cats = [];
  const byCat = new Map();
  (typeof GRAMMAR !== "undefined" ? GRAMMAR : []).forEach((u) => {
    if (!byCat.has(u.cat)) { const c = { cat: u.cat, units: [] }; byCat.set(u.cat, c); cats.push(c); }
    byCat.get(u.cat).units.push(u);
  });
  return cats;
}

/* ---------------- Library view ---------------- */
function renderLibrary(main){
  const resumable = getResumableRoom();
  main.innerHTML = `
    ${resumable ? `<div class="resume-banner">
      <div><strong>You have a live class in progress</strong> — room <span class="mono">${escapeHtml(resumable.code)}</span>.</div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-accent btn-sm" id="resumeBtn">Resume hosting</button>
        <button class="btn btn-ghost btn-sm" id="dismissResumeBtn">Dismiss</button>
      </div>
    </div>` : ""}
    <div class="lib-layout">
      <aside class="lib-sidebar panel">
        <div class="lib-tabs">
          <button data-tab="curriculum" class="${state.libTab === "curriculum" ? "active" : ""}">60-Day Curriculum</button>
          <button data-tab="grammar" class="${state.libTab === "grammar" ? "active" : ""}">Grammar Book</button>
        </div>
        <div id="libTree"></div>
      </aside>
      <section class="lib-detail panel" id="libDetail"></section>
    </div>`;

  main.querySelectorAll(".lib-tabs [data-tab]").forEach(btn => {
    btn.addEventListener("click", () => { state.libTab = btn.dataset.tab; renderApp(); });
  });
  if (resumable){
    $("resumeBtn").addEventListener("click", () => resumeHosting(resumable.code));
    $("dismissResumeBtn").addEventListener("click", () => { localStorage.removeItem(RESUME_KEY); renderApp(); });
  }
  renderLibTree();
  renderLibDetail();
}

function renderLibTree(){
  const tree = $("libTree");
  if (!tree) return;
  if (state.libTab === "curriculum"){
    tree.innerHTML = curriculumWeeks().map((wk) => {
      const groupId = "w" + wk.w;
      const open = state.openGroups.has(groupId);
      return `
        <div class="lib-group ${open ? "open" : ""}" data-group="${groupId}">
          <button class="lib-group-head" data-toggle="${groupId}">
            <span>Week ${wk.w} — ${escapeHtml(wk.wt)}</span>
            ${icon("chevron", 16)}
          </button>
          <div class="lib-group-items">
            ${wk.days.map(d => `
              <button class="lib-item ${state.selected && state.selected.kind === "day" && state.selected.ref === d.d ? "active" : ""}" data-kind="day" data-ref="${d.d}">
                <span class="lib-item-num">D${d.d}</span>
                <span>${escapeHtml(d.t)}</span>
                ${d.rev ? `<span class="lib-item-rev">Review</span>` : ""}
              </button>`).join("")}
          </div>
        </div>`;
    }).join("");
  } else {
    tree.innerHTML = grammarCats().map((c) => {
      const groupId = "c" + c.cat.replace(/\s+/g, "_");
      const open = state.openGroups.has(groupId);
      return `
        <div class="lib-group ${open ? "open" : ""}" data-group="${groupId}">
          <button class="lib-group-head" data-toggle="${groupId}">
            <span>${escapeHtml(c.cat)}</span>
            ${icon("chevron", 16)}
          </button>
          <div class="lib-group-items">
            ${c.units.map(u => `
              <button class="lib-item ${state.selected && state.selected.kind === "grammar" && state.selected.ref === u.id ? "active" : ""}" data-kind="grammar" data-ref="${escapeHtml(u.id)}">
                <span>${escapeHtml(u.title)}</span>
              </button>`).join("")}
          </div>
        </div>`;
    }).join("");
  }
  tree.querySelectorAll("[data-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.toggle;
      if (state.openGroups.has(id)) state.openGroups.delete(id); else state.openGroups.add(id);
      renderLibTree();
    });
  });
  tree.querySelectorAll(".lib-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.kind;
      const ref = kind === "day" ? Number(btn.dataset.ref) : btn.dataset.ref;
      state.selected = { kind, ref };
      renderLibTree();
      renderLibDetail();
    });
  });
}

function renderLibDetail(){
  const el = $("libDetail");
  if (!el) return;
  if (!state.selected){
    el.innerHTML = `<div class="lib-detail-empty">${icon("book", 40)}<p>Pick a day or a grammar unit from the left to see the full teaching guide.</p></div>`;
    return;
  }
  el.innerHTML = state.selected.kind === "day" ? dayDetailHtml(state.selected.ref) : grammarDetailHtml(state.selected.ref);
  const startBtn = $("startLiveBtn");
  if (startBtn) startBtn.addEventListener("click", () => startLiveClass(state.selected));
  el.querySelectorAll("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.dataset.speak));
  });
}

function dayDetailHtml(dayNum){
  const day = (typeof CURRICULUM !== "undefined" ? CURRICULUM : []).find(d => d.d === dayNum);
  if (!day) return `<p class="panel-sub">Lesson not found.</p>`;
  return `
    <div class="lesson-head">
      <div>
        <div class="lesson-eyebrow">Week ${day.w} &middot; Day ${day.d}${day.rev ? " &middot; Review" : ""}</div>
        <h1 class="lesson-title">${escapeHtml(day.t)}</h1>
        <div class="lesson-title-uz">${escapeHtml(day.tu)}</div>
      </div>
      <button class="btn btn-accent btn-lg" id="startLiveBtn">${icon("users", 20)} Start Live Class</button>
    </div>
    ${day.v && day.v.length ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("chat")} Vocabulary (${day.v.length} words)</h2>
        <div class="vocab-grid">
          ${day.v.map(([en, uz, ex]) => `
            <div class="vocab-card">
              <div class="vocab-en"><button class="play-btn" data-speak="${escapeHtml(en)}" title="Play pronunciation">${icon("play", 14)}</button>${escapeHtml(en)}</div>
              <div class="vocab-uz">${escapeHtml(uz)}</div>
              ${ex ? `<div class="vocab-ex">${escapeHtml(ex)}</div>` : ""}
            </div>`).join("")}
        </div>
      </div>` : ""}
    ${day.dl && day.dl.length ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("chat")} Dialogue Script</h2>
        <div>${day.dl.map(([speaker, en, uz]) => `
          <div class="dl-line">
            <div class="dl-speaker">${escapeHtml(speaker)}</div>
            <div class="dl-text">${escapeHtml(en)}<div class="dl-uz">${escapeHtml(uz)}</div></div>
          </div>`).join("")}</div>
      </div>` : ""}
    ${day.g ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("grammar")} Grammar Tip</h2>
        <div class="grammar-box"><h3>${escapeHtml(day.g[0])}</h3><p>${escapeHtml(day.g[1])}</p></div>
      </div>` : ""}
    ${day.qz && day.qz.length ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("quiz")} Quiz — Answer Key</h2>
        ${day.qz.map((q, i) => quizItemHtml(q, i)).join("")}
      </div>` : ""}
    ${day.sp ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("mic")} Speaking Prompt</h2>
        <div class="grammar-box"><p>${escapeHtml(day.sp[0])}</p><p class="panel-sub" style="margin-top:6px;">${escapeHtml(day.sp[1])}</p></div>
      </div>` : ""}
  `;
}

function grammarDetailHtml(unitId){
  const unit = (typeof GRAMMAR !== "undefined" ? GRAMMAR : []).find(u => u.id === unitId);
  if (!unit) return `<p class="panel-sub">Unit not found.</p>`;
  return `
    <div class="lesson-head">
      <div>
        <div class="lesson-eyebrow">Grammar Book &middot; ${escapeHtml(unit.cat)}</div>
        <h1 class="lesson-title">${escapeHtml(unit.title)}</h1>
        <div class="lesson-title-uz">${escapeHtml(unit.titleUz)}</div>
      </div>
      <button class="btn btn-accent btn-lg" id="startLiveBtn">${icon("users", 20)} Start Live Class</button>
    </div>
    ${unit.teach && unit.teach.length ? `
      <div class="t-section">
        <div class="teach-box">
          <h3>Teacher notes</h3>
          ${unit.teach.map(p => `<p class="teach-line">${escapeHtml(p)}</p>`).join("")}
        </div>
      </div>` : ""}
    <div class="t-section">
      <h2 class="t-section-title">${icon("grammar")} Rule</h2>
      <div class="grammar-box"><p>${escapeHtml(unit.ruleUz)}</p></div>
    </div>
    ${unit.explain && unit.explain.length ? `
      <div class="t-section">
        <h2 class="t-section-title">Explanation</h2>
        ${unit.explain.map(p => `<p style="margin:0 0 12px;">${escapeHtml(p)}</p>`).join("")}
      </div>` : ""}
    ${unit.examples && unit.examples.length ? `
      <div class="t-section">
        <h2 class="t-section-title">Examples</h2>
        <ul class="examples-list">
          ${unit.examples.map(([en, uz]) => `<li><button class="play-btn" data-speak="${escapeHtml(en)}" title="Play">${icon("play", 14)}</button> ${escapeHtml(en)}<div class="ex-uz">${escapeHtml(uz)}</div></li>`).join("")}
        </ul>
      </div>` : ""}
    ${unit.mistakeWrong ? `
      <div class="t-section">
        <h2 class="t-section-title">Common Mistake</h2>
        <div class="mistake-grid">
          <div class="mistake-card mistake-wrong"><div class="mistake-label">Wrong</div>${escapeHtml(unit.mistakeWrong)}</div>
          <div class="mistake-card mistake-right"><div class="mistake-label">Right</div>${escapeHtml(unit.mistakeRight)}</div>
        </div>
        ${unit.mistakeWhy ? `<p class="mistake-why">${escapeHtml(unit.mistakeWhy)}</p>` : ""}
      </div>` : ""}
    ${unit.quiz && unit.quiz.length ? `
      <div class="t-section">
        <h2 class="t-section-title">${icon("quiz")} Quiz — Answer Key</h2>
        ${unit.quiz.map((q, i) => quizItemHtml(q, i)).join("")}
      </div>` : ""}
  `;
}

function quizItemHtml(q, i){
  const [question, choices, correct] = q;
  return `
    <div class="qz-item">
      <div class="qz-q">${i + 1}. ${escapeHtml(question)}</div>
      ${choices.map((c, ci) => `<div class="qz-choice ${ci === correct ? "correct" : ""}">${ci === correct ? "&#10003;" : "&middot;"} ${escapeHtml(c)}</div>`).join("")}
    </div>`;
}

/* ---------------- Starting / resuming a live class ---------------- */
function getResumableRoom(){
  try{
    const raw = localStorage.getItem(RESUME_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.code || data.hostUid !== me().uid) return null;
    return data;
  }catch(e){ return null; }
}

async function startLiveClass(selected){
  const source = findSource(selected.kind, selected.ref);
  if (!source){ toast("Couldn't find that lesson."); return; }
  try{
    const code = await Live.createRoom(me().uid, me().name, source);
    localStorage.setItem(RESUME_KEY, JSON.stringify({ code, hostUid: me().uid }));
    enterStage(code);
  }catch(err){
    toast(err.message || "Couldn't start the class — please try again.");
  }
}

function resumeHosting(code){ enterStage(code); }

function enterStage(code){
  state.mode = "stage";
  state.code = code;
  state.room = null;
  state.slides = [];
  if (state.unsubRoom) state.unsubRoom();
  state.unsubRoom = Live.subscribeRoom(code, (room) => {
    if (!room){
      toast("This class room no longer exists.");
      exitStage();
      return;
    }
    state.room = room;
    state.slides = buildSlides(room.source);
    renderApp();
  });
  renderApp();
}

function exitStage(){
  if (state.unsubRoom) { state.unsubRoom(); state.unsubRoom = null; }
  clearTickTimer();
  localStorage.removeItem(RESUME_KEY);
  state.mode = "library";
  state.code = null;
  state.room = null;
  state.slides = [];
  renderApp();
}

function clearTickTimer(){
  if (state.tickTimer){ clearInterval(state.tickTimer); state.tickTimer = null; }
}

/* ---------------- Stage (host) ---------------- */
function renderStage(main){
  const room = state.room;
  const slides = state.slides;
  const idx = Math.min(room.cursor.slideIndex || 0, Math.max(0, slides.length - 1));
  const slide = slides[idx];
  const participantCount = Object.keys(room.participants || {}).length;
  const ended = room.status === "ended";

  main.innerHTML = `
    <div class="stage-shell">
      <div class="stage-bar">
        <div class="stage-code-wrap">
          <div>
            <div class="stage-code-label">Room code</div>
            <div class="stage-code">${escapeHtml(room.code)}</div>
          </div>
        </div>
        <div class="stage-meta">
          <span class="stage-meta-item">${icon("users", 16)} <strong>${participantCount}</strong>&nbsp;joined</span>
          <span class="stage-meta-item">Slide <strong>${idx + 1}</strong> / ${slides.length} &middot; ${escapeHtml(slide ? slideLabel(slide) : "")}</span>
          ${ended ? `<span class="lesson-badge">Class ended</span>` : ""}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" id="stageBackBtn">Back to guidebook</button>
          ${!ended ? `<button class="btn btn-danger btn-sm" id="stageEndBtn">End class</button>` : ""}
        </div>
      </div>

      <div class="stage-slide" id="stageSlide"></div>

      <div class="stage-controls">
        <div class="stage-controls-side">
          <button class="btn btn-ghost" id="stagePrev" ${idx === 0 ? "disabled" : ""}>${icon("chevron", 16)} Prev</button>
        </div>
        <div class="stage-controls-side" id="stageQuizControls"></div>
        <div class="stage-controls-side">
          <button class="btn btn-accent" id="stageNext" ${idx >= slides.length - 1 ? "disabled" : ""}>Next ${icon("chevron", 16)}</button>
        </div>
      </div>

      <div class="join-hint">Join this class at <strong>${escapeHtml(joinUrl())}</strong> — room code <strong>${escapeHtml(room.code)}</strong></div>
    </div>`;

  renderStageSlide(slide, room, idx);

  $("stageBackBtn").addEventListener("click", exitStage);
  const endBtn = $("stageEndBtn");
  if (endBtn) endBtn.addEventListener("click", async () => { await Live.hostEndClass(state.code); toast("Class ended."); });
  $("stagePrev").addEventListener("click", () => goToSlide(idx - 1));
  $("stageNext").addEventListener("click", () => goToSlide(idx + 1));
}

function joinUrl(){
  return new URL("join.html", window.location.href).toString().replace(/^https?:\/\//, "");
}

async function goToSlide(newIndex){
  clearTickTimer();
  await Live.hostSetCursor(state.code, { slideIndex: newIndex, quizOpenedAt: null, quizDurationMs: 20000, revealed: false });
}

function renderStageSlide(slide, room, idx){
  const holder = $("stageSlide");
  const controls = $("stageQuizControls");
  if (!slide){ holder.innerHTML = `<p class="panel-sub" style="text-align:center;">No content.</p>`; controls.innerHTML = ""; return; }

  if (slide.type === "dayTitle"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Week ${slide.day.w} &middot; Day ${slide.day.d}</div>
      <h1 class="slide-title">${escapeHtml(slide.day.t)}</h1>
      <div class="slide-title-uz">${escapeHtml(slide.day.tu)}</div>
      <div class="slide-wt">${escapeHtml(slide.day.wt)}</div>`;
    controls.innerHTML = "";
  } else if (slide.type === "unitTitle"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Grammar Book &middot; ${escapeHtml(slide.unit.cat)}</div>
      <h1 class="slide-title">${escapeHtml(slide.unit.title)}</h1>
      <div class="slide-title-uz">${escapeHtml(slide.unit.titleUz)}</div>`;
    controls.innerHTML = "";
  } else if (slide.type === "vocab"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Vocabulary</div>
      <div class="stage-vocab-grid">
        ${slide.day.v.map(([en, uz, ex]) => `
          <div class="vocab-card">
            <div class="vocab-en"><button class="play-btn" data-speak="${escapeHtml(en)}">${icon("play", 14)}</button>${escapeHtml(en)}</div>
            <div class="vocab-uz">${escapeHtml(uz)}</div>
            ${ex ? `<div class="vocab-ex">${escapeHtml(ex)}</div>` : ""}
          </div>`).join("")}
      </div>`;
    holder.querySelectorAll("[data-speak]").forEach(b => b.addEventListener("click", () => speak(b.dataset.speak)));
    controls.innerHTML = "";
  } else if (slide.type === "dialogue"){
    const speakers = [...new Set(slide.day.dl.map(l => l[0]))];
    holder.innerHTML = `
      <div class="slide-eyebrow">Dialogue</div>
      <div class="stage-dl">
        ${slide.day.dl.map(([sp, en, uz]) => `
          <div class="stage-dl-line ${speakers.indexOf(sp) === 1 ? "speaker-b" : ""}">
            <div class="stage-dl-speaker">${escapeHtml(sp)}</div>
            ${escapeHtml(en)}
            <div class="stage-dl-uz">${escapeHtml(uz)}</div>
          </div>`).join("")}
      </div>`;
    controls.innerHTML = "";
  } else if (slide.type === "grammarTip"){
    holder.innerHTML = `<div class="slide-eyebrow">Grammar Tip</div><div class="stage-grammar"><h2>${escapeHtml(slide.day.g[0])}</h2><p>${escapeHtml(slide.day.g[1])}</p></div>`;
    controls.innerHTML = "";
  } else if (slide.type === "teachNotes"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Teacher notes</div>
      <div class="stage-grammar" style="max-width:860px;text-align:left;">
        ${slide.unit.teach.map(p => `<p style="margin:0 0 16px;">${escapeHtml(p)}</p>`).join("")}
      </div>`;
    controls.innerHTML = "";
  } else if (slide.type === "explain"){
    holder.innerHTML = `<div class="slide-eyebrow">Explanation</div><div class="stage-grammar" style="text-align:left;">${slide.unit.explain.map(p => `<p style="margin:0 0 16px;">${escapeHtml(p)}</p>`).join("")}</div>`;
    controls.innerHTML = "";
  } else if (slide.type === "examples"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Examples</div>
      <ul class="examples-list" style="max-width:700px;margin:0 auto;">
        ${slide.unit.examples.map(([en, uz]) => `<li style="font-size:1.1rem;"><button class="play-btn" data-speak="${escapeHtml(en)}">${icon("play", 14)}</button> ${escapeHtml(en)}<div class="ex-uz">${escapeHtml(uz)}</div></li>`).join("")}
      </ul>`;
    holder.querySelectorAll("[data-speak]").forEach(b => b.addEventListener("click", () => speak(b.dataset.speak)));
    controls.innerHTML = "";
  } else if (slide.type === "mistake"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Common Mistake</div>
      <div class="mistake-grid" style="max-width:800px;margin:0 auto;">
        <div class="mistake-card mistake-wrong"><div class="mistake-label">Wrong</div><div style="font-size:1.1rem;">${escapeHtml(slide.unit.mistakeWrong)}</div></div>
        <div class="mistake-card mistake-right"><div class="mistake-label">Right</div><div style="font-size:1.1rem;">${escapeHtml(slide.unit.mistakeRight)}</div></div>
      </div>
      ${slide.unit.mistakeWhy ? `<p class="mistake-why" style="text-align:center;max-width:700px;margin:16px auto 0;">${escapeHtml(slide.unit.mistakeWhy)}</p>` : ""}`;
    controls.innerHTML = "";
  } else if (slide.type === "speaking"){
    holder.innerHTML = `
      <div class="slide-eyebrow">Speaking Prompt</div>
      <div class="stage-grammar"><p>${escapeHtml(slide.day.sp[0])}</p><p style="color:var(--muted);margin-top:10px;">${escapeHtml(slide.day.sp[1])}</p></div>`;
    controls.innerHTML = "";
  } else if (slide.type === "quiz"){
    renderQuizSlide(slide, room, idx, holder, controls);
  } else if (slide.type === "dayEnd" || slide.type === "unitEnd"){
    renderLeaderboardSlide(room, holder);
    controls.innerHTML = "";
  }
}

/* ---------------- Quiz slide (host) ---------------- */
function renderQuizSlide(slide, room, idx, holder, controls){
  const [question, choices] = slide.q;
  const correct = slide.q[2];
  const answers = (room.answers && room.answers[idx]) || {};
  const answeredCount = Object.keys(answers).length;
  const participantCount = Object.keys(room.participants || {}).length;
  const opened = !!room.cursor.quizOpenedAt;
  const revealed = !!room.cursor.revealed;
  const counts = [0, 0, 0, 0];
  Object.values(answers).forEach(a => { if (counts[a.choice] != null) counts[a.choice]++; });

  holder.innerHTML = `
    <div class="slide-eyebrow">Quiz</div>
    <div class="quiz-stage-q">${escapeHtml(question)}</div>
    <div class="quiz-options">
      ${choices.map((c, ci) => `
        <div class="quiz-opt ${revealed && ci !== correct ? "dim" : ""} ${revealed && ci === correct ? "correct" : ""}">
          <svg class="quiz-opt-shape" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4"/></svg>
          <span>${escapeHtml(c)}</span>
          ${opened ? `<span class="quiz-opt-count">${counts[ci]}</span>` : ""}
        </div>`).join("")}
    </div>
    ${!opened ? `<p class="quiz-closed-hint">Question is hidden from players until you open it.</p>` : ""}
    ${opened && !revealed ? `<p class="quiz-closed-hint">${answeredCount} / ${participantCount || "?"} answered</p>` : ""}
  `;

  if (!opened){
    controls.innerHTML = `<button class="btn btn-accent" id="quizOpenBtn">${icon("users", 16)} Open Question</button>`;
    $("quizOpenBtn").addEventListener("click", async () => {
      await Live.hostSetCursor(state.code, { slideIndex: idx, quizOpenedAt: Date.now(), quizDurationMs: 20000, revealed: false });
    });
  } else if (!revealed){
    controls.innerHTML = `<span class="quiz-countdown" id="quizCountdown">20</span><button class="btn btn-accent" id="quizRevealBtn">Reveal &amp; Score</button>`;
    $("quizRevealBtn").addEventListener("click", () => doReveal(idx, correct, room));
    startTickTimer(idx, correct, room);
  } else {
    controls.innerHTML = `<span class="panel-sub">Revealed — scores updated.</span>`;
    clearTickTimer();
  }
}

function startTickTimer(idx, correct, room){
  clearTickTimer();
  const openedAt = room.cursor.quizOpenedAt;
  const duration = room.cursor.quizDurationMs || 20000;
  const tick = () => {
    const el = $("quizCountdown");
    const remaining = Math.max(0, duration - (Date.now() - openedAt));
    if (el) el.textContent = String(Math.ceil(remaining / 1000));
    if (remaining <= 0){
      clearTickTimer();
      const key = state.code + ":" + idx;
      if (state.autoRevealedFor !== key){
        state.autoRevealedFor = key;
        doReveal(idx, correct, room);
      }
    }
  };
  tick();
  state.tickTimer = setInterval(tick, 250);
}

async function doReveal(idx, correct, room){
  clearTickTimer();
  try{
    await Live.hostRevealAndScore(state.code, idx, correct, room.cursor.quizOpenedAt, room.cursor.quizDurationMs);
  }catch(err){
    toast("Couldn't score that question — please try Reveal again.");
  }
}

/* ---------------- Leaderboard ---------------- */
function renderLeaderboardSlide(room, holder){
  const participants = room.participants || {};
  const scores = room.scores || {};
  const rows = Object.keys(participants)
    .map(uid => ({ uid, name: participants[uid].name, score: scores[uid] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  holder.innerHTML = `
    <div class="slide-eyebrow">${icon("trophy", 18)} Leaderboard</div>
    ${rows.length ? `<ul class="leaderboard-list">
      ${rows.map((r, i) => `
        <li class="lb-row rank-${i}">
          <span class="lb-rank">${i + 1}</span>
          <span class="lb-name">${escapeHtml(r.name)}</span>
          <span class="lb-score">${r.score}</span>
        </li>`).join("")}
    </ul>` : `<p class="panel-sub" style="text-align:center;">No quiz scores yet.</p>`}
  `;
}

/* ---------------- Mount ---------------- */
function init(){
  state = { mode: "library", libTab: "curriculum", selected: null, openGroups: new Set(["w1"]), code: null, room: null, slides: [], unsubRoom: null, tickTimer: null, autoRevealedFor: null };
  renderShell();
}

window.TTE_mount = init;
// A lighter re-render than init(): auth-gate calls this when something about
// the signed-in profile changes (name, role...); it must NOT reset `state`,
// or reloading mid-lesson would silently drop the teacher out of a live class.
window.TTE_refresh = renderShell;

initAuthGate({
  appKind: "teachers",
  appLabel: "Teachers platform",
  mainUrl: "https://truck-talk-webapp.vercel.app/",
});
