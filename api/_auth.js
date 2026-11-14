/* Shared by the AI endpoints (api/tutor.js, api/agent.js): "is this caller somebody the course lets in right now?".
 * The caller's Firebase ID token is verified with Google, then their own profile is read from the database with that
 * same token (so database rules apply to the read). Allowed: an approved account, a student with a paid period still
 * running (users/{uid}/paidUntil, set by api/whop.js), or a student inside the 3-day
 * trial (same rule as trialInfo() in shared/auth-gate.js; the separate SpeakUp site has the same rule in its own database). Restricted, expired and unknown callers are refused, so a
 * graduated or paused student can no longer use anything that costs money.
 * (Files starting with an underscore are not served as endpoints by Vercel.) */
"use strict";

// Public web identifiers: the same values every browser already gets from shared/firebase-config.js.
// Two sites sign people in with their own Firebase project and call these endpoints: this site (Truck Talk and its SpeakUp)
// and the separate SpeakUp site (speak-upvercel.vercel.app, repo speakup-webapp). A token is checked only against the project
// it names (its "aud"), with that project's own key and database, so one site's accounts never vouch for the other's.
const PROJECTS = {
  "truck-talk-admin": { key: "AIzaSyBGzEpwBGARclSzSuiE5o1HZB-WXp7Ikvg", db: "https://truck-talk-admin-default-rtdb.asia-southeast1.firebasedatabase.app", prefix: "" },
  "bucketlist-769b9": { key: "AIzaSyD5048tGr1biITgI2mlUa_MXdInPX4DZMc", db: "https://bucketlist-769b9-default-rtdb.asia-southeast1.firebasedatabase.app", prefix: "su:" },
};
const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const verified = new Map();   // ID token -> { uid, until }

function mayUse(profile, now) {
  if (!profile || typeof profile !== "object") return false;
  if (profile.status === "approved") return true;
  if (profile.status === "restricted") return false;
  if (profile.role === "student" && typeof profile.paidUntil === "number" && profile.paidUntil > now) return true;
  if (profile.status === "pending" && profile.role === "student") {
    const start = typeof profile.createdAt === "number" ? profile.createdAt : now;
    return start + TRIAL_MS > now;
  }
  return false;
}

// What the token says about itself (not trusted until Google confirms it below): who, and which project it was issued by
function claims(token) {
  try {
    const part = String(token).split(".")[1] || "";
    const c = JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    const uid = typeof c.user_id === "string" && /^[A-Za-z0-9]{1,128}$/.test(c.user_id) ? c.user_id : null;
    const project = typeof c.aud === "string" && Object.prototype.hasOwnProperty.call(PROJECTS, c.aud) ? PROJECTS[c.aud] : null;
    return uid && project ? { uid, project, projectId: c.aud } : null;
  } catch (e) { return null; }
}

// uid when the token is real and the person may use it; null otherwise (unreachable services count as "no")
async function checkUser(token, now) {
  const c = await checkCaller(token, now);
  return c ? c.who : null;
}

// The same check, with more about the caller: { who (rate-limit key), uid, projectId, profile }, or null.
async function checkCaller(token, now) {
  const hit = verified.get(token);
  if (hit && hit.until > now) return hit.caller;
  const caller = await identify(token);
  if (!caller || !mayUse(caller.profile, now)) return null;
  const profile = caller.profile;
  // remembered briefly, but never past the moment a trial or paid period runs out
  const ends = [profile.paidUntil, (profile.createdAt || 0) + TRIAL_MS].filter((x) => typeof x === "number" && x > now);
  verified.set(token, { caller, until: profile.status === "approved" ? now + 5 * 60 * 1000 : Math.min(now + 5 * 60 * 1000, Math.max(now, ...ends)) });
  if (verified.size > 2000) verified.clear();
  return caller;
}

// Who is this, whatever their access: { who, uid, projectId, profile } for a real token (profile may be null), else null.
// Used by api/pay.js, where somebody whose trial ended must still be able to pay.
async function identify(token) {
  try {
    // Google's check and the profile read run side by side (one round trip instead of two). The uid used for the read is
    // only a claim read from the token; it counts only when Google confirms the same uid, and the database applies its own
    // rules to the token as well.
    const c = claims(token);
    if (!c) return null;
    const [r, p] = await Promise.all([
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + c.project.key, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: token }),
      }),
      fetch(c.project.db + "/users/" + encodeURIComponent(c.uid) + ".json?auth=" + encodeURIComponent(token)),
    ]);
    if (!r.ok || !p.ok) return null;
    const uid = (((await r.json()).users || [])[0] || {}).localId;
    const profile = await p.json();
    if (!uid || uid !== c.uid) return null;
    return { who: c.project.prefix + uid, uid, projectId: c.projectId, profile };   // who: the rate limiter's key, the two sites' uids never collide
  } catch (e) { return null; }
}

// A per-person rate limiter (best effort on serverless: each server instance counts separately).
function makeLimiter({ perWindow, windowMs, perDay }) {
  const hits = new Map();
  return function underLimit(uid, now) {
    const list = (hits.get(uid) || []).filter((t) => now - t < DAY_MS);
    const recent = list.filter((t) => now - t < windowMs).length;
    if (recent >= perWindow || list.length >= perDay) { hits.set(uid, list); return false; }
    list.push(now); hits.set(uid, list);
    if (hits.size > 5000) hits.clear();
    return true;
  };
}

module.exports = { mayUse, checkUser, checkCaller, identify, makeLimiter, PROJECTS };
