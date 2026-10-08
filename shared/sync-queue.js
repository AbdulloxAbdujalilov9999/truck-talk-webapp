/* Reliable "save my progress to the cloud" queue — pure (no Firebase, no DOM), so both auth gates
 * share it and it can be tested in Node with 100 simulated students (scripts/sync-queue.test.mjs).
 *
 * What it guarantees for ONE student's progress:
 *  - Batching: many quick changes become a few writes. A write goes out `debounceMs` after the last
 *    change, but never later than `maxWaitMs` after the first unsaved change, so a student who keeps
 *    working still gets saved regularly. 100 students -> far fewer writes than one per tap.
 *  - Never two writes in flight: a change made while a write is running is sent right after it.
 *  - Nothing is lost on failure: if a write fails (no signal, server busy, permission blip) the data
 *    stays "dirty" and is retried with growing delays (2s, 5s, 15s, 30s, then every 60s).
 *  - flush(): send immediately — the gates call it when the tab is hidden/closed or the network comes
 *    back, so the last change before closing isn't left in the debounce timer.
 *  - No-op writes are skipped (same content as the last successful write).
 *
 * The value is read at SEND time (schedule() takes a function), so the newest progress always goes out,
 * never a stale copy captured earlier. */
export function createSyncQueue(options){
  const o = Object.assign({
    write: async () => {},          // async (value) => void; throws/rejects on failure
    debounceMs: 2500,
    maxWaitMs: 20000,
    retryMs: [2000, 5000, 15000, 30000, 60000],
    now: () => Date.now(),
    setTimer: (fn, ms) => setTimeout(fn, ms),
    clearTimer: (t) => clearTimeout(t),
    signature: null,                // optional (value) => string, to skip writing identical content
    onState: null,                  // optional (state) => void
  }, options);

  let getValue = null;
  let version = 0, sentVersion = 0;
  let inflight = null;              // the promise of the write that is running
  let timer = null;
  let firstDirtyAt = 0;
  let failures = 0;
  let lastSig = null, lastOk = 0, lastError = null;
  let stopped = false;

  function snapshotState(){
    return { pending: version !== sentVersion || !!inflight, inflight: !!inflight, failures, lastOk, lastError: lastError ? String((lastError && lastError.message) || lastError) : null };
  }
  function emit(){ if (o.onState){ try{ o.onState(snapshotState()); }catch(e){} } }
  function disarm(){ if (timer != null){ o.clearTimer(timer); timer = null; } }
  // `retry` timers keep their full back-off; only the normal "wait for quiet" timer is capped by maxWaitMs
  function arm(delay, retry){
    disarm();
    if (stopped) return;
    const wait = retry ? delay : Math.min(delay, Math.max(0, firstDirtyAt + o.maxWaitMs - o.now()));
    timer = o.setTimer(() => { timer = null; send(); }, wait);
  }

  async function runWrite(){
    const v = version;
    let value;
    try{ value = getValue(); }catch(e){ failures++; lastError = e; return; }
    const sig = o.signature ? o.signature(value) : null;
    if (sig !== null && sig === lastSig){ sentVersion = v; failures = 0; return; }   // identical to what's already saved
    try{
      await o.write(value);
      lastSig = sig; sentVersion = v; failures = 0; lastOk = o.now(); lastError = null;
    }catch(e){
      failures++; lastError = e;
    }
  }
  function retryDelay(){ return o.retryMs[Math.min(Math.max(failures - 1, 0), o.retryMs.length - 1)]; }

  function send(){
    if (stopped || inflight) return inflight || Promise.resolve();
    if (version === sentVersion || !getValue) return Promise.resolve();
    inflight = (async () => {
      const failedBefore = failures;
      await runWrite();
      inflight = null;
      if (version !== sentVersion){
        // either a change arrived while writing, or the write failed: schedule the next attempt
        if (failures > failedBefore) arm(retryDelay(), true);
        else { firstDirtyAt = o.now(); arm(o.debounceMs); }
      } else {
        firstDirtyAt = 0;
      }
      emit();
    })();
    emit();
    return inflight;
  }

  return {
    /** Something changed: `valueFn()` returns the progress to save (called when the write actually happens). */
    schedule(valueFn){
      if (stopped) return;
      getValue = valueFn; version++;
      if (!firstDirtyAt) firstDirtyAt = o.now();
      if (!inflight) { if (failures > 0) arm(retryDelay(), true); else arm(o.debounceMs); }
      emit();
    },
    /** Send now (tab hidden / closing / network back). Resolves when that attempt finishes. */
    flush(){
      disarm();
      if (!inflight && version !== sentVersion) { if (!firstDirtyAt) firstDirtyAt = o.now(); }
      return send();
    },
    /** True when something is waiting to be saved or being saved. */
    isPending(){ return version !== sentVersion || !!inflight; },
    state: snapshotState,
    /** Forget everything (sign-out / account switch). */
    stop(){ stopped = true; disarm(); getValue = null; },
  };
}
