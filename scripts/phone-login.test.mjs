// Run: node scripts/phone-login.test.mjs
import assert from "node:assert/strict";
import { normalizePhone, phoneCredentials, phoneFromEmail, isPhoneEmail, formatPhone, contactLabel, PHONE_EMAIL_DOMAIN } from "../shared/phone-login.js";

// every way of typing the same Uzbek number lands on one account
for (const raw of ["+998 90 123 45 67", "998901234567", "90 123 45 67", "901234567", "090 123 45 67", "00998901234567", "+998 (90) 123-45-67", " 998-90-1234567 "])
  assert.equal(normalizePhone(raw), "998901234567", raw);
// US/Canada: with or without the +1 it is the same account
for (const raw of ["+1 (415) 555-0132", "1 415 555 0132", "415-555-0132", "(415) 555 0132", "4155550132", "001 415 555 0132", "+14155550132"])
  assert.equal(normalizePhone(raw), "14155550132", raw);
assert.equal(normalizePhone("1155550132"), null);                           // 10 digits starting with 1: a mistyped US number
assert.equal(normalizePhone("+44 7911 123456"), "447911123456");            // other country codes are kept as typed
for (const bad of ["", null, undefined, "abc", "12345", "+998 90 12", "1234567890123456"])
  assert.equal(normalizePhone(bad), null, String(bad));

const c = phoneCredentials("998901234567");
assert.equal(c.email, "p998901234567@" + PHONE_EMAIL_DOMAIN);
assert.ok(c.password.length >= 6);
assert.deepEqual(phoneCredentials("998901234567"), c);                      // deterministic

assert.ok(isPhoneEmail(c.email) && isPhoneEmail(c.email.toUpperCase()));
assert.ok(!isPhoneEmail("someone@gmail.com") && !isPhoneEmail(undefined));
assert.equal(phoneFromEmail(c.email), "998901234567");
assert.equal(phoneFromEmail("p998901234567@gmail.com"), null);
assert.equal(formatPhone("998901234567"), "+998 90 123 45 67");
assert.equal(formatPhone("14155550132"), "+1 (415) 555-0132");
assert.equal(formatPhone("447911123456"), "+447911123456");
assert.equal(contactLabel(c.email), "+998 90 123 45 67");
assert.equal(contactLabel("a@b.co"), "a@b.co");
assert.equal(contactLabel(undefined), "");
console.log("phone-login: all assertions passed");
