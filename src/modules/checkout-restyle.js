/**
 * Checkout Restyle Script
 * Styles existing EasyOrders checkout elements
 */
(function() {
  'use strict';

  if (!window.location.pathname.includes('checkout')) return;

  var style = document.createElement('style');
  style.textContent = '\
    /* --- Hide header/footer --- */\
    .fasty_header, #akkad-nav, .akkad-social-section, footer, .default_footer, .akkad-sale-badge {\
      display: none !important;\
    }\
    \
    /* --- Product title: 2 lines max --- */\
    [data-cart="item-name"] {\
      display: -webkit-box !important;\
      -webkit-line-clamp: 2 !important;\
      -webkit-box-orient: vertical !important;\
      overflow: hidden !important;\
      text-overflow: ellipsis !important;\
      max-height: 2.8em !important;\
      line-height: 1.4 !important;\
    }\
    \
    /* --- Single column layout --- */\
    .checkout_container {\
      grid-template-columns: 1fr !important;\
      max-width: 640px !important;\
      padding: 0 16px !important;\
    }\
    .checkout_order_summary {\
      order: 2 !important;\
      background: #fff !important;\
      border: 2px solid #A8DDD4 !important;\
      border-radius: 16px !important;\
      padding: 16px !important;\
      margin-top: 16px !important;\
      margin-bottom: 120px !important;\
    }\
    .checkout_form {\
      order: 1 !important;\
      padding-top: 20px !important;\
    }\
    .checkout_bg_right, .checkout_bg_left {\
      display: none !important;\
    }\
    .bg-white {\
      background: #f8fafc !important;\
    }\
    \
    /* --- Section 1: Customer info --- */\
    #contact-info-heading {\
      display: flex !important;\
      align-items: center !important;\
      gap: 10px !important;\
      font-size: 16px !important;\
      font-weight: 800 !important;\
      color: #0F5E55 !important;\
      margin-bottom: 16px !important;\
      padding-bottom: 12px !important;\
      border-bottom: 2px solid #0F8478 !important;\
    }\
    #contact-info-heading::before {\
      content: "1" !important;\
      display: inline-flex !important;\
      align-items: center !important;\
      justify-content: center !important;\
      width: 28px !important;\
      height: 28px !important;\
      border-radius: 50% !important;\
      background: #0F8478 !important;\
      color: #fff !important;\
      font-size: 14px !important;\
      font-weight: 700 !important;\
      flex-shrink: 0 !important;\
    }\
    \
    /* --- Section 2: Payment --- */\
    .payments_container > span:first-child {\
      display: flex !important;\
      align-items: center !important;\
      gap: 8px !important;\
      font-size: 16px !important;\
      font-weight: 800 !important;\
      color: #0F5E55 !important;\
      margin-bottom: 16px !important;\
    }\
    .payments_container > span:first-child::before {\
      content: "2" !important;\
      display: inline-flex !important;\
      align-items: center !important;\
      justify-content: center !important;\
      width: 28px !important;\
      height: 28px !important;\
      border-radius: 50% !important;\
      background: #0F8478 !important;\
      color: #fff !important;\
      font-size: 14px !important;\
      font-weight: 700 !important;\
      flex-shrink: 0 !important;\
    }\
    \
    /* --- Form inputs --- */\
    .global_input, .global_textarea {\
      border: 2px solid #A8DDD4 !important;\
      border-radius: 12px !important;\
      padding: 12px 16px !important;\
      font-size: 15px !important;\
      background: #f9fafb !important;\
    }\
    .global_input:focus, .global_textarea:focus {\
      border-color: #0F8478 !important;\
      box-shadow: 0 0 0 3px rgba(15, 132, 120, 0.1) !important;\
      background: #fff !important;\
    }\
    .checkout_form label {\
      font-weight: 700 !important;\
      font-size: 14px !important;\
      color: #0F5E55 !important;\
      margin-bottom: 6px !important;\
    }\
    \
    /* --- Payment cards --- */\
    .payment_card {\
      border: 2px solid #A8DDD4 !important;\
      border-radius: 12px !important;\
      padding: 16px !important;\
      margin-bottom: 12px !important;\
      background: linear-gradient(to left, #EFFAF8, white, #EFFAF8) !important;\
      transition: all 0.2s !important;\
    }\
    .payment_card_name {\
      font-weight: 700 !important;\
      font-size: 15px !important;\
      color: #0F5E55 !important;\
    }\
    .payment_card_description {\
      font-size: 13px !important;\
      color: #3F8C81 !important;\
      margin-top: 2px !important;\
    }\
    .radio_container {\
      width: 22px !important;\
      height: 22px !important;\
      border-radius: 50% !important;\
      border: 2px solid #A8DDD4 !important;\
      display: flex !important;\
      align-items: center !important;\
      justify-content: center !important;\
      flex-shrink: 0 !important;\
    }\
    .radio_circle {\
      width: 12px !important;\
      height: 12px !important;\
      border-radius: 50% !important;\
      background: #d1d5db !important;\
    }\
    .radio_circle[class*="bg-blue"] {\
      background: #0F8478 !important;\
    }\
    .payment_card[class*="border-blue-600"] {\
      border-color: #0F8478 !important;\
    }\
    \
    /* --- Cart items --- */\
    .checkout_cart_items_container {\
      border: 1px solid #A8DDD4 !important;\
      border-radius: 12px !important;\
      overflow: hidden !important;\
      margin: 16px 0 !important;\
    }\
    .cart-item {\
      padding: 16px !important;\
      border-bottom: 1px solid #EFFAF8 !important;\
    }\
    .cart-item:last-child {\
      border-bottom: none !important;\
    }\
    .cart-item h3[data-cart="item-name"] {\
      font-weight: 700 !important;\
      font-size: 14px !important;\
      color: #0F5E55 !important;\
    }\
    .cart-item [data-cart="item-price"] {\
      font-weight: 700 !important;\
      color: #0F5E55 !important;\
    }\
    \
    /* --- Quantity counter --- */\
    .cart-item-quantity-counter {\
      background: rgba(15, 132, 120, 0.05) !important;\
      border: 1px solid rgba(15, 132, 120, 0.2) !important;\
      border-radius: 10px !important;\
      padding: 4px !important;\
    }\
    .cart-item-quantity-counter button {\
      border-radius: 8px !important;\
      width: 32px !important;\
      height: 32px !important;\
    }\
    \
    /* --- Invoice section --- */\
    [data-invoice="invoice"] {\
      background: #EFFAF8 !important;\
      border: 1px solid #A8DDD4 !important;\
      border-radius: 12px !important;\
      padding: 16px !important;\
      margin-top: 16px !important;\
    }\
    [data-invoice="invoice-subtotal"],\
    [data-invoice="invoice-shipping"],\
    [data-invoice="invoice-total"] {\
      display: flex !important;\
      justify-content: space-between !important;\
      padding: 8px 0 !important;\
    }\
    [data-invoice="invoice-total"] {\
      border-top: 2px solid #0F8478 !important;\
      margin-top: 8px !important;\
    }\
    [data-invoice="invoice-total-value"] {\
      font-size: 18px !important;\
      font-weight: 800 !important;\
      color: #0F5E55 !important;\
    }\
    \
    /* --- Submit button --- */\
    .checkout_buy_now {\
      border-radius: 12px !important;\
      font-size: 16px !important;\
      font-weight: 700 !important;\
      padding: 14px 24px !important;\
      background: #0F8478 !important;\
      color: #fff !important;\
      border: none !important;\
    }\
    \
    /* --- Fixed bottom bar --- */\
    .fixed.bottom-0 {\
      background: #fff !important;\
      border-top: 1px solid #A8DDD4 !important;\
      padding: 12px 16px !important;\
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;\
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08) !important;\
    }\
    \
    /* --- Summary heading --- */\
    #summary-heading {\
      display: none !important;\
    }\
    \
    /* --- Payment content (InstaPay/Wallet) --- */\
    .akkad-payment-content {\
      margin-top: 12px;\
      padding-top: 12px;\
      border-top: 1px dashed #A8DDD4;\
    }\
    .akkad-payment-box {\
      display: none;\
      flex-direction: column;\
      gap: 12px;\
      margin-top: 12px;\
    }\
    .akkad-payment-box.show {\
      display: flex;\
    }\
    .akkad-option {\
      border-radius: 12px;\
      padding: 16px;\
      border: 1px solid;\
    }\
    .akkad-option-title {\
      font-size: 15px;\
      font-weight: 700;\
      margin-bottom: 10px;\
    }\
    .akkad-instapay {\
      border-color: #ede9fe;\
      background: #faf7ff;\
    }\
    .akkad-instapay .akkad-option-title { color: #4c1d95; }\
    .akkad-wallet {\
      border-color: #dbeafe;\
      background: #f8fbff;\
    }\
    .akkad-wallet .akkad-option-title { color: #1d4ed8; }\
    .akkad-btn {\
      display: inline-flex;\
      align-items: center;\
      justify-content: center;\
      padding: 12px 20px;\
      background: #6d28d9;\
      color: #fff;\
      text-decoration: none;\
      border-radius: 10px;\
      font-weight: 700;\
      font-size: 15px;\
    }\
    .akkad-wallet-row {\
      display: flex;\
      align-items: center;\
      justify-content: space-between;\
      gap: 10px;\
    }\
    .akkad-wallet-num {\
      background: #fff;\
      border: 1px dashed #93c5fd;\
      padding: 12px 16px;\
      border-radius: 10px;\
      font-size: 20px;\
      font-weight: 700;\
      color: #111;\
    }\
    .akkad-copy-btn {\
      border: none;\
      background: #2563eb;\
      color: #fff;\
      padding: 12px 18px;\
      border-radius: 10px;\
      font-weight: 700;\
      cursor: pointer;\
    }\
    \
    /* --- Mobile --- */\
    @media (max-width: 480px) {\
      .akkad-option { padding: 12px; }\
      .akkad-btn { width: 100%; padding: 14px; font-size: 16px; }\
      .akkad-wallet-row { flex-direction: column; }\
      .akkad-wallet-num { width: 100%; text-align: center; font-size: 18px; }\
      .akkad-copy-btn { width: 100%; padding: 14px; font-size: 16px; }\
    }\
    @media (max-width: 1024px) {\
      .checkout_order_summary { margin-bottom: 140px; }\
    }\
    \
    /* --- Governor dropdown --- */\
    .select__control {\
      border: 2px solid #A8DDD4 !important;\
      border-radius: 12px !important;\
    }\
  ';
  document.head.appendChild(style);

  // Wait for DOM and retry until elements exist
  function waitForElement(selector, callback, maxRetries) {
    maxRetries = maxRetries || 30;
    var attempts = 0;
    var interval = setInterval(function() {
      var el = document.querySelector(selector);
      attempts++;
      if (el) {
        clearInterval(interval);
        callback(el);
      } else if (attempts >= maxRetries) {
        clearInterval(interval);
      }
    }, 200);
  }

  // === PAYMENT FIX ===
  function fixPayments() {
    var cards = document.querySelectorAll('.payment_card');
    if (cards.length < 2) return;

    var cod = cards[0];
    var electronic = cards[1];

    // Check if payment content already injected
    if (document.querySelector('.akkad-payment-content')) return;

    // Inject payment content
    var content = document.createElement('div');
    content.className = 'akkad-payment-content';
    content.innerHTML = '\
      <div class="akkad-payment-box" id="akkad-elec-box">\
        <div class="akkad-option akkad-instapay">\
          <div class="akkad-option-title">💜 الدفع عبر InstaPay</div>\
          <a href="https://ipn.eg/S/akkad.one/instapay/3yzMRQ" target="_blank" class="akkad-btn">فتح رابط الدفع</a>\
        </div>\
        <div class="akkad-option akkad-wallet">\
          <div class="akkad-option-title">📱 الدفع عبر محفظة الكاش</div>\
          <div class="akkad-wallet-row">\
            <div class="akkad-wallet-num">01508331823</div>\
            <button class="akkad-copy-btn" onclick="navigator.clipboard.writeText(\'01508331823\');this.textContent=\'✔ تم النسخ\';setTimeout(function(){this.textContent=\'نسخ الرقم\';}.bind(this),2000)">نسخ الرقم</button>\
          </div>\
        </div>\
      </div>';
    electronic.appendChild(content);

    // Fix toggle: use event delegation
    electronic.addEventListener('click', function(e) {
      if (e.target.closest('.akkad-payment-content')) return;
      var box = document.getElementById('akkad-elec-box');
      if (box) box.classList.add('show');
    }, true);

    cod.addEventListener('click', function(e) {
      var box = document.getElementById('akkad-elec-box');
      if (box) box.classList.remove('show');
    }, true);
  }

  // === HIDE SENDER NUMBER TEXT ===
  function hideSenderNumber() {
    var buttons = document.querySelectorAll('.payment_card');
    buttons.forEach(function(card) {
      if (card.textContent.includes('رقم او حساب المرسل')) {
        card.style.display = 'none';
      }
    });
  }

  // === INITIALIZE ===
  function init() {
    fixPayments();
    hideSenderNumber();
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 300);
      setTimeout(init, 1000);
      setTimeout(init, 2000);
    });
  } else {
    setTimeout(init, 300);
    setTimeout(init, 1000);
    setTimeout(init, 2000);
  }

  // Also retry on mutations
  new MutationObserver(function() {
    if (!document.querySelector('.akkad-payment-content')) {
      init();
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
