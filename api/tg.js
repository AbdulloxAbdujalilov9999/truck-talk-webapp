/* Telegram actions the app asks for (the bot itself is api/telegram.js).
 *
 *   GET  /api/tg?health=1                         -> { configured, bot }
 *   POST /api/tg { action: "login-start" }        -> { nonce, link }   (no sign-in needed) open link -> the bot sends a code
 *   POST /api/tg { action: "login-check", nonce, code } -> { token, name }  a Firebase custom token for signInWithCustomToken
 *   POST /api/tg { action: "link" }               -> { link }   (signed-in student) ties this account to Telegram via the bot
 *   POST /api/tg { action: "reminders", on }      -> { ok }     (signed in) daily reminders on/off
 *
 * Sign-in safety: the code goes only to the Telegram account that opened the link, it is typed back on the device that
 * started, it works once, for 10 minutes, with 5 tries. Someone sending you their link gets nothing: the code lands in
 * your Telegram, not theirs. A Telegram account tied to a student (via "link") signs in as that student; a new one gets
 * its own account "tg<telegram id>" (a 3-day trial like any sign-up). */
"use strict";
const crypto = require("crypto");
const admin = require("./_admin.js");
const tg = require("./_telegram.js");
const { identify, makeLimiter } = require("./_auth.js");

const LOGIN_TTL = 10 * 60 * 1000;
const TG_DOMAIN = "@telegram.trucktalk.invalid";   // made-up e-mail of a Telegram-only account (shared/phone-login.js)
const startLimit = makeLimiter({ perWindow: 10, windowMs: 10 * 60 * 1000, perDay: 50 });
const userLimit = makeLimiter({ perWindow: 10, windowMs: 10 * 60 * 1000, perDay: 50 });

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "authorization, content-type");
  res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}
const ipOf = (req) => String((req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "?").split(",")[0].trim();

async function handler(req, res) {
  const now = Date.now();
  if (req.method === "OPTIONS") return send(res, 204, {});
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  const ready = tg.configured() && admin.configured();
  if (req.method === "GET") return send(res, 200, q.health ? { configured: ready, bot: ready ? tg.botName() : null } : { error: "method" });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!ready) return send(res, 503, { error: "not-configured" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return send(res, 400, { error: "bad-request" });

  try {
    if (body.action === "login-start") {
      if (!startLimit("ip:" + ipOf(req), now)) return send(res, 429, { error: "slow-down" });
      const nonce = crypto.randomBytes(24).toString("base64url");
      await admin.dbUpdate("telegram/login/" + nonce, { at: now });
      return send(res, 200, { nonce, link: "https://t.me/" + tg.botName() + "?start=login_" + nonce });
    }

    if (body.action === "login-check") {
      const nonce = String(body.nonce || ""), code = String(body.code || "").replace(/\D/g, "");
      if (!/^[A-Za-z0-9_-]{20,60}$/.test(nonce) || code.length !== 6) return send(res, 400, { error: "bad-code" });
      const path = "telegram/login/" + nonce;
      const s = await admin.dbGet(path);
      if (!s || s.used || now - (s.at || 0) > LOGIN_TTL) return send(res, 410, { error: "expired" });
      if (!s.code) return send(res, 409, { error: "not-yet" });   // the bot hasn't been opened yet
      if ((s.tries || 0) >= 5) return send(res, 429, { error: "too-many" });
      const ok = s.code.length === code.length && crypto.timingSafeEqual(Buffer.from(s.code), Buffer.from(code));
      if (!ok) { await admin.dbUpdate(path, { tries: (s.tries || 0) + 1 }); return send(res, 401, { error: "wrong-code" }); }
      await admin.dbUpdate(path, { used: now });
      const tgId = String(s.tgId || "");
      if (!/^\d{3,20}$/.test(tgId)) return send(res, 500, { error: "bad-state" });
      const linked = await admin.dbGet("telegram/users/" + tgId);
      const uid = linked && linked.uid ? linked.uid : "tg" + tgId;
      if (!linked) {
        // A new Telegram account: the profile is written here (the database rules only let a person create a profile
        // that matches their sign-in e-mail, and a Telegram sign-in has none). Same shape as a sign-up's: a pending
        // student, so the 3-day trial counts from now. An existing profile (signed in before) is left as it is.
        const updates = { ["telegram/users/" + tgId]: { uid, chatId: s.chatId || null, reminders: true, at: now } };
        if (!(await admin.dbGet("users/" + uid + "/role"))) {
          updates["users/" + uid] = {
            name: String(s.name || "").trim() || "Telegram", email: uid + TG_DOMAIN, provider: "telegram",
            role: "student", status: "pending", createdAt: now, updatedAt: now, lastActive: now,
            telegram: { tgId, reminders: true },
          };
        } else updates["users/" + uid + "/telegram"] = { tgId, reminders: true };
        await admin.dbUpdate("", updates);
      }
      return send(res, 200, { token: admin.customToken(uid, { tg: tgId }), name: s.name || "", uid });
    }

    // the rest needs a signed-in person of this site
    const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token) return send(res, 401, { error: "sign-in" });
    const caller = await identify(token);
    if (!caller || caller.projectId !== "truck-talk-admin" || !caller.profile) return send(res, 403, { error: "not-allowed" });
    if (!userLimit(caller.who, now)) return send(res, 429, { error: "slow-down" });

    if (body.action === "link") {
      // students only: Telegram sign-in for a staff account would make that Telegram account a key to the admin
      if (caller.profile.role !== "student") return send(res, 403, { error: "students-only" });
      const code = crypto.randomBytes(18).toString("base64url");
      await admin.dbUpdate("telegram/link/" + code, { uid: caller.uid, at: now });
      return send(res, 200, { link: "https://t.me/" + tg.botName() + "?start=link_" + code });
    }
    if (body.action === "reminders") {
      const t = caller.profile.telegram;
      if (!t || !t.tgId) return send(res, 409, { error: "not-linked" });
      const on = !!body.on;
      await admin.dbUpdate("", { ["telegram/users/" + t.tgId + "/reminders"]: on, ["users/" + caller.uid + "/telegram/reminders"]: on });
      return send(res, 200, { ok: true });
    }
    return send(res, 400, { error: "bad-action" });
  } catch (e) {
    console.error("tg: " + (e && e.message));
    return send(res, 503, { error: "server" });
  }
}

module.exports = handler;
