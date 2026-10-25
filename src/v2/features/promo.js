import promoCss from "../styles/promo.css";

const MAX_DISCOUNT = 200;
const INVOICE_SELECTOR = '[data-invoice="invoice"]';
const TOTAL_SELECTOR = '[data-invoice="invoice-total-value"]';
const DISCOUNTED_TOTAL_SELECTOR = '[data-invoice="invoice-discounted-total-value"]';
const DISCOUNT_ROW_SELECTOR = '[data-invoice="invoice-discounted-total"]';
const ORIGINAL_DISCOUNT_KEY = "akkadPromoOriginalDiscount";
const NOTICE_CLASS = "akkad-promo-cap-note";

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

function findDiscountElement(invoice) {
  for (const paragraph of invoice.querySelectorAll("p")) {
    const text = (paragraph.textContent || "").trim();
    if (text.startsWith("خصم") || text.startsWith("الخصم")) {
      return paragraph;
    }
  }
  return null;
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
  let observedInvoice = null;
  let stopObservingInvoice = null;

  function scheduleUpdate(invoice) {
    if (scheduledFrame) return;
    scheduledFrame = window.requestAnimationFrame(() => {
      scheduledFrame = 0;
      const currentInvoice = invoice && invoice.isConnected
        ? invoice
        : document.querySelector(INVOICE_SELECTOR);
      if (currentInvoice) updateInvoice(currentInvoice, document);
    });
  }

  function observeInvoice(invoice) {
    if (observedInvoice === invoice) {
      scheduleUpdate(invoice);
      return;
    }

    if (stopObservingInvoice) stopObservingInvoice();
    observedInvoice = invoice;
    // Watch only checkout invoice text, not every text update on the storefront.
    stopObservingInvoice = dom.observe(
      invoice,
      () => scheduleUpdate(invoice),
      { childList: true, subtree: true, characterData: true }
    );
    scheduleUpdate(invoice);
  }

  const unsubscribeInvoice = dom.subscribe(INVOICE_SELECTOR, observeInvoice);
  const unsubscribeAddedNodes = dom.onNodesAdded(() => {
    if (observedInvoice && !observedInvoice.isConnected) {
      if (stopObservingInvoice) stopObservingInvoice();
      observedInvoice = null;
      stopObservingInvoice = null;
    }
  });

  return () => {
    unsubscribeInvoice();
    unsubscribeAddedNodes();
    if (stopObservingInvoice) stopObservingInvoice();
    if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
    removeStyles();
  };
}
