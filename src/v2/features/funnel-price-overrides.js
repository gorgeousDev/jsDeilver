const EXPECTED = Object.freeze({
  shipping: "50ج.م",
  total: "419.99ج.م",
  sale: "369.99ج.م"
});

export function initFunnelPriceOverrides({ document, dom, navigation, window }) {
  const originalMarkup = new Map();

  function remember(element) {
    if (!originalMarkup.has(element)) originalMarkup.set(element, element.innerHTML);
  }

  function normalizedText(element) {
    return element.textContent.replace(/\s/g, "");
  }

  function setShipping(element) {
    if (normalizedText(element) === EXPECTED.shipping) return;
    remember(element);
    const chip = document.createElement("span");
    chip.textContent = "50 ج.م";
    Object.assign(chip.style, {
      display: "inline-block",
      background: "#9896a4",
      border: "1px solid #9896a4",
      borderRadius: "8px",
      padding: "4px 10px",
      fontSize: "14px",
      fontWeight: "700",
      color: "#374151"
    });
    element.replaceChildren(chip);
  }

  function setTotal(element) {
    if (normalizedText(element) === EXPECTED.total &&
        element.querySelector(".font-\\[inherit\\]")) return;
    remember(element);
    element.replaceChildren(document.createTextNode("419.99"));
    const currency = document.createElement("span");
    currency.className = "font-[inherit]";
    currency.textContent = "ج.م";
    element.appendChild(currency);
  }

  function setSale(element) {
    if (normalizedText(element) === EXPECTED.sale &&
        element.firstElementChild?.style.display === "inline-flex") return;
    remember(element);
    const wrapper = document.createElement("span");
    Object.assign(wrapper.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
      background: "#f8fafc",
      border: "none",
      borderRadius: "10px",
      padding: "6px 12px",
      fontSize: "30px",
      fontWeight: "800",
      color: "#111827",
      lineHeight: "1"
    });
    const amount = document.createElement("span");
    amount.textContent = "369.99";
    const currency = document.createElement("span");
    currency.textContent = "ج.م";
    Object.assign(currency.style, { fontSize: "30px", fontWeight: "800", whiteSpace: "nowrap" });
    wrapper.append(amount, currency);
    element.replaceChildren(wrapper);
  }

  function apply() {
    if (!active) return;
    const shipping = document.querySelector(".shipping_cost");
    if (shipping) setShipping(shipping);
    const total = document.querySelector(".total_price");
    if (total) setTotal(total);
    document.querySelectorAll("#salePrice").forEach(setSale);
  }

  function restore() {
    for (const [element, markup] of originalMarkup) {
      if (element.isConnected) element.innerHTML = markup;
    }
    originalMarkup.clear();
  }

  let active = false;
  let stopPriceObservers = [];

  function startObservingPrices() {
    if (stopPriceObservers.length) return;
    stopPriceObservers = [
      dom.subscribe(".shipping_cost", apply),
      dom.subscribe(".total_price", apply),
      dom.subscribe("#salePrice", apply)
    ];
  }

  function stopObservingPrices() {
    for (const stop of stopPriceObservers) stop();
    stopPriceObservers = [];
  }

  const stopNavigation = navigation.subscribe(({ pathname, search, hash }) => {
    const href = `${pathname}${search}${hash}`;
    const nextActive = href.includes("funnels");
    if (active && !nextActive) {
      stopObservingPrices();
      restore();
    }
    active = nextActive;
    if (active) {
      startObservingPrices();
      apply();
    }
  });

  return () => {
    stopObservingPrices();
    stopNavigation();
    restore();
  };
}
