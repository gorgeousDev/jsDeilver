export function initHideOkkaHeading({ dom, navigation, window }) {
  const originals = new Map();
  let stopHeadings = null;
  let activePath = "";

  function update(heading) {
    if (!window.location.pathname.startsWith("/products/") ||
        !heading.textContent.toUpperCase().includes("OKKA")) return;
    if (!originals.has(heading)) {
      originals.set(heading, {
        value: heading.style.getPropertyValue("display"),
        priority: heading.style.getPropertyPriority("display")
      });
    }
    heading.style.setProperty("display", "none");
  }

  function restore() {
    for (const [heading, display] of originals) {
      if (display.value) heading.style.setProperty("display", display.value, display.priority);
      else heading.style.removeProperty("display");
    }
    originals.clear();
  }

  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!pathname.startsWith("/products/")) {
      stopHeadings?.();
      stopHeadings = null;
      activePath = "";
      restore();
      return;
    }
    if (activePath !== pathname) {
      restore();
      activePath = pathname;
    }
    if (!stopHeadings) stopHeadings = dom.subscribe("h3", update);
  });

  return () => {
    stopHeadings?.();
    stopNavigation();
    restore();
  };
}
