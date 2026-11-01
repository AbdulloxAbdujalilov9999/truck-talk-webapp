/* The Teacher (menu item "Teacher"): a full-screen spoken conversation. The teacher talks (device voice), the student
 * answers by microphone or keyboard, and every reply comes with a short helper note in Uzbek/Russian. See openTalk().
 *
 * The helper: a small round button that opens a panel with three tools: "Teacher" (teaches the lesson on screen step by
 * step, like a classroom teacher), "Translate" (English <-> Uzbek/Russian) and "Tutor" (a free English practice chat).
 * Each lesson also gets a card at the top that starts the Teacher. It talks to /api/tutor, and only appears once the server says it is set up
 * (ANTHROPIC_API_KEY in Vercel) and the student is signed in — until then nobody sees a dead button.
 * Classic script shared by both courses; text from the server is always inserted as plain text. */
(function () {
  "use strict";
  var T = window.TT_t || function (s) { return s; };
  var ENDPOINT = /^https?:$/.test(location.protocol) ? "/api/tutor" : "https://www.trucktalk.courses/api/tutor";
  var configured = false, btn = null, sheet = null, shown = false;
  var st = { tab: "translate", chat: [], busy: false, lessons: {} };
  var talk = { chat: [], busy: false, auto: true, voice: true, listening: false, speaking: false, micBlocked: false, rec: null, el: null, gen: 0, autoRun: 0 };

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
    "#ttHelper .big{width:100%;margin:6px 0 2px}",
    "#ttHelper .link{border:0;background:transparent;color:var(--muted,#4D6684);text-decoration:underline;cursor:pointer;padding:6px 2px;font:inherit;font-size:.9rem}",
    "#ttTalk{position:fixed;inset:0;z-index:65;display:flex;flex-direction:column;background:var(--surface-2,#EAF2F9);color:var(--ink,#0A1931)}",
    "#ttTalk .tk-top{display:flex;align-items:center;gap:12px;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;background:var(--surface,#fff);border-bottom:1px solid var(--line,#D3E2EF)}",
    "#ttTalk .tk-av{width:44px;height:44px;border-radius:50%;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);display:grid;place-items:center;font-size:22px;flex:none}",
    "#ttTalk .tk-who{flex:1;min-width:0}#ttTalk .tk-who b{display:block}#ttTalk .tk-st{font-size:.85rem;color:var(--muted,#4D6684)}",
    "#ttTalk .tk-x{border:0;background:transparent;color:var(--muted,#4D6684);font-size:30px;line-height:1;cursor:pointer;padding:4px 10px}",
    "#ttTalk .tk-chat{flex:1;overflow:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;max-width:760px;width:100%;margin:0 auto;box-sizing:border-box}",
    "#ttTalk .tk-m{max-width:88%;padding:12px 14px;border-radius:16px}",
    "#ttTalk .tk-m.t{align-self:flex-start;background:var(--surface,#fff);border:1px solid var(--line,#D3E2EF)}#ttTalk .tk-m.t .say{font-size:1.15rem;line-height:1.4}",
    "#ttTalk .tk-m.t .nt{margin-top:6px;font-size:.92rem;color:var(--muted,#4D6684)}",
    "#ttTalk .tk-m.s{align-self:flex-end;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff)}",
    "#ttTalk .tk-live{align-self:flex-end;max-width:88%;color:var(--muted,#4D6684);font-style:italic}",
    "#ttTalk .tk-bot{background:var(--surface,#fff);border-top:1px solid var(--line,#D3E2EF);padding:12px 14px calc(12px + env(safe-area-inset-bottom))}",
    "#ttTalk .tk-in{max-width:760px;margin:0 auto;display:flex;align-items:center;gap:10px}",
    "#ttTalk .tk-mic{width:62px;height:62px;border-radius:50%;border:0;cursor:pointer;flex:none;font-size:28px;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);box-shadow:0 4px 14px rgba(10,25,49,.25)}",
    "#ttTalk .tk-mic.on{background:#B3261E;animation:ttpulse 1.2s infinite}@keyframes ttpulse{50%{box-shadow:0 0 0 12px rgba(179,38,30,.18)}}",
    "#ttTalk .tk-mic[disabled]{opacity:.45;cursor:default}",
    "#ttTalk .tk-in input{flex:1;min-width:0;padding:13px;border-radius:12px;border:1.5px solid var(--line,#D3E2EF);background:var(--surface,#fff);color:var(--ink,#0A1931);font:inherit}",
    "#ttTalk .tk-send{padding:13px 16px;border-radius:12px;border:0;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);font-weight:700;cursor:pointer;min-height:48px}",
    "#ttTalk .tk-opt{max-width:760px;margin:8px auto 0;display:flex;gap:16px;flex-wrap:wrap;font-size:.88rem;color:var(--muted,#4D6684);align-items:center}",
    "#ttTalk .tk-opt label{display:flex;align-items:center;gap:6px;cursor:pointer}",
    "#ttTalk .tk-opt button{border:0;background:transparent;color:inherit;text-decoration:underline;cursor:pointer;font:inherit;padding:0 2px}",
    "#teacherCard{margin-top:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 16px;border-radius:14px;border:1.5px dashed var(--accent-mid,#4A7FA7);background:var(--accent-soft,#DDEAF5);color:var(--ink,#0A1931)}",
    "#teacherCard .tc-t{flex:1 1 220px;min-width:0}#teacherCard b{display:block;margin-bottom:2px}#teacherCard span{font-size:.92rem;color:var(--muted,#4D6684)}",
    "#teacherCard button{padding:11px 18px;border-radius:12px;border:0;background:var(--accent,#1A3D63);color:var(--accent-ink,#fff);font-weight:700;cursor:pointer;min-height:46px}",
  ].join("\n");

  function lang() { return (window.TT_lang && window.TT_lang()) === "ru" ? "ru" : "uz"; }
  function lesson() { try { return window.TT_lessonContext ? window.TT_lessonContext() : null; } catch (e) { return null; } }
  function lessonContext() { var h = document.querySelector(".hwy-title"); return h ? h.textContent.replace(/\s+/g, " ").trim().slice(0, 120) : ""; }

  function askRaw(body) {
    return token().then(function (tk) {
      if (!tk) throw new Error("auth");
      return fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tk }, body: JSON.stringify(body) });
    }).then(function (res) {
      if (res.ok) return res.json();
      return res.json().catch(function () { return {}; }).then(function (j) { var e = new Error("http"); e.status = res.status; e.code = j && j.error; throw e; });
    });
  }
  function ask(body) { return askRaw(body).then(function (j) { return j.reply; }); }
  function why(e) {
    var u = user(), staff = u && u.role && u.role !== "student", tail = staff && e && e.code ? " [" + e.code + "]" : "";   // staff see the server's code
    if (e && (e.message === "auth" || e.status === 401 || e.status === 403)) return T("Please sign in again to use the helper.") + tail;
    if (e && e.status === 429) return T("Please wait a little, then try again.") + tail;
    return T("The helper is busy right now. Please try again in a minute.") + tail;
  }

  function close() { if (sheet) { sheet.remove(); sheet = null; } if (btn) btn.focus(); }
  function open(tab) {
    if (sheet && sheet.isConnected) return;
    var hasLesson = !!lesson();
    st.tab = tab || (hasLesson ? "teacher" : (st.tab === "teacher" ? "translate" : st.tab));
    if (st.tab === "teacher" && !hasLesson) st.tab = "translate";
    sheet = el("div"); sheet.id = "ttHelper"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-label", T("Helper"));
    sheet.addEventListener("click", function (e) { if (e.target === sheet) close(); });
    var panel = el("div", "hp"); sheet.appendChild(panel);
    var head = el("div", "hh"); head.appendChild(el("b", null, T("Helper")));
    var x = el("button", "hx", "×"); x.type = "button"; x.setAttribute("aria-label", T("Close")); x.addEventListener("click", close); head.appendChild(x); panel.appendChild(head);
    var tabs = el("div", "ht"), body = el("div");
    (hasLesson ? [["teacher", T("This lesson")]] : []).concat([["translate", T("Translate")], ["tutor", T("Tutor")]]).forEach(function (t) {
      var b = el("button", st.tab === t[0] ? "on" : "", t[1]); b.type = "button";
      b.addEventListener("click", function () { st.tab = t[0]; Array.prototype.forEach.call(tabs.children, function (c) { c.className = ""; }); b.className = "on"; draw(body); });
      tabs.appendChild(b);
    });
    panel.appendChild(tabs); panel.appendChild(body); draw(body);
    document.body.appendChild(sheet);
  }

  function draw(body) { body.textContent = ""; (st.tab === "teacher" ? drawTeacher : st.tab === "translate" ? drawTranslate : drawTutor)(body); }

  // The teacher: one conversation per lesson, kept while the page stays open. The server knows how to teach
  // (words 3-4 at a time, correct gently, practise the dialogue, grammar, a mini quiz); we only send the lesson.
  function drawTeacher(body) {
    var ctx = lesson();
    if (!ctx) { body.appendChild(el("p", "hint", T("Open a lesson to learn it with your teacher."))); return; }
    var key = ctx.course + ":" + ctx.day, chat = st.lessons[key] || (st.lessons[key] = []);
    var box = el("div", "chat"); box.setAttribute("aria-live", "polite");
    var row = el("div", "row"), input = el("input"); input.type = "text"; input.maxLength = 500; input.placeholder = T("Type your answer"); input.setAttribute("aria-label", T("Type your answer"));
    var send = el("button", "go", T("Send")); send.type = "button";
    var start = el("button", "go big", T("Start lesson")); start.type = "button";
    var reset = el("button", "link", T("Start over")); reset.type = "button";
    function paint() {
      box.textContent = "";
      var shown = chat.filter(function (m) { return !m.hidden; });
      if (!shown.length) box.appendChild(el("p", "hint", T("Press Start and your teacher will begin today's lesson.")));
      shown.forEach(function (m) { box.appendChild(el("div", "m " + (m.role === "user" ? "u" : "a"), m.content)); });
      start.hidden = chat.length > 0; row.hidden = chat.length === 0; reset.hidden = chat.length === 0;
      box.scrollTop = box.scrollHeight;
    }
    function turn(text, hidden) {
      if (st.busy) return;
      chat.push({ role: "user", content: text, hidden: !!hidden }); st.busy = true; send.disabled = start.disabled = true; paint();
      box.appendChild(el("div", "m a", T("Thinking…"))); box.scrollTop = box.scrollHeight;
      ask({ mode: "lesson", lesson: ctx, to: lang(), messages: chat.slice(-16).map(function (m) { return { role: m.role, content: m.content }; }) })
        .then(function (r) { chat.push({ role: "assistant", content: r }); })
        .catch(function (e) { chat.push({ role: "assistant", content: why(e) }); })
        .then(function () { st.busy = false; send.disabled = start.disabled = false; paint(); input.focus(); });
    }
    start.addEventListener("click", function () { turn("I am ready. Please start the lesson.", true); });
    send.addEventListener("click", function () { var t = input.value.trim(); if (t) { input.value = ""; turn(t, false); } });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); send.click(); } });
    reset.addEventListener("click", function () { if (st.busy) return; chat.length = 0; paint(); });
    row.appendChild(input); row.appendChild(send);
    body.appendChild(box); body.appendChild(start); body.appendChild(row); body.appendChild(reset); paint();
    setTimeout(function () { (chat.length ? input : start).focus(); }, 50);
  }

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

  // ---------- The Teacher: a spoken conversation ----------
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function progress() { try { return window.TT_progressContext ? window.TT_progressContext() : null; } catch (e) { return null; } }

  function pickVoice() {
    var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    var en = vs.filter(function (v) { return /^en[-_]US/i.test(v.lang); });
    var good = /samantha|ava\b|allison|aria|jenny|google us english|karen|victoria|zira|female/i;
    return en.filter(function (v) { return good.test(v.name); })[0] || en[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  function stopSpeaking() { talk.speaking = false; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
  function stopListening() { if (talk.rec) { try { talk.rec.abort(); } catch (e) {} talk.rec = null; } talk.listening = false; }

  function openTalk() {
    if (talk.el && talk.el.isConnected) return;
    var micOk = !!SR;
    var root = el("div"); root.id = "ttTalk"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", T("Your English teacher")); talk.el = root;
    var top = el("div", "tk-top"), av = el("div", "tk-av", "👩‍🏫"), who = el("div", "tk-who"), status = el("span", "tk-st", "");
    who.appendChild(el("b", null, T("Your English teacher"))); who.appendChild(status);
    var x = el("button", "tk-x", "×"); x.type = "button"; x.setAttribute("aria-label", T("Close"));
    top.appendChild(av); top.appendChild(who); top.appendChild(x);
    var chat = el("div", "tk-chat"); chat.setAttribute("aria-live", "polite");
    var bot = el("div", "tk-bot"), row = el("div", "tk-in");
    var mic = el("button", "tk-mic", "🎤"); mic.type = "button"; mic.setAttribute("aria-label", T("Tap to talk")); if (!micOk) mic.disabled = true;
    var input = el("input"); input.type = "text"; input.maxLength = 500; input.placeholder = T("Type your answer"); input.setAttribute("aria-label", T("Type your answer"));
    var send = el("button", "tk-send", T("Send")); send.type = "button";
    row.appendChild(mic); row.appendChild(input); row.appendChild(send);
    var opt = el("div", "tk-opt");
    var l1 = el("label"), c1 = el("input"); c1.type = "checkbox"; c1.checked = talk.voice; l1.appendChild(c1); l1.appendChild(document.createTextNode(T("Teacher's voice")));
    var l2 = el("label"), c2 = el("input"); c2.type = "checkbox"; c2.checked = talk.auto && micOk; c2.disabled = !micOk; l2.appendChild(c2); l2.appendChild(document.createTextNode(T("Listen automatically")));
    var again = el("button", null, T("Start over")); again.type = "button";
    opt.appendChild(l1); opt.appendChild(l2); opt.appendChild(again);
    bot.appendChild(row); bot.appendChild(opt);
    root.appendChild(top); root.appendChild(chat); root.appendChild(bot); document.body.appendChild(root);

    var live = null;
    function setStatus() {
      status.textContent = talk.busy ? T("Thinking…") : talk.speaking ? T("Speaking…") : talk.listening ? T("Listening…") : (talk.micBlocked ? T("Microphone is not available here. Please type your answer.") : "");
      mic.className = "tk-mic" + (talk.listening ? " on" : "");
    }
    function paint() {
      chat.textContent = "";
      if (!talk.chat.length) chat.appendChild(el("p", "hint", T("Your teacher is getting ready…")));
      talk.chat.forEach(function (m) {
        if (m.hidden) return;
        if (m.role === "user") { chat.appendChild(el("div", "tk-m s", m.content)); return; }
        var b = el("div", "tk-m t"); b.appendChild(el("div", "say", m.content)); if (m.note) b.appendChild(el("div", "nt", m.note)); chat.appendChild(b);
      });
      if (live) chat.appendChild(live);
      chat.scrollTop = chat.scrollHeight; setStatus();
    }
    function say(text, done) {
      if (!talk.voice || !window.speechSynthesis) return done();
      stopSpeaking(); var u = new SpeechSynthesisUtterance(text), v = pickVoice(), fin = false, started = false;
      u.lang = "en-US"; u.rate = 0.92; if (v) u.voice = v;
      function end() { if (fin) return; fin = true; clearTimeout(wd); clearTimeout(cap); talk.speaking = false; setStatus(); done(); }
      var wd = setTimeout(function () { if (!started) end(); }, 3000);   // an engine that never starts must not freeze the conversation
      var cap = setTimeout(end, 15000);                                  // ...nor one that starts but never says it has finished
      u.onstart = function () { started = true; talk.speaking = true; setStatus(); };
      u.onend = end; u.onerror = end;
      try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { end(); }
    }
    function listen() {
      if (!SR || talk.busy || talk.listening || !root.isConnected) return;
      stopSpeaking(); var rec = new SR(), got = false; talk.rec = rec;
      rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      rec.onstart = function () { talk.listening = true; setStatus(); };
      rec.onresult = function (ev) {
        var txt = "", fin = false;
        for (var i = ev.resultIndex; i < ev.results.length; i++) { txt += ev.results[i][0].transcript; if (ev.results[i].isFinal) fin = true; }
        if (!live) { live = el("div", "tk-live"); }
        live.textContent = "“" + txt + "”"; paint();
        if (fin && txt.trim()) { got = true; live = null; turn(txt.trim(), false); }
      };
      rec.onerror = function (e) { if (e && (e.error === "not-allowed" || e.error === "service-not-allowed")) { talk.micBlocked = true; mic.disabled = true; } };
      rec.onend = function () { talk.listening = false; talk.rec = null; if (live && !got) { live = null; } paint(); };
      try { rec.start(); } catch (e) { talk.listening = false; }
    }
    function turn(text, hidden) {
      if (talk.busy) return;
      stopListening(); stopSpeaking(); var gen = talk.gen;
      talk.chat.push({ role: "user", content: text, hidden: !!hidden }); talk.busy = true; send.disabled = true; paint();
      askRaw({ mode: "talk", to: lang(), context: progress(), messages: talk.chat.slice(-16).map(function (m) { return { role: m.role, content: m.content }; }) })
        .then(function (j) {
          if (gen !== talk.gen) return;   // closed or restarted while the teacher was thinking
          talk.chat.push({ role: "assistant", content: j.say || j.reply, note: j.note || "" }); talk.busy = false; send.disabled = false; paint();
          say(j.say || j.reply, function () { if (talk.auto && SR && !talk.micBlocked && root.isConnected && ++talk.autoRun <= 10) listen(); });   // after 10 hands-free turns in a row, wait for a tap
        })
        .catch(function (e) { if (gen !== talk.gen) return; talk.chat.push({ role: "assistant", content: why(e), note: "" }); talk.busy = false; send.disabled = false; paint(); });
    }
    function begin() { talk.gen++; talk.chat = []; talk.busy = false; talk.autoRun = 0; turn("I am ready. Please start.", true); }
    function close() { talk.gen++; talk.busy = false; stopListening(); stopSpeaking(); root.remove(); talk.el = null; }

    x.addEventListener("click", close);
    mic.addEventListener("click", function () { talk.autoRun = 0; if (talk.listening) stopListening(); else { stopSpeaking(); listen(); } paint(); });
    send.addEventListener("click", function () { var t = input.value.trim(); if (t) { input.value = ""; talk.autoRun = 0; turn(t, false); } });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); send.click(); } });
    c1.addEventListener("change", function () { talk.voice = c1.checked; if (!talk.voice) stopSpeaking(); });
    c2.addEventListener("change", function () { talk.auto = c2.checked; });
    again.addEventListener("click", function () { stopListening(); stopSpeaking(); begin(); });
    root.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    paint(); if (talk.chat.length) { paint(); } else begin();
    setTimeout(function () { input.focus(); }, 80);
  }

  // "Learn this lesson with your teacher": added to the top of every lesson screen (the app redraws the screen from
  // scratch on each step, so this watches for that and puts the card back straight away)
  function ensureCard() {
    var head = document.querySelector("#app .lesson-head");
    if (!configured || !user() || !head || !lesson()) { var old = document.getElementById("teacherCard"); if (old && !head) old.remove(); return; }
    if (head.querySelector("#teacherCard")) return;
    var card = el("div"); card.id = "teacherCard";
    var tx = el("div", "tc-t"); tx.appendChild(el("b", null, T("Learn this lesson with your teacher")));
    tx.appendChild(el("span", null, T("Your AI teacher explains the words, practises the dialogue with you and checks your answers.")));
    var go = el("button", null, T("Start lesson")); go.type = "button"; go.addEventListener("click", function () { open("teacher"); });
    card.appendChild(tx); card.appendChild(go); head.appendChild(card);
  }
  function watchLessons() {
    var app = document.getElementById("app");
    if (app && window.MutationObserver) new MutationObserver(ensureCard).observe(app, { childList: true });
  }

  function refresh() {
    ensureCard();
    var show = configured && !!user();
    if (show !== !!shown) { shown = show; try { window.dispatchEvent(new Event("tt-helper-ready")); } catch (e) {} }   // lets the menu add/remove "Teacher"
    if (show && !btn) {
      btn = el("button"); btn.id = "ttHelperBtn"; btn.type = "button"; btn.textContent = "💬"; btn.setAttribute("aria-label", T("Ask the helper"));
      btn.addEventListener("click", function () { open(); }); document.body.appendChild(btn);
    } else if (!show && btn) { btn.remove(); btn = null; if (sheet) close(); }
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet) close(); });

  var style = el("style"); style.textContent = css; document.head.appendChild(style);
  window.TTHelper = { open: open, openTalk: openTalk, available: function () { return configured && !!user(); } };
  watchLessons();
  fetch(ENDPOINT + "?health=1").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { configured = !!(j && j.configured); refresh(); }).catch(function () {});
  setInterval(refresh, 1500);
})();
