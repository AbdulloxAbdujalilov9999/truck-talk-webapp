/* The Truck Talk Telegram bot (webhook). Telegram calls this for every message the bot gets.
 *
 *   GET  /api/telegram?setup=1   -> points the bot's webhook here (open once after setting the env vars; safe to repeat)
 *   GET  /api/telegram?health=1  -> { configured }
 *   POST /api/telegram           <- Telegram updates (checked with the secret header derived from the bot token)
 *
 * What the bot does:
 *   /start login_<nonce>  sign-in: sends a 6-digit code to type in the app (api/tg.js checks it)
 *   /start link_<code>    ties a signed-in student's account to this chat (daily reminders, Telegram sign-in from then on)
 *   TRUCK, /start, a number  the video funnel: what Truck Talk is, a free lesson page (/free/<n>) and the free trial
 *   /stop, /reminders     daily reminders off / on
 * State lives under telegram/ in the database, written with the service account (api/_admin.js); clients can't touch it.
 * Needs TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME and FIREBASE_SERVICE_ACCOUNT. */
"use strict";
const crypto = require("crypto");
const admin = require("./_admin.js");
const tg = require("./_telegram.js");

const LOGIN_TTL = 10 * 60 * 1000, LINK_TTL = 30 * 60 * 1000;
const PHONE_DOMAIN = "@phone.trucktalk.invalid";

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(obj));
}

function funnel(chatId, n) {
  const day = Math.min(60, Math.max(1, Number(n) || 1));
  return tg.send(chatId,
    "🚛 <b>Truck Talk</b>: ingliz tili AQShdagi o'zbek haydovchilar uchun.\n\n"
    + "• Yo'lda kerak bo'ladigan so'zlar va suhbatlar, o'zbekcha tushuntirish bilan\n"
    + "• Politsiya va DOT tekshiruviga tayyorlov (Roadside English check)\n"
    + "• AI o'qituvchi bilan gaplashish\n\n"
    + "Bepul dars: " + day + "-kun. 3 kunlik bepul sinov bilan boshlang.",
    [[{ text: "▶️ " + day + "-kun darsi (bepul)", url: tg.site() + "/free/" + day }], [{ text: "Bepul boshlash", url: tg.site() + "/trucktalk/" }]]);
}

async function onLogin(msg, nonce, now) {
  const chatId = msg.chat.id, from = msg.from || {};
  const path = "telegram/login/" + nonce;
  const s = await admin.dbGet(path);
  if (!s || s.used || now - (s.at || 0) > LOGIN_TTL) return tg.send(chatId, "Bu kirish havolasi eskirgan. Ilovada \"Telegram orqali kirish\" tugmasini qaytadan bosing.");
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").slice(0, 60);
  await admin.dbUpdate(path, { code, tgId: String(from.id), chatId, name, tries: 0, codeAt: now });
  return tg.send(chatId, "Truck Talk'ga kirish kodi: <b>" + code + "</b>\n\nKodni ilovaga yozing. Uni hech kimga bermang: Truck Talk xodimlari ham so'ramaydi.");
}

async function onLink(msg, code, now) {
  const chatId = msg.chat.id, from = msg.from || {};
  const p = await admin.dbGet("telegram/link/" + code);
  if (!p || !p.uid || now - (p.at || 0) > LINK_TTL) return tg.send(chatId, "Bu havola eskirgan. Ilovada Sozlamalar → Telegram eslatmalari tugmasini qaytadan bosing.");
  const tgId = String(from.id);
  const old = await admin.dbGet("telegram/users/" + tgId);
  const updates = {
    ["telegram/link/" + code]: null,
    ["telegram/users/" + tgId]: { uid: p.uid, chatId, reminders: true, at: now },
    ["users/" + p.uid + "/telegram"]: { tgId, reminders: true },
  };
  if (old && old.uid && old.uid !== p.uid) updates["users/" + old.uid + "/telegram"] = null;
  await admin.dbUpdate("", updates);
  // a phone-number account's password is derived from the number; once Telegram can sign it in, close that door
  let locked = false;
  const email = String((await admin.dbGet("users/" + p.uid + "/email")) || "");
  if (email.endsWith(PHONE_DOMAIN)) { try { await admin.lockPassword(p.uid); locked = true; } catch (e) { console.error("telegram: lock " + e.message); } }
  return tg.send(chatId, "✅ Truck Talk hisobingiz ulandi.\n\nHar kuni darsni o'tkazib yubormaslik uchun eslatma yuboraman. O'chirish: /stop"
    + (locked ? "\n\nEndi ilovaga telefon raqam bilan emas, <b>Telegram orqali kirish</b> tugmasi bilan kirasiz (xavfsizroq)." : ""));
}

async function setReminders(msg, on) {
  const tgId = String((msg.from || {}).id);
  const u = await admin.dbGet("telegram/users/" + tgId);
  if (!u || !u.uid) return tg.send(msg.chat.id, "Avval hisobingizni ulang: ilovada Sozlamalar → Telegram eslatmalari.");
  await admin.dbUpdate("", { ["telegram/users/" + tgId + "/reminders"]: on, ["users/" + u.uid + "/telegram/reminders"]: on });
  return tg.send(msg.chat.id, on ? "🔔 Kunlik eslatmalar yoqildi." : "🔕 Kunlik eslatmalar o'chirildi. Qayta yoqish: /reminders");
}

async function handleMessage(msg, now) {
  const text = String(msg.text || "").trim();
  if (!msg.chat || !text) return;
  let m;
  if ((m = text.match(/^\/start\s+login_([A-Za-z0-9_-]{20,60})$/))) return onLogin(msg, m[1], now);
  if ((m = text.match(/^\/start\s+link_([A-Za-z0-9_-]{16,60})$/))) return onLink(msg, m[1], now);
  if (/^\/stop\b/i.test(text)) return setReminders(msg, false);
  if (/^\/reminders\b/i.test(text)) return setReminders(msg, true);
  if ((m = text.match(/^\/start\s+(?:day|free)_?(\d{1,2})$/i))) return funnel(msg.chat.id, m[1]);
  if ((m = text.match(/^(?:truck|трак|trak)\s*(\d{1,2})?$/i))) return funnel(msg.chat.id, m[1]);
  if ((m = text.match(/^(\d{1,2})$/))) return funnel(msg.chat.id, m[1]);
  return funnel(msg.chat.id, 1);   // /start, hello, anything else
}

async function handler(req, res) {
  const q = req.query || Object.fromEntries(new URL(req.url, "http://x").searchParams);
  if (req.method === "GET") {
    if (q.health) return json(res, 200, { configured: tg.configured() && admin.configured() });
    if (q.setup) {
      if (!tg.configured()) return json(res, 503, { error: "not-configured" });
      try {
        await tg.api("setWebhook", { url: tg.site() + "/api/telegram", secret_token: tg.webhookSecret(), allowed_updates: ["message"], drop_pending_updates: true });
        await tg.api("setMyCommands", { commands: [{ command: "start", description: "Truck Talk" }, { command: "stop", description: "Eslatmalarni o'chirish" }, { command: "reminders", description: "Eslatmalarni yoqish" }] });
        return json(res, 200, { ok: true, webhook: tg.site() + "/api/telegram" });
      } catch (e) { return json(res, 502, { error: String(e.message).slice(0, 200) }); }
    }
    return json(res, 405, { error: "method" });
  }
  if (req.method !== "POST") return json(res, 405, { error: "method" });
  if (!tg.configured()) return json(res, 503, { error: "not-configured" });
  const secret = req.headers && req.headers["x-telegram-bot-api-secret-token"];
  if (secret !== tg.webhookSecret()) return json(res, 401, { error: "secret" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  // always answer 200 so Telegram doesn't retry the same update forever; failures are logged
  try { if (body && body.message && admin.configured()) await handleMessage(body.message, Date.now()); }
  catch (e) { console.error("telegram: " + (e && e.message)); }
  json(res, 200, { ok: true });
}

module.exports = handler;
