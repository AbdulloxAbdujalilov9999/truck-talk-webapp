/* One command to check the whole project:   node scripts/audit.mjs
 *  1. every JSON file parses (incl. database.rules.json, which allows // comments)
 *  2. every JavaScript file parses (ES modules and classic scripts)
 *  3. every local <script src>, <link href>, import, icon and manifest path points at a file that exists
 *  4. every interface string used in either course has an Uzbek and a Russian translation
 *  5. Russian lesson content is complete and index-aligned (Truck Talk), SpeakUp's Russian is built and aligned
 *  6. generated files (speakup/curriculum.js, speakup/shared/content-ru.js, the day map) are up to date
 *  7. unit tests: phone login, SpeakUp progress migration, sync queue (100 simulated students)
 * Exits non-zero if anything fails. */
import fs from "node:fs";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const results = []; let failed = 0;
const ok = (name, detail = "") => results.push(`  ok    ${name}${detail ? " — " + detail : ""}`);
const bad = (name, lines) => { failed++; results.push(`  FAIL  ${name}`); (Array.isArray(lines) ? lines : [lines]).slice(0, 12).forEach((l) => results.push("          " + l)); };
const files = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean).filter((f) => !/^(android-app|ios-app|\.claude)\//.test(f));
const read = (f) => fs.readFileSync(f, "utf8");

// 1. JSON
{
  const problems = [];
  for (const f of files.filter((x) => x.endsWith(".json"))) {
    try { const t = read(f); JSON.parse(f === "database.rules.json" ? t.replace(/^\s*\/\/.*$/gm, "") : t); } catch (e) { problems.push(`${f}: ${e.message}`); }
  }
  problems.length ? bad("JSON files", problems) : ok("JSON files", `${files.filter((x) => x.endsWith(".json")).length} parsed`);
}
// 2. JS syntax
{
  const problems = []; const js = files.filter((x) => /\.m?js$/.test(x) && !x.startsWith("scripts/data/"));
  for (const f of js) {
    const src = read(f);
    if (/^(import|export)\s/m.test(src)) { const r = spawnSync(process.execPath, ["--input-type=module", "--check"], { input: src, encoding: "utf8" }); if (r.status) problems.push(`${f}: ${(r.stderr || "").split("\n").find((l) => /Error/.test(l)) || "syntax error"}`); }
    else { try { new Function(src); } catch (e) { problems.push(`${f}: ${e.message}`); } }
  }
  problems.length ? bad("JavaScript syntax", problems) : ok("JavaScript syntax", `${js.length} files`);
}
// 3. local references
{
  const problems = []; const exists = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
  const resolve = (from, ref) => {
    if (/^(https?:|data:|mailto:|tel:|#|javascript:|node:)/.test(ref)) return null;
    ref = ref.split("#")[0].split("?")[0]; if (!ref) return null;
    let p = ref.startsWith("/") ? path.join(root, ref) : path.join(path.dirname(path.join(root, from)), ref);
    if (ref.endsWith("/") || (fs.existsSync(p) && fs.statSync(p).isDirectory())) p = path.join(p, "index.html");
    return p;
  };
  for (const f of files.filter((x) => /\.(html|m?js|css|json)$/.test(x) && !x.startsWith("scripts/"))) {
    const src = read(f), refs = [];
    if (f.endsWith(".html")) { for (const m of src.matchAll(/(?:src|href)=["']([^"']+)["']/g)) refs.push(m[1]); for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) refs.push(m[1]); }
    if (/\.m?js$/.test(f)) for (const m of src.matchAll(/^\s*(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/gm)) refs.push(m[1]);
    if (f.endsWith(".css")) for (const m of src.matchAll(/url\(["']?([^)"']+)["']?\)/g)) refs.push(m[1]);
    if (f.endsWith("manifest.json")) { const j = JSON.parse(src); (j.icons || []).forEach((i) => refs.push(i.src)); (j.shortcuts || []).forEach((s) => (s.icons || []).forEach((i) => refs.push(i.src))); }
    for (const r of refs) { const p = resolve(f, r); if (p && !exists(p)) problems.push(`${f}: ${r}`); }
  }
  problems.length ? bad("Local file references", problems) : ok("Local file references", "every script, stylesheet, icon, import and manifest path exists");
}
// 4. interface translations
{
  const problems = [];
  const parseD = (p) => { const src = read(p), a = src.indexOf("const D = {"), b = src.indexOf("\n};", a); return new Function("return " + src.slice(a + 10, b + 2))(); };
  for (const [name, dict, srcs] of [["Truck Talk", "shared/i18n.js", ["trucktalk/app.js", "shared/auth-gate.js"]], ["SpeakUp", "speakup/shared/i18n.js", ["speakup/app.js", "speakup/shared/auth-gate.js"]]]) {
    const D = parseD(dict);
    for (const f of srcs) for (const re of [/\btr?\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g, /\bT\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g]) {
      let m; const src = read(f);
      while ((m = re.exec(src))) { const k = m[2].replace(/\\(["'`])/g, "$1").replace(/\\n/g, "\n"); if (k.includes("${")) continue; if (!D[k]) problems.push(`${name}: not in dictionary: ${k.slice(0, 70)}`); else if (!D[k].ru || !D[k].uz) problems.push(`${name}: missing ${!D[k].ru ? "Russian" : "Uzbek"}: ${k.slice(0, 70)}`); }
    }
  }
  problems.length ? bad("Interface translations (uz + ru)", [...new Set(problems)]) : ok("Interface translations (uz + ru)", "every string used in code is translated");
}
// 5. Russian content
{
  const problems = [];
  const win = {}; new Function("window", read("shared/content-ru.js"))(win); const C = win.TT_CONTENT.ru;
  const cur = new Function(read("trucktalk/curriculum.js") + ";return {C:CURRICULUM,O:typeof ORIENTATION!=='undefined'?ORIENTATION:[]}")();
  for (const d of [...cur.C, ...cur.O]) { const cd = C.days[d.d]; if (!cd) { problems.push(`Truck Talk day ${d.d}: no Russian`); continue; } for (const [n, a, b] of [["v", d.v, cd.v], ["x", d.v, cd.x], ["dl", d.dl, cd.dl], ["q", d.qz, cd.q]]) if ((a || []).length !== (b || []).length) problems.push(`Truck Talk day ${d.d} ${n}: ${(a || []).length} vs ${(b || []).length}`); }
  const GR = new Function(read("trucktalk/grammar.js") + ";return GRAMMAR")(); for (const u of GR) if (!(C.grammar || {})[u.id]) problems.push(`Truck Talk grammar ${u.id}: no Russian`);
  const sw = {}; new Function("window", read("speakup/shared/content-ru.js"))(sw); const S = sw.TT_CONTENT.ru;
  const su = new Function(read("speakup/curriculum.js") + ";return CURRICULUM")();
  for (const d of su) { const cd = S.days[d.d]; if (!cd) { problems.push(`SpeakUp day ${d.d}: no Russian`); continue; } for (const [n, a, b] of [["v", d.v, cd.v], ["x", d.v, cd.x], ["dl", d.dl, cd.dl], ["q", d.qz, cd.q]]) if ((a || []).length !== (b || []).length) problems.push(`SpeakUp day ${d.d} ${n}: ${(a || []).length} vs ${(b || []).length}`); if (!cd.t || !cd.sp) problems.push(`SpeakUp day ${d.d}: no title/prompt`); }
  const sg = new Function(read("speakup/grammar.js") + ";return GRAMMAR")(); for (const u of sg) { const g = S.grammar[u.id]; if (!g) problems.push(`SpeakUp grammar ${u.id}: no Russian`); else if (g.explain.length !== u.explain.length || g.ex.length !== u.examples.length || g.q.length !== u.quiz.length) problems.push(`SpeakUp grammar ${u.id}: lists misaligned`); }
  problems.length ? bad("Russian lesson content", problems) : ok("Russian lesson content", `Truck Talk ${cur.C.length + cur.O.length} days + ${GR.length} grammar units, SpeakUp ${su.length} days + ${sg.length} grammar units, all aligned`);
}
// 6. generated files up to date
{
  const gen = ["speakup/curriculum.js", "speakup/shared/progress-merge.js", "speakup/shared/content-ru.js"];
  const before = gen.map(read);
  const r1 = spawnSync(process.execPath, ["scripts/merge-speakup-curriculum.mjs"], { encoding: "utf8" });
  const r2 = spawnSync(process.execPath, ["scripts/build-speakup-content-ru.mjs"], { encoding: "utf8" });
  const stale = gen.filter((f, i) => read(f) !== before[i]);
  if (r1.status) bad("SpeakUp curriculum audit (nothing lost in the 90→60 merge)", (r1.stderr || r1.stdout).split("\n"));
  else if (r2.status) bad("SpeakUp Russian build", (r2.stderr || r2.stdout).split("\n"));
  else if (stale.length) bad("Generated files up to date", [`regenerated (they were out of date): ${stale.join(", ")} — review and commit them`]);
  else ok("Generated files up to date", "curriculum merge audit passed; Russian build passed");
}
// 7. unit tests
for (const t of ["scripts/phone-login.test.mjs", "scripts/speakup-progress-migration.test.mjs", "scripts/sync-queue.test.mjs"]) {
  const r = spawnSync(process.execPath, [t], { encoding: "utf8", timeout: 120000 });
  r.status === 0 ? ok(t.replace("scripts/", "").replace(".test.mjs", " tests")) : bad(t, (r.stderr || r.stdout || "failed").split("\n").filter((l) => !/Warning|Reparsing|eliminate|trace-warn/.test(l)));
}
console.log("Project audit:\n" + results.join("\n") + `\n\n${failed ? failed + " check(s) FAILED" : "all checks passed"}`);
process.exit(failed ? 1 : 0);
