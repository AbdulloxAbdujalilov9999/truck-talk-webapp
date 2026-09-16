# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## What's inside

- **`index.html`** — the app shell, design system, and layout
- **`app.js`** — the application engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes, icons)
- **`curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, grammar tips, quizzes, speaking prompts), organized into 12 weeks
- **`grammar.js`** — the standalone Grammar Book: 28 units across 7 topics, targeting the specific ways Uzbek and English grammar differ, each with an explanation, examples, a "common mistake" callout, and a quiz

## Running it locally

This is a static, dependency-free web app. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

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
- Progress saved locally per device (`localStorage`) — no backend required
