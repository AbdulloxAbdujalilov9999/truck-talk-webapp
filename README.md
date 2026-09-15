# Truck Talk English

A 60-day, self-paced English course for Uzbek truck drivers, built entirely around real trucking and logistics scenarios — pre-trip inspections, DOT stops, weigh stations, dispatch communication, breakdowns, and more.

## What's inside

- **`index.html`** — the app shell, design system, and layout
- **`app.js`** — the application engine (lesson rendering, progress tracking, speech synthesis/recognition, quizzes)
- **`curriculum.js`** — the full 60-day curriculum data (vocabulary, dialogues, grammar tips, quizzes, speaking prompts), organized into 12 weeks

## Running it locally

This is a static, dependency-free web app. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

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
