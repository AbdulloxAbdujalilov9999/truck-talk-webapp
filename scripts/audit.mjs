/* One command to check the whole project:   node scripts/audit.mjs
 *  1. every JSON file parses (incl. database.rules.json, which allows // comments)
 *  2. every JavaScript file parses (ES modules and classic scripts)
 *  3. every local <script src>, <link href>, import, icon and manifest path points at a file that exists
 *  4. every interface string used in the course has an Uzbek and a Russian translation
 *  5. Russian and Uzbek lesson content is complete and index-aligned
 *  6. generated files (the natural-voice phrase lists) are up to date
 *  7. unit tests: phone login, sync queue (100 simulated students), tts / tutor / agent functions
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
// 2b. a function whose very first statement calls itself never returns (this took both admin dashboards down once:
// a bulk edit turned the first line of contactOf() into `contactOf(u)`, so every user row threw "too much recursion")
{
  const problems = [];
  for (const f of files.filter((x) => /\.m?js$/.test(x) && !x.startsWith("scripts/") && !x.startsWith("ios-app/"))) {
    const src = read(f);
    const re = /function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*(?:(?:const|let|var)\s+[\w$]+\s*=\s*)?\1\s*\(/g;
    for (let m; (m = re.exec(src)); ) problems.push(`${f}: ${m[1]}() calls itself as its first statement`);
  }
  problems.length ? bad("Accidental self-recursion", problems) : ok("Accidental self-recursion", "no function begins by calling itself");
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
// 3b. service-worker pre-cache lists (one missing file makes the browser cache NOTHING, silently)
{
  const problems = [];
  for (const [sw, base, pages] of [["sw.js", ".", ["index.html", "trucktalk/index.html"]]]) {
    const m = read(sw).match(/CORE_ASSETS = \[([\s\S]*?)\];/);
    if (!m) { problems.push(`${sw}: no CORE_ASSETS list`); continue; }
    const list = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    for (const p of list) { let f = path.join(base, p); if (p.endsWith("/")) f = path.join(f, "index.html"); if (!fs.existsSync(f)) problems.push(`${sw}: pre-cache entry does not exist: ${p}`); }
    const cached = new Set(list.map((p) => path.normalize(path.join(base, p))));
    // every shared module the course's sign-in code imports should be pre-cached, so a first visit that goes offline still works
    const gate = "shared/auth-gate.js";
    for (const m2 of read(gate).matchAll(/^import[^;]*?from\s+"(\.[^"]+)"/gm)) { const f = path.normalize(path.join(path.dirname(gate), m2[1])); if (!cached.has(f)) problems.push(`${sw}: ${f} is imported by ${gate} but not pre-cached`); }
  }
  problems.length ? bad("Service-worker pre-cache lists", problems) : ok("Service-worker pre-cache lists", "every entry exists and covers the sign-in modules");
}
// 4. interface translations
{
  const problems = [];
  const parseD = (p) => { const src = read(p), a = src.indexOf("const D = {"), b = src.indexOf("\n};", a); return new Function("return " + src.slice(a + 10, b + 2))(); };
  for (const [name, dict, srcs] of [["Truck Talk", "shared/i18n.js", ["trucktalk/app.js", "shared/auth-gate.js", "shared/tutor-ui.js", "shared/teach-ui.js"]]]) {
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
  const tu = {}; new Function("window", read("shared/content-uz.js"))(tu); const TU = tu.TT_CONTENT.uz;
  for (const d of [...cur.C, ...cur.O]) { const cd = TU.days[d.d]; if (!cd) { problems.push(`Truck Talk day ${d.d}: no Uzbek`); continue; } if (cd.x && cd.x.length !== d.v.length) problems.push(`Truck Talk day ${d.d} Uzbek x ${cd.x.length} vs ${d.v.length}`); if (cd.q && cd.q.length !== d.qz.length) problems.push(`Truck Talk day ${d.d} Uzbek q ${cd.q.length} vs ${d.qz.length}`); if (d.v && !cd.x) problems.push(`Truck Talk day ${d.d}: no Uzbek example sentences`); }
  for (const u of GR) { const g = TU.grammar[u.id]; if (!g) problems.push(`Truck Talk grammar ${u.id}: no Uzbek`); else if (g.explain.length !== u.explain.length || g.q.length !== u.quiz.length || !g.why) problems.push(`Truck Talk grammar ${u.id}: Uzbek misaligned`); }
  problems.length ? bad("Russian + Uzbek lesson content", problems) : ok("Russian + Uzbek lesson content", `Truck Talk ${cur.C.length + cur.O.length} days + ${GR.length} grammar units (Russian and Uzbek), all aligned`);
}
// 6. generated files up to date
{
  const gen = ["api/_phrases.json", "api/_phrases_uz.json"];
  const before = gen.map(read);
  const r = spawnSync(process.execPath, ["scripts/build-voice-phrases.mjs"], { encoding: "utf8" });
  const stale = gen.filter((f, i) => read(f) !== before[i]);
  if (r.status) bad("Natural-voice phrase build", (r.stderr || r.stdout).split("\n"));
  else if (stale.length) bad("Generated files up to date", [`regenerated (they were out of date): ${stale.join(", ")} — review and commit them`]);
  else ok("Generated files up to date", "natural-voice phrase build passed");
}
// 7. unit tests
for (const t of ["scripts/phone-login.test.mjs", "scripts/progress-merge.test.mjs", "scripts/sync-queue.test.mjs", "scripts/tts-api.test.mjs", "scripts/tutor-api.test.mjs", "scripts/agent-api.test.mjs"]) {
  const r = spawnSync(process.execPath, [t], { encoding: "utf8", timeout: 120000 });
  r.status === 0 ? ok(t.replace("scripts/", "").replace(".test.mjs", " tests")) : bad(t, (r.stderr || r.stdout || "failed").split("\n").filter((l) => !/Warning|Reparsing|eliminate|trace-warn/.test(l)));
}
console.log("Project audit:\n" + results.join("\n") + `\n\n${failed ? failed + " check(s) FAILED" : "all checks passed"}`);
process.exit(failed ? 1 : 0);
