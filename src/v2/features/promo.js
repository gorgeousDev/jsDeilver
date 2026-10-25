const MAX_DISCOUNT = 200;
const INVOICE_SELECTOR = '[data-invoice="invoice"]';
const MOBILE_SUMMARY_SELECTOR = ".checkout_mobile_total_toggle";
const PROMO_SURFACE_SELECTOR = `${INVOICE_SELECTOR}, ${MOBILE_SUMMARY_SELECTOR}`;
const NATIVE_SAVINGS_SELECTOR = '[data-invoice="invoice-total-savings"]';
const NATIVE_TOTAL_SELECTOR = '[data-invoice="invoice-total-value"]';
const MOBILE_SAVINGS_SELECTOR = '[data-invoice="checkout-mobile-total-savings"]';

function normalizeDigits(value) {
  return String(value)
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/٬/g, "")
    .replace(/٫/g, ".");
}

export function parsePromoMoney(value) {
  const normalized = normalizeDigits(value).replace(/,/g, "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

export function getCappedDiscount(actualDiscount) {
  if (!Number.isFinite(actualDiscount) || actualDiscount < 0) return NaN;
  return Math.min(actualDiscount, MAX_DISCOUNT);
}

export function getCappedTotal(backendTotal, actualDiscount) {
  if (!Number.isFinite(backendTotal)) return NaN;
  const cappedDiscount = getCappedDiscount(actualDiscount);
  if (!Number.isFinite(cappedDiscount)) return NaN;
  return Math.max(0, backendTotal + actualDiscount - cappedDiscount);
}

function updateNativeInvoice(invoice, document) {
  const savingsRow = invoice.querySelector(NATIVE_SAVINGS_SELECTOR);
  const totalElement = invoice.querySelector(NATIVE_TOTAL_SELECTOR);
  const savingsAmountElement = savingsRow?.querySelector(":scope > span:last-child");
  if (!savingsRow || !totalElement || !savingsAmountElement) return;

  const displayedSavings = Math.abs(parsePromoMoney(savingsAmountElement.textContent));
  const currentTotal = Math.abs(parsePromoMoney(totalElement.textContent));
  if (!Number.isFinite(displayedSavings) || !Number.isFinite(currentTotal)) return;

  const previousSavings = Number(savingsRow.dataset.akkadPromoActual);
  const previousDisplayedSavings = Number(savingsRow.dataset.akkadPromoDisplayed);
  const actualSavings =
    Number.isFinite(previousSavings) &&
    Math.abs(displayedSavings - previousDisplayedSavings) < 0.001
      ? previousSavings
      : displayedSavings;
  const previousDisplayedTotal = Number(totalElement.dataset.akkadPromoDisplayed);
  const totalIsOurDisplay =
    Number.isFinite(previousDisplayedTotal) &&
    Math.abs(currentTotal - previousDisplayedTotal) < 0.001;
  const originalTotal = totalIsOurDisplay
    ? currentTotal - (Number.isFinite(previousSavings) ? previousSavings - MAX_DISCOUNT : 0)
    : currentTotal;
  const cappedSavings = getCappedDiscount(actualSavings);

  if (actualSavings > MAX_DISCOUNT) {
    writeMoney(savingsAmountElement, cappedSavings, document, "");
    writeMoney(totalElement, originalTotal + actualSavings - cappedSavings, document, "");
    savingsRow.dataset.akkadPromoActual = String(actualSavings);
    savingsRow.dataset.akkadPromoDisplayed = String(cappedSavings);
    totalElement.dataset.akkadPromoDisplayed = String(originalTotal + actualSavings - cappedSavings);
  } else {
    if (totalIsOurDisplay) writeMoney(totalElement, originalTotal, document, "");
    delete savingsRow.dataset.akkadPromoActual;
    delete savingsRow.dataset.akkadPromoDisplayed;
    delete totalElement.dataset.akkadPromoDisplayed;
  }
}

function updateMobileSummary(document) {
  for (const savingsRow of document.querySelectorAll(MOBILE_SAVINGS_SELECTOR)) {
    const amountElement = savingsRow.querySelector(":scope > span:last-child");
    const totalLine = savingsRow.parentElement?.querySelector(":scope > span:first-child");
    const totalElement = totalLine?.querySelector(":scope > span:first-child");
    if (!amountElement || !totalElement) continue;

    const displayedSavings = Math.abs(parsePromoMoney(amountElement.textContent));
    const currentTotal = Math.abs(parsePromoMoney(totalElement.textContent));
    if (!Number.isFinite(displayedSavings) || !Number.isFinite(currentTotal)) continue;

    const previousSavings = Number(savingsRow.dataset.akkadPromoActual);
    const previousDisplayedSavings = Number(savingsRow.dataset.akkadPromoDisplayed);
    const actualSavings =
      Number.isFinite(previousSavings) &&
      Math.abs(displayedSavings - previousDisplayedSavings) < 0.001
        ? previousSavings
        : displayedSavings;
    const previousDisplayedTotal = Number(totalElement.dataset.akkadPromoDisplayed);
    const totalIsOurDisplay =
      Number.isFinite(previousDisplayedTotal) &&
      Math.abs(currentTotal - previousDisplayedTotal) < 0.001;
    const originalTotal = totalIsOurDisplay
      ? currentTotal -
        (Number.isFinite(previousSavings) ? previousSavings - MAX_DISCOUNT : 0)
      : currentTotal;

    if (actualSavings > MAX_DISCOUNT) {
      const cappedTotal = originalTotal + actualSavings - MAX_DISCOUNT;
      writeMoney(amountElement, MAX_DISCOUNT, document, "");
      totalElement.textContent = cappedTotal.toLocaleString("en-US");
      savingsRow.dataset.akkadPromoActual = String(actualSavings);
      savingsRow.dataset.akkadPromoDisplayed = String(MAX_DISCOUNT);
      totalElement.dataset.akkadPromoDisplayed = String(cappedTotal);
    } else {
      if (totalIsOurDisplay) totalElement.textContent = originalTotal.toLocaleString("en-US");
      delete savingsRow.dataset.akkadPromoActual;
      delete savingsRow.dataset.akkadPromoDisplayed;
      delete totalElement.dataset.akkadPromoDisplayed;
    }
  }
}

function writeMoney(element, amount, document, label) {
  const currentAmount = parsePromoMoney(element.textContent);
  if (Number.isFinite(currentAmount) && Math.abs(currentAmount - amount) < 0.001) {
    return;
  }

  const currency = document.createElement("span");
  currency.className = "font-[inherit]";
  currency.textContent = "ج.م";
  element.replaceChildren(
    document.createTextNode(`${label}${amount.toLocaleString("en-US")} `),
    currency
  );
}

export function initPromo({ document, dom, styles, window }) {
  let scheduledFrame = 0;
  const observedInvoices = new Map();

  function updateInvoices() {
    updateMobileSummary(document);
    for (const invoice of document.querySelectorAll(INVOICE_SELECTOR)) {
      updateNativeInvoice(invoice, document);
    }
  }

  function scheduleUpdate() {
    if (scheduledFrame) return;
    scheduledFrame = window.requestAnimationFrame(() => {
      scheduledFrame = 0;
      updateInvoices();
    });
  }

  function observeInvoice(invoice) {
    if (observedInvoices.has(invoice)) return;
    // Watch invoice surfaces only; unrelated storefront mutations stay unobserved.
    const stopObserving = dom.observe(invoice, scheduleUpdate, {
      childList: true,
      subtree: true,
      characterData: true
    });
    observedInvoices.set(invoice, stopObserving);
    scheduleUpdate();
  }

  const unsubscribeInvoice = dom.subscribe(
    PROMO_SURFACE_SELECTOR,
    observeInvoice
  );
  const unsubscribeAddedNodes = dom.onNodesAdded(() => {
    for (const [invoice, stopObserving] of observedInvoices) {
      if (!invoice.isConnected) {
        stopObserving();
        observedInvoices.delete(invoice);
      }
    }
  });
  scheduleUpdate();

  return () => {
    unsubscribeInvoice();
    unsubscribeAddedNodes();
    for (const stopObserving of observedInvoices.values()) stopObserving();
    observedInvoices.clear();
    if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
  };
}
