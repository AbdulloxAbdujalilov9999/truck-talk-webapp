/* Truck Talk English — service worker.
 * Caches the static app shell (HTML/JS/CSS/curriculum data) so repeat
 * visits load instantly and lessons already opened once stay usable with
 * a weak or no signal — a real scenario for this app's audience. Only
 * same-origin files are handled here; Firebase SDK/API calls and fonts are
 * left to the browser.
 */
const CACHE_NAME = "tte-shell-v5";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./curriculum.js",
  "./grammar.js",
  "./manifest.json",
  "./shared/tokens.css",
  "./shared/theme.css",
  "./shared/course.css",
  "./shared/firebase.js",
  "./shared/firebase-config.js",
  "./shared/auth-gate.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: a fresh deploy shows up on the very next open (no stale
// screens after an update); the cache is only the offline fallback, so
// lessons opened once still work with a weak or no signal.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, fonts, gstatic: the browser handles these
  if (url.pathname.startsWith("/__/")) return;        // Firebase auth handler proxy

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
  );
});
