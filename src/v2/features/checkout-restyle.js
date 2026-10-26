import checkoutCss from "../styles/checkout.css";
import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const CHECKOUT_PATH = "checkout";
const THANKS_PATH = "thanks";
const WA_NUMBER = "01508331823";
const INVOICE_SELECTOR = '[data-invoice="invoice"]';

const CHECKOUT_REMINDER_ICON =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.182-.008-.52-.01-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.173-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884";

const THANKS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

function addReminder(container, document) {
  if (container.querySelector(".akkad-wa-reminder")) return;

  const banner = document.createElement("div");
  banner.className = "akkad-wa-reminder";
  banner.dataset.akkadWa = "1";
  banner.innerHTML =
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${CHECKOUT_REMINDER_ICON}"/></svg>` +
    '<span role="note">سيتم التواصل معك عبر الواتساب لتأكيد الأوردر خلال 24 ساعة</span>';
  container.insertBefore(banner, container.firstChild);
}

function fixCheckoutHeader(document, window, headerStyles, wrapperClasses) {
  if (!window.location.pathname.includes(CHECKOUT_PATH)) return;

  for (const header of document.querySelectorAll("header.sticky.top-0.z-50")) {
    if (!headerStyles.has(header)) {
      headerStyles.set(header, captureInlineProperties(header, ["display"]));
    }
    header.style.setProperty("display", "none");
  }
  const siteHeader = document.querySelector("header.fasty_header");
  const wrapper = siteHeader?.closest("div.hidden");
  if (wrapper) {
    if (!wrapperClasses.has(wrapper)) wrapperClasses.set(wrapper, wrapper.classList.contains("hidden"));
    wrapper.classList.remove("hidden");
  }
  document.documentElement.classList.add("on-checkout");
}

function restoreCheckoutHeader(document, headerStyles, wrapperClasses) {
  for (const [header, style] of headerStyles) restoreInlineProperties(header, style);
  headerStyles.clear();
  for (const [wrapper, wasHidden] of wrapperClasses) {
    wrapper.classList.toggle("hidden", wasHidden);
  }
  wrapperClasses.clear();
  document.documentElement.classList.remove("on-checkout");
}

function labelInput(input, document) {
  const labels = {
    full_name: "الاسم بالكامل",
    phone: "رقم الهاتف",
    address: "العنوان"
  };
  const label = labels[input.name];
  if (!label || input.getAttribute("aria-label")) return;
  const associatedLabel =
    input.closest("label") || (input.id && document.querySelector(`label[for="${input.id}"]`));
  if (!associatedLabel) input.setAttribute("aria-label", label);
}

function createPaymentInfo(document) {
  const box = document.createElement("div");
  box.className = "akkad-elec-box";
  box.id = "akkad-elec-box";

  const link = document.createElement("a");
  link.href = "https://ipn.eg/S/akkad.one/instapay/3yzMRQ";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "💜 فتح رابط InstaPay";

  const wallet = document.createElement("div");
  wallet.className = "akkad-num-wrap";
  const label = document.createElement("div");
  label.className = "akkad-num-label";
  label.textContent = "📱 محفظة الكاش";

  const numberRow = document.createElement("div");
  numberRow.className = "akkad-num";
  const number = document.createElement("span");
  number.textContent = WA_NUMBER;
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.dataset.akkadCopyWallet = "";
  copyButton.textContent = "نسخ";

  numberRow.append(number, copyButton);
  wallet.append(label, numberRow);
  box.append(link, wallet);
  return box;
}

function createThanksCard(document, orderId) {
  const card = document.createElement("div");
  card.className = "akkad-thanks-card";
  card.dataset.akkadThanks = "1";
  card.innerHTML =
    '<div class="akkad-thanks-badge">' + THANKS_ICON + "</div>" +
    '<h1 class="akkad-thanks-title">شكراً لطلبك من <span>أكاد</span></h1>' +
    '<p class="akkad-thanks-sub">تم استلام طلبك بنجاح</p>' +
    '<p class="akkad-thanks-msg">سيتم التواصل معك عبر الهاتف خلال 24 ساعة لتأكيد البيانات قبل الشحن.</p>' +
    '<div class="akkad-thanks-steps">' +
    '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">1</span><div><b>استلام الطلب</b><br><small>تم تسجيل طلبك بنجاح</small></div></div>' +
    '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">2</span><div><b>التواصل للتأكيد</b><br><small>التواصل عبر الواتساب</small></div></div>' +
    '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">3</span><div><b>الشحن والتسليم</b><br><small>تجهيز طلبك وتسليمه إليك</small></div></div>' +
    "</div>" +
    '<div class="akkad-thanks-divider"></div>' +
    '<div class="akkad-thanks-wa"><p class="akkad-thanks-wa-before">أو يمكنك التواصل معنا</p>' +
    `<a class="akkad-thanks-wa-btn" href="https://wa.me/201508331823?text=${encodeURIComponent("مرحبا . لقد طلبت من متجركم و اريد التأكيد")}" target="_blank" rel="noopener">من هنا</a>` +
    '<p class="akkad-thanks-wa-after">لتأكيد الطلب سريعاً</p></div>' +
    '<a class="akkad-thanks-home" href="/">متابعة التسوق</a>';

  if (orderId) {
    const order = document.createElement("div");
    order.className = "akkad-thanks-order";
    order.textContent = `رقم الطلب: ${orderId}`;
    card.insertBefore(order, card.querySelector(".akkad-thanks-msg"));
  }
  return card;
}

function renderThanksPage(container, document, window, originalStyles, hiddenChildren, cards) {
  if (container.querySelector(".akkad-thanks-card")) return;

  const orderId = new URLSearchParams(window.location.search).get("order_id") || "";
  Array.from(container.children).forEach((child) => {
    if (child.querySelector("[data-invoice]") || child.hasAttribute("data-invoice")) return;
    const hasProductOffer = child.querySelector('a[href*="/products/"]');
    const isFiller = child.querySelector(".thanks_content") ||
      (typeof child.className === "string" && /(^|\s)thanks_content(\s|$)/.test(child.className));
    const hasHomeLink = child.querySelector('a[href="/"]');
    if (isFiller || (!hasProductOffer && hasHomeLink)) {
      if (!hiddenChildren.has(child)) {
        hiddenChildren.set(child, captureInlineProperties(child, ["display"]));
      }
      child.style.setProperty("display", "none", "important");
      child.dataset.akkadThanksHidden = "1";
    }
  });

  if (!originalStyles.has(container)) {
    originalStyles.set(container, captureInlineProperties(container, [
      "margin-top", "padding-bottom", "justify-content", "display", "flex-direction", "align-items"
    ]));
  }
  container.style.marginTop = "40px";
  container.style.paddingBottom = "44px";
  container.style.justifyContent = "flex-start";
  if (!container.classList.contains("thanks_container")) {
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
  }
  const card = createThanksCard(document, orderId);
  cards.add(card);
  container.insertBefore(card, container.firstChild);
}

export function initCheckoutRestyle({ document, dom, events, navigation, styles, window }) {
  const removeStyles = styles.add("akkad-v2-checkout-css", checkoutCss);
  let thanksTimer = 0;
  let thanksObserverCleanup = null;
  const headerStyles = new Map();
  const wrapperClasses = new Map();
  const thanksStyles = new Map();
  const hiddenThanksChildren = new Map();
  const thanksCards = new Set();

  function restoreThanksPage() {
    for (const card of thanksCards) card.remove();
    thanksCards.clear();
    for (const [element, style] of hiddenThanksChildren) {
      restoreInlineProperties(element, style);
      delete element.dataset.akkadThanksHidden;
    }
    hiddenThanksChildren.clear();
    for (const [container, style] of thanksStyles) restoreInlineProperties(container, style);
    thanksStyles.clear();
  }

  function initializeCheckout(container) {
    if (!window.location.pathname.includes(CHECKOUT_PATH)) return;
    addReminder(container, document);
    fixCheckoutHeader(document, window, headerStyles, wrapperClasses);
  }

  function initializePayments() {
    const cards = document.querySelectorAll(".payment_card");
    if (cards.length < 2) return;
    const electronic = cards[1];
    const content = electronic.querySelector(".payment_card_content");
    if (!content || content.querySelector(".akkad-elec-box")) return;

    const box = createPaymentInfo(document);
    const image = content.querySelector(".payment_card_img_container");
    if (image?.nextSibling) content.insertBefore(box, image.nextSibling);
    else content.appendChild(box);
  }

  function initializeThanksPage(pathname = window.location.pathname) {
    if (!pathname.includes(THANKS_PATH)) {
      if (thanksTimer) window.clearTimeout(thanksTimer);
      thanksTimer = 0;
      if (thanksObserverCleanup) thanksObserverCleanup();
      thanksObserverCleanup = null;
      restoreThanksPage();
      return;
    }

    const container = document.querySelector(".thanks_container") ||
      document.querySelector("main div.mt-20") ||
      document.querySelector("div.mt-20");
    if (!container || document.querySelector(".akkad-thanks-card") || thanksTimer) return;

    const delay = document.readyState === "complete" ? 50 : 400;
    thanksTimer = window.setTimeout(() => {
      thanksTimer = 0;
      if (!window.location.pathname.includes(THANKS_PATH)) return;
      renderThanksPage(container, document, window, thanksStyles, hiddenThanksChildren, thanksCards);
      if (!thanksObserverCleanup) {
        const stopObserving = dom.observe(
          container,
          () => renderThanksPage(container, document, window, thanksStyles, hiddenThanksChildren, thanksCards),
          { childList: true }
        );
        thanksObserverCleanup = stopObserving;
      }
    }, delay);
  }

  const unsubscribeCheckout = dom.subscribe(".checkout_container", initializeCheckout);
  const unsubscribePayments = dom.subscribe(".payment_card", initializePayments);
  const unsubscribeInputs = dom.subscribe(
    'input[name="full_name"], input[name="phone"], input[name="address"]',
    (input) => labelInput(input, document)
  );
  const unsubscribeThanks = dom.subscribe(
    ".thanks_container, main div.mt-20, div.mt-20",
    () => initializeThanksPage()
  );

  const unsubscribePaymentCardClick = events.on("click", ".payment_card", (event, card) => {
    const box = document.querySelector(".akkad-elec-box");
    if (!box) return;
    const cards = Array.from(document.querySelectorAll(".payment_card"));
    if (card === cards[1]) box.classList.add("show");
    else if (card === cards[0]) box.classList.remove("show");
  });

  const unsubscribeWalletCopy = events.on("click", "[data-akkad-copy-wallet]", (event, button) => {
    event.stopPropagation();
    const clipboard = window.navigator.clipboard;
    if (!clipboard) {
      button.textContent = "انسخ يدويًا";
      return;
    }

    clipboard.writeText(WA_NUMBER).then(() => {
      button.textContent = "✔ تم";
    }).catch((error) => {
      window.console.error("Could not copy the wallet number.", error);
      button.textContent = "تعذر النسخ";
    }).finally(() => {
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = "نسخ";
      }, 2000);
    });
  });

  const unsubscribeRoutes = navigation.subscribe(({ pathname }) => {
    const isCheckout = pathname.includes(CHECKOUT_PATH);
    document.documentElement.classList.toggle("on-checkout", isCheckout);
    if (isCheckout) {
      fixCheckoutHeader(document, window, headerStyles, wrapperClasses);
    } else {
      restoreCheckoutHeader(document, headerStyles, wrapperClasses);
    }
    initializeThanksPage(pathname);
  });

  const unsubscribeHeaders = dom.subscribe(
    "header.sticky.top-0.z-50, header.fasty_header",
    () => fixCheckoutHeader(document, window, headerStyles, wrapperClasses)
  );

  return () => {
    unsubscribeCheckout();
    unsubscribePayments();
    unsubscribeInputs();
    unsubscribeThanks();
    unsubscribePaymentCardClick();
    unsubscribeWalletCopy();
    unsubscribeRoutes();
    unsubscribeHeaders();
    if (thanksTimer) window.clearTimeout(thanksTimer);
    if (thanksObserverCleanup) thanksObserverCleanup();
    restoreCheckoutHeader(document, headerStyles, wrapperClasses);
    restoreThanksPage();
    removeStyles();
  };
}
