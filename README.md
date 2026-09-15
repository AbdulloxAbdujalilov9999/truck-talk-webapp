# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## What's inside

- **`index.html`** — the app shell, design system, and layout
- **`app.js`** — the application engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes)
- **`curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, grammar tips, quizzes, speaking prompts), organized into 12 weeks
- **`auth.js`** — accounts, admin approval, presence, and sign-up email notifications (Firebase Auth + Firestore + EmailJS)
- **`firestore.rules`** — the Firestore Security Rules that enforce admin-only approval server-side (not just in the UI)

## Running it locally

This is a static web app (one external dependency: Firebase, loaded via CDN — see **Accounts setup** below). Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Accounts setup (Firebase + EmailJS)

The app is gated behind sign-up/login. New accounts start `pending` and can't reach the course until the admin (`abdujalilov7707@gmail.com`, hardcoded in `auth.js`) approves them from the in-app **Admin** dashboard, which also shows who's currently online.

1. **Firebase** — create a free project at [console.firebase.google.com](https://console.firebase.google.com), register a web app, and copy the `firebaseConfig` object into the top of `auth.js`. Enable **Authentication → Sign-in method → Email/Password**, and create a **Firestore Database** (production mode). Paste the contents of `firestore.rules` into **Firestore → Rules** and publish.
2. **EmailJS** — create a free account at [emailjs.com](https://www.emailjs.com), connect a Gmail service, create a template using the variables `{{user_name}}`, `{{user_email}}`, `{{signup_date}}` (set the template's "To email" to the admin address), and paste the Service ID / Template ID / Public Key into the top of `auth.js`.
3. The first account created with the admin email is auto-approved as admin; every other sign-up starts `pending` and triggers an EmailJS notification to the admin.

The Firebase config values are not secret (they're meant to ship in client code) — access control is enforced entirely by `firestore.rules`, not by hiding them.

## Features

- 60 daily lessons (12 weeks × 5 days, every 5th day a cumulative review) covering trucking & logistics English end to end
- Flashcard vocabulary with text-to-speech pronunciation
- Scripted dialogues with line-by-line or full audio playback
- Auto-scored multiple-choice quizzes that gate day-unlocking
- Speech-recognition "Radio Check" speaking practice (Chromium-based browsers)
- Dashboard with a mile-marker progress map, streaks, and XP
- Searchable glossary auto-built from all 60 days of vocabulary
- Bilingual English/Uzbek toggle
- Printable certificate of completion after the Day 60 Final Road Test
- Progress saved locally per device (`localStorage`) — no backend required
