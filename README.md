# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## One site, two courses

The site is a section picker with two English courses behind one sign-in:

| | Section | Path | What it is |
|---|---|---|---|
| 1 | **SpeakUp** — general basics | `/speakup/` (admin: `/speakup/admin/`) | A 60-day spoken-English course starting from zero — condensed from the original 90 days by merging closely related lessons (see below); originally its own repo, `speakup-webapp` |
| 2 | **Truck Talk** — necessary stuff only | `/trucktalk/` (admin: `/admin/`, Courses: `/teachers/`) | The focused 60-day course for truck drivers described in the rest of this README |

`/` (the root `index.html`) is the picker: SpeakUp first, Truck Talk second, with a "Continue here" mark on the section last used. An installed app opens straight into its last section; "All courses" (Settings, sign-in screens, admin Account) goes back to the picker (`/?hub=1`).

**One account, two sets of progress.** Both courses use the same Firebase project, so one sign-in covers both and a person has one profile (role, approval, teacher, free trial). Course data is kept apart: Truck Talk uses `progress/`, `resets/` and `unlockFrom/unlockTo`; SpeakUp uses the `speakup/` namespace (`speakup/progress|resets|passes|assignments`) and `spUnlockFrom/spUnlockTo`. Local (on-device) progress keys are `tte_*` and `su_*`, so they never collide. The two apps still can't share a page — they define the same global names — which is why each is its own entry point with its own `shared/` UI layer (`speakup/shared/`); only the Firebase init/config and `phone-login.js` are shared.

**Truck Talk is locked for new students.** A student who signed up after 2026-10-07 18:56 UTC can't open Truck Talk until they have finished SpeakUp (all 60 lessons) or a teacher, manager or owner opens it for them (the **Truck Talk access** button on a student's Progress page, in either admin dashboard → `users/{uid}/ttAccess`). The lock screen updates by itself the moment either happens. Students who already had an account keep their access; teachers, managers and owners are never locked. (Client-side gate in `shared/auth-gate.js`, like the lesson locks; the grant itself is protected by `database.rules.json`.)

**Staff see both courses finished.** Teacher, manager and owner accounts have every lesson open in SpeakUp too, shown as 100% complete with every quiz and exercise pre-answered — a view only, never saved or synced (same mechanism as Truck Talk's).

**SpeakUp: 90 → 60 lessons, nothing deleted.** Every 3 old weeks (12 lessons + 3 reviews) became 2 new weeks (8 lessons + 2 reviews): 24 pairs of neighbouring, closely related lessons were merged (e.g. *Greetings + The Alphabet*, *Present Simple + He/She -s*, *Zero + First Conditional*, *Hobbies + Technology*) and 6 pairs of review days. A merged lesson keeps all of both lessons' words, both dialogues (shown as Conversation 1 / 2, each voiced and role-played on its own), both grammar tips, both quizzes and both speaking/live-session prompts. Grammar order is unchanged. It is generated: `node scripts/merge-speakup-curriculum.mjs` rebuilds `speakup/curriculum.js` from the untouched original in `scripts/data/` and **audits** that every word, dialogue line, question, tip and prompt is still present. Progress saved under the old numbering is converted automatically (a merged lesson counts as done only when all its parts were; `speakup/shared/progress-merge.js` → `migrate`, test: `node scripts/speakup-progress-migration.test.mjs`).

**Phone-number sign-in (no SMS).** "Continue with phone number" asks for a name and a phone number and signs the person in — nothing is texted. Behind the scenes the number becomes a normal e-mail+password Firebase account (see `shared/phone-login.js`), so the same number gets the same account on any device. Because there's no code to prove ownership, *anyone who knows a number can sign in as that person* — fine for a language course, not for staff: keep teacher/manager/owner accounts on Google or e-mail. Phone accounts show their number instead of an e-mail and have no password to manage. A number typed without a country code is read by its length: 10 digits = US/Canada (+1 — most Truck Talk drivers), 9 digits = Uzbekistan (+998); `+1…`/`+998…` always work. Test: `node scripts/phone-login.test.mjs`.

## What's inside

- **`index.html`** — the section picker (the site's home page)
- **`trucktalk/`** — the Truck Talk student course (section 2):
  - **`index.html`** — app shell, design system, and layout
  - **`app.js`** — the course engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes, icons)
  - **`manifest.json`** — its installable-app manifest (the root `manifest.json` belongs to the picker)
- **`speakup/`** — SpeakUp (section 1): its own `index.html`, `app.js`, `curriculum.js`, `grammar.js`, `admin/`, `shared/`, `manifest.json` and service worker (`sw.js`, scope `/speakup/`)
- **`trucktalk/curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, grammar tips, quizzes, speaking prompts), organized into 12 weeks
- **`trucktalk/grammar.js`** — the standalone Grammar Book: 33 units across 8 topics, targeting the specific ways Uzbek and English grammar differ, each with an explanation, examples, a "common mistake" callout, a quiz, and teacher-facing notes
- **`admin/`** — the admin platform (owner / manager / teacher dashboard: users, students, progress, calendar), served at `/admin/` on the same site — see **Admin platform setup** below. (This used to be its own repo, `truck-talk-admin-app`; it now lives here, so there's one repo, one deploy and one link.)
- **`teachers/`** — Truck Talk Teachers (shown as **Courses** in the app's buttons), the live classroom platform (lesson guidebooks + Kahoot-style hosted quiz sessions), served at `/teachers/` — see **Teachers platform** below
- **`shared/`** — Firebase config + the account gate (sign in incl. phone number, request access, approval/restriction screens) used by the Truck Talk course, the admin platform, and Teachers; also `firebase.js`/`firebase-config.js`/`phone-login.js`, which SpeakUp re-uses
- **`scripts/`** — `make-native-index.js` (builds the native apps' `www/index.html` from `trucktalk/index.html`) and the phone-login unit test
- **`database.rules.json`** — the server-side Realtime Database access rules; the actual security boundary, not the app UI

## Running it locally

This is a static web app (one external dependency: Firebase, loaded via CDN — see **Admin platform setup** below). Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` for the section picker, `http://localhost:8000/trucktalk/` or `http://localhost:8000/speakup/` for a course, `http://localhost:8000/admin/` (or `/speakup/admin/`) for the admin dashboard, or `http://localhost:8000/teachers/` for Truck Talk Teachers (and `http://localhost:8000/teachers/join.html` for the participant/player view — see **Teachers platform** below).

## Admin platform setup (Firebase)

The course and the admin dashboard now share one Firebase project: everyone signs in (Google, Apple, or email/password), fills in their name, and taps **Request access**; an owner or manager approves the request from `admin/` and assigns a role (Teacher, or Student + their Teacher). Until you connect a real Firebase project, both `index.html` and `admin/index.html` will just show a "Setup needed" screen.

1. **Create a Firebase project** — free Spark plan is enough — at [console.firebase.google.com](https://console.firebase.google.com), then **Project settings → General → Your apps → add a Web app**, and copy its config object into [`shared/firebase-config.js`](shared/firebase-config.js).
2. **Authentication → Sign-in method** — enable **Google** and **Email/Password** (phone-number sign-in rides on Email/Password, so it needs nothing extra). Apple Sign-In additionally needs an Apple Developer Program membership and a "Sign in with Apple" Services ID configured in both Apple's and Firebase's consoles — skip it for now if you don't need it, the button just won't work until then.
3. **Realtime Database** — not Firestore: create one via `npx firebase-tools init database` (or Build → Realtime Database → Create Database in the console), then publish [`database.rules.json`](database.rules.json) with `npx firebase-tools deploy --only database` (or paste it into the console's Rules tab). Realtime Database works on the free **Spark plan with no billing account required** — that's specifically why this project uses it instead of Firestore, which now requires upgrading to Blaze just to create a database at all. Add the resulting `databaseURL` to `shared/firebase-config.js` alongside the rest of the config (get the full config, including `databaseURL`, any time via `npx firebase-tools apps:sdkconfig web`).
4. Open the course or the admin dashboard and sign in with **`abdujalilov7707@gmail.com`** — that address is hardcoded (in `shared/firebase-config.js` and independently in `database.rules.json`) to auto-approve as the **owner**, skipping the request queue. Everyone else who signs up lands in the owner/manager's **Users** section as a pending request.

Roles: **Owner** (everything: approve/restrict anyone, assign teachers, edit any teacher's calendar) and **Manager** (same day-to-day approval/management powers, but can't touch owner or manager accounts) use the admin dashboard's Users/Students/Progress/Calendar sections; **Teacher** gets Students/Progress/Calendar scoped to their own assigned students, and manages their own calendar; **Student** is unaffected — signing in just drops them into the course exactly as before, with their progress now also synced to the cloud so their teacher can see it.

## Teachers platform

**Truck Talk Teachers** (`teachers/`) is a separate app for holding a *live, instructor-led* lesson — the classroom/guidebook counterpart to the self-paced course. It has two parts:

- **Guidebook** (`teachers/index.html`) — every one of the 60 curriculum days and all 33 Grammar Book units, browsable in one place, with every piece of teaching content already in `curriculum.js`/`grammar.js` laid out for prep and in-class reference: the full vocabulary list with pronunciation playback, the dialogue script, the grammar tip or rule, a quiz **answer key** (the correct choice is marked, unlike the student-facing quiz), the speaking prompt, and — for Grammar Book units — the **Teacher Notes** callout (classroom drills and what to prioritize, written specifically for this).
- **Live class** — from any day or unit, "Start Live Class" opens a Kahoot-style hosted session: the teacher gets a 5-character room code to read aloud or put on a shared screen, drivers join on their own phones at `teachers/join.html` with just that code and a name (no account needed), and the teacher steps through vocabulary/dialogue/grammar slides while quiz questions run live — drivers tap an answer, a countdown closes the question, and the teacher reveals the correct answer with scores (speed-weighted, like Kahoot) and a running leaderboard, all synced in real time through the same Realtime Database as the rest of the platform.

It's gated the same way the admin dashboard is — owner/manager/teacher accounts only, reusing `shared/auth-gate.js`'s `"teachers"` app kind — but it's otherwise independent: slide *content* is never written to the database (every device already has `curriculum.js`/`grammar.js` loaded and derives the same slide list from the lesson reference), only the live session state (which slide is showing, who's joined, their answers and scores) lives under the `liveClasses/` node in [`database.rules.json`](database.rules.json).

Setup, on top of the Firebase project from **Admin platform setup** above:

1. Deploy the updated rules (they now include the `liveClasses/` node): `npx firebase-tools deploy --only database`.
2. **Authentication → Sign-in method → enable Anonymous.** A driver joining `teachers/join.html` without an existing Truck Talk account signs in anonymously just for that session (if they already have an account signed in on that device, it reuses that instead) — without this toggle, joining a class fails.
3. Open `teachers/index.html` and sign in with an owner, manager, or teacher account — a student account gets redirected back to the course.

**One site, three Truck Talk apps (plus SpeakUp).** The course (`/trucktalk/`), the admin dashboard (`/admin/`) and Courses/Teachers (`/teachers/`) are served by the same deployment, so signing in once covers all of them and moving between them keeps you in the same tab and the same installed app. Owner/manager/teacher accounts get **Go to Admin Dashboard** and **Go to Courses** buttons in the course's Settings, and matching links in the admin dashboard's Account section and the Courses header. The links are plain same-site paths (see `SITE` in `shared/auth-gate.js`); only the native Android/iOS course app, which bundles just the course, falls back to the live site's absolute URL.

**Staff accounts see the course as finished.** Teacher, manager and owner accounts always have all 60 lessons open, and the course shows them as already completed — every lesson, grammar unit and homework session at 100%, every quiz and practice exercise pre-answered correctly (so it works as an answer key). This is a view only: it's never saved to the device or the cloud, so a student who signs in on the same device afterwards keeps their own real progress. Students start with Day 1 open and need a teacher or manager to open each lesson after that.

## Features

- 60 daily lessons (12 weeks × 5 days, every 5th day a cumulative review), drilled down as Lessons → Week → Day, covering trucking & logistics English end to end, 20 vocabulary words per day
- Flashcard vocabulary with text-to-speech pronunciation, auto-tuned to prefer instant on-device voices (including Siri voices on Apple devices) over laggy network ones
- Scripted dialogues with line-by-line or full audio playback
- Auto-generated Practice tab (fill-in-the-blank, word matching) built fresh from each day's vocabulary
- Auto-scored quizzes blending hand-written comprehension questions with generated vocabulary questions; gate day-unlocking
- Speech-recognition "Radio Check" speaking practice (Chromium-based browsers)
- Standalone **Grammar Book** — 33 units across 8 topics targeting real Uzbek/English grammar differences (articles, do-support, word order, modals...), drilled down as Grammar → Topic → Unit, each with a quiz
- **Truck Talk Teachers** (`teachers/`) — a live, instructor-led classroom platform: a full teaching guidebook for all 60 days and every Grammar Book unit (vocabulary, scripts, quiz answer keys, teacher notes), plus Kahoot-style hosted quiz sessions drivers join from their phones — see **Teachers platform** below
- **Homework** section — the full course glossary (952+ words) lives here now as an expandable accordion of 48 sessions of 20 words, with a search box that jumps straight to a session; each session's quiz is the only way to mark it complete
- Dashboard with a mile-marker progress map, streaks, and XP
- Bilingual English/Uzbek toggle
- Consistent inline-SVG icon set throughout (no emoji)
- Printable certificate of completion after the Day 60 Final Road Test
- Mobile-first layout with a fixed bottom tab bar
- Progress saved locally per device (`localStorage`) first and always; once signed in it also syncs to the cloud so your teacher and the owner can see it

## Brand colours

Main brand colour: **Truck Talk Navy `#1A3D63`**. All colours live in one file, `shared/tokens.css`, which the course site, the admin dashboard, and Teachers all link.

| Name | Hex | Used for |
| --- | --- | --- |
| Navy 900 | `#0A1931` | Text on light, page background in dark mode |
| **Navy 700 (main)** | **`#1A3D63`** | Header, primary buttons, logo, icon background |
| Navy 500 | `#4A7FA7` | Progress bars, highlights, secondary accents |
| Navy 200 | `#B3CFE5` | Soft fills, primary button in dark mode |
| Navy 50 | `#F6FAFD` | Page background in light mode |
