import { registerFeature } from "./registry.js";
import { initSliderDrag } from "./slider-drag.js";
import { initVideoLazy } from "./video-lazy.js";

// Importing a feature does not start it. Registration makes it available to
// the runtime, which decides whether to initialize it from config/defaults.
registerFeature({
  id: "videoLazy",
  enabledByDefault: true,
  init: initVideoLazy
});

registerFeature({
  id: "sliderDrag",
  enabledByDefault: true,
  init: initSliderDrag
});
