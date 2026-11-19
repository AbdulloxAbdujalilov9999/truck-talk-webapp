/* SpeakUp was removed from this site. Phones that installed it still have its old service worker; when the browser
 * checks for an update it gets this file, which deletes SpeakUp's offline copy, unregisters itself and reloads its
 * open pages, which then land on Truck Talk (vercel.json redirects every other /speakup/ address there). */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("su-")).map((k) => caches.delete(k)));
    await self.registration.unregister();
    const pages = await self.clients.matchAll({ type: "window" });
    pages.forEach((c) => c.navigate("/trucktalk/").catch(() => {}));
  })());
});
