import { start } from "./runtime.js";
import { getConfig } from "./config.js";
import "./features/index.js";

// The bundle is loaded with `defer`, so parsing is complete but Next.js may
// still be rendering. Features tolerate targets appearing afterward.
start(getConfig());
