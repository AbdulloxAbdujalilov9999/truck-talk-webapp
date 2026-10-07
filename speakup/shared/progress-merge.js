/* Merges two copies of a student's progress (e.g. this device's and the
 * cloud's) into one, so a device that's behind never overwrites one that's
 * ahead. Pure and order-independent: merge(a, b) and merge(b, a) agree on
 * everything except `name`, where `a` (the local copy) wins.
 *
 * Records carry an `at` timestamp (ms). Deleting a record (a teacher's
 * reset) leaves a tombstone in `removed`, and erasing everything sets
 * `epoch` — a record only survives if it is newer than whichever of those
 * applies to it, which is what stops a stale device from resurrecting
 * something that was reset elsewhere.
 */
(function (root) {
  const COLLS = ["completed", "grammarDone", "homeworkDone", "roleplay"];

  // Realtime Database hands back an Array (with null holes) for any object
  // whose keys look like 0..n — "completed" keyed by day number does.
  function asObj(v) {
    if (!v || typeof v !== "object") return {};
    if (!Array.isArray(v)) return v;
    const o = {};
    v.forEach((x, i) => { if (x != null) o[i] = x; });
    return o;
  }

  function normalize(p) {
    p = p || {};
    const n = Object.assign({}, p);
    COLLS.forEach((c) => { n[c] = asObj(p[c]); });
    n.appliedResets = asObj(p.appliedResets);
    n.appliedPasses = asObj(p.appliedPasses);
    const r = asObj(p.removed);
    n.removed = {};
    COLLS.forEach((c) => { n.removed[c] = asObj(r[c]); });
    n.epoch = Number(p.epoch) || 0;
    n.xp = Number(p.xp) || 0;
    n.streak = Number(p.streak) || 0;
    delete n.updatedAt;
    return n;
  }

  function pickEntry(coll, ea, eb) {
    if (!ea) return eb;
    if (!eb) return ea;
    if (coll === "roleplay") {
      const hi = (eb.best || 0) > (ea.best || 0) ? eb : ea;
      return Object.assign({}, hi, { best: Math.max(ea.best || 0, eb.best || 0), at: Math.max(ea.at || 0, eb.at || 0) });
    }
    const ta = ea.at || 0, tb = eb.at || 0;
    if (ta !== tb) return ta > tb ? ea : eb;
    return (eb.score || 0) > (ea.score || 0) ? eb : ea;
  }

  function derivedXp(m) {
    let xp = 0;
    Object.values(m.completed).forEach((e) => { xp += 100 + (e.score || 0) * 5; });
    Object.values(m.grammarDone).forEach((e) => { xp += 60 + (e.score || 0) * 3; });
    Object.values(m.homeworkDone).forEach((e) => { xp += 80 + (e.score || 0) * 3; });
    xp += Object.keys(m.roleplay).length * 30;
    return xp;
  }

  function sameKeys(side, m) {
    return COLLS.every((c) => {
      const a = Object.keys(side[c]).sort().join(",");
      const b = Object.keys(m[c]).sort().join(",");
      return a === b;
    });
  }

  function merge(localRaw, remoteRaw) {
    const A = normalize(localRaw), B = normalize(remoteRaw);
    const m = Object.assign({}, B, A);

    m.epoch = Math.max(A.epoch, B.epoch);
    m.removed = {};
    COLLS.forEach((c) => {
      const out = {};
      new Set(Object.keys(A.removed[c]).concat(Object.keys(B.removed[c]))).forEach((k) => {
        out[k] = Math.max(A.removed[c][k] || 0, B.removed[c][k] || 0);
      });
      m.removed[c] = out;
    });

    COLLS.forEach((c) => {
      const out = {};
      new Set(Object.keys(A[c]).concat(Object.keys(B[c]))).forEach((k) => {
        const e = pickEntry(c, A[c][k], B[c][k]);
        const cut = Math.max(m.removed[c][k] || 0, m.epoch);
        if (cut > 0 && (e.at || 0) <= cut) return;
        out[k] = e;
      });
      m[c] = out;
    });

    m.appliedResets = Object.assign({}, B.appliedResets, A.appliedResets);
    m.appliedPasses = Object.assign({}, B.appliedPasses, A.appliedPasses);
    m.name = A.name || B.name || "";

    const la = A.lastDate || "", lb = B.lastDate || "";
    if (la > lb) { m.lastDate = A.lastDate; m.streak = A.streak; }
    else if (lb > la) { m.lastDate = B.lastDate; m.streak = B.streak; }
    else { m.lastDate = A.lastDate || B.lastDate || null; m.streak = Math.max(A.streak, B.streak); }

    const aSame = sameKeys(A, m), bSame = sameKeys(B, m);
    m.xp = aSame && bSame ? Math.max(A.xp, B.xp) : aSame ? A.xp : bSame ? B.xp : derivedXp(m);

    delete m.updatedAt;
    return m;
  }

  function canon(v) {
    if (Array.isArray(v)) return v.map(canon);
    if (v && typeof v === "object") {
      const o = {};
      Object.keys(v).sort().forEach((k) => { o[k] = canon(v[k]); });
      return o;
    }
    return v;
  }
  // Stable string for "are these two copies the same?" — ignores updatedAt
  // and the array-vs-object quirk of Realtime Database.
  function signature(p) { return JSON.stringify(canon(normalize(p))); }

  const api = { merge, signature, normalize };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SU_progressMerge = api;
})(typeof window !== "undefined" ? window : globalThis);
