/* Truck Talk — shared account gate: sign in (Google / Apple / email),
 * "complete your profile → request access", pending/restricted screens,
 * and routing a signed-in, approved user to the right app.
 *
 * Used by the course (trucktalk/index.html, appKind: "main"), the admin dashboard
 * (admin/index.html, "admin") and the Teachers platform (teachers/index.html,
 * "teachers") — all three are one site, so links between them are plain
 * same-site paths (see SITE below). Once a user is signed in AND approved AND their
 * role matches the host app, this hands off to that page's own script via
 * window.TTE_mount() / window.TTE_refresh() (app.js / admin.js define
 * these) rather than rendering any app UI itself — this module only ever
 * owns the full-screen gate states.
 */
import { auth, db, googleProvider, isFirebaseConfigured, usesRedirectSignIn, keepConnectionLean } from "./firebase.js";
import { createSyncQueue } from "./sync-queue.js";
import { PLANS, INCLUDES, PAID_VOICE_MINUTES, CONTACT_TELEGRAM } from "./pay-config.js";

// Is a paid period running? users/{uid}/paidUntil is a time in ms, set by the payment webhook (api/whop.js) or by an
// owner/manager in the admin; access ends by itself once it passes.
function paidActive(profile, now = Date.now()){
  return !!profile && typeof profile.paidUntil === "number" && profile.paidUntil > now;
}
import { OWNER_EMAIL } from "./firebase-config.js";
import { normalizePhone, phoneCredentials, phoneFromEmail, contactLabel, isTelegramEmail } from "./phone-login.js";
import {
  onAuthStateChanged, signInWithPopup, signInWithCustomToken, signInWithRedirect, getRedirectResult, signInWithCredential, GoogleAuthProvider, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, updatePassword,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  ref, set, update, onValue, serverTimestamp, runTransaction,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const GOOGLE_ICON = `<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.4 10.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.2-5.6l-6.6-5.6C29.6 34.8 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.8 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C39.9 37.4 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>`;
// Apple sign-in is coded and ready (see git history / firebase.js's
// appleProvider) but hidden here — it needs an Apple Developer Program
// membership ($99/yr) to create the Services ID, Team ID, Key ID and
// private key that Firebase requires before it will actually accept an
// Apple sign-in (the console's on/off switch alone does nothing without
// them: attempting it still fails with auth/operation-not-allowed).
// Re-enable by restoring the Apple button below and the appleProvider
// import once that's set up.

// Interface text goes through shared/i18n.js (window.TT_t); falls back to
// the English key if that script isn't loaded.
const T = (k, v) => (window.TT_t ? window.TT_t(k, v) : String(k).replace(/\{(\w+)\}/g, (m, x) => (v && v[x] != null ? v[x] : m)));
let redraw = null;   // re-renders whichever gate screen is showing, when the language changes

// The course, admin dashboard and Teachers platform are one site, so links
// between them are relative ("/admin/") and keep the user in the same tab and
// installed app. The one exception is the native (Capacitor) course app,
// which only bundles the course itself — there, the other apps have to be
// opened on the real site.
const PROD_SITE = "https://truck-talk-webapp.vercel.app";
const nativePlatform = typeof window !== "undefined" && window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform();
const SITE = (nativePlatform === "android" || nativePlatform === "ios") ? PROD_SITE : "";
// New (non-owner) sign-ups get immediate, temporary access — a 3-day free
// trial — instead of waiting on approval. They're written with
// status:"pending", role:"student" (see requestAccess below); database.rules.json's
// creation rule requires exactly that shape from a self-write. An owner or
// manager can approve (making access permanent, any role) or restrict
// (ending it immediately) at any point, trial running or not — see
// admin/admin.js's approveUser/setUserStatus. trialInfo() below is the one
// place that defines "3 days" and is used both to gate access here and to
// show the days-left banner once mounted.
const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;
function trialInfo(profile){
  const start = typeof profile.createdAt === "number" ? profile.createdAt : Date.now();
  const end = start + TRIAL_MS;
  const msLeft = end - Date.now();
  return { active: msLeft > 0, daysLeft: Math.max(0, Math.ceil(msLeft / 86400000)), end };
}
// A trial user's status is "pending" for as long as they're mid-trial —
// re-check right when it lapses so an open tab doesn't keep showing the
// app past expiry until the next unrelated re-render.
let trialTimer = null;
function scheduleTrialRecheck(user, profile, msUntilExpiry){
  clearTimeout(trialTimer);
  if (msUntilExpiry == null) return;
  trialTimer = setTimeout(() => handleProfile(user, profile), Math.min(Math.max(msUntilExpiry, 0) + 1000, 2147483647));
}

const BRAND = "TRUCK TALK";
const TELEGRAM_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#29A9EB"/><path fill="#fff" d="M5.4 11.8l11.1-4.3c.5-.2 1 .1.8.9l-1.9 8.9c-.1.6-.5.8-1 .5l-2.8-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.2-4.7c.2-.2 0-.3-.3-.1l-6.4 4-2.8-.9c-.6-.2-.6-.6.1-.9z"/></svg>`;
const PHONE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`;
/* ---------------- Saving progress ---------------- */
let syncQueue = null, syncUid = null, lifecycleWired = false;
let cloudProgress = { uid: null, ready: false, val: null };   // the live cloud copy (progress listener in mountApp)
function publishSyncState(st){ window.TTE_syncState = st; try{ window.dispatchEvent(new Event("tte-syncstate")); }catch(e){} }
function progressQueue(uid){
  if (syncQueue && syncUid === uid) return syncQueue;
  if (syncQueue) syncQueue.stop();
  syncUid = uid;
  syncQueue = createSyncQueue({
    // Merged with whatever the cloud already has (shared/progress-merge.js), so a device that is behind (a new
    // phone, one that missed lessons done elsewhere) can never wipe out the newer copy.
    //
    // Mobile data: once the live copy of the cloud progress is here (see cloudProgress below), only what changed
    // is sent (progress-merge.js diff(), usually a few hundred bytes) instead of the whole progress, which grows
    // to tens of KB late in the course and would otherwise go up on every save. The first save of a brand-new
    // student, or a very large change, still goes as one transaction of the whole thing.
    write: (value) => {
      const M = window.TTE_progressMerge;
      const cloud = cloudProgress.uid === uid && cloudProgress.ready ? cloudProgress.val : null;
      if (M && M.diff && cloud){
        const patch = M.diff(cloud, M.merge(value, cloud));
        const n = Object.keys(patch).length;
        if (!n) return Promise.resolve();
        if (n <= 300){ patch.updatedAt = Date.now(); return update(ref(db, "progress/" + uid), patch); }
      }
      return runTransaction(ref(db, "progress/" + uid), (cloudNow) => {
        const merged = M ? M.merge(value, cloudNow) : Object.assign({}, value);
        merged.updatedAt = Date.now();
        return merged;
      });
    },
    signature: (value) => JSON.stringify(value),
    onState: publishSyncState,
  });
  wireLifecycle();
  return syncQueue;
}
function flushBeforeLeaving(queue){
  return Promise.race([queue.flush().catch(() => {}), new Promise((r) => setTimeout(r, 3000))]);
}
function wireLifecycle(){
  if (lifecycleWired) return;
  lifecycleWired = true;
  const flushNow = () => { if (syncQueue) syncQueue.flush().catch(() => {}); };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushNow(); });
  window.addEventListener("pagehide", flushNow);
  window.addEventListener("online", flushNow);
  // a background tab lets go of its database connection after a while (see keepConnectionLean)
  if (opts && opts.appKind === "main") keepConnectionLean({ beforeIdle: () => (syncQueue ? syncQueue.flush() : null), afterWake: flushNow });
}

const ROLE_LABEL = { owner: "Owner", manager: "Manager", teacher: "Teacher", student: "Student" };

let opts = null;
let unsubProfile = null;
let unsubResets = null;
let unsubProgress = null, progressUid = null;
let resetsUid = null;
let mode = "signin"; // signin | signup | reset
let errorMsg = "";
let busy = false;

function $(id){ return document.getElementById(id); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

function root(){
  let el = document.getElementById("authRoot");
  if (!el){
    el = document.createElement("div");
    el.id = "authRoot";
    document.body.prepend(el);
  }
  if (!el.dataset.langWired){
    el.dataset.langWired = "1";
    // Every gate screen gets the EN | UZ | RU switch at the top of its card.
    const addLang = () => {
      const card = el.querySelector(".auth-card");
      if (!card || card.querySelector(".auth-lang") || !window.TT_langSwitchHtml) return;
      const bar = document.createElement("div");
      bar.className = "auth-lang";
      bar.innerHTML = window.TT_langSwitchHtml();
      card.prepend(bar);
      window.TT_bindLangSwitch(bar);
    };
    new MutationObserver(addLang).observe(el, { childList: true });
    if (window.TT_onLang) window.TT_onLang(() => {
      const shell = document.getElementById("appShell");
      if (redraw && !(shell && !shell.hidden)) redraw();   // never paint a gate screen over the running app
    });
  }
  return el;
}

function showAppShell(show){
  const gate = document.getElementById("authRoot");
  const shell = document.getElementById("appShell");
  if (gate) gate.hidden = show;
  if (shell) shell.hidden = !show;
}

function mapAuthError(err){
  const code = err && err.code;
  const map = {
    "auth/email-already-in-use": T("That email already has an account. Try signing in instead."),
    "auth/invalid-email": T("That doesn't look like a valid email address."),
    "auth/weak-password": T("Password must be at least 6 characters."),
    "auth/wrong-password": T("Incorrect password."),
    "auth/user-not-found": T("No account found with that email."),
    "auth/invalid-credential": T("Incorrect email or password."),
    "auth/too-many-requests": T("Too many attempts. Please wait a moment and try again."),
    "auth/popup-closed-by-user": T("Sign-in was cancelled."),
    "auth/cancelled-popup-request": T("Sign-in was cancelled."),
    "auth/account-exists-with-different-credential": T("An account already exists with this email using a different sign-in method."),
    "auth/operation-not-allowed": T("This sign-in method isn't turned on yet — ask the owner to enable it in Firebase."),
    "auth/credential-already-in-use": T("That password is already linked to a different account."),
    "auth/provider-already-linked": T("Your account already has a password set — use Change password instead."),
    "auth/requires-recent-login": T("For your security, please sign out and sign back in, then try again."),
  };
  return map[code] || (err && err.message) || T("Something went wrong. Please try again.");
}

/* ---------------- Not configured ---------------- */
function renderNotConfigured(){
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">Setup needed</h1>
      <p class="auth-sub">This copy hasn't been connected to Firebase yet. Add your project config to <code>shared/firebase-config.js</code>, then reload. See README.md for the full setup guide.</p>
    </div></div>`;
}

/* ---------------- Sign in / sign up / reset ---------------- */
function renderAuthScreen(){
  redraw = renderAuthScreen;
  const isSignup = mode === "signup";
  const isReset = mode === "reset";
  const isPhone = mode === "phone";
  if (isPhone){ renderPhoneScreen(); return; }
  if (mode === "telegram"){ renderTelegramScreen(); return; }

  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">${isReset ? T("Reset your password") : isSignup ? T("Create your account") : T("Sign in")}</h1>
      <p class="auth-sub">${isReset ? T("We'll email you a reset link.") : T("New accounts need owner or manager approval before you get access.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      ${!isReset ? `
        <div class="auth-providers">
          <button type="button" class="auth-btn-provider" id="googleBtn" ${busy ? "disabled" : ""}>${GOOGLE_ICON}<span>${T("Continue with Google")}</span></button>
          ${tgReady ? `<button type="button" class="auth-btn-provider" id="telegramBtn" ${busy ? "disabled" : ""}>${TELEGRAM_ICON}<span>${T("Continue with Telegram")}</span></button>` : ""}
          <button type="button" class="auth-btn-provider" id="phoneBtn" ${busy ? "disabled" : ""}>${PHONE_ICON}<span>${T("Continue with phone number")}</span></button>
        </div>
        <div class="auth-divider">${T("or")}</div>
      ` : ""}
      <form id="authForm" class="auth-form">
        <label class="auth-label" for="authEmail">${T("Email")}</label>
        <input class="auth-input" id="authEmail" type="email" autocomplete="email" required>
        ${!isReset ? `
          <label class="auth-label" for="authPassword">${T("Password")}</label>
          <input class="auth-input" id="authPassword" type="password" autocomplete="${isSignup ? "new-password" : "current-password"}" required minlength="6">
        ` : ""}
        <button class="btn btn-accent" type="submit" style="margin-top:14px;width:100%;" ${busy ? "disabled" : ""}>
          ${busy ? T("Please wait…") : isReset ? T("Send reset link") : isSignup ? T("Create account") : T("Sign in with email")}
        </button>
      </form>
      <div class="auth-links">
        ${isReset
          ? `<button class="auth-link-btn" data-mode="signin">${T("Back to sign in")}</button>`
          : isSignup
            ? `<button class="auth-link-btn" data-mode="signin">${T("Already have an account? Sign in")}</button>`
            : `<button class="auth-link-btn" data-mode="signup">${T("Create an account with email")}</button><button class="auth-link-btn" data-mode="reset">${T("Forgot password?")}</button>`}
      </div>
    </div></div>`;

  $("authForm").addEventListener("submit", onEmailAuthSubmit);
  const g = $("googleBtn"); if (g) g.addEventListener("click", signInWithGoogle);
  const ph = $("phoneBtn"); if (ph) ph.addEventListener("click", () => { mode = "phone"; errorMsg = ""; renderAuthScreen(); });
  const tgb = $("telegramBtn"); if (tgb) tgb.addEventListener("click", () => { mode = "telegram"; errorMsg = ""; tgLogin = null; renderAuthScreen(); startTelegramLogin(); });
  root().querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => { mode = btn.dataset.mode; errorMsg = ""; renderAuthScreen(); });
  });
}

/* ---------------- Phone number sign-in (no SMS — see shared/phone-login.js) ---------------- */
let pendingPhoneName = "";   // typed on the phone form; used to create the profile without asking again
function renderPhoneScreen(){
  redraw = renderAuthScreen;
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">${BRAND}</span>
      <h1 class="auth-title">${T("Continue with phone number")}</h1>
      <p class="auth-sub">${T("Enter your name and phone number. No SMS code is sent — use the same number next time to get back into your account.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      <form id="phoneForm" class="auth-form">
        <label class="auth-label" for="phoneName">${T("Full name")}</label>
        <input class="auth-input" id="phoneName" type="text" autocomplete="name" value="${escapeHtml(pendingPhoneName)}" required>
        <label class="auth-label" for="phoneNumber">${T("Phone number")}</label>
        <input class="auth-input" id="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="+1 (415) 555-0132" required>
        <button class="btn btn-accent" type="submit" style="margin-top:14px;width:100%;" ${busy ? "disabled" : ""}>${busy ? T("Please wait…") : T("Continue")}</button>
      </form>
      <div class="auth-links"><button class="auth-link-btn" data-mode="signin">${T("Use email or Google instead")}</button></div>
    </div></div>`;
  $("phoneForm").addEventListener("submit", onPhoneSubmit);
  root().querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => { mode = btn.dataset.mode; errorMsg = ""; renderAuthScreen(); });
  });
}

// Signs in with the account this number maps to, creating it the first time.
async function onPhoneSubmit(e){
  e.preventDefault();
  errorMsg = "";
  const name = $("phoneName").value.trim();
  const digits = normalizePhone($("phoneNumber").value);
  if (!name) return;
  if (!digits){ pendingPhoneName = name; errorMsg = T("That doesn't look like a valid phone number. Include the area or country code."); renderAuthScreen(); return; }
  const { email, password } = phoneCredentials(digits);
  pendingPhoneName = name;
  busy = true; renderAuthScreen();
  try{
    try{
      await signInWithEmailAndPassword(auth, email, password);
    }catch(err){
      // Firebase answers "no such user" and "wrong password" with the same
      // invalid-credential code, so try creating the account either way: it
      // succeeds for a new number, and fails with email-already-in-use for an
      // existing one whose password isn't the derived one.
      if (err && (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password")){
        try{ await createUserWithEmailAndPassword(auth, email, password); }
        catch(e2){
          // Also what a number tied to Telegram answers (api/telegram.js locks its derived password): point there.
          if (e2 && e2.code === "auth/email-already-in-use") throw new Error(tgReady ? T("This number is tied to Telegram now. Use \"Continue with Telegram\" to sign in.") : T("This number is already registered with a different sign-in method. Ask the owner to help."));
          throw e2;
        }
      } else throw err;
    }
  }catch(err){
    busy = false; errorMsg = mapAuthError(err); renderAuthScreen();
  }
}

/* ---------------- Telegram sign-in (api/tg.js + the bot, api/telegram.js) ----------------
 * The site asks for a one-time link, the person opens it in Telegram, the bot answers with a 6-digit code, and the code
 * is typed back here. The code only ever reaches the Telegram account that opened the link, so a link someone sends
 * you can't be used to get into their account (or yours). */
let tgReady = false;         // /api/tg?health=1 said the bot is set up
let tgLogin = null;          // { nonce, link } of the attempt on screen
function checkTelegram(){
  try{
    fetch(API + "/api/tg?health=1").then(r => r.ok ? r.json() : null).then(j => {
      tgReady = !!(j && j.configured);
      if (tgReady && redraw === renderAuthScreen && mode === "signin" && !busy) renderAuthScreen();
    }).catch(() => {});
  }catch(e){}
}
async function tgPost(body){
  const r = await fetch(API + "/api/tg", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  let j = null; try{ j = await r.json(); }catch(e){}
  return { status: r.status, body: j || {} };
}
async function startTelegramLogin(){
  busy = true; renderAuthScreen();
  try{
    const r = await tgPost({ action: "login-start" });
    if (r.status !== 200 || !r.body.link) throw new Error(r.status === 429 ? T("Too many attempts. Please wait a moment and try again.") : T("Something went wrong. Please try again."));
    tgLogin = { nonce: r.body.nonce, link: r.body.link };
  }catch(err){ errorMsg = (err && err.message) || T("Something went wrong. Please try again."); }
  busy = false; if (mode === "telegram") renderAuthScreen();
}
function renderTelegramScreen(){
  redraw = renderAuthScreen;
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">${BRAND}</span>
      <h1 class="auth-title">${T("Continue with Telegram")}</h1>
      <p class="auth-sub">${T("1. Open our Telegram bot and press Start. 2. It sends you a 6-digit code. 3. Type the code here.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      ${tgLogin ? `<a class="auth-btn-provider" id="tgOpenLink" href="${escapeHtml(tgLogin.link)}" target="_blank" rel="noopener" style="text-decoration:none;justify-content:center;">${TELEGRAM_ICON}<span>${T("Open Telegram")}</span></a>
      <form id="tgCodeForm" class="auth-form" style="margin-top:14px;">
        <label class="auth-label" for="tgCode">${T("Code from Telegram")}</label>
        <input class="auth-input" id="tgCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="123456" required style="letter-spacing:0.3em;font-size:1.3rem;text-align:center;">
        <button class="btn btn-accent" type="submit" style="margin-top:14px;width:100%;" ${busy ? "disabled" : ""}>${busy ? T("Please wait…") : T("Sign in")}</button>
      </form>` : `<p class="auth-sub">${busy ? T("Please wait…") : ""}</p>${!busy ? `<button class="btn btn-accent" id="tgRetry" style="width:100%;">${T("Try again")}</button>` : ""}`}
      <div class="auth-links"><button class="auth-link-btn" data-mode="signin">${T("Use email or Google instead")}</button></div>
    </div></div>`;
  const f = $("tgCodeForm"); if (f) f.addEventListener("submit", onTelegramCode);
  const again = $("tgRetry"); if (again) again.addEventListener("click", () => { errorMsg = ""; startTelegramLogin(); });
  root().querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => { mode = btn.dataset.mode; errorMsg = ""; tgLogin = null; renderAuthScreen(); });
  });
}
async function onTelegramCode(e){
  e.preventDefault();
  const code = $("tgCode").value.replace(/\D/g, "");
  if (code.length !== 6){ errorMsg = T("The code has 6 digits."); renderAuthScreen(); return; }
  errorMsg = ""; busy = true; renderAuthScreen();
  try{
    const r = await tgPost({ action: "login-check", nonce: tgLogin.nonce, code });
    if (r.status !== 200 || !r.body.token){
      const why = {
        "not-yet": T("Open Telegram and press Start first, then type the code the bot sends you."),
        "wrong-code": T("That code isn't right. Check the last message from the bot."),
        "expired": T("This code has expired. Press \"Try again\" for a new one."),
        "too-many": T("Too many wrong codes. Press \"Try again\" for a new one."),
      }[r.body.error];
      if (r.body.error === "expired" || r.body.error === "too-many") tgLogin = null;
      throw new Error(why || T("Something went wrong. Please try again."));
    }
    await signInWithCustomToken(auth, r.body.token);
    tgLogin = null;   // onAuthStateChanged takes it from here
  }catch(err){
    busy = false; errorMsg = (err && err.message) || T("Something went wrong. Please try again."); renderAuthScreen();
  }
}

async function signInWithProvider(provider){
  errorMsg = ""; busy = true; renderAuthScreen();
  try{
    if (usesRedirectSignIn){ await signInWithRedirect(auth, provider); return; }
    await signInWithPopup(auth, provider);
  }catch(err){
    busy = false; errorMsg = mapAuthError(err); renderAuthScreen();
  }
}

// Inside the Capacitor Android app, window.__ttNativeAuth is set by
// vendor-auth-bridge.js (bundled by android-app's copy-web script) — that
// file doesn't exist on the live website, so this always falls through to
// the normal signInWithPopup path there. See native-auth-bridge.js and
// shared/firebase.js for why the native path needs a separate credential
// hand-off: Google blocks OAuth popups/redirects inside embedded WebViews,
// so the native app must sign in through Android's own Google Sign-In SDK
// and then hand that credential to the Firebase JS SDK manually.
async function signInWithGoogle(){
  if (!window.__ttNativeAuth){
    return signInWithProvider(googleProvider);
  }
  errorMsg = ""; busy = true; renderAuthScreen();
  try{
    const result = await window.__ttNativeAuth.signInWithGoogle();
    const idToken = result && result.credential && result.credential.idToken;
    if (!idToken) throw new Error(T("Google sign-in did not return a credential."));
    await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  }catch(err){
    busy = false; errorMsg = mapAuthError(err); renderAuthScreen();
  }
}

async function onEmailAuthSubmit(e){
  e.preventDefault();
  errorMsg = "";
  const email = $("authEmail").value.trim();
  const password = mode !== "reset" ? $("authPassword").value : null;

  busy = true; renderAuthScreen();
  try{
    if (mode === "signup"){
      await createUserWithEmailAndPassword(auth, email, password);
    } else if (mode === "reset"){
      await sendPasswordResetEmail(auth, email);
      busy = false; mode = "signin"; errorMsg = "";
      renderAuthScreen();
      alert(T("Password reset email sent — check your inbox."));
      return;
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  }catch(err){
    busy = false; errorMsg = mapAuthError(err); renderAuthScreen();
  }
}

/* ---------------- Complete profile → request access ---------------- */
let profDraft = { name: "", phone: "" };   // what was typed, kept across re-renders (errors, "please wait")
function renderCompleteProfile(user){
  redraw = () => renderCompleteProfile(user);
  // A phone sign-up already gave its name on the phone form — no second form.
  if (phoneFromEmail(user.email) && pendingPhoneName && !busy && !errorMsg){
    busy = true;
    requestAccess(user, pendingPhoneName).catch((err) => { busy = false; errorMsg = mapAuthError(err); renderCompleteProfile(user); });
    return;
  }
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">${T("Complete your profile")}</h1>
      <p class="auth-sub">${T("Tell us your name and phone number to create your account and start your free 3-day trial — no approval needed.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      <form id="profileForm" class="auth-form">
        <label class="auth-label" for="profName">${T("Full name")}</label>
        <input class="auth-input" id="profName" type="text" autocomplete="name" value="${escapeHtml(profDraft.name || user.displayName || "")}" required>
        <label class="auth-label" for="profPhone">${T("Phone number")}</label>
        <input class="auth-input" id="profPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+1 (415) 555-0132" value="${escapeHtml(profDraft.phone || (phoneFromEmail(user.email) ? contactLabel(user.email) : ""))}" required>
        <p class="auth-hint" style="margin:6px 2px 0;font-size:0.8rem;opacity:0.75;">${T("We only keep your number so your teacher can reach you. No text message is sent.")}</p>
        <button class="btn btn-accent" type="submit" style="margin-top:14px;width:100%;" ${busy ? "disabled" : ""}>${busy ? T("Please wait…") : T("Create account")}</button>
      </form>
      <div class="auth-links"><button class="auth-link-btn" id="cancelProfileBtn">${T("Sign out")}</button></div>
    </div></div>`;

  $("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("profName").value.trim();
    const phone = normalizePhone($("profPhone").value);
    profDraft = { name, phone: $("profPhone").value.trim() };
    if (!name) return;
    if (!phone){ errorMsg = T("That doesn't look like a valid phone number. Include the area or country code."); renderCompleteProfile(user); return; }
    busy = true; errorMsg = ""; renderCompleteProfile(user);
    try{
      await requestAccess(user, name, phone);
    }catch(err){
      busy = false; errorMsg = mapAuthError(err); renderCompleteProfile(user);
    }
  });
  $("cancelProfileBtn").addEventListener("click", () => signOut(auth));
}

async function requestAccess(user, name, phoneDigits){
  // Not lower-cased: this must byte-for-byte match auth.token.email in
  // database.rules.json, which is what actually decides owner bootstrap.
  const email = user.email || "";
  const isOwner = email === OWNER_EMAIL;
  const phone = phoneFromEmail(email) || phoneDigits || null;   // a phone-number account already is its number; everyone else types theirs
  const profile = {
    name,
    email,
    photoURL: user.photoURL || null,
    provider: phoneFromEmail(email) ? "phone" : ((user.providerData[0] && user.providerData[0].providerId) || "password"),
    status: isOwner ? "approved" : "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };
  if (phone) profile.phone = "+" + phone;
  if (isOwner) profile.role = "owner";
  else profile.role = "student";   // immediate 3-day trial access, see trialInfo() above
  await set(ref(db, "users/" + user.uid), profile);
}

/* ---------------- Pay screen ---------------- */
// Shown when the free trial is over (or a paid period ended). One card per
// plan in shared/pay-config.js; the button asks /api/pay for a Whop checkout tied to this account, so the payment
// opens the course by itself (api/whop.js). If that isn't set up yet, it falls back to the plan's plain Whop link.
const API = (nativePlatform === "android" || nativePlatform === "ios") ? PROD_SITE : (window.TT_API_BASE != null ? String(window.TT_API_BASE) : "");
let payBusy = null, payError = "";
function payCardHtml(profile, reason){
  const lapsed = typeof profile.paidUntil === "number" && profile.paidUntil <= Date.now();
  const title = reason === "upgrade" ? T("Choose your plan") : lapsed ? T("Your paid access has ended") : T("Free trial ended");
  const sub = reason === "upgrade"
      ? T("Pay now and every lesson opens; your trial days are not lost.")
    : lapsed
      ? T("Thanks, {name}. Renew to keep studying; your progress is saved.", { name: escapeHtml(profile.name || "") })
      : T("Thanks, {name}. Choose a plan to keep studying; your progress is saved.", { name: escapeHtml(profile.name || "") });
  const back = /[?&]paid=1\b/.test(location.search);
  const plans = PLANS.map((p, i) => `
    <div class="pay-plan${p.note ? " best" : ""}">
      ${p.note ? `<span class="pay-tag">${T(p.note)}</span>` : ""}
      <div><div class="pay-price">${escapeHtml(p.price)}</div><div class="pay-period">${T(p.period)}</div></div>
      <button class="btn btn-accent" data-plan="${i}" ${payBusy ? "disabled" : ""}>${payBusy === p.id ? T("Please wait…") : T("Pay")}</button>
    </div>`).join("");
  return `
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">${title}</h1>
      <p class="auth-sub">${sub}</p>
      ${back ? `<div class="auth-notice">${T("Thank you! Your payment is being confirmed. This page opens the course by itself in a minute.")}</div>` : ""}
      ${payError ? `<div class="auth-error">${escapeHtml(payError)}</div>` : ""}
      <div class="pay-plans">${plans}</div>
      <ul class="pay-includes">${INCLUDES.map(x => `<li>${T(x, { min: PAID_VOICE_MINUTES })}</li>`).join("")}</ul>
      <p class="pay-fine">${T("Card payment through Whop. The monthly plan renews each month until you cancel; the 3-month plan is paid once and ends by itself. We never promise a pass: the officer decides.")}</p>
      ${CONTACT_TELEGRAM ? `<a class="btn btn-ghost" href="${escapeHtml(CONTACT_TELEGRAM)}" target="_blank" rel="noopener" style="display:flex;width:100%;margin-bottom:10px;text-decoration:none;">${T("Questions or another way to pay? Write to us")}</a>` : ""}`;
}
function wirePayButtons(scope, repaint){
  scope.querySelectorAll("[data-plan]").forEach(btn => btn.addEventListener("click", () => startPayment(PLANS[Number(btn.dataset.plan)], repaint)));
}
async function startPayment(plan, repaint){
  if (!plan || payBusy) return;
  payBusy = plan.id; payError = ""; repaint();
  let url = "";
  try{
    const token = auth.currentUser && await auth.currentUser.getIdToken();
    const r = await fetch(API + "/api/pay", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + token }, body: JSON.stringify({ plan: plan.id }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && /^https:\/\//.test(j.url || "")) url = j.url;
  }catch(e){}
  if (!url && /^https:\/\//.test(plan.whopLink || "")) url = plan.whopLink;
  if (url){ window.location.href = url; return; }
  payBusy = null;
  payError = CONTACT_TELEGRAM ? T("Online payment isn't switched on yet. Please write to us to pay.") : T("Online payment isn't switched on yet. Please try again later.");
  repaint();
}
function renderPaywall(profile, reason){
  const again = () => renderPaywall(profile, reason);
  redraw = again;
  root().innerHTML = `<div class="auth-screen"><div class="auth-card">${payCardHtml(profile, reason)}
      <button class="btn btn-ghost btn-sm" id="paySignOut">${T("Sign out")}</button>
    </div></div>`;
  wirePayButtons(root(), again);
  $("paySignOut").addEventListener("click", () => signOut(auth));
}
// The same plans over the running app (from the trial banner or Settings), closable.
function renderPayOverlay(user, profile){
  let el = document.getElementById("payOverlay");
  if (el) el.remove();
  el = document.createElement("div");
  el.id = "payOverlay";
  el.style.cssText = "position:fixed;inset:0;z-index:1000;overflow:auto;";
  const paint = () => {
    el.innerHTML = `<div class="auth-screen" style="background:rgba(0,0,0,.45)"><div class="auth-card">${payCardHtml(profile, "upgrade")}
        <button class="btn btn-ghost btn-sm" id="payClose">${T("Close")}</button></div></div>`;
    wirePayButtons(el, paint);
    el.querySelector("#payClose").addEventListener("click", () => el.remove());
  };
  document.body.appendChild(el);
  paint();
}

/* ---------------- Pending / restricted / wrong-app screens ---------------- */
function renderPending(profile){
  // Every non-owner sign-up gets role:"student" immediately (see
  // requestAccess), so landing here while still "pending" with that role
  // can only mean the 3-day trial (or a paid period) ran out: that's the pay
  // screen. Anything else (no role at all) is a genuine, not-yet-reviewed request.
  if (profile.role === "student"){ renderPaywall(profile, "trial"); return; }
  redraw = () => renderPending(profile);
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">${T("Awaiting approval")}</h1>
      <p class="auth-sub">${T("Thanks, {name} — your request is in. An owner or manager needs to approve it before you can get in. This page updates automatically, no need to refresh.", { name: escapeHtml(profile.name || "") })}</p>
      <button class="btn btn-ghost btn-sm" id="pendingSignOut">${T("Sign out")}</button>
    </div></div>`;
  $("pendingSignOut").addEventListener("click", () => signOut(auth));
}

// Shown to anyone whose access an owner/manager switched off. A reason (set in the admin when restricting) changes
// the wording: a graduate is congratulated, a paused student is told they can come back.
function renderRestricted(profile){
  redraw = () => renderRestricted(profile);
  const reason = profile && profile.statusReason;
  const title = reason === "graduated" ? T("Course completed") : reason === "paused" ? T("Access paused") : T("Access restricted");
  const text = reason === "graduated"
    ? T("Congratulations — you have finished the course! Your access has now ended. Contact your teacher if you would like to continue.")
    : reason === "paused"
      ? T("Your access is paused for now. Contact your teacher when you are ready to continue.")
      : T("Your access to this platform has been turned off. Contact your owner or manager if you think this is a mistake.");
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <h1 class="auth-title">${title}</h1>
      <p class="auth-sub">${text}</p>
      <button class="btn btn-ghost btn-sm" id="restrictedSignOut">${T("Sign out")}</button>
    </div></div>`;
  $("restrictedSignOut").addEventListener("click", () => signOut(auth));
}

function renderWrongApp(profile){
  redraw = () => renderWrongApp(profile);
  const forStaffApp = opts.appKind !== "main"; // signed into the course, but role isn't student
  const label = ROLE_LABEL[profile.role] ? T(ROLE_LABEL[profile.role]) : profile.role;
  const targetUrl = forStaffApp ? opts.mainUrl : (opts.appKind === "teachers" ? (opts.teachersUrl || opts.adminUrl) : opts.adminUrl);
  const appLabel = opts.appLabel || T("admin dashboard");

  if (targetUrl){
    // Nobody should have to click through to the right app — a student
    // has no reason to be on the admin dashboard (or vice versa), so send
    // them straight there the moment we know their role doesn't match.
    root().innerHTML = `
      <div class="auth-screen"><div class="auth-card">
        <span class="auth-brand">TRUCK TALK</span>
        <h1 class="auth-title">${T("Redirecting…")}</h1>
        <p class="auth-sub">${forStaffApp ? T("Taking you to the course.") : T("Taking you to the {app}.", { app: appLabel })}</p>
        <div class="auth-links"><button class="auth-link-btn" id="wrongAppSignOut">${T("Wrong account? Sign out")}</button></div>
      </div></div>`;
    $("wrongAppSignOut").addEventListener("click", () => signOut(auth));
    window.location.replace(targetUrl);
    return;
  }

  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">TRUCK TALK</span>
      <span class="auth-role-pill">${escapeHtml(label)}</span>
      <h1 class="auth-title">${forStaffApp ? T("This is the student course") : T("This is the {app}", { app: appLabel })}</h1>
      <p class="auth-sub">${forStaffApp ? T("Your account is a student account — head back to the course.") : T("Your account is a {role} account — head to the {app} instead.", { role: label.toLowerCase(), app: appLabel })}</p>
      <div class="auth-notice">${forStaffApp ? T("Ask your owner or manager for the course link.") : T("Ask your owner or manager for the {app} link.", { app: appLabel })}</div>
      <div class="auth-links"><button class="auth-link-btn" id="wrongAppSignOut">${T("Sign out")}</button></div>
    </div></div>`;
  $("wrongAppSignOut").addEventListener("click", () => signOut(auth));
}

/* ---------------- Wiring into the host app ---------------- */
let heartbeatUid = null;
let mountedSignature = null;
function mountApp(user, profile, trial){
  redraw = null;   // the gate is done; a language change now belongs to the host app
  showAppShell(true);
  // auth.currentUser.email is the source of truth (e.g. after someone
  // completes a verifyBeforeUpdateEmail link, it changes there first);
  // reconcile the database copy whenever the two drift apart, rather
  // than writing it eagerly at change-email time before it's confirmed.
  const email = user.email || profile.email;
  const trialDaysLeft = trial && trial.active ? trial.daysLeft : null;
  const unlockFrom = typeof profile.unlockFrom === "number" ? profile.unlockFrom : null;
  const unlockTo = typeof profile.unlockTo === "number" ? profile.unlockTo : null;
  // Whether this account can already sign in with email+password as a
  // fallback to Google — a Google-only sign-up has no such credential
  // until they add one via window.TTE_addPassword (see below).
  const hasPassword = (user.providerData || []).some(p => p.providerId === "password");
  // A phone-number account's e-mail is a made-up id (see shared/phone-login.js):
  // show the number instead, and don't offer password management — its password
  // is derived from the number, so changing it would lock the person out.
  const isPhone = !!phoneFromEmail(email) || isTelegramEmail(email) || !email;   // no password to manage for these
  const telegram = profile.telegram && profile.telegram.tgId ? { reminders: profile.telegram.reminders !== false } : null;
  const pacing = profile.pacing === "teacher" ? "teacher" : "self";
  const paidUntil = profile.status !== "approved" && paidActive(profile) ? profile.paidUntil : null;
  window.TTE_user = { uid: user.uid, name: profile.name, email: contactLabel(email), role: profile.role, teacherId: profile.teacherId || null, trialDaysLeft, unlockFrom, unlockTo, pacing, paidUntil, hasPassword: isPhone ? false : hasPassword, isPhone, telegram };
  window.TTE_telegramReady = () => tgReady;   // the bot is set up (Settings shows "Telegram reminders" only then)
  // "See plans" in the trial banner / Settings (students only; never inside the store apps)
  window.TTE_openPay = profile.role === "student" && !(nativePlatform === "android" || nativePlatform === "ios") ? () => renderPayOverlay(user, profile) : null;
  // Non-student roles get a voluntary link to the admin dashboard (shown
  // in the host app's own UI, e.g. Settings) — they are never forced
  // there. Only appKind "main" ever has a role other than student mount
  // here at all, so this is effectively "am I on the course site and not
  // a student".
  window.TTE_adminUrl = (profile.role !== "student" && opts.adminUrl) ? opts.adminUrl : null;
  window.TTE_teachersUrl = (profile.role !== "student" && opts.teachersUrl) ? opts.teachersUrl : null;
  window.TTE_mainUrl = opts.mainUrl || null;
  // Progress goes to the cloud through a queue (shared/sync-queue.js): batched, retried after failures,
  // flushed when the tab is hidden or closed — so 100 students studying at once don't lose anything.
  const queue = progressQueue(user.uid);
  window.TTE_signOut = async () => { await flushBeforeLeaving(queue); return signOut(auth); };
  window.TTE_getToken = () => user.getIdToken();   // for /api/tutor (shared/tutor-ui.js)
  window.TTE_syncProgress = (progress) => queue.schedule(() => JSON.parse(JSON.stringify(progress)));
  // Where the student is in the course (usage/{uid}), for the admin's "Where students stop". Students only; best effort.
  window.TTE_track = profile.role === "student" ? (day, step) => {
    const at = Date.now(), patch = { last: day ? { at, day, step } : { at, step } };
    if (day) patch["days/" + day + "/" + step] = at;
    update(ref(db, "usage/" + user.uid), patch).catch(() => {});
  } : null;
  // Writing lastActive changes this same profile node, which re-fires the
  // onValue listener that called us — so the heartbeat is written once per
  // sign-in (not on every call), and the host is only refreshed when
  // something it actually shows changed. Otherwise the page redraws in a
  // never-ending loop.
  const heartbeat = {};
  if (heartbeatUid !== user.uid){ heartbeat.lastActive = serverTimestamp(); heartbeatUid = user.uid; }
  if (email && email !== profile.email) heartbeat.email = email;
  if (Object.keys(heartbeat).length) update(ref(db, "users/" + user.uid), heartbeat).catch(() => {});

  const signature = [user.uid, profile.name, email, profile.role, profile.teacherId || "", window.TTE_adminUrl || "", window.TTE_teachersUrl || "", trialDaysLeft, unlockFrom, unlockTo, pacing, paidUntil].join("|");
  if (!window.TTE_mounted){
    window.TTE_mounted = true;
    mountedSignature = signature;
    window.TTE_mount && window.TTE_mount();
  } else if (signature !== mountedSignature){
    mountedSignature = signature;
    window.TTE_refresh && window.TTE_refresh();
  }

  // Live copy of this student's progress from the cloud: a new phone gets everything back, and lessons done on
  // another device show up here without a reload (app.js merges it, see onRemoteProgress).
  if (opts.appKind === "main" && progressUid !== user.uid){
    if (unsubProgress) unsubProgress();
    progressUid = user.uid;
    const uid = user.uid;
    cloudProgress = { uid, ready: false, val: null };
    unsubProgress = onValue(ref(db, "progress/" + uid), (snap) => {
      cloudProgress = { uid, ready: true, val: snap.val() };
      if (window.TTE_onRemoteProgress) window.TTE_onRemoteProgress(snap.val(), uid);
    }, () => {});
  }

  // Lesson/homework/grammar resets issued by a teacher, manager or owner
  // arrive as small requests under resets/{myUid}; the host app applies
  // each once and we stamp it applied. (Only the course site defines
  // TTE_applyResets — the admin dashboard has no progress of its own.)
  if (opts.appKind === "main" && resetsUid !== user.uid){
    if (unsubResets) unsubResets();
    resetsUid = user.uid;
    unsubResets = onValue(ref(db, "resets/" + user.uid), (snap) => {
      if (!window.TTE_applyResets) return;
      window.TTE_applyResets(snap.val(), (id) => {
        update(ref(db, "resets/" + user.uid + "/" + id), { appliedAt: serverTimestamp() }).catch(() => {});
      });
    }, () => {});
  }
}

function handleProfile(user, profile){
  if (profile.status === "restricted"){
    clearTimeout(trialTimer);
    showAppShell(false);
    renderRestricted(profile);
    return;
  }
  const trial = profile.status === "pending" && profile.role === "student" ? trialInfo(profile) : null;
  // A paid period (users/{uid}/paidUntil, see shared/pay-config.js) lets a student in until it passes.
  const paid = profile.role === "student" && paidActive(profile);
  const usable = profile.status === "approved" ? !!profile.role : !!((trial && trial.active) || paid);
  if (!usable){
    clearTimeout(trialTimer);
    showAppShell(false);
    renderPending(profile);
    return;
  }
  const isStudentRole = profile.role === "student";
  // The course site (appKind "main") is open to every approved role —
  // owner, manager, and teacher accounts can see the platform itself,
  // exactly like a student would, not just admin staff. The admin
  // dashboard (appKind "admin") is still staff-only: a student has no
  // data there and gets sent back to the course instead.
  const matchesThisApp = (opts.appKind === "admin" || opts.appKind === "teachers") ? !isStudentRole : true;
  if (!matchesThisApp){
    clearTimeout(trialTimer);
    showAppShell(false);
    renderWrongApp(profile);
    return;
  }
  // Re-check the moment access would lapse (a trial, or a paid period that isn't permanent approval).
  const endsAt = profile.status === "approved" ? null : Math.max(paid ? profile.paidUntil : 0, trial && trial.active ? trial.end : 0) || null;
  if (endsAt) scheduleTrialRecheck(user, profile, endsAt - Date.now());
  else clearTimeout(trialTimer);
  mountApp(user, profile, paid ? null : trial);
}

/**
 * @param {Object} userOpts
 * @param {"main"|"admin"|"teachers"} userOpts.appKind - which app this page is
 * @param {string|null} [userOpts.adminUrl] - admin dashboard link; defaults to this site's /admin/
 * @param {string|null} [userOpts.teachersUrl] - Teachers platform ("Courses") link; defaults to this site's /teachers/
 * @param {string|null} [userOpts.mainUrl] - the course link, used to send students away from staff apps; defaults to this site's /trucktalk/
 * @param {string|null} [userOpts.appLabel] - human label for this app, used in "wrong app" copy on a staff app (e.g. "Teachers platform")
 */
export function initAuthGate(userOpts){
  opts = Object.assign({ appKind: "main", adminUrl: SITE + "/admin/", teachersUrl: SITE + "/teachers/", mainUrl: SITE + "/trucktalk/", appLabel: null }, userOpts);

  if (!isFirebaseConfigured){ renderNotConfigured(); return; }

  mode = "signin"; errorMsg = ""; busy = false;
  checkTelegram();

  // Coming back from a redirect sign-in: the signed-in user arrives via
  // onAuthStateChanged below; this only surfaces a failed attempt.
  if (usesRedirectSignIn){
    getRedirectResult(auth).catch((err) => { busy = false; errorMsg = mapAuthError(err); renderAuthScreen(); });
  }

  onAuthStateChanged(auth, (user) => {
    busy = false;
    if (unsubProfile){ unsubProfile(); unsubProfile = null; }

    if (!user){
      if (unsubResets){ unsubResets(); unsubResets = null; resetsUid = null; }
      if (unsubProgress){ unsubProgress(); unsubProgress = null; progressUid = null; }
      cloudProgress = { uid: null, ready: false, val: null };
      clearTimeout(trialTimer);
      showAppShell(false);
      window.TTE_user = null; heartbeatUid = null;
      pendingPhoneName = ""; profDraft = { name: "", phone: "" };
      if (syncQueue){ syncQueue.stop(); syncQueue = null; syncUid = null; }
      // Otherwise a different account signing in right after (same tab,
      // e.g. a shared machine) would skip TTE_mount() entirely — mountApp()
      // only calls it "if (!window.TTE_mounted)", so a stale true here would
      // leave the new session on the previous account's listeners/state.
      window.TTE_mounted = false;
      mode = "signin"; errorMsg = "";
      renderAuthScreen();
      return;
    }

    unsubProfile = onValue(ref(db, "users/" + user.uid), (snap) => {
      if (!snap.exists()){ renderCompleteProfile(user); return; }
      handleProfile(user, snap.val());
    }, (err) => {
      errorMsg = mapAuthError(err);
      renderAuthScreen();
    });
  });
}

// Lets a Google-only account add an email+password fallback (so losing
// access to Gmail doesn't mean losing the account), and lets any account
// that already has one change it. Called from the host app's Settings UI
// via window.TTE_addPassword / window.TTE_changePassword; both throw an
// Error with an already-translated, user-facing message on failure.
window.TTE_addPassword = async function(newPassword){
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error(T("Something went wrong. Please try again."));
  try{
    await linkWithCredential(user, EmailAuthProvider.credential(user.email, newPassword));
  }catch(err){ throw new Error(mapAuthError(err)); }
  if (window.TTE_user) window.TTE_user.hasPassword = true;
  window.TTE_refresh && window.TTE_refresh();
};
window.TTE_changePassword = async function(currentPassword, newPassword){
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error(T("Something went wrong. Please try again."));
  try{
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
    await updatePassword(user, newPassword);
  }catch(err){ throw new Error(mapAuthError(err)); }
};

export function signOutUser(){ return signOut(auth); }
