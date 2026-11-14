/* Who may open Truck Talk? One rule, used by the home page, the Truck Talk page and the SpeakUp page.
 *
 * Truck Talk is the site's main course, but it is closed to students who signed up after TT_LOCK_FROM
 * (once their free 3-day trial is over) until they pay (paidUntil), a teacher/manager/owner opens it for them
 * (users/{uid}/ttAccess === true) or they have finished SpeakUp (all SPEAKUP_DAYS lessons). Until then those students never see Truck Talk anywhere: they are
 * sent straight to SpeakUp. Teachers, managers and owners always have it, and so does every account that
 * existed before TT_LOCK_FROM (or has no recorded sign-up date: an old account).
 *
 * Pure (no Firebase, no DOM) so it can be unit-tested: scripts/tt-access.test.mjs. */
export const TT_LOCK_FROM = 1791399379000;   // 2026-10-07T18:56:19Z
export const SPEAKUP_DAYS = 60;
export const TT_TRIAL_MS = 3 * 24 * 60 * 60 * 1000;   // same as TRIAL_MS in shared/auth-gate.js

/** Has the student completed every SpeakUp lesson? `progress` is the value of speakup/progress/{uid}. */
export function speakupFinished(progress){
  if (!progress || !(Number(progress.schema) >= 2)) return false;   // schema 2 = numbered for the 60-lesson course
  const done = progress.completed ? Object.values(progress.completed).filter(Boolean).length : 0;
  return done >= SPEAKUP_DAYS;
}

/** Is a paid period running? `users/{uid}/paidUntil` is a time in ms, set by the payment webhook (api/whop.js) or by
 *  an owner/manager in the admin; access ends by itself once it passes. */
export function paidActive(profile, now = Date.now()){
  return !!profile && typeof profile.paidUntil === "number" && profile.paidUntil > now;
}

/** true = this person may NOT open Truck Talk (yet). */
export function lockedFromTruckTalk(profile, finishedSpeakUp){
  if (!profile || profile.role !== "student") return false;           // staff (and unknown) are never locked
  if (profile.ttAccess === true) return false;                         // a teacher opened it
  if (paidActive(profile)) return false;                               // they paid for Truck Talk
  const created = typeof profile.createdAt === "number" ? profile.createdAt : 0;
  if (created < TT_LOCK_FROM) return false;                            // an account from before the lock existed
  if (created + TT_TRIAL_MS > Date.now()) return false;                // the free 3-day trial includes Truck Talk; after it, the pay screen
  return !finishedSpeakUp;
}
