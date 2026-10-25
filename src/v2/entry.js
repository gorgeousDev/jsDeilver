import { start } from "./runtime.js";
import { getConfig } from "./config.js";
import "./features/index.js";

function boot() {
  start(getConfig());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
