/* Truck Talk English — service worker.
 * Caches the static app shell (HTML/JS/CSS/curriculum data) so repeat
 * visits load instantly and lessons already opened once stay usable with
 * a weak or no signal — a real scenario for this app's audience. Firebase
 * SDK/API calls are explicitly left alone: they're either pinned CDN URLs
 * the browser already caches well on its own, or live calls that must
 * hit the network (auth, database reads/writes).
 */
const CACHE_NAME = "tte-shell-v4";
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = req.url;
  if (new URL(url).pathname.startsWith("/__/")) return; // Firebase auth handler proxy
  if (url.includes("googleapis.com") || url.includes("gstatic.com") || url.includes("firebasedatabase.app") || url.includes("firebaseapp.com")) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
