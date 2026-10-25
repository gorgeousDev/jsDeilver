import darkModeCss from "../styles/dark-mode.css";
import designTokensCss from "../styles/tokens.css";
import {
  closestPaintedBackground,
  contrastRatio,
  hasOwnText,
  isNeutralColor,
  luminance,
  parseRgb
} from "../core/accessibility/contrast.js";

const STORAGE_KEY = "akkad_theme";
const ROOT_CLASS = "akkad-dark";
const FADE_CLASS = "akkad-theme-fading";
const STYLE_ID = "akkad-v2-dark-css";
const BUTTON_ID = "akkad-theme-toggle";
const INK_ATTRIBUTE = "data-akkad-ink";
const MIN_CONTRAST = 3.2;
const DARK_BACKGROUND_LUMINANCE = 0.2;
const LABEL_TO_LIGHT = "التبديل إلى الوضع الفاتح";
const LABEL_TO_DARK = "التبديل إلى الوضع الليلي";
const SUN_PATH = "M12 2.7v2.3M12 19v2.3M2.7 12h2.3M19 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6";

const ICON_PATHS = {
  moon: "M20.4 14.5A8.6 8.6 0 0 1 9.5 3.6a8.6 8.6 0 1 0 10.9 10.9Z"
};

const PALETTE = Object.freeze({
  page: "#1B1931",
  secondaryText: "#CAA4A5",
  primaryText: "#E9BCB9"
});

function readPreference(window) {
  try {
    const preference = window.localStorage.getItem(STORAGE_KEY);
    return preference === "dark" || preference === "light" ? preference : null;
  } catch {
    return null;
  }
}

function savePreference(window, mode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Private browsing can disable storage; the current page still changes mode.
  }
}

function systemPrefersDark(window) {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function getMode(window) {
  return readPreference(window) || (systemPrefersDark(window) ? "dark" : "light");
}

function createIcon(document, mode) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (mode === "dark") {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "4.1");
    svg.appendChild(circle);
    path.setAttribute("d", SUN_PATH);
  } else {
    path.setAttribute("d", ICON_PATHS.moon);
  }
  svg.appendChild(path);
  return svg;
}

export function initDarkMode({ document, dom, events, styles, window }) {
  const root = document.documentElement;
  const originalThemeColor = document.querySelector('meta[name="theme-color"]');
  const originalThemeColorContent = originalThemeColor && originalThemeColor.content;
  const originallyDark = root.classList.contains(ROOT_CLASS);
  const originalThemeAttribute = root.getAttribute("data-akkad-theme");
  let button = document.getElementById(BUTTON_ID);
  let ownsButton = false;
  let mountReady = false;
  let inkTimer = 0;
  let fadeTimer = 0;
  let mountTimer = 0;
  let pendingInkRoots = new Set();
  let fullInkSweepPending = false;
  let destroyed = false;

  function syncThemeColor(mode) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      (document.head || root).appendChild(meta);
    }
    meta.content = mode === "dark" ? PALETTE.page : "#ffffff";
  }

  function syncButton(mode) {
    if (!button || !button.isConnected) return;
    const label = mode === "dark" ? LABEL_TO_LIGHT : LABEL_TO_DARK;
    button.replaceChildren(createIcon(document, mode));
    button.setAttribute("aria-label", label);
    button.title = label;
    button.setAttribute("aria-pressed", String(mode === "dark"));
  }

  function applyMode(animate) {
    const mode = getMode(window);
    let prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // If the browser has no media-query support, keep the transition enabled.
    }

    window.clearTimeout(fadeTimer);
    if (animate && !prefersReducedMotion) {
      root.classList.add(FADE_CLASS);
      void root.offsetWidth;
      fadeTimer = window.setTimeout(() => root.classList.remove(FADE_CLASS), 320);
    } else {
      root.classList.remove(FADE_CLASS);
    }

    root.classList.toggle(ROOT_CLASS, mode === "dark");
    root.setAttribute("data-akkad-theme", mode);
    syncThemeColor(mode);
    syncButton(mode);
    scheduleInkSweep();
  }

  function sweepInk(subtree) {
    if (!root.classList.contains(ROOT_CLASS)) {
      restoreInk(subtree || document);
      return;
    }

    // A mode switch scans the page once; later React insertions scan only the
    // newly-added subtree so dynamic content does not trigger repeated full-page work.
    const elements = [];
    if (subtree && subtree.nodeType === 1) elements.push(subtree);
    const queryRoot = subtree && typeof subtree.querySelectorAll === "function"
      ? subtree
      : document.body;
    if (queryRoot) elements.push(...queryRoot.querySelectorAll("*"));

    for (const element of elements) {
      if (element.closest(`#${BUTTON_ID}`)) continue;
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || !hasOwnText(element)) continue;

      const foreground = parseRgb(style.color);
      const background = closestPaintedBackground(element, window);
      if (!foreground || luminance(background) > DARK_BACKGROUND_LUMINANCE) continue;
      if (contrastRatio(foreground, background) >= MIN_CONTRAST) continue;

      if (!element.hasAttribute(INK_ATTRIBUTE)) {
        element.setAttribute(INK_ATTRIBUTE, element.style.color || "");
      }
      element.style.color = isNeutralColor(foreground)
        ? PALETTE.secondaryText
        : PALETTE.primaryText;
    }
  }

  function restoreInk(subtree) {
    const scope = subtree && typeof subtree.querySelectorAll === "function"
      ? subtree
      : document;
    const marked = [];
    if (scope.nodeType === 1 && scope.hasAttribute(INK_ATTRIBUTE)) marked.push(scope);
    marked.push(...scope.querySelectorAll(`[${INK_ATTRIBUTE}]`));

    for (const element of marked) {
      element.style.color = element.getAttribute(INK_ATTRIBUTE) || "";
      element.removeAttribute(INK_ATTRIBUTE);
    }
  }

  function scheduleInkSweep(subtree) {
    if (subtree) pendingInkRoots.add(subtree);
    else fullInkSweepPending = true;

    window.clearTimeout(inkTimer);
    inkTimer = window.setTimeout(() => {
      if (fullInkSweepPending) {
        sweepInk();
      } else {
        for (const addedRoot of pendingInkRoots) {
          sweepInk(addedRoot);
        }
      }
      pendingInkRoots = new Set();
      fullInkSweepPending = false;
    }, 220);
  }

  function mountButton() {
    if (button && button.isConnected) return true;
    const header = document.querySelector("header.fasty_header") ||
      document.querySelector("header");
    if (!header) return false;

    // Wait until the window load event before touching React-owned header DOM;
    // inserting during hydration can make React discard the server-rendered UI.
    const row = header.querySelector(".h-\\[72px\\]") ||
      header.querySelector(".fasty_header_logo")?.closest("div.flex");
    const group = row && row.children[0];
    if (!group) return false;

    button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.setAttribute("aria-label", LABEL_TO_DARK);
    group.insertBefore(button, group.firstChild);
    ownsButton = true;
    syncButton(getMode(window));
    return true;
  }

  function onToggle() {
    const nextMode = root.classList.contains(ROOT_CLASS) ? "light" : "dark";
    savePreference(window, nextMode);
    applyMode(true);
  }

  const removeDarkStyles = styles.add(
    STYLE_ID,
    `${designTokensCss}\n${darkModeCss}`
  );
  applyMode(false);

  const unsubscribeHeader = dom.subscribe("header", () => {
    if (mountReady) mountButton();
  });
  const unsubscribeAddedNodes = dom.onNodesAdded((node) => {
    if (node.nodeType === 1) scheduleInkSweep(node);
  });
  const unsubscribeToggle = events.on("click", `#${BUTTON_ID}`, onToggle);

  const onSystemThemeChange = () => {
    if (!readPreference(window)) applyMode(true);
  };
  let mediaQuery = null;
  try {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  } catch {
    // Initial mode still works with the light default when OS preference is unavailable.
  }
  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", onSystemThemeChange);
  } else if (mediaQuery && mediaQuery.addListener) {
    mediaQuery.addListener(onSystemThemeChange);
  }

  const beginMount = () => {
    if (destroyed) return;
    mountReady = true;
    mountButton();
  };
  const onWindowLoad = () => {
    mountTimer = window.setTimeout(beginMount, 400);
  };
  if (document.readyState === "complete") {
    onWindowLoad();
  } else {
    window.addEventListener("load", onWindowLoad, { once: true });
  }

  return () => {
    destroyed = true;
    unsubscribeHeader();
    unsubscribeAddedNodes();
    unsubscribeToggle();
    if (mediaQuery && mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", onSystemThemeChange);
    } else if (mediaQuery && mediaQuery.removeListener) {
      mediaQuery.removeListener(onSystemThemeChange);
    }
    window.removeEventListener("load", onWindowLoad);
    window.clearTimeout(inkTimer);
    window.clearTimeout(fadeTimer);
    window.clearTimeout(mountTimer);
    restoreInk();
    if (ownsButton && button) button.remove();
    removeDarkStyles();
    root.classList.toggle(ROOT_CLASS, originallyDark);
    if (originalThemeAttribute === null) root.removeAttribute("data-akkad-theme");
    else root.setAttribute("data-akkad-theme", originalThemeAttribute);

    const currentThemeColor = document.querySelector('meta[name="theme-color"]');
    if (originalThemeColor) {
      originalThemeColor.content = originalThemeColorContent;
    } else if (currentThemeColor) {
      currentThemeColor.remove();
    }
  };
}
