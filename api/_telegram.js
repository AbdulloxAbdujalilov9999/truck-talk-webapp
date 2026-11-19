/* Shared by the Telegram endpoints (api/telegram.js webhook, api/tg.js app actions, api/reminders.js daily reminders).
 *   TELEGRAM_BOT_TOKEN     from @BotFather (required for anything Telegram)
 *   TELEGRAM_BOT_USERNAME  the bot's @name without the @ (for t.me links)
 *   SITE_URL               optional, default https://www.trucktalk.courses
 * The webhook's secret is derived from the bot token, so there is nothing else to set up. */
"use strict";
const crypto = require("crypto");

const site = () => (process.env.SITE_URL || "https://www.trucktalk.courses").replace(/\/$/, "");
const configured = () => !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_USERNAME);
const botName = () => String(process.env.TELEGRAM_BOT_USERNAME || "").replace(/^@/, "");
// Telegram sends this back in X-Telegram-Bot-Api-Secret-Token on every webhook call (set by setWebhook in api/telegram.js)
const webhookSecret = () => crypto.createHash("sha256").update("tt-webhook:" + (process.env.TELEGRAM_BOT_TOKEN || "")).digest("hex").slice(0, 48);

async function api(method, payload) {
  const r = await fetch("https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN + "/" + method, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
  });
  let j = null;
  try { j = await r.json(); } catch (e) {}
  if (!r.ok || !j || !j.ok) throw new Error("telegram-" + method + "-" + r.status + (j && j.description ? " " + j.description : ""));
  return j.result;
}
// text in Telegram's HTML mode; buttons: [[{ text, url }]]
function send(chatId, text, buttons) {
  const p = { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true };
  if (buttons) p.reply_markup = { inline_keyboard: buttons };
  return api("sendMessage", p);
}
const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

module.exports = { site, configured, botName, webhookSecret, api, send, esc };
