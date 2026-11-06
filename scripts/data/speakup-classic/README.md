Snapshot of the separate SpeakUp site's lessons (repo speakup-webapp, speak-upvercel.vercel.app): `curriculum.js` and `grammar.js`.
Used only by `scripts/build-voice-phrases.mjs` so the voice endpoint (api/tts.js) may speak that site's lesson lines and the teacher's Uzbek
narration for its 90 lessons ("SpeakUp Classic" in shared/teach-script.js). When that site's lessons change, copy the two files here again and
run `node scripts/build-voice-phrases.mjs`.
