/* Shared by the AI endpoints (api/tutor.js, api/agent.js): "is this caller somebody the course lets in right now?".
 * The caller's Firebase ID token is verified with Google, then their own profile is read from the database with that
 * same token (so database rules apply to the read). Allowed: an approved account, or a student inside the 3-day
 * trial (same rule as trialInfo() in shared/auth-gate.js). Restricted, expired and unknown callers are refused, so a
 * graduated or paused student can no longer use anything that costs money.
 * (Files starting with an underscore are not served as endpoints by Vercel.) */
"use strict";

// Public web identifiers: the same values every browser already gets from shared/firebase-config.js
const FIREBASE_WEB_KEY = "AIzaSyBGzEpwBGARclSzSuiE5o1HZB-WXp7Ikvg";
const DB_URL = "https://truck-talk-admin-default-rtdb.asia-southeast1.firebasedatabase.app";
const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const verified = new Map();   // ID token -> { uid, until }

function mayUse(profile, now) {
  if (!profile || typeof profile !== "object") return false;
  if (profile.status === "approved") return true;
  if (profile.status === "pending" && profile.role === "student") {
    const start = typeof profile.createdAt === "number" ? profile.createdAt : now;
    return start + TRIAL_MS > now;
  }
  return false;
}

function claimedUid(token) {
  try {
    const part = String(token).split(".")[1] || "";
    const uid = JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")).user_id;
    return typeof uid === "string" && /^[A-Za-z0-9]{1,128}$/.test(uid) ? uid : null;
  } catch (e) { return null; }
}

// uid when the token is real and the person may use it; null otherwise (unreachable services count as "no")
async function checkUser(token, now) {
  const hit = verified.get(token);
  if (hit && hit.until > now) return hit.uid;
  try {
    // Google's check and the profile read run side by side (one round trip instead of two). The uid used for the read is
    // only a claim read from the token; it counts only when Google confirms the same uid, and the database applies its own
    // rules to the token as well.
    const claimed = claimedUid(token);
    if (!claimed) return null;
    const [r, p] = await Promise.all([
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + FIREBASE_WEB_KEY, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: token }),
      }),
      fetch(DB_URL + "/users/" + encodeURIComponent(claimed) + ".json?auth=" + encodeURIComponent(token)),
    ]);
    if (!r.ok || !p.ok) return null;
    const uid = (((await r.json()).users || [])[0] || {}).localId;
    if (!uid || uid !== claimed || !mayUse(await p.json(), now)) return null;
    verified.set(token, { uid, until: now + 5 * 60 * 1000 });
    if (verified.size > 2000) verified.clear();
    return uid;
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

module.exports = { mayUse, checkUser, makeLimiter };
