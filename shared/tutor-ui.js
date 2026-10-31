/* The helper: a small round button that opens a panel with two tools, "Translate" (English <-> Uzbek/Russian) and
 * "Tutor" (a short English practice chat). It talks to /api/tutor, and only appears once the server says it is set up
 * (ANTHROPIC_API_KEY in Vercel) and the student is signed in — until then nobody sees a dead button.
 * Classic script shared by both courses; text from the server is always inserted as plain text. */
(function () {
  "use strict";
  var T = window.TT_t || function (s) { return s; };
  var ENDPOINT = /^https?:$/.test(location.protocol) ? "/api/tutor" : "https://www.trucktalk.courses/api/tutor";
  var configured = false, btn = null, sheet = null;
  var st = { tab: "translate", chat: [], busy: false };

  function user() { return window.TTE_user || window.SU_user || null; }
  function token() { var f = window.TTE_getToken || window.SU_getToken; return f ? f() : Promise.resolve(null); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var css = [
    "#ttHelperBtn{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:45;width:54px;height:54px;border-radius:50%;border:0;cursor:pointer;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);box-shadow:0 6px 20px rgba(10,25,49,.28);display:grid;place-items:center;font-size:24px;line-height:1}",
    "@media(min-width:761px){#ttHelperBtn{bottom:24px;right:24px}}",
    "#ttHelper{position:fixed;inset:0;z-index:60;display:flex;align-items:flex-end;justify-content:center;background:rgba(10,25,49,.45)}",
    "#ttHelper .hp{background:var(--surface,#fff);color:var(--ink,#0A1931);border:1px solid var(--line,#D3E2EF);width:min(560px,100%);max-height:86vh;display:flex;flex-direction:column;border-radius:18px 18px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(10,25,49,.25)}",
    "@media(min-width:761px){#ttHelper{align-items:center}#ttHelper .hp{border-radius:18px;padding-bottom:16px}}",
    "#ttHelper .hh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}",
    "#ttHelper .hh b{font-size:1.05rem}",
    "#ttHelper .hx{border:0;background:transparent;color:var(--muted,#4D6684);font-size:26px;line-height:1;cursor:pointer;padding:4px 8px}",
    "#ttHelper .ht{display:flex;gap:6px;margin-bottom:12px}",
    "#ttHelper .ht button{flex:1;padding:10px;border-radius:12px;border:1.5px solid var(--line,#D3E2EF);background:var(--surface-2,#EAF2F9);color:var(--ink,#0A1931);font-weight:700;cursor:pointer}",
    "#ttHelper .ht button.on{background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);border-color:var(--accent,#1A3D63)}",
    "#ttHelper textarea,#ttHelper input{width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1.5px solid var(--line,#D3E2EF);background:var(--surface,#fff);color:var(--ink,#0A1931);font:inherit}",
    "#ttHelper .go{margin-top:10px;padding:12px 18px;border-radius:12px;border:0;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);font-weight:700;cursor:pointer;min-height:46px}",
    "#ttHelper .go[disabled]{opacity:.55;cursor:default}",
    "#ttHelper .out{margin-top:12px;padding:12px;border-radius:12px;background:var(--surface-2,#EAF2F9);white-space:pre-wrap;min-height:20px;font-size:1.05rem}",
    "#ttHelper .err{color:#B3261E}",
    "#ttHelper .chat{overflow:auto;flex:1;min-height:160px;max-height:46vh;display:flex;flex-direction:column;gap:8px;margin-bottom:10px}",
    "#ttHelper .m{max-width:86%;padding:10px 12px;border-radius:14px;white-space:pre-wrap}",
    "#ttHelper .m.u{align-self:flex-end;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff)}",
    "#ttHelper .m.a{align-self:flex-start;background:var(--surface-2,#EAF2F9)}",
    "#ttHelper .hint{color:var(--muted,#4D6684);font-size:.92rem;margin:4px 0 10px}",
    "#ttHelper .row{display:flex;gap:8px}#ttHelper .row .go{margin-top:0}",
  ].join("\n");

  function lang() { return (window.TT_lang && window.TT_lang()) === "ru" ? "ru" : "uz"; }
  function lessonContext() { var h = document.querySelector(".hwy-title"); return h ? h.textContent.replace(/\s+/g, " ").trim().slice(0, 120) : ""; }

  function ask(body) {
    return token().then(function (tk) {
      if (!tk) throw new Error("auth");
      return fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tk }, body: JSON.stringify(body) });
    }).then(function (res) {
      if (res.ok) return res.json().then(function (j) { return j.reply; });
      var e = new Error("http"); e.status = res.status; throw e;
    });
  }
  function why(e) {
    if (e && (e.message === "auth" || e.status === 401 || e.status === 403)) return T("Please sign in again to use the helper.");
    if (e && e.status === 429) return T("Please wait a little, then try again.");
    return T("The helper is busy right now. Please try again in a minute.");
  }

  function close() { if (sheet) { sheet.remove(); sheet = null; } if (btn) btn.focus(); }
  function open() {
    if (sheet && sheet.isConnected) return;
    sheet = el("div"); sheet.id = "ttHelper"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-label", T("Helper"));
    sheet.addEventListener("click", function (e) { if (e.target === sheet) close(); });
    var panel = el("div", "hp"); sheet.appendChild(panel);
    var head = el("div", "hh"); head.appendChild(el("b", null, T("Helper")));
    var x = el("button", "hx", "×"); x.type = "button"; x.setAttribute("aria-label", T("Close")); x.addEventListener("click", close); head.appendChild(x); panel.appendChild(head);
    var tabs = el("div", "ht"), body = el("div");
    [["translate", T("Translate")], ["tutor", T("Tutor")]].forEach(function (t) {
      var b = el("button", st.tab === t[0] ? "on" : "", t[1]); b.type = "button";
      b.addEventListener("click", function () { st.tab = t[0]; Array.prototype.forEach.call(tabs.children, function (c) { c.className = ""; }); b.className = "on"; draw(body); });
      tabs.appendChild(b);
    });
    panel.appendChild(tabs); panel.appendChild(body); draw(body);
    document.body.appendChild(sheet);
  }

  function draw(body) { body.textContent = ""; (st.tab === "translate" ? drawTranslate : drawTutor)(body); }

  function drawTranslate(body) {
    var ta = el("textarea"); ta.rows = 3; ta.maxLength = 400; ta.placeholder = T("Type a word or sentence"); ta.setAttribute("aria-label", T("Type a word or sentence"));
    var go = el("button", "go", T("Translate")); go.type = "button";
    var out = el("div", "out"); out.setAttribute("aria-live", "polite");
    go.addEventListener("click", function () {
      var text = ta.value.trim(); if (!text || st.busy) return;
      st.busy = true; go.disabled = true; out.className = "out"; out.textContent = T("Thinking…");
      ask({ mode: "translate", text: text, to: lang() }).then(function (r) { out.textContent = r; })
        .catch(function (e) { out.className = "out err"; out.textContent = why(e); })
        .then(function () { st.busy = false; go.disabled = false; });
    });
    body.appendChild(ta); body.appendChild(go); body.appendChild(out); setTimeout(function () { ta.focus(); }, 50);
  }

  function drawTutor(body) {
    var chat = el("div", "chat"); chat.setAttribute("aria-live", "polite");
    function paint() {
      chat.textContent = "";
      if (!st.chat.length) chat.appendChild(el("p", "hint", T("Write to your tutor in English. Mistakes are fine.")));
      st.chat.forEach(function (m) { chat.appendChild(el("div", "m " + (m.role === "user" ? "u" : "a"), m.content)); });
      chat.scrollTop = chat.scrollHeight;
    }
    var row = el("div", "row"), input = el("input"); input.type = "text"; input.maxLength = 500; input.placeholder = T("Your message"); input.setAttribute("aria-label", T("Your message"));
    var send = el("button", "go", T("Send")); send.type = "button";
    function submit() {
      var text = input.value.trim(); if (!text || st.busy) return;
      st.chat.push({ role: "user", content: text }); input.value = ""; st.busy = true; send.disabled = true;
      paint(); var wait = el("div", "m a", T("Thinking…")); chat.appendChild(wait); chat.scrollTop = chat.scrollHeight;
      ask({ mode: "tutor", messages: st.chat.slice(-10), context: lessonContext() })
        .then(function (r) { st.chat.push({ role: "assistant", content: r }); })
        .catch(function (e) { st.chat.push({ role: "assistant", content: why(e) }); })
        .then(function () { st.busy = false; send.disabled = false; paint(); input.focus(); });
    }
    send.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    row.appendChild(input); row.appendChild(send); body.appendChild(chat); body.appendChild(row); paint(); setTimeout(function () { input.focus(); }, 50);
  }

  function refresh() {
    var show = configured && !!user();
    if (show && !btn) {
      btn = el("button"); btn.id = "ttHelperBtn"; btn.type = "button"; btn.textContent = "💬"; btn.setAttribute("aria-label", T("Ask the helper"));
      btn.addEventListener("click", open); document.body.appendChild(btn);
    } else if (!show && btn) { btn.remove(); btn = null; if (sheet) close(); }
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet) close(); });

  var style = el("style"); style.textContent = css; document.head.appendChild(style);
  fetch(ENDPOINT + "?health=1").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { configured = !!(j && j.configured); refresh(); }).catch(function () {});
  setInterval(refresh, 1500);
})();
