/* Truck Talk — prices and payment links shown to students (the pay screen in shared/auth-gate.js, the landing page
 * /drivers/). Edit this one file to change what people see.
 *
 * How a payment opens the course:
 *   1. The pay button asks /api/pay for a Whop checkout made for this student (it carries their account id).
 *   2. Whop calls /api/whop after the payment; that sets users/{uid}/paidUntil and opens every lesson.
 *   3. The student's open page updates by itself. When paidUntil passes, access ends by itself.
 * If /api/pay isn't set up yet (no WHOP_API_KEY on Vercel), the button falls back to the plain Whop link below, and the
 * owner opens the account by hand in the admin ("Paid access" on the student's page).
 *
 * Voice minutes are enforced on the server (api/_plans.js); the numbers here are only what the pay screen says. */
export const PLANS = [
  {
    id: "month",
    price: "$149",
    period: "per month",
    days: 30,
    whopLink: "",            // e.g. "https://whop.com/checkout/plan_XXXX" — fallback only, see above
  },
  {
    id: "quarter",
    price: "$399",
    period: "for 3 months",
    days: 90,
    note: "Save $48",
    whopLink: "",
  },
];

// What every paid plan includes (shown as a checklist on the pay screen).
export const INCLUDES = [
  "All 60 Truck Talk lessons: the officer's questions, documents, road signs, dispatch and broker calls",
  "Live class 3 times a week, explained in Uzbek and Russian",
  "Weekly mock roadside inspection: the teacher plays the officer",
  "AI voice teacher: {min} minutes of speaking practice a month",
];
export const PAID_VOICE_MINUTES = 120;   // keep equal to PLANS.paid.minutes in api/_plans.js

// Optional: a person to write to (pay another way, company plans, questions). Leave "" to hide the button.
export const CONTACT_TELEGRAM = "";      // e.g. "https://t.me/your_username"
