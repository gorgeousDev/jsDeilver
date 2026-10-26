import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createDelegatedEvents } from "../core/delegated-events.js";
import { createDomObserver } from "../core/dom-observer.js";
import { createNavigation } from "../core/navigation.js";
import { createStyleManager } from "../core/style-manager.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FEATURE_DIR = path.join(ROOT, "features");

const legacyFeatureModules = {
  "akkad-product-gallery": "product-gallery.js",
  "akkad-image-alt": "image-alt.js",
  "akkad-gallery-controls": "product-gallery-controls.js",
  "akkad-copy-link": "product-copy-link.js",
  "akkad-category-navigation": "category-navigation.js",
  "v2-google-site-verification": "google-site-verification.js",
  "v2-whatsapp-widget": "whatsapp-widget.js",
  "v2-store-style-overrides": "store-style-overrides.js",
  "v2-mobile-product-grid": "mobile-product-grid.js",
  "v2-sale-tags": "sale-tags.js",
  "v2-featured-banner-frame": "featured-banner-frame.js",
  "v2-floating-live-counter": "floating-live-counter.js",
  "v2-viewer-badge": "product-viewer-badge.js",
  "v2-product-details-position": "product-details-position.js",
  "v2-image-preview-lightbox": "image-preview-lightbox.js",
  "v2-hide-okka-heading": "hide-okka-heading.js",
  "v2-disable-cart-image-links": "disable-cart-image-links.js",
  "v2-payment-method-order": "payment-method-order.js",
  "v2-funnel-price-overrides": "funnel-price-overrides.js",
  "v2-office-supplies-sections": "office-supplies-sections.js",
  "v2-graduation-gift-slider": "graduation-gift-slider.js"
};

const featureIds = {
  "akkad-product-gallery": "productGallery",
  "akkad-image-alt": "imageAlt",
  "akkad-gallery-controls": "productGalleryControls",
  "akkad-copy-link": "productCopyLink",
  "akkad-category-navigation": "categoryNavigation",
  "v2-google-site-verification": "googleSiteVerification",
  "v2-whatsapp-widget": "whatsappWidget",
  "v2-store-style-overrides": "storeStyleOverrides",
  "v2-mobile-product-grid": "mobileProductGrid",
  "v2-sale-tags": "saleTags",
  "v2-featured-banner-frame": "featuredBannerFrame",
  "v2-floating-live-counter": "floatingLiveCounter",
  "v2-viewer-badge": "productViewerBadge",
  "v2-product-details-position": "productDetailsPosition",
  "v2-image-preview-lightbox": "imagePreviewLightbox",
  "v2-hide-okka-heading": "hideOkkaHeading",
  "v2-disable-cart-image-links": "disableCartImageLinks",
  "v2-payment-method-order": "paymentMethodOrder",
  "v2-funnel-price-overrides": "funnelPriceOverrides",
  "v2-office-supplies-sections": "officeSuppliesSections",
  "v2-graduation-gift-slider": "graduationGiftSlider"
};

const manifest = JSON.parse(readFileSync(path.join(ROOT, "../modules/features/manifest.json"), "utf8"));
const expectedLegacyFeatures = [...new Set(Object.values(manifest).flat())]
  .filter((name) => name !== "akkad-stylesheets");
const indexSource = readFileSync(path.join(FEATURE_DIR, "index.js"), "utf8");

for (const legacyName of expectedLegacyFeatures) {
  const moduleName = legacyFeatureModules[legacyName];
  assert(moduleName, `Missing v2 mapping for legacy feature "${legacyName}".`);
  assert(existsSync(path.join(FEATURE_DIR, moduleName)), `Missing feature module ${moduleName}.`);
  assert(
    indexSource.includes(`"${featureIds[legacyName]}"`),
    `Legacy feature "${legacyName}" is not registered in the v2 feature index.`
  );
}

const bundle = await readFile(path.join(ROOT, "dist", "akkad-v2.min.js"), "utf8");
new vm.Script(bundle, { filename: "dist/akkad-v2.min.js" });
assert(!bundle.includes("Akkad v2 loaded"), "Temporary startup diagnostics should not ship.");
for (const featureId of Object.values(featureIds)) {
  assert(bundle.includes(featureId), `Built bundle does not include ${featureId}.`);
}

function makeEventTarget() {
  const handlers = new Map();
  return {
    addEventListener(type, callback) {
      if (!handlers.has(type)) handlers.set(type, new Set());
      handlers.get(type).add(callback);
    },
    removeEventListener(type, callback) {
      handlers.get(type)?.delete(callback);
    },
    dispatch(type, event = {}) {
      for (const callback of handlers.get(type) || []) callback(event);
    },
    handlers
  };
}

function testNavigation() {
  const target = makeEventTarget();
  const location = { pathname: "/", search: "", hash: "" };
  const history = {
    state: null,
    pushState(state, _title, url) {
      this.state = state;
      const next = new URL(url, "https://store.test");
      Object.assign(location, { pathname: next.pathname, search: next.search, hash: next.hash });
    },
    replaceState(state, _title, url) {
      this.state = state;
      const next = new URL(url, "https://store.test");
      Object.assign(location, { pathname: next.pathname, search: next.search, hash: next.hash });
    }
  };
  const originalPush = history.pushState;
  const navigation = createNavigation({ ...target, history, location });
  const seen = [];
  const unsubscribe = navigation.subscribe((route) => seen.push(route.pathname));
  history.pushState({}, "", "/products/sample");
  history.pushState({}, "", "/products/sample");
  assert.deepEqual(seen, ["/", "/products/sample"]);
  unsubscribe();
  navigation.destroy();
  assert.equal(history.pushState, originalPush);
}

function testDomObserver() {
  class FakeNode {
    constructor(selector = "") {
      this.nodeType = 1;
      this.selector = selector;
      this.children = [];
    }
    matches(selector) {
      return this.selector === selector;
    }
    querySelectorAll(selector) {
      return this.children.flatMap((child) => [
        ...(child.matches(selector) ? [child] : []),
        ...child.querySelectorAll(selector)
      ]);
    }
  }

  let observerInstance;
  class FakeMutationObserver {
    constructor(callback) {
      this.callback = callback;
      observerInstance = this;
    }
    observe(target, options) {
      this.target = target;
      this.options = options;
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  const existing = new FakeNode(".item");
  const body = new FakeNode("body");
  body.children.push(existing);
  const document = { body, documentElement: body };
  const dom = createDomObserver(document, { MutationObserver: FakeMutationObserver });
  const notified = [];
  const unsubscribe = dom.subscribe(".item", (element) => notified.push(element));
  const inserted = new FakeNode(".item");
  observerInstance.callback([{ addedNodes: [inserted] }]);
  assert.deepEqual(notified, [existing, inserted]);
  unsubscribe();
  assert.equal(observerInstance.disconnected, true);
  dom.destroy();
}

function testDelegatedEvents() {
  const document = makeEventTarget();
  const events = createDelegatedEvents(document);
  let called = 0;
  const unsubscribe = events.on("click", ".target", () => called++);
  const target = { closest: (selector) => selector === ".target" ? target : null };
  document.dispatch("click", { target });
  assert.equal(called, 1);
  unsubscribe();
  document.dispatch("click", { target });
  assert.equal(called, 1);
  events.destroy();
}

function testStyleManager() {
  const styles = new Map();
  const document = {
    getElementById: (id) => styles.get(id) || null,
    createElement: () => ({
      remove() {
        styles.delete(this.id);
      }
    }),
    head: {
      appendChild(style) {
        styles.set(style.id, style);
      }
    }
  };
  const manager = createStyleManager(document);
  const remove = manager.add("style-test", "body{}");
  assert.equal(styles.get("style-test").textContent, "body{}");
  remove();
  assert.equal(styles.has("style-test"), false);
  manager.destroy();
}

testNavigation();
testDomObserver();
testDelegatedEvents();
testStyleManager();
console.log(`OK  ${expectedLegacyFeatures.length} legacy feature modules are registered; bundle and shared runtime services pass checks.`);
