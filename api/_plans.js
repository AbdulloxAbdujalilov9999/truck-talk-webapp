/* What each kind of account gets: paid plan lengths (for the Whop webhook) and AI voice-teacher minutes (for api/agent.js).
 * Pure: no network, so scripts/plans.test.mjs can check it.
 *
 * Voice minutes are counted from voiceUsage/{uid}/{sessionId} = { start, granted, used? } (ms, seconds, seconds), written
 * only by the server. A call that never reported its end counts as long as it could have lasted (granted seconds), or
 * as the time since it started, whichever is less, so closing the tab can't hide a call. */
"use strict";

const DAY = 24 * 60 * 60 * 1000;

// Paid periods. The pay screen's prices live in shared/pay-config.js; keep the ids the same.
const PAID_PLANS = {
  month: { days: 30 },
  quarter: { days: 90 },
};

// Minutes of live voice practice. windowDays null = counted over the whole life of the account.
const VOICE = {
  trial: { minutes: Number(process.env.VOICE_MIN_TRIAL) || 10, windowDays: null },
  paid: { minutes: Number(process.env.VOICE_MIN_PAID) || 120, windowDays: 30 },       // shared/pay-config.js PAID_VOICE_MINUTES
  approved: { minutes: Number(process.env.VOICE_MIN_APPROVED) || 120, windowDays: 30 },
};

/** Which voice allowance applies to this profile; null = unlimited (staff). */
function voicePlan(profile, now) {
  if (!profile) return VOICE.trial;
  if (profile.role && profile.role !== "student") return null;
  if (profile.status === "approved") return VOICE.approved;
  if (typeof profile.paidUntil === "number" && profile.paidUntil > now) return VOICE.paid;
  return VOICE.trial;
}

/** Seconds a session counts for right now. */
function sessionSeconds(s, now) {
  if (!s || typeof s.start !== "number") return 0;
  const granted = Math.max(0, Number(s.granted) || 0);
  if (typeof s.used === "number") return Math.max(0, Math.min(s.used, granted));
  return Math.max(0, Math.min(granted, Math.ceil((now - s.start) / 1000)));
}

/** { limit, used, left } in seconds for this plan and ledger; limit Infinity when unlimited. */
function voiceBalance(plan, ledger, now) {
  if (!plan) return { limit: Infinity, used: 0, left: Infinity };
  const from = plan.windowDays ? now - plan.windowDays * DAY : -Infinity;
  let used = 0;
  for (const s of Object.values(ledger || {})) if (s && typeof s.start === "number" && s.start >= from) used += sessionSeconds(s, now);
  const limit = plan.minutes * 60;
  return { limit, used, left: Math.max(0, limit - used) };
}

/** New paidUntil after a payment for `planId`: extends a running period, starts a lapsed one from now. (The webhook
 *  makes sure each payment is counted once.) */
function extendPaid(currentPaidUntil, planId, now) {
  const plan = PAID_PLANS[planId] || PAID_PLANS.month;
  return Math.max(typeof currentPaidUntil === "number" ? currentPaidUntil : 0, now) + plan.days * DAY;
}

module.exports = { DAY, PAID_PLANS, VOICE, voicePlan, sessionSeconds, voiceBalance, extendPaid };
