/* "Sign in with your phone number" — no SMS.
 *
 * Firebase's real phone sign-in sends a text message (which needs a paid plan
 * and an SMS provider). The owner asked for the opposite: type a name and a
 * phone number and you're in, nothing is texted. So a phone number is turned
 * into an ordinary Firebase email+password account behind the scenes:
 *
 *   +1 (415) 555-0132  ->  email    p14155550132@phone.trucktalk.invalid
 *                          password tte-phone-14155550132
 *
 * The same number always maps to the same account, so typing it again on any
 * device signs you back in. The e-mail domain is never mailed (".invalid" is
 * reserved and can't resolve) — it is only an account id.
 *
 * Trade-off, by design: the password is derived from the number, so anyone who
 * knows a phone number can sign in as that person. That is what "no SMS code"
 * means; it is fine for a language course but means these accounts are only as
 * private as the phone number is. Staff roles (teacher / manager / owner) should
 * keep Google or e-mail+password sign-in — an owner/manager can still restrict
 * any account from the admin dashboard.
 *
 * This module is pure (no Firebase, no DOM) so both auth gates — Truck Talk and
 * SpeakUp — share it, and it can be unit-tested in Node.
 */

export const PHONE_EMAIL_DOMAIN = "phone.trucktalk.invalid";
/* Truck Talk drivers mostly have US numbers, SpeakUp students mostly Uzbek ones,
 * so a number typed without a country code is told apart by its length:
 *   10 digits (415 555 0132)        -> US/Canada, +1
 *   9 digits  (90 123 45 67)        -> Uzbekistan, +998
 *   10 digits with a leading 0 (090 123 45 67) -> Uzbekistan, +998
 * Anything with an explicit country code (+1…, +998…, 00…) is kept as typed. */

/** Digits-only international form ("14155550132", "998901234567") or null if it isn't a plausible number. */
export function normalizePhone(raw){
  let d = String(raw == null ? "" : raw).replace(/\D+/g, "");
  if (d.startsWith("00")) d = d.slice(2);                          // 00 1 415… / 00 998… dialling prefix
  if (d.length === 9) d = "998" + d;                               // Uzbek local number
  else if (d.length === 10 && d.startsWith("0")) d = "998" + d.slice(1);
  else if (d.length === 10 && !d.startsWith("1")) d = "1" + d;     // US/Canada national number (area codes never start with 0 or 1)
  if (d.length < 10 || d.length > 15) return null;                 // E.164 allows at most 15 digits
  if (d.length === 10) return null;                                // a bare 10-digit number starting with 1 is a mistyped US number
  return d;
}

/** The Firebase email+password pair for a normalized number. */
export function phoneCredentials(digits){
  return { email: "p" + digits + "@" + PHONE_EMAIL_DOMAIN, password: "tte-phone-" + digits };
}

export function isPhoneEmail(email){
  return typeof email === "string" && email.toLowerCase().endsWith("@" + PHONE_EMAIL_DOMAIN);
}

/** Digits for an account's synthetic e-mail, or null for a normal e-mail. */
export function phoneFromEmail(email){
  if (!isPhoneEmail(email)) return null;
  const m = /^p(\d{10,15})@/i.exec(email);
  return m ? m[1] : null;
}

/** "14155550132" -> "+1 (415) 555-0132", "998901234567" -> "+998 90 123 45 67"; others as +digits. */
export function formatPhone(digits){
  if (!digits) return "";
  const d = String(digits);
  if (d.length === 11 && d.startsWith("1")) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 12 && d.startsWith("998")) return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
  return "+" + d;
}

/** What to show wherever an account's e-mail would normally appear. */
export function contactLabel(email){
  const d = phoneFromEmail(email);
  return d ? formatPhone(d) : (email || "");
}
