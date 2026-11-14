/* Server-side database access for the payment webhook (api/whop.js) and the voice-minute ledger (api/agent.js).
 *
 * Everything else on the server reads the database with the caller's own sign-in token, so database rules apply. These
 * two jobs have to write what a student may never write themselves (when their access ends, how many minutes they used),
 * so they use the Firebase project's service account instead:
 *
 *   FIREBASE_SERVICE_ACCOUNT  the whole JSON key file (Firebase console > Project settings > Service accounts >
 *                             Generate new private key), pasted as one Vercel environment variable.
 *
 * No SDK: the key signs a short JWT (RS256, Node's crypto), Google trades it for an access token, and the Realtime
 * Database REST API accepts that token. Only the Truck Talk project (truck-talk-admin) is wired; when the variable is
 * missing, configured() is false and callers fall back to their old behavior. */
"use strict";
const crypto = require("crypto");

const DB_URL = "https://truck-talk-admin-default-rtdb.asia-southeast1.firebasedatabase.app";
const SCOPES = "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email";
let cached = { token: "", until: 0 };

function account() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const a = JSON.parse(raw);
    return a && a.client_email && a.private_key ? { email: a.client_email, key: String(a.private_key).replace(/\\n/g, "\n") } : null;
  } catch (e) { return null; }
}
function configured() { return !!account(); }

async function accessToken(now = Date.now()) {
  if (cached.token && cached.until > now + 60000) return cached.token;
  const a = account();
  if (!a) throw new Error("no-service-account");
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const iat = Math.floor(now / 1000);
  const unsigned = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({ iss: a.email, scope: SCOPES, aud: "https://oauth2.googleapis.com/token", iat, exp: iat + 3600 });
  const sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), a.key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: "grant_type=" + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer") + "&assertion=" + unsigned + "." + sig,
  });
  if (!r.ok) throw new Error("token-" + r.status);
  const j = await r.json();
  cached = { token: j.access_token, until: now + (Number(j.expires_in) || 3600) * 1000 };
  return cached.token;
}

// path like "users/abc" (no leading slash). value null on a missing node.
async function dbGet(path) {
  const r = await fetch(DB_URL + "/" + path + ".json", { headers: { authorization: "Bearer " + await accessToken() } });
  if (!r.ok) throw new Error("db-get-" + r.status);
  return r.json();
}
// Multi-path update at a node: { "a/b": 1, "c": null } — atomic, like the client SDK's update().
async function dbUpdate(path, values) {
  const r = await fetch(DB_URL + "/" + (path ? path + "/" : "") + ".json", {
    method: "PATCH", headers: { authorization: "Bearer " + await accessToken(), "content-type": "application/json" }, body: JSON.stringify(values),
  });
  if (!r.ok) throw new Error("db-update-" + r.status);
  return r.json();
}

module.exports = { configured, dbGet, dbUpdate, DB_URL, _reset: () => { cached = { token: "", until: 0 }; } };
