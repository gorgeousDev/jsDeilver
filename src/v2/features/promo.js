import promoCss from "../styles/promo.css";

const MAX_DISCOUNT = 200;
const INVOICE_SELECTOR = '[data-invoice="invoice"]';
const CUSTOM_INVOICE_SELECTOR = ".akkad-invoice";
const TOTAL_SELECTOR = '[data-invoice="invoice-total-value"]';
const DISCOUNTED_TOTAL_SELECTOR = '[data-invoice="invoice-discounted-total-value"]';
const DISCOUNT_ROW_SELECTOR = '[data-invoice="invoice-discounted-total"]';
const ORIGINAL_DISCOUNT_KEY = "akkadPromoOriginalDiscount";
const CUSTOM_ACTUAL_KEY = "akkadPromoCustomActual";
const CUSTOM_TOTAL_DISPLAYED_KEY = "akkadPromoCustomDisplayedTotal";
const NOTICE_CLASS = "akkad-promo-cap-note";
const NATIVE_SAVINGS_SELECTOR = '[data-invoice="invoice-total-savings"]';
const NATIVE_TOTAL_SELECTOR = '[data-invoice="invoice-total-value"]';

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

function findDiscountElement(invoice) {
  for (const paragraph of invoice.querySelectorAll("p")) {
    const text = (paragraph.textContent || "").trim();
    if (text.startsWith("خصم") || text.startsWith("الخصم")) {
      return paragraph;
    }
  }
  return null;
}

function findBackendDiscount(document) {
  const candidates = document.querySelectorAll(
    `${INVOICE_SELECTOR} p, .mt-2.flex.items-center.justify-between p`
  );

  for (const paragraph of candidates) {
    if (paragraph.closest(CUSTOM_INVOICE_SELECTOR)) continue;
    const text = (paragraph.textContent || "").trim();
    if (text.startsWith("خصم") || text.startsWith("الخصم")) {
      const amount = Math.abs(parsePromoMoney(text));
      if (Number.isFinite(amount)) return amount;
    }
  }

  return NaN;
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
    syncNotice(savingsRow.parentElement, true, document);
  } else {
    if (totalIsOurDisplay) writeMoney(totalElement, originalTotal, document, "");
    delete savingsRow.dataset.akkadPromoActual;
    delete savingsRow.dataset.akkadPromoDisplayed;
    delete totalElement.dataset.akkadPromoDisplayed;
    syncNotice(savingsRow.parentElement, false, document);
  }
}

function updateCustomInvoice(invoice, document, backendDiscount) {
  const discountElement = invoice.querySelector(".inv-discount-val");
  const totalElement = invoice.querySelector(".inv-grand");
  if (!discountElement || !totalElement) return;

  const actualDiscount = Number.isFinite(backendDiscount)
    ? backendDiscount
    : Math.abs(parsePromoMoney(discountElement.textContent));
  const currentTotal = parsePromoMoney(totalElement.textContent);
  if (!Number.isFinite(actualDiscount) || !Number.isFinite(currentTotal)) return;

  const previousActual = Number(invoice.dataset[CUSTOM_ACTUAL_KEY]);
  const previousDisplayedTotal = Number(invoice.dataset[CUSTOM_TOTAL_DISPLAYED_KEY]);
  const currentIsOurDisplay =
    Number.isFinite(previousDisplayedTotal) &&
    Math.abs(currentTotal - previousDisplayedTotal) < 0.001;
  const backendTotal = currentIsOurDisplay
    ? currentTotal - (previousActual - MAX_DISCOUNT)
    : currentTotal;
  const cappedDiscount = getCappedDiscount(actualDiscount);

  if (actualDiscount <= MAX_DISCOUNT) {
    delete invoice.dataset[CUSTOM_ACTUAL_KEY];
    delete invoice.dataset[CUSTOM_TOTAL_DISPLAYED_KEY];
    syncNotice(invoice, false, document);
    return;
  }

  const cappedTotal = getCappedTotal(backendTotal, actualDiscount);
  const formattedDiscount = `-${cappedDiscount.toLocaleString("en-US")} ج.م`;
  const formattedTotal = `${cappedTotal.toLocaleString("en-US")} ج.م`;
  if (discountElement.textContent !== formattedDiscount) {
    discountElement.textContent = formattedDiscount;
  }
  if (totalElement.textContent !== formattedTotal) {
    totalElement.textContent = formattedTotal;
  }

  invoice.dataset[CUSTOM_ACTUAL_KEY] = String(actualDiscount);
  invoice.dataset[CUSTOM_TOTAL_DISPLAYED_KEY] = String(cappedTotal);
  syncNotice(invoice, true, document);
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

function syncNotice(invoice, shouldShow, document) {
  let notice = invoice.querySelector(`.${NOTICE_CLASS}`);

  if (!shouldShow) {
    if (notice) notice.remove();
    return;
  }

  if (!notice) {
    notice = document.createElement("p");
    notice.className = NOTICE_CLASS;
    notice.setAttribute("role", "note");
    notice.textContent =
      "تنبيه: الحد الأقصى للخصم ٢٠٠ جنيه. يتم تأكيد إجمالي الطلب يدويًا قبل التجهيز.";
    invoice.appendChild(notice);
  }
}

function updateInvoice(invoice, document) {
  const discountElement = findDiscountElement(invoice);
  if (!discountElement) {
    syncNotice(invoice, false, document);
    return;
  }

  const originalTotalElement = invoice.querySelector(TOTAL_SELECTOR);
  const discountedTotalElement = invoice.querySelector(DISCOUNTED_TOTAL_SELECTOR);
  const discountRow = invoice.querySelector(DISCOUNT_ROW_SELECTOR);

  if (!originalTotalElement || !discountedTotalElement || !discountRow) {
    return;
  }

  const currentDiscount = Math.abs(parsePromoMoney(discountElement.textContent));
  if (!Number.isFinite(currentDiscount)) return;

  const previouslyCappedDiscount = Number(invoice.dataset[ORIGINAL_DISCOUNT_KEY]);
  const hadPreviousCap = Number.isFinite(previouslyCappedDiscount);
  // Keep the backend amount separately; the visible row is rewritten to 200.
  const isShowingPreviousCap =
    hadPreviousCap && Math.abs(currentDiscount - MAX_DISCOUNT) < 0.001;
  const actualDiscount = isShowingPreviousCap ? previouslyCappedDiscount : currentDiscount;
  const displayedDiscount = getCappedDiscount(actualDiscount);
  const originalTotal = parsePromoMoney(originalTotalElement.textContent);
  if (!Number.isFinite(originalTotal)) return;

  if (actualDiscount === 0) {
    delete invoice.dataset[ORIGINAL_DISCOUNT_KEY];
    syncNotice(invoice, false, document);
    return;
  }

  if (actualDiscount > MAX_DISCOUNT) {
    invoice.dataset[ORIGINAL_DISCOUNT_KEY] = String(actualDiscount);
  } else {
    delete invoice.dataset[ORIGINAL_DISCOUNT_KEY];
  }

  if (actualDiscount <= MAX_DISCOUNT && !hadPreviousCap) {
    syncNotice(invoice, false, document);
    return;
  }

  const displayedTotal = Math.max(0, originalTotal - displayedDiscount);
  writeMoney(discountElement, displayedDiscount, document, "خصم: ");
  writeMoney(discountedTotalElement, displayedTotal, document, "");
  syncNotice(invoice, actualDiscount > MAX_DISCOUNT, document);

  invoice.dataset.akkadPromoActualDiscount = String(actualDiscount);
  invoice.dataset.akkadPromoDisplayedDiscount = String(displayedDiscount);
}

export function initPromo({ document, dom, styles, window }) {
  const removeStyles = styles.add("akkad-v2-promo-css", promoCss);
  let scheduledFrame = 0;
  const observedInvoices = new Map();

  function updateInvoices() {
    const backendDiscount = findBackendDiscount(document);
    for (const invoice of document.querySelectorAll(INVOICE_SELECTOR)) {
      updateInvoice(invoice, document);
      updateNativeInvoice(invoice, document);
    }
    for (const invoice of document.querySelectorAll(CUSTOM_INVOICE_SELECTOR)) {
      updateCustomInvoice(invoice, document, backendDiscount);
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
    `${INVOICE_SELECTOR}, ${CUSTOM_INVOICE_SELECTOR}`,
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
    removeStyles();
  };
}
