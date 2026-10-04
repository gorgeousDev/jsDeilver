/**
 * Checkout Restyle Script
 */
(function() {
  'use strict';

  var style = document.createElement('style');
  style.id = 'akkad-checkout-style';

  style.textContent = [
    /* ---------- palette: light by default, plum ramp under akkad-dark ---------- */
    ':root{--co-page:#ffffff;--co-panel:#f8fafc;--co-raised:#ffffff;--co-sunken:#f7eff1;--co-line:#e6d9ea;--co-line-strong:#A34054;--co-ink:#241a2b;--co-ink-2:#5d4a63;--co-ink-3:#7b6a80;--co-accent:#A34054;--co-accent-2:#7C2E58;--co-on-accent:#ffffff;--co-bright:#A34054;--co-bright-2:#FFD9A0;--co-soft:rgba(163,64,84,.08);--co-soft-2:rgba(163,64,84,.18);--co-ring:rgba(163,64,84,.14);--co-shadow:0 4px 15px rgba(36,26,43,.10);--co-grad:linear-gradient(135deg,#fdf7f9,#f7eef1);--co-row:rgba(163,64,84,.04);--co-bar:#ffffff;--co-bar-line:#e6d9ea;--co-bar-shadow:0 -4px 12px rgba(36,26,43,.10);--co-warn-bg:#fef2f2;--co-warn-line:#fca5a5;--co-warn-btn:#fee2e2;--co-warn-ink:#b91c1c}',
    'html.akkad-dark{--co-page:#1B1931;--co-panel:#44174E;--co-raised:#662249;--co-sunken:#3a1445;--co-line:#5C2151;--co-line-strong:#AB8B90;--co-ink:#E9BCB9;--co-ink-2:#CAA4A5;--co-ink-3:#AB8B90;--co-accent:#A34054;--co-accent-2:#7C2E58;--co-on-accent:#ffffff;--co-bright:#ED9E59;--co-bright-2:#FFD9A0;--co-soft:rgba(163,64,84,.22);--co-soft-2:rgba(237,158,89,.20);--co-ring:rgba(237,158,89,.22);--co-shadow:0 4px 15px rgba(0,0,0,.35);--co-grad:linear-gradient(135deg,#3d1747,#662249);--co-row:rgba(233,188,185,.07);--co-bar:#662249;--co-bar-line:#5C2151;--co-bar-shadow:0 -4px 12px rgba(0,0,0,.45);--co-warn-bg:rgba(163,64,84,.22);--co-warn-line:#A34054;--co-warn-btn:rgba(163,64,84,.40);--co-warn-ink:#ED9E59}',

    /* keep sale labels out of the checkout only — this script is loaded
       site-wide, so an unscoped rule here hides them on every page */
    '.checkout_container .akkad-sale-tag, .checkout_order_summary .akkad-sale-tag, .akkad-sale-badge { display: none !important; }',
    '[data-cart="item-name"] { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; text-overflow: ellipsis !important; max-height: 2.8em !important; line-height: 1.4 !important; }',
    '.checkout_container { grid-template-columns: 1fr !important; padding: 0 16px !important; }',
    '.checkout_order_summary { order: 2 !important; background: var(--co-panel) !important; border: 2px solid var(--co-line) !important; border-radius: 16px !important; padding: 24px !important; margin-top: 16px !important; margin-bottom: 120px !important; color: var(--co-ink) !important; }',
    '.checkout_form { order: 1 !important; padding-top: 20px !important; }',
    '.checkout_bg_right, .checkout_bg_left { display: none !important; }',
    '.bg-white { background: #f8fafc !important; }',
    '#summary-heading { display: none !important; }',

    '#contact-info-heading { display: flex !important; align-items: center !important; gap: 10px !important; font-size: 16px !important; font-weight: 800 !important; color: var(--co-bright) !important; margin-bottom: 16px !important; padding-bottom: 12px !important; border-bottom: 2px solid var(--co-accent) !important; }',
    '#contact-info-heading::before { content: "1" !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 28px !important; height: 28px !important; border-radius: 50% !important; background: var(--co-accent) !important; color: var(--co-on-accent) !important; font-size: 14px !important; font-weight: 700 !important; flex-shrink: 0 !important; }',
    '.payments_container > span:first-child { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 16px !important; font-weight: 800 !important; color: var(--co-bright) !important; margin-bottom: 16px !important; }',
    '.payments_container > span:first-child::before { content: "2" !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 28px !important; height: 28px !important; border-radius: 50% !important; background: var(--co-accent) !important; color: var(--co-on-accent) !important; font-size: 14px !important; font-weight: 700 !important; }',

    '.global_input, .global_textarea { border: 2px solid var(--co-line-strong) !important; border-radius: 12px !important; padding: 12px 16px !important; font-size: 15px !important; background: var(--co-raised) !important; color: var(--co-ink) !important; }',
    '.global_input:focus, .global_textarea:focus { border-color: var(--co-bright) !important; box-shadow: 0 0 0 3px var(--co-ring) !important; background: var(--co-raised) !important; outline: none !important; }',
    '.global_input::placeholder, .global_textarea::placeholder { color: var(--co-ink-3) !important; opacity: 1 !important; }',
    '.checkout_form label { font-weight: 700 !important; font-size: 14px !important; color: var(--co-ink) !important; margin-bottom: 6px !important; }',

    /* dark mode maps the theme's gray utilities to --co-ink-3 (#AB8B90),
       which is 4.95:1 on the panel but only 3.61:1 on the raised surface the
       payment cards and cart rows sit on. Re-assert the ink scale inside the
       checkout, scoped one level deeper so it wins that tie. */
    'html.akkad-dark .checkout_container .text-gray-400,',
    'html.akkad-dark .checkout_container .text-gray-500,',
    'html.akkad-dark .checkout_container .text-gray-600,',
    'html.akkad-dark .checkout_container .cart-item p{ color: var(--co-ink) !important; }',
    'html.akkad-dark .checkout_container .payment_card_description{ color: var(--co-ink-2) !important; }',
    'html.akkad-dark .checkout_container .payment_card_name{ color: var(--co-ink) !important; }',
    'html.akkad-dark .checkout_container .cart-item [data-cart="item-price"],',
    'html.akkad-dark .checkout_container .cart-item [data-cart="item-price"] span{ color: var(--co-bright) !important; }',

    /* dark mode also maps the theme's border-gray utilities to --co-line, which
       drops control boundaries to 1.46:1 — an input you cannot see. Re-assert
       the stronger line one level deeper for every control that needs a visible
       edge (WCAG 1.4.11 wants 3:1 against the control's own surface). */
    'html.akkad-dark .checkout_container .global_input,',
    'html.akkad-dark .checkout_container .global_textarea,',
    'html.akkad-dark .checkout_container .payment_card,',
    'html.akkad-dark .checkout_container .select__control,',
    'html.akkad-dark .checkout_container .checkout_cart_items_container,',
    'html.akkad-dark .checkout_container .fixed.bottom-0{ border-color: var(--co-line-strong) !important; }',

    '.payment_card { border: 2px solid var(--co-line-strong) !important; border-radius: 12px !important; padding: 16px !important; margin-bottom: 12px !important; background: var(--co-raised) !important; color: var(--co-ink) !important; transition: all 0.2s !important; }',
    '.payment_card:has(input:checked) { border-color: var(--co-bright) !important; background: var(--co-soft) !important; }',
    '.payment_card_name { font-weight: 700 !important; font-size: 15px !important; color: var(--co-ink) !important; }',
    '.payment_card_description { font-size: 13px !important; color: var(--co-ink-2) !important; margin-top: 2px !important; }',
    '.radio_container { width: 22px !important; height: 22px !important; border-radius: 50% !important; border: 2px solid var(--co-line-strong) !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }',
    '.radio_circle { width: 12px !important; height: 12px !important; border-radius: 50% !important; background: var(--co-line-strong) !important; }',
    '.radio_circle[class*="bg-blue"] { background: var(--co-accent) !important; }',
    '.payment_card[class*="border-blue-600"] { border-color: var(--co-bright) !important; }',

    '.checkout_cart_items_container { border: 1px solid var(--co-line-strong) !important; border-radius: 12px !important; overflow: hidden !important; margin: 16px 0 !important; }',
    '.cart-item { padding: 16px !important; border-bottom: 1px solid var(--co-line) !important; background: var(--co-raised) !important; color: var(--co-ink) !important; }',
    '.cart-item:last-child { border-bottom: none !important; }',
    '.cart-item h3[data-cart="item-name"] { font-weight: 700 !important; font-size: 14px !important; color: var(--co-ink) !important; }',
    '.cart-item [data-cart="item-price"] { font-weight: 700 !important; color: var(--co-bright) !important; }',
    '.cart-item-quantity-counter { background: var(--co-soft) !important; border: 1px solid var(--co-soft-2) !important; border-radius: 10px !important; padding: 4px !important; }',
    '.cart-item-quantity-counter button { border-radius: 8px !important; width: 32px !important; height: 32px !important; }',

    '[data-invoice="invoice"] { background: var(--co-sunken) !important; border: 1px solid var(--co-line) !important; border-radius: 12px !important; padding: 16px !important; margin-top: 16px !important; color: var(--co-ink) !important; }',
    '[data-invoice="invoice-subtotal"], [data-invoice="invoice-shipping"], [data-invoice="invoice-total"] { display: flex !important; justify-content: space-between !important; padding: 8px 0 !important; }',
    '[data-invoice="invoice-total"] { border-top: 2px solid var(--co-accent) !important; margin-top: 8px !important; }',
    '[data-invoice="invoice-total-value"] { font-size: 18px !important; font-weight: 800 !important; color: var(--co-bright) !important; }',

    '.checkout_buy_now { border-radius: 12px !important; font-size: 16px !important; font-weight: 700 !important; padding: 14px 24px !important; background: var(--co-accent) !important; color: var(--co-on-accent) !important; border: none !important; }',
    '.checkout_buy_now:hover { background: var(--co-accent-2) !important; }',
    '.fixed.bottom-0 { background: var(--co-bar) !important; color: var(--co-ink) !important; border-top: 1px solid var(--co-line-strong) !important; padding: 12px 16px !important; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important; box-shadow: var(--co-bar-shadow) !important; }',
    '.select__control { border: 2px solid var(--co-line-strong) !important; border-radius: 12px !important; background: var(--co-raised) !important; color: var(--co-ink) !important; }',
    '.select__menu { background: var(--co-raised) !important; color: var(--co-ink) !important; border: 1px solid var(--co-line) !important; }',
    '.select__menu-item { color: var(--co-ink) !important; }',
    '.select__menu-item.is-selected, .select__menu-item.is-focused { background: var(--co-accent) !important; color: var(--co-on-accent) !important; }',
    '.select__value, .select__label, .select__input { color: var(--co-ink) !important; }',
    '.select__indicator { color: var(--co-ink-2) !important; }',

    '.payment_card_content { display: flex !important; flex-direction: column !important; }',

    '.akkad-elec-box { display: none; margin-top: 10px; }',
    '.akkad-elec-box.show { display: flex !important; flex-direction: column !important; gap: 10px; }',
    '.akkad-elec-box a { display: block; padding: 10px 14px; background: var(--co-accent); color: var(--co-on-accent); text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; }',
    '.akkad-elec-box a:hover { background: var(--co-accent-2); }',
    '.akkad-elec-box .akkad-num-wrap { background: var(--co-sunken); border: 1px dashed var(--co-line-strong); border-radius: 8px; padding: 12px; }',
    '.akkad-elec-box .akkad-num-label { font-size: 13px; font-weight: 700; color: var(--co-bright); margin-bottom: 8px; }',
    '.akkad-elec-box .akkad-num { display: flex; align-items: center; justify-content: space-between; background: var(--co-raised); border: 1px solid var(--co-line-strong); border-radius: 6px; padding: 10px 12px; }',
    '.akkad-elec-box .akkad-num span { font-size: 16px; font-weight: 700; color: var(--co-ink); direction: ltr; }',
    '.akkad-elec-box .akkad-num button { border: none; background: var(--co-accent); color: var(--co-on-accent); padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; }',
    '.akkad-elec-box .akkad-num button:hover { background: var(--co-accent-2); }',

    '.akkad-invoice { direction: rtl; width: 100%; background: var(--co-grad); border: 2px solid var(--co-line-strong); border-radius: 12px; padding: 14px; font-family: Tajawal, sans-serif; color: var(--co-ink); box-shadow: var(--co-shadow); margin-bottom: 16px; }',
    '.akkad-invoice-header { border-bottom: 2px solid var(--co-accent); padding-bottom: 14px; margin-bottom: 14px; }',
    '.akkad-invoice-brand { text-align: center; margin-bottom: 10px; }',
    '.akkad-invoice-brand h2 { font-size: 18px; font-weight: 900; color: var(--co-ink); margin: 0; }',
    '.akkad-invoice-brand h2 span { color: var(--co-bright); }',
    '.akkad-invoice-brand p { font-size: 11px; font-weight: 600; color: var(--co-ink-2); margin: 4px 0 0 0; }',
    '.akkad-invoice-meta { text-align: right !important; font-size: 12px !important; line-height: 1.8 !important; }',
    '.akkad-invoice-meta p { margin: 0 !important; }',
    '.akkad-invoice-meta-label { font-weight: 700 !important; font-size: 14px !important; }',
    '.akkad-invoice-customer { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; font-size: 11px; }',
    '.akkad-invoice-customer-info { display: flex; flex-direction: column; gap: 3px; }',
    '.akkad-invoice-customer-info span { font-weight: 700; }',
    '.akkad-invoice-customer-count { text-align: left; }',
    '.akkad-invoice-table-wrapper { border-radius: 10px; overflow: hidden; border: 1px solid var(--co-line); }',
    '.akkad-invoice-table { width: 100%; border-collapse: collapse; font-size: 12px; }',
    '.akkad-invoice-table thead tr { background: var(--co-accent-2); color: var(--co-on-accent); }',
    '.akkad-invoice-table th { border: 1px solid var(--co-accent-2); padding: 10px 4px; text-align: center; font-weight: 700; }',
    '.akkad-invoice-table td { border: 1px solid var(--co-line); padding: 10px 6px; text-align: center; }',
    '.akkad-invoice-table td:nth-child(2) { text-align: right; font-weight: 600; font-size: 11px; }',
    '.akkad-invoice-table tbody tr:nth-child(odd) { background: var(--co-row); }',
    '.akkad-invoice-table tfoot tr { background: var(--co-accent-2); color: var(--co-on-accent); }',
    '.akkad-invoice-table tfoot td { border: 1px solid var(--co-accent-2); padding: 10px 6px; font-weight: 900; }',
    '.akkad-invoice-table tfoot td:last-child { font-size: 13px; color: var(--co-bright-2); }',
    '.akkad-invoice-table .item-total { font-weight: 700; color: var(--co-ink); }',
    '.akkad-invoice-footer-msg { margin-top: 14px; border-radius: 10px; overflow: hidden; border: 1px solid var(--co-line); }',
    '.akkad-invoice-footer-msg-top { background: var(--co-accent-2); color: var(--co-on-accent); text-align: center; padding: 10px 14px; }',
    '.akkad-invoice-footer-msg-top p { font-weight: 900; font-size: 12px; margin: 0; }',
    '.akkad-invoice-footer-msg-top span { color: var(--co-bright-2); }',
    '.akkad-invoice-row { display: flex !important; justify-content: space-between !important; padding: 6px 0 !important; font-size: 12px !important; }',
    '.akkad-invoice-row span:first-child { font-weight: 700 !important; color: var(--co-ink-2) !important; }',
    '.akkad-invoice-discount span:last-child { color: var(--co-warn-ink) !important; font-weight: 800 !important; }',
    '.akkad-invoice-shipping span:last-child { color: var(--co-ink) !important; font-weight: 700 !important; }',
    '.akkad-invoice-total-row { display: flex !important; justify-content: space-between !important; padding: 10px 0 0 0 !important; margin-top: 6px !important; border-top: 2px solid var(--co-accent) !important; }',
    '.akkad-invoice-total-row span:first-child { font-weight: 800 !important; font-size: 14px !important; color: var(--co-ink-2) !important; }',
    '.akkad-invoice-total-row span:last-child { font-weight: 900 !important; font-size: 16px !important; color: var(--co-bright) !important; }',

    '.mt-2.flex.items-end.justify-between { background: var(--co-sunken) !important; border: 1.5px solid var(--co-line-strong) !important; border-radius: 12px !important; padding: 14px 16px !important; margin-top: 14px !important; display: flex !important; align-items: flex-end !important; gap: 12px !important; color: var(--co-ink) !important; }',
    '.mt-2.flex.items-end.justify-between label { font-weight: 700 !important; font-size: 14px !important; color: var(--co-ink) !important; margin-bottom: 6px !important; }',
    '.mt-2.flex.items-end.justify-between .relative { flex: 1 !important; }',
    '.mt-2.flex.items-end.justify-between .global_input { border: 2px solid var(--co-line-strong) !important; border-radius: 10px !important; padding: 10px 14px !important; font-size: 14px !important; height: 42px !important; background: var(--co-raised) !important; color: var(--co-ink) !important; }',
    '.mt-2.flex.items-end.justify-between .global_input:focus { border-color: var(--co-bright) !important; box-shadow: 0 0 0 3px var(--co-ring) !important; outline: none !important; }',
    '.mt-2.flex.items-end.justify-between button { background: var(--co-accent) !important; color: var(--co-on-accent) !important; border: none !important; border-radius: 10px !important; padding: 10px 24px !important; font-weight: 700 !important; font-size: 14px !important; white-space: nowrap !important; height: 42px !important; transition: all 0.2s !important; cursor: pointer !important; }',
    '.mt-2.flex.items-end.justify-between button:hover { background: var(--co-accent-2) !important; transform: scale(1.02) !important; }',

    '.mt-2.flex.items-center.justify-between { background: var(--co-warn-bg) !important; border: 1.5px solid var(--co-warn-line) !important; border-radius: 12px !important; padding: 14px 16px !important; margin-top: 14px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; }',
    '.mt-2.flex.items-center.justify-between p { font-weight: 700 !important; font-size: 15px !important; color: var(--co-ink) !important; margin: 0 !important; display: flex !important; align-items: center !important; gap: 6px !important; }',
    '.mt-2.flex.items-center.justify-between p::before { content: "\u{1F3F7}" !important; font-size: 14px !important; }',
    '.mt-2.flex.items-center.justify-between button { background: var(--co-warn-btn) !important; border: 1.5px solid var(--co-warn-line) !important; color: var(--co-warn-ink) !important; border-radius: 8px !important; padding: 8px 16px !important; font-weight: 700 !important; font-size: 13px !important; transition: all 0.2s !important; cursor: pointer !important; }',
    '.mt-2.flex.items-center.justify-between button:hover { background: var(--co-accent) !important; border-color: var(--co-accent) !important; color: var(--co-on-accent) !important; transform: scale(1.02) !important; }',
    '.checkout_container button.flex.items-center.justify-center.gap-2:not(.checkout_buy_now):not(.cart-item-quantity-counter button) { border: 1.5px solid var(--co-line-strong) !important; background: var(--co-sunken) !important; color: var(--co-ink) !important; border-radius: 8px !important; padding: 8px 16px !important; font-weight: 700 !important; font-size: 13px !important; cursor: pointer !important; transition: all 0.2s !important; }',
    '.checkout_container button.flex.items-center.justify-center.gap-2:not(.checkout_buy_now):not(.cart-item-quantity-counter button):hover { background: var(--co-accent) !important; border-color: var(--co-accent) !important; color: var(--co-on-accent) !important; }',

    '@media (max-width: 1024px) { .checkout_order_summary { margin-bottom: 140px; } }',
    '@media (min-width: 1024px) { .checkout_container { grid-template-columns: 1fr 1fr !important; gap: 40px !important; max-width: 1100px !important; padding: 0 40px !important; } .checkout_form { order: 1 !important; padding-top: 30px !important; } .checkout_order_summary { order: 2 !important; position: sticky !important; top: 90px !important; align-self: start !important; padding: 28px !important; margin-bottom: 0 !important; } .akkad-invoice { padding: 20px !important; } .akkad-invoice-brand h2 { font-size: 22px !important; } .akkad-invoice-table { font-size: 13px !important; } .akkad-invoice-table th { padding: 12px 8px !important; } .akkad-invoice-table td { padding: 12px 10px !important; } .akkad-invoice-customer { font-size: 12px !important; } .akkad-invoice-total-row span:first-child { font-size: 16px !important; } .akkad-invoice-total-row span:last-child { font-size: 20px !important; } }',
    '@media (max-width: 480px) { .akkad-invoice-table { font-size: 10px; } .akkad-invoice-table th, .akkad-invoice-table td { padding: 8px 2px; } .akkad-invoice-table td:nth-child(4), .akkad-invoice-table th:nth-child(4) { display: none; } .akkad-invoice-table td:nth-child(5), .akkad-invoice-table th:nth-child(5) { display: none; } }'
  ].join('\n');

  document.head.appendChild(style);

  if (!window.location.pathname.includes('checkout')) {
    var checkoutCheck = setInterval(function() {
      if (window.location.pathname.includes('checkout')) {
        clearInterval(checkoutCheck);
        setTimeout(run, 100);
        setTimeout(run, 500);
        setTimeout(run, 1500);
      }
    }, 500);
    new MutationObserver(scheduleRun).observe(document.body, { childList: true, subtree: true });
    return;
  }

  var runScheduled = false;

  function scheduleRun() {
    if (runScheduled) return;
    runScheduled = true;
    setTimeout(function() {
      runScheduled = false;
      run();
    }, 250);
  }

  function run() {
    fixPayments();
    injectInvoice();
    fixInputs();
    listenSubmit();
  }

  function listenSubmit() {
    var btn = document.querySelector('.checkout_buy_now');
    if (!btn || btn._akkadListen) return;
    btn._akkadListen = true;
    btn.addEventListener('click', function() {
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      var name = document.querySelector('[name="full_name"]');
      var phone = document.querySelector('[name="phone"]');
      if (name && !name.value.trim()) return;
      if (phone && !phone.value.trim()) return;
      saveInvoiceCounter();
    });
  }

  function fixPayments() {
    var cards = document.querySelectorAll('.payment_card');
    if (cards.length < 2) return;
    if (document.querySelector('.akkad-elec-box')) return;

    var electronic = cards[1];
    var content = electronic.querySelector('.payment_card_content');
    if (!content) return;

    var box = document.createElement('div');
    box.className = 'akkad-elec-box';
    box.id = 'akkad-elec-box';
    box.innerHTML =
      '<a href="https://ipn.eg/S/akkad.one/instapay/3yzMRQ" target="_blank">💜 فتح رابط InstaPay</a>' +
      '<div class="akkad-num-wrap">' +
        '<div class="akkad-num-label">📱 محفظة الكاش</div>' +
        '<div class="akkad-num">' +
          '<span>01508331823</span>' +
          '<button onclick="navigator.clipboard.writeText(\'01508331823\');this.textContent=\'✔ تم\';var b=this;setTimeout(function(){b.textContent=\'نسخ\';},2000)">نسخ</button>' +
        '</div>' +
      '</div>';

    var imgContainer = content.querySelector('.payment_card_img_container');
    if (imgContainer && imgContainer.nextSibling) {
      content.insertBefore(box, imgContainer.nextSibling);
    } else {
      content.appendChild(box);
    }

    electronic.addEventListener('click', function(e) {
      if (e.target.closest('.akkad-elec-box')) return;
      box.classList.add('show');
    }, true);

    cards[0].addEventListener('click', function() {
      box.classList.remove('show');
    }, true);
  }


  var currentCounter = null;

  function getInvoiceNumber() {
    var now = new Date();
    var yy = String(now.getFullYear()).slice(-2);
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var dd = String(now.getDate()).padStart(2, '0');
    var dateKey = yy + mm + dd;

    var counter = parseInt(localStorage.getItem('akkad_invoice_counter')) || 1198;
    currentCounter = counter;

    return 'akd-' + dateKey + '-' + String(counter).padStart(4, '0');
  }

  function saveInvoiceCounter() {
    if (currentCounter !== null) {
      localStorage.setItem('akkad_invoice_counter', currentCounter + 1);
    }
  }

  function injectInvoice() {
    var summary = document.querySelector('.checkout_order_summary');
    if (!summary || document.querySelector('.akkad-invoice')) return;

    var invoice = document.createElement('div');
    invoice.className = 'akkad-invoice';
    invoice.innerHTML =
      '<div class="akkad-invoice-header">' +
        '<div class="akkad-invoice-brand">' +
          '<h2><span>أكاد</span></h2>' +
          '<p>أفضل عروض الأدوات المنزلية والعطور والأجهزة</p>' +
        '</div>' +
        '<div class="akkad-invoice-meta">' +
          '<p class="akkad-invoice-meta-label">رقم الطلب: ' + getInvoiceNumber() + '</p>' +
          '<p class="akkad-invoice-meta-label">التاريخ: ' + new Date().toLocaleDateString('ar-EG', {day:'2-digit',month:'2-digit',year:'numeric'}) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="akkad-invoice-customer">' +
        '<div class="akkad-invoice-customer-info">' +
          '<div><span>العميل: </span><span class="inv-name">— غير محدد —</span></div>' +
          '<div><span>رقم العميل: </span><span class="inv-phone" dir="ltr">— غير محدد —</span></div>' +
        '</div>' +
        '<div class="akkad-invoice-customer-count">' +
          '<span>إجمالي القطع: </span><span class="inv-count">0</span>' +
        '</div>' +
      '</div>' +
      '<div class="akkad-invoice-table-wrapper">' +
        '<table class="akkad-invoice-table">' +
          '<thead><tr><th>م</th><th>الصنف</th><th>العدد</th><th>السعر</th><th>الإجمالي</th></tr></thead>' +
          '<tbody class="inv-tbody"></tbody>' +
          '<tfoot><tr><td colspan="5">الإجمالي الكلي</td></tr></tfoot>' +
        '</table>' +
      '</div>' +
      '<div class="akkad-invoice-discount" style="display:none">' +
        '<div class="akkad-invoice-row"><span>خصم الكوبون</span><span class="inv-discount-val">0 ج</span></div>' +
      '</div>' +
      '<div class="akkad-invoice-shipping">' +
        '<div class="akkad-invoice-row"><span>الشحن</span><span class="inv-shipping-val">0 ج</span></div>' +
      '</div>' +
      '<div class="akkad-invoice-total-row">' +
        '<span>الإجمالي النهائي</span><span class="inv-grand">0 ج</span>' +
      '</div>' +
      '<div class="akkad-invoice-footer-msg">' +
        '<div class="akkad-invoice-footer-msg-top">' +
          '<p>شكرًا لثقتكم في <span>أكاد</span> — نتشرف بخدمتكم دائمًا</p>' +
        '</div>' +
      '</div>';

    summary.prepend(invoice);

    function update() {
      var nameInput = document.querySelector('[name="full_name"]');
      var phoneInput = document.querySelector('[name="phone"]');
      var items = document.querySelectorAll('.cart-item');
      var tbody = invoice.querySelector('.inv-tbody');

      invoice.querySelector('.inv-name').textContent = (nameInput && nameInput.value) || '— غير محدد —';
      invoice.querySelector('.inv-phone').textContent = (phoneInput && phoneInput.value) || '— غير محدد —';

      var totalCount = 0, grandTotal = 0;
      tbody.innerHTML = '';

      items.forEach(function(item, i) {
        var name = item.querySelector('[data-cart="item-name"]');
        var priceEl = item.querySelector('[data-cart="item-price"]');
        var qtyEl = item.querySelector('[data-cart="item-quantity"]');
        var price = parseInt((priceEl ? priceEl.textContent : '0').replace(/[^0-9]/g, '')) || 0;
        var qty = parseInt(qtyEl ? qtyEl.textContent : '1') || 1;
        var total = price * qty;
        totalCount += qty;
        grandTotal += total;

        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i+1) + '</td><td><div style="font-weight:600;font-size:11px;">' + (name ? name.textContent : '') + '</div></td><td style="font-weight:700;">' + qty + '</td><td>' + price.toLocaleString() + ' ج</td><td class="item-total">' + total.toLocaleString() + ' ج</td>';
        tbody.appendChild(tr);
      });

      invoice.querySelector('.inv-count').textContent = totalCount;

      // Read shipping from EasyOrders original invoice
      var shippingContainer = document.querySelector('[data-invoice="invoice-shipping"]');
      var shipping = 0;
      if (shippingContainer) {
        var shippingDd = shippingContainer.querySelector('dd');
        if (shippingDd) {
          shipping = parseInt(shippingDd.textContent.replace(/[^0-9]/g, '')) || 0;
        }
      }

      // Read discount from coupon container
      var discount = 0;
      var discountContainer = document.querySelector('.mt-2.flex.items-center.justify-between');
      if (discountContainer) {
        var discountP = discountContainer.querySelector('p');
        if (discountP && discountP.textContent.includes('خصم')) {
          discount = parseInt(discountP.textContent.replace(/[^0-9]/g, '')) || 0;
        }
      }

      var discountBox = invoice.querySelector('.akkad-invoice-discount');
      if (discount > 0) {
        discountBox.style.display = 'block';
        discountBox.querySelector('.inv-discount-val').textContent = '-' + discount.toLocaleString() + ' ج';
      } else {
        discountBox.style.display = 'none';
      }

      invoice.querySelector('.inv-shipping-val').textContent = shipping > 0 ? shipping.toLocaleString() + ' ج' : 'مجاني';
      invoice.querySelector('.inv-grand').textContent = (grandTotal - discount + shipping).toLocaleString() + ' ج';
    }

    update();
    if (window.__akkadInvoiceTimer) clearInterval(window.__akkadInvoiceTimer);
    window.__akkadInvoiceTimer = setInterval(function() {
      if (!invoice.isConnected) {
        clearInterval(window.__akkadInvoiceTimer);
        window.__akkadInvoiceTimer = null;
        return;
      }
      update();
    }, 1000);
  }

  function fixInputs() {
    var nameInput = document.querySelector('[name="full_name"]');
    var phoneInput = document.querySelector('[name="phone"]');

    if (nameInput && !nameInput._akkadFixed) {
      nameInput._akkadFixed = true;
      nameInput.addEventListener('input', function() {
        var evt = new Event('input', { bubbles: true });
        nameInput.dispatchEvent(evt);
      });
    }

    if (phoneInput && !phoneInput._akkadFixed) {
      phoneInput._akkadFixed = true;
      phoneInput.addEventListener('input', function() {
        var evt = new Event('input', { bubbles: true });
        phoneInput.dispatchEvent(evt);
      });
    }

    var labels = { full_name: 'الاسم بالكامل', phone: 'رقم الهاتف', address: 'العنوان' };
    Object.keys(labels).forEach(function(name) {
      var el = document.querySelector('[name="' + name + '"]');
      if (!el || el.getAttribute('aria-label')) return;
      var labelled = el.closest('label') ||
        (el.id && document.querySelector('label[for="' + el.id + '"]'));
      if (!labelled) el.setAttribute('aria-label', labels[name]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(run, 300);
      setTimeout(run, 1000);
      setTimeout(run, 2000);
    });
  } else {
    setTimeout(run, 300);
    setTimeout(run, 1000);
    setTimeout(run, 2000);
  }

  new MutationObserver(scheduleRun).observe(document.body, { childList: true, subtree: true });
})();