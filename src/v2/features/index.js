import { registerFeature } from "./registry.js";
import { initDarkMode } from "./dark-mode.js";
import { initCheckoutRestyle } from "./checkout-restyle.js";
import { initSliderDrag } from "./slider-drag.js";
import { initVideoLazy } from "./video-lazy.js";
import { initImageAlt } from "./image-alt.js";
import { initCategoryNavigation } from "./category-navigation.js";
import { initProductCopyLink } from "./product-copy-link.js";
import { initProductGalleryControls } from "./product-gallery-controls.js";
import { initProductViewerBadge } from "./product-viewer-badge.js";
import { initProductDetailsPosition } from "./product-details-position.js";
import { initHideOkkaHeading } from "./hide-okka-heading.js";
import { initDisableCartImageLinks } from "./disable-cart-image-links.js";
import { initPaymentMethodOrder } from "./payment-method-order.js";
import { initSaleTags } from "./sale-tags.js";
import { initMobileProductGrid } from "./mobile-product-grid.js";
import { initFeaturedBannerFrame } from "./featured-banner-frame.js";
import { initGoogleSiteVerification } from "./google-site-verification.js";
import { initWhatsAppWidget } from "./whatsapp-widget.js";
import { initFloatingLiveCounter } from "./floating-live-counter.js";
import { initFunnelPriceOverrides } from "./funnel-price-overrides.js";
import { initProductGallery } from "./product-gallery.js";
import { initImagePreviewLightbox } from "./image-preview-lightbox.js";
import { initOfficeSuppliesSections } from "./office-supplies-sections.js";
import { initGraduationGiftSlider } from "./graduation-gift-slider.js";
import { initStoreStyleOverrides } from "./store-style-overrides.js";

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
  id: "videoLazy",
  enabledByDefault: true,
  init: initVideoLazy
});

registerFeature({
  id: "sliderDrag",
  enabledByDefault: true,
  init: initSliderDrag
});

const migratedFeatures = [
  ["imageAlt", initImageAlt],
  ["categoryNavigation", initCategoryNavigation],
  ["productCopyLink", initProductCopyLink],
  ["productGalleryControls", initProductGalleryControls],
  ["productViewerBadge", initProductViewerBadge],
  ["productDetailsPosition", initProductDetailsPosition],
  ["hideOkkaHeading", initHideOkkaHeading],
  ["disableCartImageLinks", initDisableCartImageLinks],
  ["paymentMethodOrder", initPaymentMethodOrder],
  ["saleTags", initSaleTags],
  ["mobileProductGrid", initMobileProductGrid],
  ["featuredBannerFrame", initFeaturedBannerFrame],
  ["googleSiteVerification", initGoogleSiteVerification],
  ["whatsappWidget", initWhatsAppWidget],
  ["floatingLiveCounter", initFloatingLiveCounter],
  ["funnelPriceOverrides", initFunnelPriceOverrides],
  ["productGallery", initProductGallery],
  ["imagePreviewLightbox", initImagePreviewLightbox],
  ["officeSuppliesSections", initOfficeSuppliesSections],
  ["graduationGiftSlider", initGraduationGiftSlider],
  ["storeStyleOverrides", initStoreStyleOverrides]
];

for (const [id, init] of migratedFeatures) {
  registerFeature({ id, enabledByDefault: true, init });
}
