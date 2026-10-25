import { registerFeature } from "./registry.js";
import { initDarkMode } from "./dark-mode.js";
import { initCheckoutRestyle } from "./checkout-restyle.js";
import { initPromo } from "./promo.js";
import { initSliderDrag } from "./slider-drag.js";
import { initVideoLazy } from "./video-lazy.js";

// Importing a feature does not start it. Registration makes it available to
// the runtime, which decides whether to initialize it from config/defaults.
registerFeature({
  id: "darkMode",
  enabledByDefault: true,
  init: initDarkMode
});

registerFeature({
  id: "checkoutRestyle",
  enabledByDefault: true,
  init: initCheckoutRestyle
});

registerFeature({
  id: "promo",
  enabledByDefault: true,
  init: initPromo
});

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
