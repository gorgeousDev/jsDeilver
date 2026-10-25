import { start } from "./runtime.js";
import { getConfig } from "./config.js";
import "./features/index.js";

const loadStartedAt = performance.now();
const entryScriptUrl = document.currentScript && document.currentScript.src;

function boot() {
  start(getConfig());

  const entries = entryScriptUrl
    ? performance.getEntriesByName(entryScriptUrl)
    : [];
  const resourceEntry = entries.length ? entries[entries.length - 1] : null;
  const downloadMs = resourceEntry && resourceEntry.responseEnd >= resourceEntry.startTime
    ? Number((resourceEntry.responseEnd - resourceEntry.startTime).toFixed(2))
    : null;
  const initMs = Number((performance.now() - loadStartedAt).toFixed(2));

  console.log("Akkad v2 loaded", { downloadMs, initMs });
}

boot();
