/* Truck Talk English — accounts, admin approval, presence, notifications */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, sendPasswordResetEmail, updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, updateDoc, onSnapshot,
  collection, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* ---------------------------------------------------------------------
   1. Paste your Firebase config below (Firebase Console → Project
      settings → General → Your apps → Web app → SDK setup and
      configuration). These values are not secret — they're meant to
      ship in client-side code; access control is enforced by
      Firestore Security Rules (see firestore.rules), not by hiding
      these.
   2. Fill in your EmailJS Service ID, Template ID and Public Key
      (EmailJS dashboard → Email Services / Email Templates / Account).
--------------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

const ADMIN_EMAIL = "abdujalilov7707@gmail.com";
const ONLINE_THRESHOLD_MS = 60000;
const HEARTBEAT_MS = 25000;

const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");

let app, auth, db;
let currentUser = null;
let currentProfile = null;
let unsubProfile = null;
let unsubAdminList = null;
let heartbeatTimer = null;
let authMode = "login"; // "login" | "signup" | "reset"
let authError = "";
let authBusy = false;

function $(id){ return document.getElementById(id); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ---------------- Not configured yet ---------------- */
function renderNotConfigured(){
  $("authRoot").innerHTML = `
    <div class="auth-screen">
      <div class="auth-card">
        <span class="brand-mark" style="display:inline-block;margin-bottom:16px;">TRUCK TALK</span>
        <h2 style="margin-bottom:10px;">Setup needed</h2>
        <p class="panel-sub">This copy hasn't been connected to Firebase yet. Add your Firebase config and EmailJS keys to <code>auth.js</code>, then redeploy.</p>
      </div>
    </div>`;
}

/* ---------------- Auth screens (login / signup / reset) ---------------- */
function renderAuthScreen(){
  const root = $("authRoot");
  const isSignup = authMode === "signup";
  const isReset = authMode === "reset";

  root.innerHTML = `
    <div class="auth-screen">
      <div class="auth-card">
        <span class="brand-mark" style="display:inline-block;margin-bottom:18px;">TRUCK TALK</span>
        <h1 class="hwy-title" style="font-size:1.4rem;margin-bottom:4px;">${isReset ? "Reset your password" : isSignup ? "Create your account" : "Sign in"}</h1>
        <p class="panel-sub" style="margin-bottom:18px;">${isReset ? "We'll email you a reset link." : isSignup ? "New accounts need admin approval before you can start the course." : "English for the trucking & logistics road."}</p>

        ${authError ? `<div class="auth-error">${escapeHtml(authError)}</div>` : ""}

        <form id="authForm" class="auth-form">
          ${isSignup ? `
            <label class="auth-label" for="authName">Full name</label>
            <input class="auth-input" id="authName" type="text" autocomplete="name" required>
          ` : ""}
          <label class="auth-label" for="authEmail">Email</label>
          <input class="auth-input" id="authEmail" type="email" autocomplete="email" required>
          ${!isReset ? `
            <label class="auth-label" for="authPassword">Password</label>
            <input class="auth-input" id="authPassword" type="password" autocomplete="${isSignup ? "new-password" : "current-password"}" required minlength="6">
          ` : ""}
          <button class="btn btn-accent" type="submit" style="margin-top:6px;width:100%;" ${authBusy ? "disabled" : ""}>
            ${authBusy ? "Please wait…" : isReset ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div class="auth-links">
          ${isReset
            ? `<button class="link-btn" data-mode="login">Back to sign in</button>`
            : isSignup
              ? `<button class="link-btn" data-mode="login">Already have an account? Sign in</button>`
              : `<button class="link-btn" data-mode="signup">Create an account</button><button class="link-btn" data-mode="reset">Forgot password?</button>`
          }
        </div>
      </div>
    </div>
  `;

  $("authForm").addEventListener("submit", onAuthSubmit);
  root.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => { authMode = btn.dataset.mode; authError = ""; renderAuthScreen(); });
  });
}

async function onAuthSubmit(e){
  e.preventDefault();
  authError = "";
  const email = $("authEmail").value.trim();
  const password = authMode !== "reset" ? $("authPassword").value : null;
  const name = authMode === "signup" ? $("authName").value.trim() : null;

  authBusy = true; renderAuthScreen();
  try{
    if (authMode === "signup") {
      await doSignup(name, email, password);
    } else if (authMode === "reset") {
      await sendPasswordResetEmail(auth, email);
      authBusy = false;
      authError = "";
      authMode = "login";
      renderAuthScreen();
      alert("Password reset email sent — check your inbox.");
      return;
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch(err){
    authBusy = false;
    authError = mapAuthError(err);
    renderAuthScreen();
  }
}

async function doSignup(name, email, password){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL;
  const profile = {
    name, email: email.toLowerCase(),
    role: isAdminEmail ? "admin" : "driver",
    status: isAdminEmail ? "approved" : "pending",
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  if (!isAdminEmail) notifyAdminOfSignup(name, email);
}

function mapAuthError(err){
  const code = err && err.code;
  const map = {
    "auth/email-already-in-use": "That email already has an account. Try signing in instead.",
    "auth/invalid-email": "That doesn't look like a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/wrong-password": "Incorrect password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

function notifyAdminOfSignup(name, email){
  if (!window.emailjs || EMAILJS_SERVICE_ID.startsWith("YOUR_")) return;
  const signup_date = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { user_name: name, user_email: email, signup_date })
    .catch(err => console.warn("EmailJS notification failed:", err));
}

/* ---------------- Pending / revoked screens ---------------- */
function renderPending(profile){
  $("authRoot").innerHTML = `
    <div class="auth-screen">
      <div class="auth-card">
        <span class="brand-mark" style="display:inline-block;margin-bottom:18px;">TRUCK TALK</span>
        <h1 class="hwy-title" style="font-size:1.3rem;margin-bottom:10px;">Awaiting approval</h1>
        <p class="panel-sub">Thanks, ${escapeHtml(profile.name || "")}! Your account has been created and the admin has been notified. You'll get access as soon as it's approved — this page updates automatically, no need to refresh.</p>
        <button class="btn btn-ghost btn-sm" id="pendingSignOut" style="margin-top:16px;">Sign out</button>
      </div>
    </div>`;
  $("pendingSignOut").addEventListener("click", () => signOut(auth));
}

function renderRevoked(){
  $("authRoot").innerHTML = `
    <div class="auth-screen">
      <div class="auth-card">
        <span class="brand-mark" style="display:inline-block;margin-bottom:18px;">TRUCK TALK</span>
        <h1 class="hwy-title" style="font-size:1.3rem;margin-bottom:10px;">Access revoked</h1>
        <p class="panel-sub">Your access to this platform has been turned off. Contact the admin if you think this is a mistake.</p>
        <button class="btn btn-ghost btn-sm" id="revokedSignOut" style="margin-top:16px;">Sign out</button>
      </div>
    </div>`;
  $("revokedSignOut").addEventListener("click", () => signOut(auth));
}

/* ---------------- Presence heartbeat ---------------- */
function onVisible(){
  if (document.visibilityState === "visible" && currentUser) touchPresence();
}
function touchPresence(){
  updateDoc(doc(db, "users", currentUser.uid), { lastActive: serverTimestamp() }).catch(() => {});
}
function startHeartbeat(){
  stopHeartbeat();
  touchPresence();
  heartbeatTimer = setInterval(touchPresence, HEARTBEAT_MS);
  document.addEventListener("visibilitychange", onVisible);
}
function stopHeartbeat(){
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
  document.removeEventListener("visibilitychange", onVisible);
}

/* ---------------- Admin dashboard ---------------- */
function fmtLastActive(ts){
  if (!ts || !ts.toDate) return "never";
  const ms = Date.now() - ts.toDate().getTime();
  if (ms < ONLINE_THRESHOLD_MS) return "online";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function renderAdminDashboard(){
  const container = document.getElementById("app");
  if (!container) return;
  if (unsubAdminList) { unsubAdminList(); unsubAdminList = null; }

  container.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>Admin — People</h2>
        <p class="panel-sub">Everyone who has ever signed up. Approve pending drivers, or revoke access at any time.</p>
      </div>
      <div id="adminList" class="admin-list"><p class="panel-sub">Loading…</p></div>
    </section>
  `;

  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  unsubAdminList = onSnapshot(q, snap => {
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderAdminList(users);
  }, err => {
    document.getElementById("adminList").innerHTML = `<p class="panel-sub">Couldn't load users: ${escapeHtml(err.message || "")}</p>`;
  });
}

function renderAdminList(users){
  const listEl = document.getElementById("adminList");
  if (!listEl) return;
  const pending = users.filter(u => u.status === "pending");
  const others = users.filter(u => u.status !== "pending");

  function row(u){
    const online = u.lastActive && u.lastActive.toDate && (Date.now() - u.lastActive.toDate().getTime()) < ONLINE_THRESHOLD_MS;
    const isAdminRow = u.role === "admin";
    return `
      <div class="admin-row">
        <div class="admin-row-main">
          <span class="presence-dot ${online ? "online" : "offline"}" title="${online ? "Online" : "Offline"}"></span>
          <div>
            <span class="admin-name">${escapeHtml(u.name || "(no name)")}${isAdminRow ? ' <span class="badge-admin">ADMIN</span>' : ""}</span>
            <span class="admin-email mono">${escapeHtml(u.email || "")}</span>
          </div>
        </div>
        <div class="admin-row-meta">
          <span class="admin-status status-${u.status}">${u.status}</span>
          <span class="admin-seen mono">${online ? "Online" : "Last seen " + fmtLastActive(u.lastActive)}</span>
        </div>
        ${isAdminRow ? "" : `
          <div class="admin-row-actions">
            ${u.status !== "approved" ? `<button class="btn btn-accent btn-sm" data-approve="${u.id}">Approve</button>` : ""}
            ${u.status !== "revoked" ? `<button class="btn btn-danger btn-sm" data-revoke="${u.id}">Revoke</button>` : `<button class="btn btn-ghost btn-sm" data-approve="${u.id}">Restore access</button>`}
          </div>`}
      </div>`;
  }

  listEl.innerHTML = `
    ${pending.length ? `<h3 class="admin-section-title">Pending approval (${pending.length})</h3>${pending.map(row).join("")}` : ""}
    <h3 class="admin-section-title">${pending.length ? "Everyone else" : "All users"} (${others.length})</h3>
    ${others.length ? others.map(row).join("") : `<p class="panel-sub">No one yet.</p>`}
  `;

  listEl.querySelectorAll("[data-approve]").forEach(btn => {
    btn.addEventListener("click", () => updateDoc(doc(db, "users", btn.dataset.approve), { status: "approved" }).catch(e => alert(e.message)));
  });
  listEl.querySelectorAll("[data-revoke]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Revoke this person's access? They'll be signed out of the course immediately.")) {
        updateDoc(doc(db, "users", btn.dataset.revoke), { status: "revoked" }).catch(e => alert(e.message));
      }
    });
  });
}

/* ---------------- Wiring into the main app ---------------- */
function showAuthRoot(){ $("authRoot").hidden = false; $("appShell").hidden = true; }
function showAppShell(){ $("authRoot").hidden = true; $("appShell").hidden = false; }

function mountMainApp(profile){
  showAppShell();
  window.TTE_currentUser = { uid: currentUser.uid, name: profile.name, email: profile.email, role: profile.role };
  window.TTE_signOut = () => signOut(auth);
  window.TTE_renderAdmin = renderAdminDashboard;
  if (!window.TTE_appMounted) {
    window.TTE_appMounted = true;
    window.TTE_initApp && window.TTE_initApp();
  } else if (window.TTE_refreshNav) {
    window.TTE_refreshNav();
  }
}

function handleProfile(profile){
  if (profile.status === "approved") {
    startHeartbeat();
    mountMainApp(profile);
  } else if (profile.status === "revoked") {
    stopHeartbeat();
    showAuthRoot();
    renderRevoked();
  } else {
    stopHeartbeat();
    showAuthRoot();
    renderPending(profile);
  }
}

function init(){
  if (!isConfigured) { renderNotConfigured(); return; }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  if (window.emailjs && !EMAILJS_PUBLIC_KEY.startsWith("YOUR_")) window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  authMode = "login";
  renderAuthScreen();

  onAuthStateChanged(auth, user => {
    currentUser = user;
    authBusy = false;
    if (unsubProfile) { unsubProfile(); unsubProfile = null; }
    stopHeartbeat();

    if (!user) {
      window.TTE_currentUser = null;
      showAuthRoot();
      authMode = "login"; authError = "";
      renderAuthScreen();
      return;
    }

    unsubProfile = onSnapshot(doc(db, "users", user.uid), snap => {
      if (!snap.exists()) { showAuthRoot(); renderPending({ name: user.displayName || "" }); return; }
      currentProfile = snap.data();
      handleProfile(currentProfile);
    }, err => {
      console.error(err);
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
