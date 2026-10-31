/* Truck Talk English — service worker for the site root (the section picker,
 * Truck Talk at /trucktalk/, and the admin / Courses pages). SpeakUp at
 * /speakup/ registers its own, more specific one.
 * Caches the static app shell (HTML/JS/CSS/curriculum data) so repeat
 * visits load instantly and lessons already opened once stay usable with
 * a weak or no signal — a real scenario for this app's audience. Only
 * same-origin files are handled here; Firebase SDK/API calls and fonts are
 * left to the browser.
 */
const CACHE_NAME = "tte-shell-v22";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./trucktalk/",
  "./trucktalk/index.html",
  "./trucktalk/app.js",
  "./trucktalk/curriculum.js",
  "./trucktalk/grammar.js",
  "./trucktalk/manifest.json",
  "./shared/tokens.css",
  "./shared/i18n.js",
  "./shared/theme.css",
  "./shared/course.css",
  "./shared/firebase.js",
  "./shared/firebase-config.js",
  "./shared/auth-gate.js",
  "./shared/phone-login.js",
  "./shared/sync-queue.js",
  "./shared/tt-access.js",
  "./shared/neural-voice.js",
  "./shared/tutor-ui.js",
  "./icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Only this app's own caches: SpeakUp's service worker (/speakup/sw.js)
    // keeps its "su-shell-*" cache on the same origin.
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("tte-shell-") && k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: a fresh deploy shows up on the very next open (no stale
// screens after an update); the cache is only the offline fallback, so
// lessons opened once still work with a weak or no signal.
// Offline fallback for a page that was never cached: the shell of the section
// it belongs to (the site root is the section picker).
function offlineShell(url){
  if (url.pathname.startsWith("/trucktalk/")) return "./trucktalk/index.html";
  if (url.pathname.startsWith("/speakup/")) return "./speakup/index.html";
  return "./index.html";
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, fonts, gstatic: the browser handles these
  if (url.pathname.startsWith("/__/")) return;        // Firebase auth handler proxy
  if (url.pathname.startsWith("/api/")) return;       // natural-voice audio: shared/neural-voice.js keeps its own cache

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match(offlineShell(url))))
  );
});
