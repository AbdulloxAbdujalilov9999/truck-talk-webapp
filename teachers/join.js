/* Truck Talk Teachers — participant join page. No account needed: whoever
 * has the room code (read off the teacher's shared screen) types it in,
 * picks a name, and answers quiz questions live from their own phone —
 * same idea as Kahoot's player page. See live.js for the realtime plumbing
 * and slides.js for how the same {kind, ref} the host is showing turns
 * into the same ordered slide list here, so both sides stay in lockstep
 * from nothing more than a synced slide index.
 */
import { findSource, buildSlides } from "./slides.js";
import * as Live from "./live.js";

function $(id){ return document.getElementById(id); }
function escapeHtml(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

const root = $("joinRoot");
const SESSION_KEY = "tt_player_session";

let state = {
  screen: "join",       // "join" | "playing"
  code: null,
  uid: null,
  name: null,
  room: null,
  slides: [],
  unsubRoom: null,
  answeredSlide: null,  // slideIndex already answered this session (client-side lock)
  scoreBaseline: 0,     // my total score at the moment the current quiz slide opened, to show points earned on reveal
  baselineSlide: null,
};

function render(){
  if (state.screen === "join") renderJoinForm();
  else renderPlaying();
}

/* ---------------- Join form ---------------- */
function renderJoinForm(prefillCode, errorMsg){
  const params = new URLSearchParams(window.location.search);
  const code = prefillCode || params.get("code") || "";
  root.innerHTML = `
    <div class="j-card">
      <h1 class="j-title">Join a class</h1>
      <p class="j-sub">Enter the room code your teacher is showing on screen.</p>
      ${errorMsg ? `<div class="j-error">${escapeHtml(errorMsg)}</div>` : ""}
      <form id="joinForm">
        <label class="j-label" for="codeInput">Room code</label>
        <input class="j-input" id="codeInput" maxlength="5" autocomplete="off" autocapitalize="characters" value="${escapeHtml(code)}" required>
        <label class="j-label" for="nameInput">Your name</label>
        <input class="j-input j-name-input" id="nameInput" maxlength="40" autocomplete="name" placeholder="e.g. Aziz" required>
        <button class="j-btn" type="submit" id="joinSubmitBtn">Join</button>
      </form>
    </div>`;
  $("joinForm").addEventListener("submit", onJoinSubmit);
}

async function onJoinSubmit(e){
  e.preventDefault();
  const code = $("codeInput").value.trim().toUpperCase();
  const name = $("nameInput").value.trim();
  if (!code || !name) return;
  const btn = $("joinSubmitBtn");
  btn.disabled = true; btn.textContent = "Joining…";
  try{
    const exists = await Live.roomExists(code);
    if (!exists){ renderJoinForm(code, "No class found with that code. Check with your teacher."); return; }
    const user = await Live.ensureParticipantAuth();
    await Live.joinRoom(code, user.uid, name);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ code, name }));
    state.code = code; state.uid = user.uid; state.name = name;
    enterPlaying();
  }catch(err){
    renderJoinForm(code, err.message || "Couldn't join — please try again.");
  }
}

/* ---------------- Playing ---------------- */
function enterPlaying(){
  state.screen = "playing";
  if (state.unsubRoom) state.unsubRoom();
  state.unsubRoom = Live.subscribeRoom(state.code, (room) => {
    if (!room){ root.innerHTML = `<div class="j-card"><p class="j-sub">This class has ended or no longer exists.</p></div>`; return; }
    const prevIdx = state.room && state.room.cursor ? state.room.cursor.slideIndex : null;
    const newIdx = room.cursor ? room.cursor.slideIndex : null;
    if (newIdx !== prevIdx) state.answeredSlide = null;
    state.room = room;
    state.slides = buildSlides(room.source);
    render();
  });
  render();
}

function myScore(){
  return (state.room.scores && state.room.scores[state.uid]) || 0;
}
function myRank(){
  const scores = state.room.scores || {};
  const ids = Object.keys(state.room.participants || {});
  const sorted = ids.map(id => scores[id] || 0).sort((a, b) => b - a);
  const mine = scores[state.uid] || 0;
  return sorted.indexOf(mine) + 1;
}

function renderPlaying(){
  const room = state.room;
  const header = `
    <div class="play-header">
      <div><strong>${escapeHtml(state.name)}</strong></div>
      <div style="text-align:right;">
        <div class="play-score">${myScore()}</div>
        <div class="play-rank">Rank ${myRank()} / ${Object.keys(room.participants || {}).length}</div>
      </div>
    </div>`;

  if (room.status === "ended"){
    root.innerHTML = header + `
      <div class="end-card">
        <h1 class="j-title">Class ended</h1>
        <p class="j-sub">Final score: <strong>${myScore()}</strong> &middot; Rank ${myRank()}</p>
        <p class="j-sub">Thanks for playing! Continue your lessons in the Truck Talk course.</p>
      </div>`;
    return;
  }

  const idx = room.cursor ? room.cursor.slideIndex : 0;
  const slide = state.slides[idx];

  if (!slide || slide.type !== "quiz"){
    root.innerHTML = header + `
      <div class="wait-card">
        ${waitIcon()}
        <h1 class="j-title">You're in!</h1>
        <p class="j-sub">Watch the shared screen — questions will appear here.</p>
      </div>`;
    return;
  }

  const [question, choices] = slide.q;
  const correct = slide.q[2];
  const opened = !!room.cursor.quizOpenedAt;
  const revealed = !!room.cursor.revealed;
  const myAnswer = (room.answers && room.answers[idx] && room.answers[idx][state.uid]) || null;

  if (!opened){
    root.innerHTML = header + `
      <div class="wait-card">
        ${waitIcon()}
        <h1 class="j-title">Get ready</h1>
        <p class="j-sub">Your teacher is about to open a question.</p>
      </div>`;
    return;
  }

  if (revealed){
    const correctChoice = myAnswer && myAnswer.choice === correct;
    root.innerHTML = header + `
      <div class="result-card">
        <div class="result-verdict ${myAnswer ? (correctChoice ? "correct" : "wrong") : "wrong"}">${myAnswer ? (correctChoice ? "Correct!" : "Not quite") : "No answer"}</div>
        <p class="j-sub">Correct answer: <strong>${escapeHtml(choices[correct])}</strong></p>
        ${myAnswer ? `<div class="result-points">+${Math.max(0, myScore() - (state.baselineSlide === idx ? state.scoreBaseline : myScore()))} pts</div>` : ""}
      </div>`;
    return;
  }

  if (state.baselineSlide !== idx){ state.baselineSlide = idx; state.scoreBaseline = myScore(); }

  const alreadyAnswered = state.answeredSlide === idx || !!myAnswer;
  root.innerHTML = header + `
    <div class="q-card">
      <div class="q-text">${escapeHtml(question)}</div>
      <div class="q-options">
        ${choices.map((c, ci) => `
          <button class="q-opt ${alreadyAnswered && (!myAnswer || myAnswer.choice !== ci) ? "locked" : ""} ${myAnswer && myAnswer.choice === ci ? "mine" : ""}" data-choice="${ci}" ${alreadyAnswered ? "disabled" : ""}>${escapeHtml(c)}</button>`).join("")}
      </div>
      ${alreadyAnswered ? `<p class="q-locked-hint">Answer locked in — waiting for your teacher to reveal the result…</p>` : ""}
    </div>`;

  if (!alreadyAnswered){
    root.querySelectorAll("[data-choice]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const choice = Number(btn.dataset.choice);
        state.answeredSlide = idx;
        render();
        try{ await Live.submitAnswer(state.code, idx, state.uid, choice); }
        catch(err){ state.answeredSlide = null; render(); }
      });
    });
  }
}

function waitIcon(){
  return `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
}

/* ---------------- Resume a session across reloads ---------------- */
async function tryResume(){
  try{
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { code, name } = JSON.parse(raw);
    if (!code || !name) return false;
    const exists = await Live.roomExists(code);
    if (!exists) return false;
    const user = await Live.ensureParticipantAuth();
    await Live.joinRoom(code, user.uid, name);
    state.code = code; state.uid = user.uid; state.name = name;
    enterPlaying();
    return true;
  }catch(e){ return false; }
}

(async function start(){
  const resumed = await tryResume();
  if (!resumed) render();
})();
