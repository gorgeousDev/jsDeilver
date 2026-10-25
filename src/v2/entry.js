import { start } from "./runtime.js";
import { getConfig } from "./config.js";
import "./features/index.js";

// Capture this while the bundled entry script is executing; currentScript is
// not reliable later, after asynchronous work or other scripts have run.
const loadStartedAt = performance.now();
const entryScriptUrl = document.currentScript && document.currentScript.src;

function boot() {
  // The bundle is loaded with `defer`, so parsing is complete but Next.js may
  // still be rendering. Features must tolerate targets appearing afterward.
  start(getConfig());

  // Resource Timing measures the request, not JavaScript execution. Cross-
  // origin timing policy may hide these values, so report null when unavailable.
  const entries = entryScriptUrl
    ? performance.getEntriesByName(entryScriptUrl)
    : [];
  const resourceEntry = entries.length ? entries[entries.length - 1] : null;
  const downloadMs = resourceEntry && resourceEntry.responseEnd >= resourceEntry.startTime
    ? Number((resourceEntry.responseEnd - resourceEntry.startTime).toFixed(2))
    : null;
  const initMs = Number((performance.now() - loadStartedAt).toFixed(2));

  // Temporary testing diagnostic; remove after migration testing is complete.
  console.log("Akkad v2 loaded", { downloadMs, initMs });
}

boot();
