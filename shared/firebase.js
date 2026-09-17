/* Firebase app init — single source of truth, imported by auth-gate.js,
 * app.js's cloud sync bridge, and admin/admin.js. */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider, OAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

export const isFirebaseConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");

// Inside the Capacitor Android app, window.Capacitor is injected by the
// native bridge itself (no import needed to detect it). The default web
// persistence doesn't reliably survive app restarts in that WebView, so
// native builds need initializeAuth + indexedDBLocalPersistence instead of
// plain getAuth — see shared/README notes in auth-gate.js's native sign-in
// path for why this pairs with the native Google Sign-In bridge.
const isNativeApp = typeof window !== "undefined" && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

const app = isFirebaseConfigured
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null;

export const auth = app
  ? (isNativeApp ? initializeAuth(app, { persistence: indexedDBLocalPersistence }) : getAuth(app))
  : null;
export const db = app ? getDatabase(app) : null;

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
