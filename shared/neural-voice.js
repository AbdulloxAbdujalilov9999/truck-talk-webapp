/* Natural voice for both courses (window.TTVoice). Plays the audio from /api/tts, which turns each course phrase
 * into a lifelike recording once and caches it. If anything goes wrong (offline, voice not set up, quota used up,
 * browser can't play it) play() answers "failed" and the course falls back to the phone's built-in voice, so a
 * student never hears silence. Classic script, no dependencies.
 *
 *   TTVoice.usable()                      -> false after the server said it isn't set up (retried every 10 minutes)
 *   TTVoice.play(text, { gender, rate, stale, onstart }) -> Promise<"played" | "stale" | "failed">
 *   TTVoice.prefetch(text, gender)        -> warm the next phrase of a list
 *   TTVoice.stop()                        -> silence now (pending play() calls resolve "stale")
 */
(function () {
  "use strict";
  var ENDPOINT = /^https?:$/.test(location.protocol) ? "/api/tts" : "https://www.trucktalk.courses/api/tts";
  var CACHE_NAME = "tt-voice-v1";
  var FETCH_TIMEOUT_MS = 7000;
  var RETRY_AFTER_MS = 10 * 60 * 1000;
  // 0.25 s of silence: played inside the first tap/click so iOS Safari lets later, asynchronous plays through
  var SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";

  var audio = null, unlocked = false, disabledUntil = 0, current = null, generation = 0;
  var inflight = {};

  function ensureAudio() { if (!audio) { audio = new Audio(); audio.preload = "auto"; } return audio; }
  function unlock() {
    if (unlocked) return; unlocked = true;
    try { var a = ensureAudio(); a.src = SILENT; var p = a.play(); if (p && p.catch) p.catch(function () { unlocked = false; }); } catch (e) { unlocked = false; }
  }
  ["pointerdown", "touchend", "click", "keydown"].forEach(function (ev) { document.addEventListener(ev, unlock, { capture: true, passive: true }); });

  function urlFor(text, gender) { return ENDPOINT + "?g=" + (gender === "male" ? "male" : "female") + "&t=" + encodeURIComponent(text); }
  function usable() { return typeof Audio !== "undefined" && typeof fetch === "function" && Date.now() >= disabledUntil; }

  function getBlob(text, gender) {
    var url = urlFor(text, gender);
    if (inflight[url]) return inflight[url];
    var p = (async function () {
      var cache = null;
      try { if (window.caches) cache = await caches.open(CACHE_NAME); } catch (e) {}
      if (cache) { try { var hit = await cache.match(url); if (hit) return await hit.blob(); } catch (e) {} }
      var ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = ctl ? setTimeout(function () { ctl.abort(); }, FETCH_TIMEOUT_MS) : null;
      try {
        var res = await fetch(url, ctl ? { signal: ctl.signal } : undefined);
        var type = (res.headers.get("content-type") || "");
        if (!res.ok || type.indexOf("audio") !== 0) {
          // 503 = not set up / quota / provider hiccup, 404 or 405 without a JSON body = no function at this address
          // (local dev, old deploy) — stop asking for a while. The function's own JSON 404 ("not in the course")
          // is about this one phrase only: that phrase uses the device voice, everything else keeps the natural one.
          var json = type.indexOf("json") !== -1;
          if (res.status === 503 || ((res.status === 404 || res.status === 405) && !json)) disabledUntil = Date.now() + RETRY_AFTER_MS;
          throw new Error("tts " + res.status);
        }
        var copy = res.clone();
        var blob = await res.blob();
        if (cache) { try { await cache.put(url, copy); } catch (e) {} }
        return blob;
      } finally { if (timer) clearTimeout(timer); }
    })();
    inflight[url] = p;
    var done = function () { delete inflight[url]; };
    p.then(done, done);
    return p;
  }

  function stop() {
    generation++;
    var c = current; current = null;
    if (audio) { try { audio.pause(); } catch (e) {} }
    if (c) c("stale");
  }

  function play(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!usable()) return resolve("failed");
      stop();                                   // one voice at a time
      var myGen = generation;
      var finished = false;
      var objectUrl = null;
      var finish = function (result) {
        if (finished) return; finished = true;
        if (current === finish) current = null;
        if (objectUrl) { try { URL.revokeObjectURL(objectUrl); } catch (e) {} }
        resolve(result);
      };
      current = finish;
      getBlob(text, opts.gender).then(function (blob) {
        if (finished) return;
        if (myGen !== generation || (opts.stale && opts.stale())) return finish("stale");
        var a = ensureAudio();
        objectUrl = URL.createObjectURL(blob);
        a.onended = function () { finish("played"); };
        a.onerror = function () { finish("failed"); };
        a.onplaying = function () { if (opts.onstart) { try { opts.onstart(); } catch (e) {} } };
        a.src = objectUrl;
        a.defaultPlaybackRate = a.playbackRate = Math.min(1.25, Math.max(0.5, opts.rate || 1));
        a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = true;
        var p = a.play();
        if (p && p.catch) p.catch(function () { finish("failed"); });
      }).catch(function () { finish("failed"); });
    });
  }

  function prefetch(text, gender) {
    if (!usable() || !text) return;
    getBlob(text, gender).catch(function () {});
  }

  window.TTVoice = { usable: usable, play: play, prefetch: prefetch, stop: stop, _url: urlFor };
})();
