/* Truck Talk Teachers — the live classroom room: one Realtime Database
 * node per session (liveClasses/{code}), written by the host (teachers.js)
 * and read by everyone including participants (join.js). See
 * database.rules.json's "liveClasses" block for the actual access rules
 * this is built around: the host owns everything under their room except
 * participants/{uid} and answers/{slideIndex}/{uid}, which each
 * participant owns for themselves.
 *
 * Slide CONTENT is never written here — only the live, interactive state
 * (whose room this is, which slide index is showing, who has joined, and
 * their answers/scores). See slides.js for why that's safe to leave out.
 */
import { auth, db } from "../shared/firebase.js";
import {
  ref, set, update, get, onValue, off,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const CODE_CHARS = "23456789ACDEFGHJKMNPQRTUVWXY"; // no 0/O/1/I/L — read aloud or off a screen without confusion
function randomCode(){
  let s = "";
  for (let i = 0; i < 5; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

function roomRef(code){ return ref(db, "liveClasses/" + code); }

/** Creates a new room for {kind, ref, title} (see slides.js findSource) and returns its code. */
export async function createRoom(hostUid, hostName, source){
  for (let attempt = 0; attempt < 5; attempt++){
    const code = randomCode();
    const snap = await get(roomRef(code));
    if (snap.exists()) continue;
    const room = {
      hostUid, hostName: hostName || "", code,
      createdAt: Date.now(),
      status: "lobby", // lobby | live | ended
      source,
      cursor: { slideIndex: 0, quizOpenedAt: null, quizDurationMs: 20000, revealed: false },
    };
    try{
      await set(roomRef(code), room);
      return code;
    }catch(err){
      if (attempt === 4) throw err; // someone else's create raced us onto this exact code — try another
    }
  }
  throw new Error("Could not create a room — please try again.");
}

export function subscribeRoom(code, cb){
  const r = roomRef(code);
  onValue(r, (snap) => cb(snap.val()), () => cb(null));
  return () => off(r);
}

/** Host-only: patch top-level room fields (status, cursor, scores/*). */
export function hostUpdate(code, patch){
  return update(roomRef(code), patch);
}

export function hostSetCursor(code, cursor){
  return update(roomRef(code), { cursor });
}

export async function hostStartClass(code){
  return update(roomRef(code), { status: "live" });
}

export async function hostEndClass(code){
  return update(roomRef(code), { status: "ended" });
}

export async function getAnswers(code, slideIndex){
  const snap = await get(ref(db, `liveClasses/${code}/answers/${slideIndex}`));
  return snap.val() || {};
}

export async function getScores(code){
  const snap = await get(ref(db, `liveClasses/${code}/scores`));
  return snap.val() || {};
}

/** Host-only: award points for the just-revealed quiz slide and mark it revealed. */
export async function hostRevealAndScore(code, slideIndex, correctIndex, questionOpenedAt, durationMs){
  const [answers, scores] = await Promise.all([getAnswers(code, slideIndex), getScores(code)]);
  const scoreUpdates = {};
  Object.keys(answers).forEach((uid) => {
    const a = answers[uid];
    if (a.choice !== correctIndex) return;
    const elapsed = Math.max(0, (a.at || 0) - (questionOpenedAt || 0));
    const remaining = Math.max(0, Math.min(1, 1 - elapsed / (durationMs || 20000)));
    const points = Math.round(500 + 500 * remaining);
    scoreUpdates[uid] = (scores[uid] || 0) + points;
  });
  const patch = { "cursor/revealed": true };
  Object.keys(scoreUpdates).forEach((uid) => { patch["scores/" + uid] = scoreUpdates[uid]; });
  await update(roomRef(code), patch);
  return scoreUpdates;
}

/** Participant: reuse whoever is already signed in (course/teacher account
 * open in this browser), otherwise sign in anonymously just for this room. */
export async function ensureParticipantAuth(){
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export function joinRoom(code, uid, name){
  return set(ref(db, `liveClasses/${code}/participants/${uid}`), { name: name.slice(0, 40), joinedAt: Date.now() });
}

export function submitAnswer(code, slideIndex, uid, choice){
  return set(ref(db, `liveClasses/${code}/answers/${slideIndex}/${uid}`), { choice, at: Date.now() });
}

export function roomExists(code){
  return get(roomRef(code)).then(snap => snap.exists());
}
