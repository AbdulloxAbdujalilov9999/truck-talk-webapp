/* Builds the native (Capacitor) app's www/index.html from the Truck Talk
 * course page. On the website the course lives at /trucktalk/ and reaches the
 * shared files with "../" (shared/, icons/); the native app bundles everything
 * flat, so those become "./".
 * Usage: node ../scripts/make-native-index.js www/index.html   (run from android-app/ or ios-app/) */
const fs = require("fs");
const path = require("path");
const out = process.argv[2];
if (!out) { console.error("usage: make-native-index.js <output html>"); process.exit(1); }
const src = path.join(__dirname, "..", "trucktalk", "index.html");
fs.writeFileSync(out, fs.readFileSync(src, "utf8").replace(/(["'])\.\.\//g, "$1./"));
