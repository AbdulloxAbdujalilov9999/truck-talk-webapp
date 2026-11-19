/* Daily Telegram reminders (Vercel Cron, see "crons" in vercel.json: every day 14:00 UTC = 9 AM Central / 8 AM Mountain).
 * For every student who tied Telegram to their account and kept reminders on: if they haven't opened a lesson in the
 * last 18 hours, send one short message with their next lesson and a button to it. Paused, graduated and restricted
 * accounts, and finished students, get nothing.
 *   CRON_SECRET  required: Vercel sends it as "Authorization: Bearer <secret>" on cron calls, so nobody else can trigger it.
 * Also needs the Telegram and service-account variables (api/_telegram.js, api/_admin.js). */
"use strict";
const admin = require("./_admin.js");
const tg = require("./_telegram.js");

const QUIET_MS = 18 * 60 * 60 * 1000, MAX_PER_RUN = 800;

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(obj));
}

function nextDay(completed) {
  const done = completed && typeof completed === "object" ? completed : {};
  for (let d = 1; d <= 60; d++) if (!done[d]) return d;
  return null;
}

async function remindOne(link, now) {
  const [profile, last, completed] = await Promise.all([
    admin.dbGet("users/" + link.uid), admin.dbGet("usage/" + link.uid + "/last"), admin.dbGet("progress/" + link.uid + "/completed"),
  ]);
  if (!profile || profile.status === "restricted" || profile.role !== "student") return "skip";
  if (last && typeof last.at === "number" && now - last.at < QUIET_MS) return "skip";
  const day = nextDay(Array.isArray(completed) ? Object.assign({}, completed) : completed);
  if (!day) return "skip";
  const name = String(profile.name || "").split(/\s+/)[0];
  await tg.send(link.chatId,
    (name ? tg.esc(name) + ", " : "") + "bugungi dars sizni kutyapti: <b>" + day + "-kun</b>. 10–15 daqiqa yetadi. 🚛\n\nO'chirish: /stop",
    [[{ text: "▶️ " + day + "-kun darsini ochish", url: tg.site() + "/trucktalk/" }]]);
  return "sent";
}

async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  if (!secret || auth !== "Bearer " + secret) return json(res, 401, { error: "not-allowed" });
  if (!tg.configured() || !admin.configured()) return json(res, 503, { error: "not-configured" });
  const now = Date.now();
  let links;
  try { links = (await admin.dbGet("telegram/users")) || {}; } catch (e) { return json(res, 503, { error: "db" }); }
  const due = Object.values(links).filter((l) => l && l.uid && l.chatId && l.reminders !== false).slice(0, MAX_PER_RUN);
  let sent = 0, failed = 0;
  for (const l of due) {
    try { if ((await remindOne(l, now)) === "sent") sent++; }
    catch (e) { failed++; if (failed <= 5) console.error("reminders: " + (e && e.message)); }
  }
  json(res, 200, { checked: due.length, sent, failed });
}

module.exports = handler;
module.exports.nextDay = nextDay;
