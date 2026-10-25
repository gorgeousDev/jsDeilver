import { start } from "./runtime.js";
import { getConfig } from "./config.js";
import "./features/index.js";

function boot() {
  start(getConfig());
  console.log("Akkad v2 entry loaded");
}

boot();
