/* SpeakUp — shared account gate: sign in (Google / Apple / email),
 * "complete your profile → request access", pending/restricted screens,
 * and routing a signed-in, approved user to the right app.
 *
 * Used by both index.html (appKind: "main") and admin/index.html
 * (appKind: "admin"). Once a user is signed in AND approved AND their
 * role matches the host app, this hands off to that page's own script via
 * window.SU_mount() / window.SU_refresh() (app.js / admin.js define
 * these) rather than rendering any app UI itself — this module only ever
 * owns the full-screen gate states.
 */
import { auth, db, googleProvider, isFirebaseConfigured, usesRedirectSignIn } from "./firebase.js";
import { OWNER_EMAIL } from "./firebase-config.js";
import { normalizePhone, phoneCredentials, phoneFromEmail, contactLabel } from "../../shared/phone-login.js";
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithCredential, GoogleAuthProvider, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, updatePassword,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  ref, set, update, onValue, runTransaction, serverTimestamp,
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

const BRAND = "SPEAKUP";
const PHONE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`;
const ROLE_LABEL = { owner: "Owner", manager: "Manager", teacher: "Teacher", student: "Student" };

let opts = null;
let unsubProfile = null;
let unsubResets = null;
let resetsUid = null;
let unsubPasses = null;
let passesUid = null;
let unsubProgress = null;
let progressUid = null;
let unsubAssignments = null;
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
      // Sign-in screens of a course (not the staff apps): a way back to the
      // section picker, in case someone opened the wrong course.
      if (opts && opts.appKind === "main" && !window.Capacitor && !card.querySelector(".auth-all-courses")){
        const back = document.createElement("a");
        back.className = "auth-link-btn auth-all-courses";
        back.href = "/?hub=1";
        back.style.cssText = "display:block;text-align:center;margin-top:14px;text-decoration:none;";
        back.textContent = "\u2190 " + T("All courses");
        card.appendChild(back);
      }
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
      <span class="auth-brand">SPEAKUP</span>
      <h1 class="auth-title">Setup needed</h1>
      <p class="auth-sub">This copy hasn't been connected to Firebase yet. Add your project config to <code>shared/firebase-config.js</code>, then reload. See README.md for the full setup guide.</p>
    </div></div>`;
}

/* ---------------- Sign in / sign up / reset ---------------- */
function renderAuthScreen(){
  redraw = renderAuthScreen;
  const isSignup = mode === "signup";
  const isReset = mode === "reset";
  if (mode === "phone"){ renderPhoneScreen(); return; }

  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">SPEAKUP</span>
      <h1 class="auth-title">${isReset ? T("Reset your password") : isSignup ? T("Create your account") : T("Sign in")}</h1>
      <p class="auth-sub">${isReset ? T("We'll email you a reset link.") : T("New accounts need owner or manager approval before you get access.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      ${!isReset ? `
        <div class="auth-providers">
          <button type="button" class="auth-btn-provider" id="googleBtn" ${busy ? "disabled" : ""}>${GOOGLE_ICON}<span>${T("Continue with Google")}</span></button>
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
        <input class="auth-input" id="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" required>
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
          if (e2 && e2.code === "auth/email-already-in-use") throw new Error(T("This number is already registered with a different sign-in method. Ask the owner to help."));
          throw e2;
        }
      } else throw err;
    }
  }catch(err){
    busy = false; errorMsg = mapAuthError(err); renderAuthScreen();
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
function renderCompleteProfile(user){
  // A phone sign-up already gave its name on the phone form — no second form.
  if (phoneFromEmail(user.email) && pendingPhoneName && !busy && !errorMsg){
    busy = true;
    requestAccess(user, pendingPhoneName).catch((err) => { busy = false; errorMsg = mapAuthError(err); renderCompleteProfile(user); });
    return;
  }
  redraw = () => renderCompleteProfile(user);
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">SPEAKUP</span>
      <h1 class="auth-title">${T("Complete your profile")}</h1>
      <p class="auth-sub">${T("Tell us your name to create your account and start your free 3-day trial — no approval needed.")}</p>
      ${errorMsg ? `<div class="auth-error">${escapeHtml(errorMsg)}</div>` : ""}
      <form id="profileForm" class="auth-form">
        <label class="auth-label" for="profName">${T("Full name")}</label>
        <input class="auth-input" id="profName" type="text" value="${escapeHtml(user.displayName || "")}" required>
        <button class="btn btn-accent" type="submit" style="margin-top:14px;width:100%;" ${busy ? "disabled" : ""}>${busy ? T("Please wait…") : T("Create account")}</button>
      </form>
      <div class="auth-links"><button class="auth-link-btn" id="cancelProfileBtn">${T("Sign out")}</button></div>
    </div></div>`;

  $("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("profName").value.trim();
    if (!name) return;
    busy = true; errorMsg = ""; renderCompleteProfile(user);
    try{
      await requestAccess(user, name);
    }catch(err){
      busy = false; errorMsg = mapAuthError(err); renderCompleteProfile(user);
    }
  });
  $("cancelProfileBtn").addEventListener("click", () => signOut(auth));
}

async function requestAccess(user, name){
  // Not lower-cased: this must byte-for-byte match auth.token.email in
  // database.rules.json, which is what actually decides owner bootstrap.
  const email = user.email || "";
  const isOwner = email === OWNER_EMAIL;
  const phone = phoneFromEmail(email);
  const profile = {
    name,
    email,
    photoURL: user.photoURL || null,
    provider: phone ? "phone" : ((user.providerData[0] && user.providerData[0].providerId) || "password"),
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

/* ---------------- Pending / restricted / wrong-app screens ---------------- */
function renderPending(profile){
  redraw = () => renderPending(profile);
  // Every non-owner sign-up gets role:"student" immediately (see
  // requestAccess), so landing here while still "pending" with that role
  // can only mean the 3-day trial ran out — anything else (no role at all)
  // is a genuine, not-yet-reviewed request.
  const expired = profile.role === "student";
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">SPEAKUP</span>
      <h1 class="auth-title">${expired ? T("Free trial ended") : T("Awaiting approval")}</h1>
      <p class="auth-sub">${expired
        ? T("Thanks, {name} — your free trial has ended. An owner or manager needs to approve your account so you can keep using SpeakUp. This page updates automatically, no need to refresh.", { name: escapeHtml(profile.name || "") })
        : T("Thanks, {name} — your request is in. An owner or manager needs to approve it before you can get in. This page updates automatically, no need to refresh.", { name: escapeHtml(profile.name || "") })}</p>
      <button class="btn btn-ghost btn-sm" id="pendingSignOut">${T("Sign out")}</button>
    </div></div>`;
  $("pendingSignOut").addEventListener("click", () => signOut(auth));
}

function renderRestricted(){
  redraw = renderRestricted;
  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">SPEAKUP</span>
      <h1 class="auth-title">${T("Access restricted")}</h1>
      <p class="auth-sub">${T("Your access to this platform has been turned off. Contact your owner or manager if you think this is a mistake.")}</p>
      <button class="btn btn-ghost btn-sm" id="restrictedSignOut">${T("Sign out")}</button>
    </div></div>`;
  $("restrictedSignOut").addEventListener("click", () => signOut(auth));
}

function renderWrongApp(profile){
  redraw = () => renderWrongApp(profile);
  const forAdmin = opts.appKind === "main"; // signed into the course, but role isn't student
  const label = ROLE_LABEL[profile.role] ? T(ROLE_LABEL[profile.role]) : profile.role;
  const targetUrl = forAdmin ? opts.adminUrl : opts.mainUrl;

  if (targetUrl){
    // Nobody should have to click through to the right app — a student
    // has no reason to be on the admin dashboard (or vice versa), so send
    // them straight there the moment we know their role doesn't match.
    root().innerHTML = `
      <div class="auth-screen"><div class="auth-card">
        <span class="auth-brand">SPEAKUP</span>
        <h1 class="auth-title">${T("Redirecting…")}</h1>
        <p class="auth-sub">${forAdmin ? T("Taking you to the admin dashboard.") : T("Taking you to the course.")}</p>
        <div class="auth-links"><button class="auth-link-btn" id="wrongAppSignOut">${T("Wrong account? Sign out")}</button></div>
      </div></div>`;
    $("wrongAppSignOut").addEventListener("click", () => signOut(auth));
    window.location.replace(targetUrl);
    return;
  }

  root().innerHTML = `
    <div class="auth-screen"><div class="auth-card">
      <span class="auth-brand">SPEAKUP</span>
      <span class="auth-role-pill">${escapeHtml(label)}</span>
      <h1 class="auth-title">${forAdmin ? T("This is the student course") : T("This is the admin dashboard")}</h1>
      <p class="auth-sub">${forAdmin ? T("Your account is a {role} account — head to the admin dashboard instead.", { role: label.toLowerCase() }) : T("Your account is a student account — head back to the course.")}</p>
      <div class="auth-notice">${forAdmin ? T("Ask your owner or manager for the admin dashboard link.") : T("Ask your owner or manager for the course link.")}</div>
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
  const unlockFrom = typeof profile.spUnlockFrom === "number" ? profile.spUnlockFrom : null;
  const unlockTo = typeof profile.spUnlockTo === "number" ? profile.spUnlockTo : null;
  // Whether this account can already sign in with email+password as a
  // fallback to Google — a Google-only sign-up has no such credential
  // until they add one via window.SU_addPassword (see below).
  const hasPassword = (user.providerData || []).some(p => p.providerId === "password");
  // A phone-number account's e-mail is a made-up id (see shared/phone-login.js):
  // show the number instead, and don't offer password management — its password
  // is derived from the number, so changing it would lock the person out.
  const isPhone = !!phoneFromEmail(email);
  window.SU_user = { uid: user.uid, name: profile.name, email: contactLabel(email), role: profile.role, teacherId: profile.teacherId || null, trialDaysLeft, unlockFrom, unlockTo, hasPassword: isPhone ? false : hasPassword, isPhone };
  // Non-student roles get a voluntary link to the admin dashboard (shown
  // in the host app's own UI, e.g. Settings) — they are never forced
  // there. Only appKind "main" ever has a role other than student mount
  // here at all, so this is effectively "am I on the course site and not
  // a student".
  window.SU_adminUrl = (profile.role !== "student" && opts.adminUrl) ? opts.adminUrl : null;
  window.SU_signOut = () => signOut(auth);
  // Never a blind overwrite: the cloud copy is read inside a transaction and
  // merged with this device's, so a device that's behind (e.g. an old phone
  // that missed lessons done on a laptop) can't wipe out the newer copy.
  window.SU_syncProgress = (progress) => {
    const M = window.SU_progressMerge;
    runTransaction(ref(db, "speakup/progress/" + user.uid), (cloud) => {
      const merged = M ? M.merge(progress, cloud) : progress;
      merged.updatedAt = Date.now();
      return merged;
    }).catch(() => {});
  };
  // Writing lastActive changes this same profile node, which re-fires the
  // onValue listener that called us — so the heartbeat is written once per
  // sign-in (not on every call), and the host is only refreshed when
  // something it actually shows changed. Otherwise the page redraws in a
  // never-ending loop.
  const heartbeat = {};
  if (heartbeatUid !== user.uid){ heartbeat.lastActive = serverTimestamp(); heartbeatUid = user.uid; }
  if (email && email !== profile.email) heartbeat.email = email;
  if (Object.keys(heartbeat).length) update(ref(db, "users/" + user.uid), heartbeat).catch(() => {});

  const signature = [user.uid, profile.name, email, profile.role, profile.teacherId || "", window.SU_adminUrl || "", trialDaysLeft, unlockFrom, unlockTo].join("|");
  if (!window.SU_mounted){
    window.SU_mounted = true;
    mountedSignature = signature;
    window.SU_mount && window.SU_mount();
  } else if (signature !== mountedSignature){
    mountedSignature = signature;
    window.SU_refresh && window.SU_refresh();
  }

  // Lesson/homework/grammar resets issued by a teacher, manager or owner
  // arrive as small requests under resets/{myUid}; the host app applies
  // each once and we stamp it applied. (Only the course site defines
  // SU_applyResets — the admin dashboard has no progress of its own.)
  if (opts.appKind === "main" && resetsUid !== user.uid){
    if (unsubResets) unsubResets();
    resetsUid = user.uid;
    unsubResets = onValue(ref(db, "speakup/resets/" + user.uid), (snap) => {
      if (!window.SU_applyResets) return;
      window.SU_applyResets(snap.val(), (id) => {
        update(ref(db, "speakup/resets/" + user.uid + "/" + id), { appliedAt: serverTimestamp() }).catch(() => {});
      });
    }, () => {});
  }

  // Live copy of this student's progress from the cloud, so lessons done on
  // another device show up here (and vice versa) without a manual refresh.
  if (opts.appKind === "main" && progressUid !== user.uid){
    if (unsubProgress) unsubProgress();
    progressUid = user.uid;
    unsubProgress = onValue(ref(db, "speakup/progress/" + user.uid), (snap) => {
      if (window.SU_onRemoteProgress) window.SU_onRemoteProgress(snap.val());
    }, () => {});
  }

  // Lesson passes issued by a teacher, manager or owner — the mirror of
  // resets above, same request/apply/stamp flow, under passes/{myUid}.
  if (opts.appKind === "main" && passesUid !== user.uid){
    if (unsubPasses) unsubPasses();
    passesUid = user.uid;
    unsubPasses = onValue(ref(db, "speakup/passes/" + user.uid), (snap) => {
      if (!window.SU_applyPasses) return;
      window.SU_applyPasses(snap.val(), (id) => {
        update(ref(db, "speakup/passes/" + user.uid + "/" + id), { appliedAt: serverTimestamp() }).catch(() => {});
      });
    }, () => {});
  }
}

function handleProfile(user, profile){
  if (profile.status === "restricted"){
    clearTimeout(trialTimer);
    showAppShell(false);
    renderRestricted();
    return;
  }
  const trial = profile.status === "pending" && profile.role === "student" ? trialInfo(profile) : null;
  const usable = profile.status === "approved" ? !!profile.role : !!(trial && trial.active);
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
  const matchesThisApp = opts.appKind === "admin" ? !isStudentRole : true;
  if (!matchesThisApp){
    clearTimeout(trialTimer);
    showAppShell(false);
    renderWrongApp(profile);
    return;
  }
  if (trial && trial.active) scheduleTrialRecheck(user, profile, trial.end - Date.now());
  else clearTimeout(trialTimer);
  mountApp(user, profile, trial);
}

/**
 * @param {Object} userOpts
 * @param {"main"|"admin"} userOpts.appKind - which app this page is
 * @param {string|null} [userOpts.adminUrl] - where to send non-students on the main site (null: show guidance text instead of a link)
 * @param {string|null} [userOpts.mainUrl] - where to send students on the admin site (null: show guidance text instead of a link)
 */
export function initAuthGate(userOpts){
  opts = Object.assign({ appKind: "main", adminUrl: null, mainUrl: null }, userOpts);

  if (!isFirebaseConfigured){ renderNotConfigured(); return; }

  mode = "signin"; errorMsg = ""; busy = false;

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
      if (unsubPasses){ unsubPasses(); unsubPasses = null; passesUid = null; }
      if (unsubProgress){ unsubProgress(); unsubProgress = null; progressUid = null; }
      if (unsubAssignments){ unsubAssignments(); unsubAssignments = null; }
      clearTimeout(trialTimer);
      showAppShell(false);
      window.SU_user = null; heartbeatUid = null;
      pendingPhoneName = "";
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
// via window.SU_addPassword / window.SU_changePassword; both throw an
// Error with an already-translated, user-facing message on failure.
window.SU_addPassword = async function(newPassword){
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error(T("Something went wrong. Please try again."));
  try{
    await linkWithCredential(user, EmailAuthProvider.credential(user.email, newPassword));
  }catch(err){ throw new Error(mapAuthError(err)); }
  if (window.SU_user) window.SU_user.hasPassword = true;
  window.SU_refresh && window.SU_refresh();
};
window.SU_changePassword = async function(currentPassword, newPassword){
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error(T("Something went wrong. Please try again."));
  try{
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
    await updatePassword(user, newPassword);
  }catch(err){ throw new Error(mapAuthError(err)); }
};

// Homework a teacher/manager/owner assigned to this student — day, grammar
// unit, or free-text note — lives at assignments/{myUid} (see
// database.rules.json). Unlike resets, there's nothing here for the
// student's app to "apply" or stamp: it's read-only for them, and
// completion is inferred client-side from their own progress (app.js).
// This keeps the same "app.js never imports the Firebase SDK directly"
// boundary as SU_syncProgress/SU_applyResets: the host app just calls
// window.SU_watchAssignments(cb) once and gets cb(assignmentsObjectOrNull)
// whenever the node changes, without knowing anything about Firebase.
window.SU_watchAssignments = function(cb){
  const user = auth.currentUser;
  if (!user){ cb(null); return () => {}; }
  if (unsubAssignments) unsubAssignments();
  unsubAssignments = onValue(ref(db, "speakup/assignments/" + user.uid), (snap) => cb(snap.val()), () => cb(null));
  return () => { if (unsubAssignments){ unsubAssignments(); unsubAssignments = null; } };
};

export function signOutUser(){ return signOut(auth); }
