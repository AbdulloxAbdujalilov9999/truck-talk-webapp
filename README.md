# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## One site, two courses

The site is a section picker with two English courses behind one sign-in:

| | Section | Path | What it is |
|---|---|---|---|
| 1 | **SpeakUp** — general basics | `/speakup/` (admin: `/speakup/admin/`) | A 60-day spoken-English course starting from zero — condensed from the original 90 days by merging closely related lessons (see below); originally its own repo, `speakup-webapp` |
| 2 | **Truck Talk** — necessary stuff only | `/trucktalk/` (admin: `/admin/`, Courses: `/teachers/`) | The focused 60-day course for truck drivers described in the rest of this README |

`/` (the root `index.html`) first checks who you are: new students go straight to SpeakUp, everyone with Truck Talk sees the two courses — Truck Talk first (main), SpeakUp second — with a "Continue here" mark on the one last used. An installed app opens straight into its last section; "All courses" (Settings, sign-in screens, admin Account) goes back to the picker (`/?hub=1`).

**One account, two sets of progress.** Both courses use the same Firebase project, so one sign-in covers both and a person has one profile (role, approval, teacher, free trial). Course data is kept apart: Truck Talk uses `progress/`, `resets/` and `unlockFrom/unlockTo`; SpeakUp uses the `speakup/` namespace (`speakup/progress|resets|passes|assignments`) and `spUnlockFrom/spUnlockTo`. Local (on-device) progress keys are `tte_*` and `su_*`, so they never collide. The two apps still can't share a page — they define the same global names — which is why each is its own entry point with its own `shared/` UI layer (`speakup/shared/`); only the Firebase init/config and `phone-login.js` are shared.

**Truck Talk is the main course, but closed to new students.** A student who signed up after 2026-10-07 18:56 UTC never sees Truck Talk: signing in anywhere sends them straight to SpeakUp (the home page redirects them, opening `/trucktalk/` redirects them, and SpeakUp never mentions it). Truck Talk opens for them when a teacher, manager or owner presses **Truck Talk access** on their Progress page (either admin dashboard → `users/{uid}/ttAccess`), or when they finish all 60 SpeakUp lessons — a toast tells them while the page is open. From then on, signing in shows the home page with both courses, **Truck Talk first and marked as the main course**, then SpeakUp (offered once per browser session; "Switch course" in Settings goes back). Students who already had an account keep their access; teachers, managers and owners always have it. The rule is in `shared/tt-access.js` (test: `node scripts/tt-access.test.mjs`) and is a client-side gate like the lesson locks; the grant itself is protected by `database.rules.json`.

**Staff see both courses finished.** Teacher, manager and owner accounts have every lesson open in SpeakUp too, shown as 100% complete with every quiz and exercise pre-answered — a view only, never saved or synced (same mechanism as Truck Talk's).

**SpeakUp: 90 → 60 lessons, nothing deleted.** Every 3 old weeks (12 lessons + 3 reviews) became 2 new weeks (8 lessons + 2 reviews): 24 pairs of neighbouring, closely related lessons were merged (e.g. *Greetings + The Alphabet*, *Present Simple + He/She -s*, *Zero + First Conditional*, *Hobbies + Technology*) and 6 pairs of review days. A merged lesson keeps all of both lessons' words, both dialogues (shown as Conversation 1 / 2, each voiced and role-played on its own), both quizzes and both speaking/live-session prompts. Grammar order is unchanged. There are no per-lesson Tip or Notes tabs in either course (grammar lives in the Grammar Book). It is generated: `node scripts/merge-speakup-curriculum.mjs` rebuilds `speakup/curriculum.js` from the untouched original in `scripts/data/` and **audits** that every word, dialogue line, question and prompt is still present. Progress saved under the old numbering is converted automatically (a merged lesson counts as done only when all its parts were; `speakup/shared/progress-merge.js` → `migrate`, test: `node scripts/speakup-progress-migration.test.mjs`).

**Phone-number sign-in (no SMS).** "Continue with phone number" asks for a name and a phone number and signs the person in — nothing is texted. Behind the scenes the number becomes a normal e-mail+password Firebase account (see `shared/phone-login.js`), so the same number gets the same account on any device. Because there's no code to prove ownership, *anyone who knows a number can sign in as that person* — fine for a language course, not for staff: keep teacher/manager/owner accounts on Google or e-mail. Phone accounts show their number instead of an e-mail and have no password to manage. A number typed without a country code is read by its length: 10 digits = US/Canada (+1 — most Truck Talk drivers), 9 digits = Uzbekistan (+998); `+1…`/`+998…` always work. Test: `node scripts/phone-login.test.mjs`.

**Many students at once.** Progress is saved through a queue (`shared/sync-queue.js`): rapid changes are batched into a few writes (a student changing something every ~2 s produces about one write per 8 s), a change is never lost if a write fails (it is retried with back-off, and again when the network returns or the tab is hidden/closed), there is never more than one write in flight per student, and unchanged content isn't re-written. A tab that has been in the background for 2 minutes lets go of its database connection (`keepConnectionLean` in `shared/firebase.js`; unsaved progress is flushed first, and it reconnects when the tab is shown again), and the admin dashboards redraw at most every 400 ms however many students are saving. Settings shows a "Progress backup" line (saved / saving / waiting for signal). `node scripts/sync-queue.test.mjs` simulates 100 students on a flaky network. **Plan limit:** Firebase's free Spark plan allows **100 simultaneous Realtime Database connections in total** — every open student tab, admin dashboard and live-class participant counts — so 100 students all active in the same instant already uses the whole allowance; the Blaze (pay-as-you-go) plan raises it to 200,000 and for a course this size the cost is a few cents a month. Moving to Blaze is a billing decision and is not done automatically.

**Russian.** Both courses translate the interface (`shared/i18n.js` / `speakup/shared/i18n.js`) and the lesson content: word meanings, example sentences, dialogues, quiz questions, speaking prompts, lesson titles and the Grammar Book are in `shared/content-ru.js` (Truck Talk, hand-maintained, index-matched to `trucktalk/curriculum.js`; covers the Orientation days too) and `speakup/shared/content-ru.js` (SpeakUp, **generated**: write Russian in `scripts/data/speakup-ru/part*.js` for the original 90 days, check with `node scripts/check-speakup-ru.mjs`, then `node scripts/build-speakup-content-ru.mjs` applies the same merges as the 60-lesson curriculum and fails if any list is misaligned). Uzbek for SpeakUp: word meanings, dialogues, titles and prompts are baked into its `curriculum.js` / `grammar.js`; the translations of example sentences and quiz questions are in `speakup/shared/content-uz.js` (generated the same way: hand-written Uzbek in `scripts/data/speakup-uz/part*.js`, entries are `"first 8 letters of the English§Uzbek"` so a misaligned one is caught, built by `node scripts/build-speakup-content-uz.mjs`).

**Every new account gives a phone number.** Besides the phone sign-in, anyone creating an account with e-mail or Google is asked for a phone number on the "Complete your profile" step (required, no SMS, not verified). It is stored as `users/{uid}/phone` (`+` and 10–15 digits, validated in `database.rules.json`) and shown next to the e-mail in both admin dashboards so a teacher can reach the student. Accounts made before this have no number.

## What's inside

- **`index.html`** — the section picker (the site's home page)
- **`trucktalk/`** — the Truck Talk student course (section 2):
  - **`index.html`** — app shell, design system, and layout
  - **`app.js`** — the course engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes, icons)
  - **`manifest.json`** — its installable-app manifest (the root `manifest.json` belongs to the picker)
- **`speakup/`** — SpeakUp (section 1): its own `index.html`, `app.js`, `curriculum.js`, `grammar.js`, `admin/`, `shared/`, `manifest.json` and service worker (`sw.js`, scope `/speakup/`)
- **`trucktalk/curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, quizzes, speaking prompts), organized into 12 weeks
- **`trucktalk/grammar.js`** — the standalone Grammar Book: 33 units across 8 topics, targeting the specific ways Uzbek and English grammar differ, each with an explanation, examples, a "common mistake" callout, a quiz, and teacher-facing notes
- **`admin/`** — the admin platform (owner / manager / teacher dashboard: users, students, progress, calendar), served at `/admin/` on the same site — see **Admin platform setup** below. (This used to be its own repo, `truck-talk-admin-app`; it now lives here, so there's one repo, one deploy and one link.)
- **`teachers/`** — Truck Talk Teachers (shown as **Courses** in the app's buttons), the live classroom platform (lesson guidebooks + Kahoot-style hosted quiz sessions), served at `/teachers/` — see **Teachers platform** below
- **`shared/`** — Firebase config + the account gate (sign in incl. phone number, request access, approval/restriction screens) used by the Truck Talk course, the admin platform, and Teachers; also `firebase.js`/`firebase-config.js`/`phone-login.js`, which SpeakUp re-uses
- **`scripts/`** — `make-native-index.js` (builds the native apps' `www/index.html` from `trucktalk/index.html`) and the phone-login unit test
- **`database.rules.json`** — the server-side Realtime Database access rules; the actual security boundary, not the app UI

## Checking everything

`node scripts/audit.mjs` runs every check in one go: JSON and JavaScript syntax, every local file reference, interface translations (Uzbek + Russian) for both courses, Russian lesson content completeness and alignment, that the generated SpeakUp files are up to date (and that nothing was lost in the 90→60 merge), and the unit tests (phone login, progress migration, sync queue with 100 simulated students). Run it before every push.

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

### Admin dashboard test rig

`node scripts/admin-harness/build.mjs` builds copies of both admin dashboards and the teachers page (`out/tt`, `out/speakup`, `out/teachers`) that run against an in-memory fake Firebase with sample users (pending trial, expired trial, phone-number user, approved student with progress, teacher, manager, restricted, owner). Serve the repo root and open `/scripts/admin-harness/out/tt/index.html` or `/out/speakup/index.html`. An empty user list hides whole classes of bugs, so check the dashboards with data after touching `admin/admin.js` or `speakup/admin/admin.js`. `node scripts/audit.mjs` also fails if a function begins by calling itself.

### Natural voice (ElevenLabs)

Both courses read words, examples and conversations aloud. `shared/neural-voice.js` asks `/api/tts` (Vercel function, `api/tts.js`) for a lifelike recording and plays it; if that is unavailable for any reason it silently falls back to the phone's built-in voice (`speakBrowser` in each `app.js`).

- **Keys live only in Vercel → Project → Settings → Environment Variables**, never in the repo: `ELEVENLABS_API_KEY` (optional `ELEVENLABS_VOICE_FEMALE`, `ELEVENLABS_VOICE_MALE`, `ELEVENLABS_MODEL`; default model `eleven_multilingual_v2`). `OPENAI_API_KEY` works as an alternative (`OPENAI_TTS_MODEL`, `OPENAI_VOICE_FEMALE/MALE`); ElevenLabs wins if both are set. Redeploy after changing them.
- The function only speaks phrases listed in `api/_phrases.json` (built from the lessons by `node scripts/build-voice-phrases.mjs`; the audit fails if it is stale), so it cannot be used as a free text-to-speech service. A phrase is generated once, then cached by Vercel's CDN and on each student's device; failures are never cached.
- Health check without any key exposure: `/api/tts?health=1` → `{configured, provider, phrases}`.
- Female/male follows the Settings choice; the other person in a conversation gets the opposite voice. The speed slider changes playback speed only, so recordings are shared.
- Local test with a stubbed provider and no key: `node scripts/admin-harness/serve.mjs` then open `/scripts/admin-harness/out/ttapp/index.html` (run `build.mjs` first). `node scripts/tts-api.test.mjs` covers the function.

### Helper: AI tutor + translator

**Teacher (menu item)**: a full-screen spoken conversation, like talking to a real teacher. Tap *Teacher* in the menu and the teacher greets you, speaks (device voice, English only), and you answer with the microphone (auto-listens after each reply; stops after 10 hands-free turns in a row) or the keyboard. Every reply has a short helper note in Uzbek/Russian (translations, "Better: …" corrections). It adapts to the student's progress via `window.TT_progressContext()` in each `app.js`; `mode: "talk"` in `api/tutor.js` returns `{say, note}`. The menu item only appears once the helper is available (key set, signed in). Uses the browser's speech engines, so quality depends on the phone; ElevenLabs is not used here on purpose (a long chat would use up the monthly characters the lesson voices need).

Every lesson also has a **lesson teacher**: a card at the top of the lesson ("Learn this lesson with your teacher") and the first tab of the 💬 panel on any lesson screen. It teaches the lesson on screen like a classroom teacher: the words 3–4 at a time with a short exercise each, gentle corrections ("Better: …"), the dialogue practised line by line, the grammar point, then a mini quiz. Explanations are in Uzbek or Russian (the interface language), the English stays simple. The lesson comes from `window.TT_lessonContext()` in each `app.js` (a review day revises that week's words); `mode: "lesson"` in `api/tutor.js` holds the teaching method. The panel also has **Translate** and a free **Tutor** chat. The 💬 button opens **Translate** (English ⇄ Uzbek/Russian, a word or a sentence) and **Tutor** (a short English practice chat that corrects mistakes gently and stays on English/trucking). `shared/tutor-ui.js` → `api/tutor.js` → Anthropic. It only appears once the server reports it is set up, so until then nobody sees a dead button.

- **Key:** `ANTHROPIC_API_KEY` in Vercel → Settings → Environment Variables (optional `TUTOR_MODEL`, default `claude-haiku-5-5`), then redeploy. Never in the repo or browser.
- **Who can use it:** only people the course lets in. The function verifies the caller's Firebase token and reads their profile with it: approved accounts, or students inside the 3-day trial. Restricted/expired/unknown callers get nothing.
- **Cost guards:** short inputs, small replies, small model, 30 requests per 10 minutes and 300 per day per person (best effort on serverless). **Set a monthly spend limit in the Anthropic Console** — that is the hard stop.
- Tests: `node scripts/tutor-api.test.mjs`. In the keyless local rig (`node scripts/admin-harness/serve.mjs`) the Google, database and Anthropic calls are stubbed.

### Lesson screens

Each lesson has four steps (three on days without a grammar point): **Words** (vocabulary + practice), **Conversation** (dialogue + role-play + speaking), **Grammar**, **Quiz**. The parts themselves are unchanged; `tabParts()`/`normalizeTab()` in each `app.js` define the grouping, and old links to `roleplay`/`dialogue`/`speak`/`practice` still land in the right place. The Grammar book lives under Lessons; the menu has five items.

### Admin: finding people, and why someone is restricted

Both dashboards (`/admin/`, `/speakup/admin/`; one shared user list) have a **search box** above the lists: type any part of a name, e-mail or phone number (digits in any format), a role, or a status word (*paused*, *graduated*, *left*, *restricted*); several words must all match. **Restrict** (and **Deny** on a pending request) now asks why: *Paused* (may come back), *Graduated*, *Left*, or no reason. It is saved as `users/{uid}/statusReason` + `restrictedAt`; the list shows a badge and "since" date, there are filter chips per reason, and **Grant access** clears the reason. A restricted person is signed out immediately and cannot use the lessons or the AI helper (`api/tutor.js` only serves approved accounts or students inside the 3-day trial); a graduate sees a "Course completed" message, a paused student "Access paused". `matchesUser()` in each `admin.js` is the search rule.

### Voice teacher (ElevenLabs agent)

The menu's **Teacher** becomes a live voice call (like a phone call) once the server has an agent configured; until then it is the text/voice teacher described above. The agent ("Truck Talk Teacher") lives in the ElevenLabs account; its settings are versioned in `elevenlabs/teacher.agent.json` (CLI project: `elevenlabs/agents.json` has its id, `agent_configs/` the synced copy; `npx @elevenlabs/cli agents push` from that folder updates it — note that the CLI's `--dry-run` on `agents add` really did create it). It is private (`enable_auth`): the browser gets only a one-time signed link from `api/agent.js`, for people `api/_auth.js` lets in (approved accounts, or students inside the 3-day trial — so paused, graduated and left students cannot call).

- **Turn it on:** Vercel env vars `ELEVENLABS_API_KEY` (already used for the lesson voices) and `ELEVENLABS_AGENT_ID` (`agent_8301m6cg6ha5f0pt7fz72kpb3r7n`), then redeploy. Remove `ELEVENLABS_AGENT_ID` to switch it off again.
- **Cost guards:** calls end after 30 minutes (`max_duration_seconds`, the most a single call can last), max 40 calls a day (`daily_limit`), silence ends a call after 30 s, plus 4 sessions per hour / 12 per day per person in `api/agent.js`. Calls are billed per minute by ElevenLabs against the plan; watch usage in the ElevenLabs dashboard. Audio is not recorded; transcripts are kept 30 days.
- **In the browser:** `shared/tutor-ui.js` loads `@elevenlabs/client@1.32.1` from jsDelivr only when the screen opens, locked with an integrity hash (update `SDK_URL`/`SDK_HASH` together). The student's name, course, finished lessons, next lesson and recent words are passed as the agent's `{{dynamic variables}}`. Each teacher line has a *Translate* link (uses the helper).
- Tests: `node scripts/agent-api.test.mjs`; the rig fakes the ElevenLabs session (`window.TTAgentSDK`).

### Lesson presentations (the teacher teaches in Uzbek)

Students are learning English, so the teacher explains in **Uzbek** and says the English for them to repeat. Lessons that have one get a card "Learn this lesson with your teacher" that opens a full-screen presentation (`shared/teach-ui.js`): intro → each word (English word, what it means in Uzbek, "repeat", an example) → the dialogue (two voices, translation on screen, current line highlighted) → the grammar rule in Uzbek with examples → on to the quiz. Review days quiz the week's words (the meaning appears after a pause). Lessons without one keep the AI lesson teacher. No captions are shown for the narration, by request.

- **Built from the lesson's own data** (`shared/teach-script.js`): Uzbek meanings, dialogue translations and the Grammar Book's `ruleUz`/examples, plus fixed Uzbek sentences ("Takrorlang.", "Misol.", ...). **Enabled so far: Truck Talk days 1–5** (`ENABLED` at the top of that file; add days or SpeakUp once they sound right). A grammar point with no Grammar Book unit needs a hand-written Uzbek text in `GRAMMAR_UZ` (day 3 has one).
- **Audio:** English lines are the normal lesson voices (`/api/tts`). The Uzbek narration is `/api/tts?l=uz`: ElevenLabs **`eleven_v4`** with `language_code: "uz"` (v4 and v4 Turbo officially support Uzbek; v3 and Multilingual v2 do not) and a native Uzbek voice from the voice library (default **Davronbek**, `ELEVENLABS_UZ_VOICE` to change it: other Uzbek voices tried were Mirzaev `RaNVfTYq3HYeFPLng6XN`, Bahriddin `1xZ621W54CwGT3dITE48`, Sodiqjon `CBeZJ4EnTnrJmhtlMCNC`; all native Uzbek voices in the library are male). A Scribe round-trip heard every word back correctly. Only the lines in `api/_phrases_uz.json` can be spoken (built by `node scripts/build-voice-phrases.mjs`, which also checks every English line the teacher says is an allowed lesson phrase), so cost is bounded: ~4,200 characters for days 1–5, each generated once and cached. **Audio is cached forever by URL**, so when the Uzbek voice or model changes, bump `UZ_VOICE_VERSION` in `shared/neural-voice.js`.
- If audio cannot be played, English falls back to the device voice and Uzbek to a reading pause, so the lesson still moves on.

### The AI teaches in Uzbek (live call and written chat)

Students do not speak English yet, so the AI teacher explains, asks and encourages in Uzbek and uses English only for the word being taught.
- **Live voice call** (the ElevenLabs agent, `elevenlabs/teacher.agent.json`): language `uz`, TTS `eleven_v4_turbo` with the native Uzbek voice, speech recognition `scribe_realtime`, and a prompt that teaches one word at a time (English word, Uzbek meaning, "repeat", a check question in Uzbek). Edit the JSON and run `npx @elevenlabs/cli agents push` from `elevenlabs/` (copy `agent_configs/Truck-Talk-Teacher.json` too: `push` reads that one). The site picks up changes immediately; no deploy needed.
- **Written Teacher** (`mode: "talk"` in `api/tutor.js`, the fallback when the call is unavailable): answers `{ say, en }` — `say` is the Uzbek teaching message, `en` the one English word/phrase being practised (shown big with a speaker button; only that is read aloud, by the device's English voice). Microphone input listens for English right after she asks for an English phrase, and for Uzbek otherwise. Needs a browser that supports Uzbek speech recognition for the Uzbek case; typing always works.

### The teacher on the platform: orb, transcript, dock

- **Teacher screen** (menu → Teacher): a dark "control room" with an animated orb (`.tt-orb` in `shared/tutor-ui.js`): idle breathing, cyan while listening, violet while speaking, spinning ring while connecting. The orb swells with the real loudness (`getInputVolume()` / `getOutputVolume()` from the ElevenLabs library). Under it is the **transcript of the whole call**, the teacher on the left and the student on the right, with a Translate link on teacher lines. **The transcript needs the agent to send text events**: `client_events` in `elevenlabs/teacher.agent.json` must include `user_transcript`, `agent_response` (and the tentative/correction/part events). The earlier "audio, interruption" only was why no text showed; after editing, `agents push` from `elevenlabs/` (copy `agent_configs/Truck-Talk-Teacher.json` too).
- **Docked teacher** (`#teacherDock`, top of every lesson, sticky): a small orb, a line about the lesson, *Start lesson* (opens the presentation, or the AI lesson teacher where there is none), a mic (asks the Teacher a question) and a sound switch (`tt_dock_sound` in localStorage). The lesson underneath is used as usual. For a lesson with a presentation it says one Uzbek line (`TTTeachScript.dockLine`) the first time the lesson opens in a visit.
- **Less praise**: the live agent, the written teacher and the lesson teacher are told to confirm a correct answer in a word ("To'g'ri.") and not to stack compliments. Tune the wording in the agent prompt (`FEEDBACK` rule) and in `api/tutor.js` (`talkPrompt`, `lessonPrompt`).
- The translator decides the language first (English → Uzbek/Russian; anything else → English); checked against the real model. The written teacher recovers from malformed JSON (`parseTalk`), so a student never sees scaffolding.
