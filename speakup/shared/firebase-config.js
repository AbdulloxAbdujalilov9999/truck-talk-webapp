/* SpeakUp now lives inside the Truck Talk site and shares its Firebase
 * project (one sign-in, one user list for both courses), so the config is
 * the site-wide one in /shared/firebase-config.js — not a copy of it.
 * SpeakUp's own data sits under the "speakup/" namespace in the database
 * (see /database.rules.json). */
export { firebaseConfig, OWNER_EMAIL } from "../../shared/firebase-config.js";
