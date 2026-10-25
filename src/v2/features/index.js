import { registerFeature } from "./registry.js";
import { initSliderDrag } from "./slider-drag.js";
import { initVideoLazy } from "./video-lazy.js";

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
