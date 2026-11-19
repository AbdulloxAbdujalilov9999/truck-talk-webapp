/* Truck Talk English — service worker for the site root (the home page, which
 * opens Truck Talk, Truck Talk at /trucktalk/, and the admin / Courses pages).
 * Caches the static app shell (HTML/JS/CSS/curriculum data) so repeat
 * visits load instantly and lessons already opened once stay usable with
 * a weak or no signal — a real scenario for this app's audience. Only
 * same-origin files are handled here; Firebase SDK/API calls and fonts are
 * left to the browser.
 */
const CACHE_NAME = "tte-shell-v35";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./trucktalk/",
  "./trucktalk/index.html",
  "./trucktalk/app.js",
  "./trucktalk/roadside.js",
  "./trucktalk/curriculum.js",
  "./trucktalk/grammar.js",
  "./trucktalk/manifest.json",
  "./shared/tokens.css",
  "./shared/i18n.js",
  "./shared/content-uz.js",
  "./shared/theme.css",
  "./shared/course.css",
  "./shared/firebase.js",
  "./shared/firebase-config.js",
  "./shared/auth-gate.js",
  "./shared/phone-login.js",
  "./shared/sync-queue.js",
  "./shared/progress-merge.js",
  "./shared/pay-config.js",
  "./shared/neural-voice.js",
  "./shared/tutor-ui.js",
  "./shared/teach-script.js",
  "./shared/teach-ui.js",
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
    // Only this app's own caches (SpeakUp's old "su-shell-*" cache is removed by speakup/sw.js).
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("tte-shell-") && k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: a fresh deploy shows up on the very next open (no stale screens after an update), and the
// browser only re-checks files it already has (an unchanged file costs a tiny "not modified" answer, not a new
// download). On a weak signal, though, waiting for the network can stall a screen for half a minute, so if a
// file is already saved on the phone and the network hasn't answered within NET_WAIT_MS, the saved copy is shown
// and the network answer (when it comes) still updates the cache for next time.
// Offline fallback for a page that was never cached: the shell of the section it belongs to.
const NET_WAIT_MS = 3500;
function offlineShell(url){
  if (url.pathname.startsWith("/trucktalk/")) return "./trucktalk/index.html";
  return "./index.html";
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, fonts, gstatic: the browser handles these
  if (url.pathname.startsWith("/__/")) return;        // Firebase auth handler proxy
  if (url.pathname.startsWith("/api/")) return;       // natural-voice audio: shared/neural-voice.js keeps its own cache

  const network = fetch(req).then((res) => {
    if (res && res.ok){
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
    }
    return res;
  });
  event.waitUntil(network.catch(() => {}));   // let the cache update finish even if the saved copy answered first
  event.respondWith(new Promise((resolve) => {
    let done = false;
    const answer = (r) => { if (!done && r){ done = true; resolve(r); } };
    const fallback = () => caches.match(req).then((cached) => cached || caches.match(offlineShell(url)));
    const timer = setTimeout(() => { caches.match(req).then(answer); }, NET_WAIT_MS);
    network.then((res) => { clearTimeout(timer); answer(res); })
      .catch(() => { clearTimeout(timer); fallback().then((r) => answer(r || Response.error())); });
  }));
});
