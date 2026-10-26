import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const BADGE_SELECTOR = "span";
const WATCHING_TEXT = "يشاهد هذا المنتج";
const PARENT_PROPERTIES = ["margin-top", "margin-bottom", "background", "border", "border-radius", "padding", "color", "font-weight"];
const BADGE_PROPERTIES = ["background", "color", "padding", "border-radius", "font-weight"];

export function initProductViewerBadge({ dom, navigation, window }) {
  const changedStyles = new Map();
  let stopBadges = null;
  let activePath = "";

  function saveStyle(element, properties) {
    if (!changedStyles.has(element)) {
      changedStyles.set(element, captureInlineProperties(element, properties));
    }
  }

  function styleBadge(badge) {
    if (!window.location.pathname.startsWith("/products/") ||
        !/^\d+$/.test(badge.textContent.trim())) return;
    const parent = badge.parentElement;
    if (!parent || !parent.textContent.includes(WATCHING_TEXT)) return;

    saveStyle(parent, PARENT_PROPERTIES);
    saveStyle(badge, BADGE_PROPERTIES);
    parent.style.setProperty("margin-top", "18px");
    parent.style.setProperty("margin-bottom", "20px");
    parent.style.setProperty("background", "#44174E");
    parent.style.setProperty("border", "1px solid #662249");
    parent.style.setProperty("border-radius", "12px");
    parent.style.setProperty("padding", "12px 16px");
    parent.style.setProperty("color", "#ffffff");
    parent.style.setProperty("font-weight", "700");
    badge.style.setProperty("background", "#A34054");
    badge.style.setProperty("color", "#ffffff");
    badge.style.setProperty("padding", "3px 10px");
    badge.style.setProperty("border-radius", "999px");
    badge.style.setProperty("font-weight", "800");
  }

  function restore() {
    for (const [element, style] of changedStyles) {
      restoreInlineProperties(element, style);
    }
    changedStyles.clear();
  }

  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!pathname.startsWith("/products/")) {
      stopBadges?.();
      stopBadges = null;
      activePath = "";
      restore();
      return;
    }
    if (activePath !== pathname) {
      restore();
      activePath = pathname;
    }
    if (!stopBadges) stopBadges = dom.subscribe(BADGE_SELECTOR, styleBadge);
  });

  return () => {
    stopBadges?.();
    stopNavigation();
    restore();
  };
}
