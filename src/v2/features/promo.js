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
const NATIVE_SAVINGS_LABEL = "إجمالي التوفير";
const NATIVE_TOTAL_LABEL = "الإجمالي";

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

function isLabel(element, label) {
  const text = (element.textContent || "").replace(/\s+/g, " ").trim();
  return text === label || text.startsWith(`${label} `) || text.startsWith(`${label}:`);
}

function findLabelElement(root, label) {
  if (!root || root.nodeType !== 1) return null;
  const elements = [root, ...root.querySelectorAll("*")];

  return elements.find((element) => {
    if (!isLabel(element, label)) return false;
    return !Array.from(element.children).some((child) => isLabel(child, label));
  }) || null;
}

function findRow(root, labelElement, label) {
  let current = labelElement;

  for (let depth = 0; current && depth < 6; depth += 1, current = current.parentElement) {
    const amounts = Array.from(current.querySelectorAll("*")).filter((element) => {
      if (element === labelElement || labelElement.contains(element)) return false;
      const text = (element.textContent || "").trim();
      return /\d/.test(normalizeDigits(text)) && Number.isFinite(parsePromoMoney(text));
    });
    const leafAmounts = amounts.filter((element) =>
      !Array.from(element.children).some((child) => amounts.includes(child))
    );

    if (leafAmounts.length === 1) {
      return { row: current, amountElement: leafAmounts[0], label };
    }

    const combinedAmount = Math.abs(parsePromoMoney(labelElement.textContent));
    if (leafAmounts.length === 0 && isLabel(labelElement, label) &&
        normalizeDigits(labelElement.textContent).match(/\d/)) {
      return { row: current, amountElement: labelElement, label, combinedAmount };
    }
  }

  return null;
}

function writeNativeAmount(row, amount) {
  if (row.amountElement === row.labelElement) {
    const replacement = `${row.label} ${amount.toLocaleString("en-US")} ج.م`;
    if (row.amountElement.textContent !== replacement) {
      row.amountElement.textContent = replacement;
    }
    return;
  }

  const currentText = (row.amountElement.textContent || "").trim();
  if (Math.abs(parsePromoMoney(currentText) - amount) < 0.001) return;

  const currency = currentText.match(/ج\.?\s*م|جنيه|EGP/i)?.[0];
  const currencyIsAdjacent = Array.from(row.amountElement.parentElement?.children || [])
    .some((element) => element !== row.amountElement && /ج\.?\s*م|جنيه|EGP/i.test(element.textContent));
  const suffix = currency || (currencyIsAdjacent ? "" : " ج.م");
  row.amountElement.textContent = `${amount.toLocaleString("en-US")}${suffix ? ` ${suffix}` : ""}`;
}

function updateNativeCheckout(root, document) {
  const savingsLabel = findLabelElement(root, NATIVE_SAVINGS_LABEL);
  if (!savingsLabel || savingsLabel.closest(`${INVOICE_SELECTOR}, ${CUSTOM_INVOICE_SELECTOR}`)) {
    return null;
  }

  const savingsRow = findRow(root, savingsLabel, NATIVE_SAVINGS_LABEL);
  if (!savingsRow) return null;
  savingsRow.labelElement = savingsLabel;

  const savingsAmount = Number.isFinite(savingsRow.combinedAmount)
    ? savingsRow.combinedAmount
    : Math.abs(parsePromoMoney(savingsRow.amountElement.textContent));
  if (!Number.isFinite(savingsAmount)) return savingsRow.row.parentElement;

  const totalLabel = findLabelElement(savingsRow.row.parentElement, NATIVE_TOTAL_LABEL);
  if (!totalLabel) return savingsRow.row.parentElement;

  const totalRow = findRow(savingsRow.row.parentElement, totalLabel, NATIVE_TOTAL_LABEL);
  if (!totalRow) return savingsRow.row.parentElement;
  totalRow.labelElement = totalLabel;

  const previousSavings = Number(savingsRow.row.dataset.akkadPromoActual);
  const previousShownSavings = Number(savingsRow.row.dataset.akkadPromoDisplayed);
  const actualSavings =
    Number.isFinite(previousSavings) &&
    Math.abs(savingsAmount - previousShownSavings) < 0.001
      ? previousSavings
      : savingsAmount;
  const currentTotal = Math.abs(parsePromoMoney(totalRow.amountElement.textContent));
  if (!Number.isFinite(currentTotal)) return savingsRow.row.parentElement;

  const previousShownTotal = Number(totalRow.row.dataset.akkadPromoDisplayed);
  const totalIsOurDisplay =
    Number.isFinite(previousShownTotal) && Math.abs(currentTotal - previousShownTotal) < 0.001;
  const originalTotal = totalIsOurDisplay
    ? currentTotal - (Number.isFinite(previousSavings) ? previousSavings : actualSavings) + MAX_DISCOUNT
    : currentTotal;
  const cappedSavings = getCappedDiscount(actualSavings);
  const cappedTotal = originalTotal + actualSavings - cappedSavings;

  if (actualSavings > MAX_DISCOUNT) {
    writeNativeAmount(savingsRow, cappedSavings);
    writeNativeAmount(totalRow, cappedTotal);
    savingsRow.row.dataset.akkadPromoActual = String(actualSavings);
    savingsRow.row.dataset.akkadPromoDisplayed = String(cappedSavings);
    totalRow.row.dataset.akkadPromoDisplayed = String(cappedTotal);
    syncNotice(savingsRow.row.parentElement, true, document);
  } else {
    if (totalIsOurDisplay) writeNativeAmount(totalRow, originalTotal);
    delete savingsRow.row.dataset.akkadPromoActual;
    delete savingsRow.row.dataset.akkadPromoDisplayed;
    delete totalRow.row.dataset.akkadPromoDisplayed;
    syncNotice(savingsRow.row.parentElement, false, document);
  }

  return savingsRow.row.parentElement;
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
  const observedNativeRows = new Map();

  function observeNativeRow(row) {
    if (!row || observedNativeRows.has(row)) return;
    const stopObserving = dom.observe(row, scheduleUpdate, {
      childList: true,
      subtree: true,
      characterData: true
    });
    observedNativeRows.set(row, stopObserving);
  }

  function updateInvoices() {
    const backendDiscount = findBackendDiscount(document);
    const nativeRow = updateNativeCheckout(document.body || document.documentElement, document);
    if (nativeRow) observeNativeRow(nativeRow);
    for (const invoice of document.querySelectorAll(INVOICE_SELECTOR)) {
      updateInvoice(invoice, document);
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
  const unsubscribeAddedNodes = dom.onNodesAdded((node) => {
    for (const [invoice, stopObserving] of observedInvoices) {
      if (!invoice.isConnected) {
        stopObserving();
        observedInvoices.delete(invoice);
      }
    }

    for (const [row, stopObserving] of observedNativeRows) {
      if (!row.isConnected) {
        stopObserving();
        observedNativeRows.delete(row);
      }
    }

    const root = node.nodeType === 1 ? node : node.parentElement;
    if (!root || !findLabelElement(root, NATIVE_SAVINGS_LABEL)) return;
    const nativeRow = updateNativeCheckout(root, document);
    if (nativeRow) observeNativeRow(nativeRow);
  });
  scheduleUpdate();

  return () => {
    unsubscribeInvoice();
    unsubscribeAddedNodes();
    for (const stopObserving of observedInvoices.values()) stopObserving();
    observedInvoices.clear();
    for (const stopObserving of observedNativeRows.values()) stopObserving();
    observedNativeRows.clear();
    if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
    removeStyles();
  };
}
