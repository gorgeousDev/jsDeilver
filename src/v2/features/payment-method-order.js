const CHECKOUT_PREFIX = "/checkout";
const PAYMENT_CONTAINER_SELECTOR = ".payments_container";

export function initPaymentMethodOrder({ document, dom, navigation, window }) {
  const containerObservers = new Map();
  let stopContainers = null;

  function reorder(container) {
    if (!window.location.pathname.startsWith(CHECKOUT_PREFIX)) return;
    const cards = Array.from(container.children);
    const transfer = cards.find((card) => card.textContent.includes("صورة التحويل"));
    const cashOnDelivery = cards.find((card) => card.textContent.includes("دفع عند الاستلام"));
    if (transfer && cashOnDelivery && container.firstElementChild !== cashOnDelivery) {
      container.insertBefore(cashOnDelivery, transfer);
    }
  }

  function observeContainer(container) {
    if (!window.location.pathname.startsWith(CHECKOUT_PREFIX) ||
        containerObservers.has(container)) return;
    reorder(container);
    containerObservers.set(container, dom.observe(container, () => reorder(container)));
  }

  function disconnectContainers() {
    for (const stop of containerObservers.values()) stop();
    containerObservers.clear();
  }

  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!pathname.startsWith(CHECKOUT_PREFIX)) {
      stopContainers?.();
      stopContainers = null;
      disconnectContainers();
      return;
    }
    if (!stopContainers) stopContainers = dom.subscribe(PAYMENT_CONTAINER_SELECTOR, observeContainer);
    document.querySelectorAll(PAYMENT_CONTAINER_SELECTOR).forEach(observeContainer);
  });

  return () => {
    stopContainers?.();
    stopNavigation();
    disconnectContainers();
  };
}
