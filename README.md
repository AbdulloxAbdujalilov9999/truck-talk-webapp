# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## What's inside

- **`index.html`** — the student course: app shell, design system, and layout
- **`app.js`** — the course engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes, icons)
- **`curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, grammar tips, quizzes, speaking prompts), organized into 12 weeks
- **`grammar.js`** — the standalone Grammar Book: 28 units across 7 topics, targeting the specific ways Uzbek and English grammar differ, each with an explanation, examples, a "common mistake" callout, and a quiz
- **`admin/`** — the admin platform (owner / manager / teacher dashboard: users, students, progress, calendar) — see **Admin platform setup** below
- **`shared/`** — Firebase config + the account gate (sign in, request access, approval/restriction screens) used by both the course and the admin platform
- **`database.rules.json`** — the server-side Realtime Database access rules; the actual security boundary, not the app UI

## Running it locally

This is a static web app (one external dependency: Firebase, loaded via CDN — see **Admin platform setup** below). Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` for the course, or `http://localhost:8000/admin/` for the admin dashboard.

## Admin platform setup (Firebase)

The course and the admin dashboard now share one Firebase project: everyone signs in (Google, Apple, or email/password), fills in their name, and taps **Request access**; an owner or manager approves the request from `admin/` and assigns a role (Teacher, or Student + their Teacher). Until you connect a real Firebase project, both `index.html` and `admin/index.html` will just show a "Setup needed" screen.

1. **Create a Firebase project** — free Spark plan is enough — at [console.firebase.google.com](https://console.firebase.google.com), then **Project settings → General → Your apps → add a Web app**, and copy its config object into [`shared/firebase-config.js`](shared/firebase-config.js).
2. **Authentication → Sign-in method** — enable **Google** and **Email/Password**. Apple Sign-In additionally needs an Apple Developer Program membership and a "Sign in with Apple" Services ID configured in both Apple's and Firebase's consoles — skip it for now if you don't need it, the button just won't work until then.
3. **Realtime Database** — not Firestore: create one via `npx firebase-tools init database` (or Build → Realtime Database → Create Database in the console), then publish [`database.rules.json`](database.rules.json) with `npx firebase-tools deploy --only database` (or paste it into the console's Rules tab). Realtime Database works on the free **Spark plan with no billing account required** — that's specifically why this project uses it instead of Firestore, which now requires upgrading to Blaze just to create a database at all. Add the resulting `databaseURL` to `shared/firebase-config.js` alongside the rest of the config (get the full config, including `databaseURL`, any time via `npx firebase-tools apps:sdkconfig web`).
4. Open the course or the admin dashboard and sign in with **`abdujalilov7707@gmail.com`** — that address is hardcoded (in `shared/firebase-config.js` and independently in `database.rules.json`) to auto-approve as the **owner**, skipping the request queue. Everyone else who signs up lands in the owner/manager's **Users** section as a pending request.

Roles: **Owner** (everything: approve/restrict anyone, assign teachers, edit any teacher's calendar) and **Manager** (same day-to-day approval/management powers, but can't touch owner or manager accounts) use the admin dashboard's Users/Students/Progress/Calendar sections; **Teacher** gets Students/Progress/Calendar scoped to their own assigned students, and manages their own calendar; **Student** is unaffected — signing in just drops them into the course exactly as before, with their progress now also synced to the cloud so their teacher can see it.

## Features

- 60 daily lessons (12 weeks × 5 days, every 5th day a cumulative review), drilled down as Lessons → Week → Day, covering trucking & logistics English end to end, 20 vocabulary words per day
- Flashcard vocabulary with text-to-speech pronunciation, auto-tuned to prefer instant on-device voices (including Siri voices on Apple devices) over laggy network ones
- Scripted dialogues with line-by-line or full audio playback
- Auto-generated Practice tab (fill-in-the-blank, word matching) built fresh from each day's vocabulary
- Auto-scored quizzes blending hand-written comprehension questions with generated vocabulary questions; gate day-unlocking
- Speech-recognition "Radio Check" speaking practice (Chromium-based browsers)
- Standalone **Grammar Book** — 28 units across 7 topics targeting real Uzbek/English grammar differences (articles, do-support, word order, modals...), drilled down as Grammar → Topic → Unit, each with a quiz
- **Homework** section — the full course glossary (952+ words) lives here now as an expandable accordion of 48 sessions of 20 words, with a search box that jumps straight to a session; each session's quiz is the only way to mark it complete
- Dashboard with a mile-marker progress map, streaks, and XP
- Bilingual English/Uzbek toggle
- Consistent inline-SVG icon set throughout (no emoji)
- Printable certificate of completion after the Day 60 Final Road Test
- Mobile-first layout with a fixed bottom tab bar
- Progress saved locally per device (`localStorage`) first and always; once signed in it also syncs to the cloud so your teacher and the owner can see it

## Brand colours

Main brand colour: **Truck Talk Navy `#1A3D63`**. All colours live in one file, `shared/tokens.css`, which both the course site and the admin dashboard link.

| Name | Hex | Used for |
| --- | --- | --- |
| Navy 900 | `#0A1931` | Text on light, page background in dark mode |
| **Navy 700 (main)** | **`#1A3D63`** | Header, primary buttons, logo, icon background |
| Navy 500 | `#4A7FA7` | Progress bars, highlights, secondary accents |
| Navy 200 | `#B3CFE5` | Soft fills, primary button in dark mode |
| Navy 50 | `#F6FAFD` | Page background in light mode |
