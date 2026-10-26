import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const BUTTONS_SELECTOR = ".product_gallery_btns_container";
const PRODUCT_ROUTE = /^\/products\//;
const CONTROL_PROPERTIES = [
  "top", "left", "right", "bottom", "display", "flex-direction",
  "align-items", "gap", "z-index"
];

export function initProductGalleryControls({ document, dom, navigation, window }) {
  const originals = new WeakMap();
  let active = false;
  let stopButtons = null;

  function update(buttons) {
    if (!PRODUCT_ROUTE.test(window.location.pathname)) return;
    if (!originals.has(buttons)) {
      originals.set(buttons, captureInlineProperties(buttons, CONTROL_PROPERTIES));
    }
    if (window.innerWidth <= 1024) {
      Object.assign(buttons.style, {
        top: "12px",
        left: "12px",
        right: "auto",
        bottom: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        zIndex: "1"
      });
    } else {
      restoreInlineProperties(buttons, originals.get(buttons));
    }
  }

  function onResize() {
    if (!active) return;
    document.querySelectorAll(BUTTONS_SELECTOR).forEach(update);
  }

  function syncRoute() {
    const nextActive = PRODUCT_ROUTE.test(window.location.pathname);
    if (nextActive) {
      active = true;
      document.querySelectorAll(BUTTONS_SELECTOR).forEach(update);
      return;
    }
    active = false;
    document.querySelectorAll(BUTTONS_SELECTOR).forEach((element) => {
      if (!originals.has(element)) return;
      restoreInlineProperties(element, originals.get(element));
      originals.delete(element);
    });
  }

  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (PRODUCT_ROUTE.test(pathname)) {
      syncRoute();
      if (!stopButtons) stopButtons = dom.subscribe(BUTTONS_SELECTOR, update);
      return;
    }
    stopButtons?.();
    stopButtons = null;
    syncRoute();
  });
  window.addEventListener("resize", onResize, { passive: true });

  return () => {
    stopButtons?.();
    stopNavigation();
    window.removeEventListener("resize", onResize);
    active = false;
    document.querySelectorAll(BUTTONS_SELECTOR).forEach((element) => {
      if (!originals.has(element)) return;
      restoreInlineProperties(element, originals.get(element));
    });
  };
}
