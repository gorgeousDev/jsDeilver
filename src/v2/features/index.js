import { registerFeature } from "./registry.js";
import { initVideoLazy } from "./video-lazy.js";

registerFeature({
  id: "videoLazy",
  enabledByDefault: true,
  init: initVideoLazy
});
