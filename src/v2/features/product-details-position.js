const DETAILS_SELECTOR = ".product_tabs_container";
const POLICY_SELECTOR = ".flex.flex-col.mt-4.rounded-xl.border";

export function initProductDetailsPosition({ document, dom, navigation, window }) {
  let frame = 0;
  let stopDetails = null;
  let stopPolicy = null;

  function moveDetails() {
    if (!window.location.pathname.startsWith("/products/")) return;
    const policy = document.querySelector(POLICY_SELECTOR);
    const details = document.querySelector(DETAILS_SELECTOR);
    if (policy?.parentNode && details && policy.previousElementSibling !== details) {
      policy.parentNode.insertBefore(details, policy);
    }
  }

  function schedule() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(moveDetails);
  }

  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!pathname.startsWith("/products/")) {
      stopDetails?.();
      stopPolicy?.();
      stopDetails = null;
      stopPolicy = null;
      return;
    }
    if (!stopDetails) stopDetails = dom.subscribe(DETAILS_SELECTOR, schedule);
    if (!stopPolicy) stopPolicy = dom.subscribe(POLICY_SELECTOR, schedule);
    schedule();
  });

  return () => {
    stopDetails?.();
    stopPolicy?.();
    stopNavigation();
    if (frame) window.cancelAnimationFrame(frame);
  };
}
