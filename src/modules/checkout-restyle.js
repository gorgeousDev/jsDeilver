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
    /* WhatsApp order-confirmation reminder: sits as the very first thing the
       reader sees when they arrive at the checkout card */
    '.checkout_container .akkad-wa-reminder { grid-column: 1 / -1 !important; display: flex !important; align-items: center !important; gap: 12px !important; background: linear-gradient(135deg, #128C7E, #075E54) !important; color: #ffffff !important; padding: 13px 16px !important; border-radius: 12px !important; margin-top: 12px !important; margin-bottom: 16px !important; font-weight: 800 !important; font-size: 14px !important; line-height: 1.6 !important; box-shadow: 0 3px 12px rgba(18, 140, 126, .28) !important; }',
    '.checkout_container .akkad-wa-reminder svg { flex: 0 0 auto !important; width: 26px !important; height: 26px !important; }',
    '.checkout_container .akkad-wa-reminder span { flex: 1 1 auto !important; }',
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
    /* the theme marks the selected card by toggling Tailwind classes
       (border-blue-600 on the card, bg-blue-500 on the circle), not by native
       radio inputs, so a :has(input:checked) rule alone would never fire.
       The dark group above (html.akkad-dark .checkout_container .payment_card,
       0,3,1) also beats a bare [class*="border-blue-600"] (0,2,0), which is why
       the selected border collapsed back to --co-line-strong at night. Re-scope
       the selected state one level deeper so it wins that tie. */
    '.payment_card:has(input:checked),',
    '.payment_card[class*="border-blue-600"] { border-color: var(--co-accent-2) !important; background: var(--co-soft) !important; }',
    'html.akkad-dark .checkout_container .payment_card:has(input:checked),',
    'html.akkad-dark .checkout_container .payment_card[class*="border-blue-600"] { border-color: var(--co-bright) !important; background: var(--co-soft) !important; }',
    /* in light the palette maps one plum (#A34054) onto both --co-line-strong
       and --co-bright, so the chosen and idle borders would be identical; the
       deeper accent-2 keeps the selected edge readable next to the idle one. */
    '.payment_card_name { font-weight: 700 !important; font-size: 15px !important; color: var(--co-ink) !important; }',
    '.payment_card_description { font-size: 13px !important; color: var(--co-ink-2) !important; margin-top: 2px !important; }',
    '.radio_container { width: 22px !important; height: 22px !important; border-radius: 50% !important; border: 2px solid var(--co-line-strong) !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }',
    '.radio_circle { width: 12px !important; height: 12px !important; border-radius: 50% !important; background: var(--co-line-strong) !important; }',
    '.radio_circle[class*="bg-blue"] { background: var(--co-accent) !important; }',
    /* dark mode: akkad-dark-mode.js re-maps the theme's bg-gray-200 and
       border-gray-200 utilities (html.akkad-dark .bg-gray-200 = 0,2,1), which
       outrank these bare rules and flattened the ring and dot onto the card
       background. Re-assert them one level deeper so the empty radio is a
       visible beige ring and the chosen state an unmistakable bright dot. */
    'html.akkad-dark .checkout_container .radio_container{ border-color: var(--co-line-strong) !important; }',
    'html.akkad-dark .checkout_container .radio_circle{ background: var(--co-line-strong) !important; }',
    'html.akkad-dark .checkout_container .radio_circle[class*="bg-blue"]{ background: var(--co-bright) !important; }',

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
    /* react-select paints its own divider, which is a hardcoded #ccc in the
       theme and was the last light pixel left anywhere on the page */
    '.select__indicator-separator { background: var(--co-line-strong) !important; opacity: 1 !important; }',

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
    '@media (max-width: 480px) { .akkad-invoice-table { font-size: 11px; } .akkad-invoice-table th, .akkad-invoice-table td { padding: 8px 4px; } .akkad-invoice-table td:nth-child(4), .akkad-invoice-table th:nth-child(4) { display: none; } .akkad-invoice-table td:nth-child(5), .akkad-invoice-table th:nth-child(5) { display: none; } }',

    /* ---------- mobile checkout rework ---------- */
    /* Pin the order button to the viewport bottom on mobile. .checkout_button
       was position:sticky inside .checkout_form, so it only stayed put while
       the form was in view and scrolled away the moment the reader passed it. */
    '@media (max-width: 1024px) { .checkout_button { position: fixed !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 60 !important; width: auto !important; background: var(--co-bar) !important; border-top: 1px solid var(--co-line-strong) !important; box-shadow: var(--co-bar-shadow) !important; padding: 12px 16px !important; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important; } .checkout_container { padding-bottom: 92px !important; } }',
    /* Lift the WhatsApp float clear of the pinned order bar and shrink it a
       touch so it no longer sits on top of the checkout button on mobile. */
    '@media (max-width: 1024px) { html.on-checkout #pky_wa_button { bottom: calc(84px + env(safe-area-inset-bottom, 0px)) !important; right: 16px !important; width: 54px !important; height: 54px !important; } }',
    /* The lower order-summary section duplicates the mobile summary that sits
       right after the client fields. On MOBILE only, hide its toggle + body but
       KEEP them mounted: the injected mobile qty controls forward their clicks
       to the React-owned (+/-/remove) buttons that live inside this hidden
       body. On desktop this lower summary IS the primary one, so it stays. */
    '@media (max-width: 1024px) { #checkout-order-summary-toggle, #checkout-order-summary-content { display: none !important; } }',
    /* Unfold the upper mobile summary by default. React renders it collapsed
       (product list hidden behind the "الاجمالي" total row), which is why the
       injected editable controls were invisible. Force the content open on
       mobile so the products + qty/delete controls show without a tap. */
    '@media (max-width: 1024px) { #checkout-mobile-order-summary-content { display: block !important; max-height: none !important; overflow: visible !important; } }',
    /* Stop horizontal overflow on mobile. The invoice table + WhatsApp reminder
       have wide min-content, and grid/flex children default to min-width:auto
       so they refuse to shrink below it. That pushed the document to 556px on a
       390px viewport: the in-flow header shifted right and the fixed order bar
       (left:0/right:0 relative to the expanded layout viewport) shifted left.
       Make wide children fit, and clip any residual overflow at the container. */
    '@media (max-width: 1024px) { ' +
      '.checkout_container, .checkout_container > *, .checkout_form, .checkout_order_summary { min-width: 0 !important; } ' +
      '.checkout_order_summary { max-width: 100% !important; box-sizing: border-box !important; } ' +
      '.akkad-invoice { max-width: 100% !important; box-sizing: border-box !important; } ' +
      '.akkad-invoice-table { table-layout: auto !important; width: 100% !important; } ' +
      '.akkad-invoice-table td:nth-child(2), .akkad-invoice-table th:nth-child(2) { white-space: normal !important; word-break: break-word !important; } ' +
      '.akkad-invoice-table-wrapper { overflow-x: auto !important; } ' +
      '.akkad-wa-reminder { max-width: 100% !important; box-sizing: border-box !important; white-space: normal !important; overflow-wrap: anywhere !important; } ' +
      '.checkout_container { overflow-x: hidden !important; } ' +
    '}',
    /* Styling for the qty controls injected into each mobile cart row. */
    '.akkad-qty-row { margin-top: 10px !important; }',
    '.akkad-qty-row button { border: 1px solid var(--co-line-strong) !important; background: var(--co-soft) !important; color: var(--co-ink) !important; border-radius: 8px !important; width: 30px !important; height: 30px !important; font-weight: 700 !important; cursor: pointer !important; line-height: 1 !important; }',
    '.akkad-qty-row [data-akkad="val"] { color: var(--co-ink) !important; font-weight: 700 !important; }',
    '.akkad-qty-row [data-akkad="del"] { border: none !important; background: transparent !important; color: #dc2626 !important; width: auto !important; height: auto !important; font-size: 22px !important; padding: 0 4px !important; }',

    /* ---------- /thanks professional success page ---------- */
    '.thanks_container .akkad-thanks-card { direction: rtl !important; width: min(640px, 96%) !important; margin: 0 auto 40px auto !important; background: linear-gradient(180deg, #fffdfe, #fdf5f8) !important; border: 2px solid var(--co-line-strong) !important; border-radius: 24px !important; padding: 28px 24px !important; box-shadow: var(--co-shadow) !important; text-align: center !important; font-family: Tajawal, sans-serif !important; color: var(--co-ink) !important; }',
    'html.akkad-dark .thanks_container .akkad-thanks-card { background: linear-gradient(180deg, #3d1747, #291030) !important; border-color: #5C2151 !important; box-shadow: 0 18px 40px rgba(0,0,0,.45) !important; }',
    '.akkad-thanks-badge { width: 86px !important; height: 86px !important; margin: 0 auto 6px auto !important; border-radius: 50% !important; background: radial-gradient(circle at 30% 25%, #2BD97C, #12a351) !important; box-shadow: 0 10px 24px rgba(18,163,81,.35), inset 0 -6px 12px rgba(0,0,0,.12) !important; display: flex !important; align-items: center !important; justify-content: center !important; position: relative !important; }',
    '.akkad-thanks-badge::after { content: "" !important; position: absolute !important; inset: -10px !important; border-radius: 50% !important; border: 2px solid rgba(18,163,81,.4) !important; animation: akkadPulse 1.8s ease-out infinite !important; }',
    '@keyframes akkadPulse { 0% { transform: scale(.82); opacity: .9; } 100% { transform: scale(1.4); opacity: 0; } }',
    '.akkad-thanks-badge svg { width: 46px !important; height: 46px !important; color: #fff !important; }',
    '.akkad-thanks-title { font-size: 27px !important; font-weight: 900 !important; color: var(--co-ink) !important; margin: 12px 0 4px 0 !important; }',
    '.akkad-thanks-title span { color: var(--co-bright) !important; }',
    '.akkad-thanks-sub { font-size: 15px !important; font-weight: 700 !important; color: var(--co-ink-2) !important; margin: 2px 0 0 0 !important; }',
    '.akkad-thanks-order { display: inline-block !important; margin: 14px auto 0 auto !important; background: var(--co-soft) !important; border: 1px dashed var(--co-line-strong) !important; color: var(--co-ink) !important; border-radius: 999px !important; padding: 7px 18px !important; font-size: 13px !important; font-weight: 800 !important; }',
    '.akkad-thanks-msg { font-size: 13px !important; font-weight: 600 !important; line-height: 1.9 !important; color: var(--co-ink-2) !important; margin: 16px auto 2px auto !important; max-width: 470px !important; }',
    '.akkad-thanks-steps { display: flex !important; gap: 0 !important; justify-content: center !important; margin: 24px 0 6px 0 !important; }',
    '.akkad-thanks-step { flex: 1 !important; position: relative !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 6px !important; }',
    '.akkad-thanks-step + .akkad-thanks-step::before { content: "" !important; position: absolute !important; top: 17px !important; right: -50% !important; width: 100% !important; height: 2px !important; background: var(--co-line) !important; }',
    '.akkad-thanks-step-num { width: 36px !important; height: 36px !important; border-radius: 50% !important; background: var(--co-accent) !important; color: var(--co-on-accent) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 900 !important; font-size: 15px !important; position: relative !important; z-index: 1 !important; box-shadow: 0 4px 10px rgba(163,64,84,.3) !important; }',
    '.akkad-thanks-step b { font-size: 12.5px !important; font-weight: 800 !important; color: var(--co-ink) !important; }',
    '.akkad-thanks-step small { font-size: 10.5px !important; color: var(--co-ink-3) !important; }',
    '.akkad-thanks-divider { height: 1px !important; background: var(--co-line) !important; margin: 22px 0 20px 0 !important; }',
    '.akkad-thanks-wa { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 10px !important; }',
    '.akkad-thanks-wa-icon { width: 52px !important; height: 52px !important; border-radius: 50% !important; background: linear-gradient(135deg, #25D366, #128C7E) !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 8px 18px rgba(18,140,126,.35) !important; }',
    '.akkad-thanks-wa-icon svg { width: 30px !important; height: 30px !important; color: #fff !important; }',
    '.akkad-thanks-wa-before { font-size: 15px !important; font-weight: 800 !important; color: var(--co-ink) !important; margin: 0 !important; }',
    '.akkad-thanks-wa-btn { display: inline-flex !important; align-items: center !important; gap: 8px !important; background: linear-gradient(135deg, #25D366, #075E54) !important; color: #ffffff !important; text-decoration: none !important; border-radius: 999px !important; padding: 13px 46px !important; font-weight: 900 !important; font-size: 17px !important; box-shadow: 0 10px 22px rgba(18,140,126,.4) !important; transition: transform .15s ease !important; }',
    '.akkad-thanks-wa-btn:hover { transform: translateY(-2px) scale(1.02) !important; }',
    '.akkad-thanks-wa-after { font-size: 12.5px !important; font-weight: 700 !important; color: var(--co-ink-2) !important; margin: 0 !important; }',
    '.akkad-thanks-home { display: inline-block !important; margin-top: 24px !important; text-decoration: none !important; border: 2px solid var(--co-line-strong) !important; color: var(--co-bright) !important; font-weight: 800 !important; font-size: 13px !important; border-radius: 999px !important; padding: 10px 32px !important; transition: all .15s ease !important; }',
    '.akkad-thanks-home:hover { background: var(--co-accent) !important; color: var(--co-on-accent) !important; }',
    '@media (max-width: 520px) { .akkad-thanks-steps { flex-direction: column; gap: 12px; } .akkad-thanks-step { flex-direction: row; align-items: center; justify-content: center; gap: 12px; } .akkad-thanks-step + .akkad-thanks-step::before { display: none; } .akkad-thanks-title { font-size: 22px; } .akkad-thanks-card { padding: 24px 16px !important; } .thanks_container .akkad-thanks-card { margin-bottom: 28px !important; } }'
  ].join('\n');

  document.head.appendChild(style);

  /* Route dispatch is deferred until after the definitions below (see the
     routeTick() block after the thanks functions). EasyOrders reaches /thanks
     and /checkout by client-side navigation, so the route can change after
     this file has loaded — dispatching once at parse time (as the old code
     did) is why the thanks card only appeared after a manual reload/new tab. */

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
    /* Self-heal the stylesheet too: if React/head ever drops our <style>, the
       whole restyle silently disappears until a reload. Re-attach it here. */
    if (!document.getElementById('akkad-checkout-style')) {
      document.head.appendChild(style);
    }
    injectReminder();
    fixCheckoutHeader();
    fixPayments();
    injectInvoice();
    fixInputs();
    listenSubmit();
    makeMobileSummaryFunctional();
  }

  /* On /checkout the theme hides the site header (header.fasty_header lives
     inside a wrapper that gets the `hidden` class there, but not on home) and
     renders its own 82px logo header BELOW the site nav strip (#akkad-nav).
     Result: checkout opened with only the nav strip, no real header. Fix =
     drop `hidden` from the site-header wrapper so the same header the rest of
     the site shows appears, and keep hiding the extra theme logo header. */
  function fixCheckoutHeader() {
    if (!window.location.pathname.includes('checkout')) return;
    var headers = document.querySelectorAll('header.sticky.top-0.z-50');
    for (var i = 0; i < headers.length; i++) {
      headers[i].style.display = 'none';
    }
    var siteHeader = document.querySelector('header.fasty_header');
    if (siteHeader) {
      var wrap = siteHeader.closest('div.hidden');
      if (wrap) wrap.classList.remove('hidden');
    }
    document.documentElement.classList.add('on-checkout');
  }

  /* ---------- /thanks professional success page ---------- */
  var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var THANKS_WA_LINK = 'https://wa.me/201508331823?text=' + encodeURIComponent('مرحبا . لقد طلبت من متجركم و اريد التأكيد');

  function buildThanksPage() {
    var container = document.querySelector('.thanks_container') ||
                    document.querySelector('main div.mt-20') ||
                    document.querySelector('div.mt-20');
    if (!container) return false;
    var orderId = (new URLSearchParams(window.location.search)).get('order_id') || '';

    if (orderId) {
      /* legit order: keep EVERYTHING the server renders (the order tracking /
         invoice block, offers, footer) and only HIDE EasyOrders' own thank-you
         filler + its duplicate home button, then put our card on top.
         Hiding (not removing) keeps React's tree intact — removing nodes the
         app controls can make it re-render/remount and re-hit its API. */
      Array.from(container.children).forEach(function(k) {
        var cls = k.className || '';
        if (/akkad-thanks-card/.test(cls)) return;
        var isServer = !!k.querySelector('[data-invoice]') || (k.hasAttribute && k.hasAttribute('data-invoice'));
        if (isServer) return;
        var isFiller = !!k.querySelector('.thanks_content') || /(^|\s)thanks_content(\s|$)/.test(cls);
        var isDupHome = !k.querySelector('[data-invoice]') && !k.querySelector('a[href*="/products/"]') && !!k.querySelector('a[href="/"]');
        if (isFiller || isDupHome) hideThanksRow(k);
      });
    } else {
      /* no order id: hide the original title / message / home-button rows but
         keep the "منتجات مشابهة" offers block and footer below the card. */
      var stop = false;
      Array.from(container.children).forEach(function(k) {
        if (stop) return;
        var cls = k.className || '';
        var isCard = /akkad-thanks-card/.test(cls);
        var isServer = !!k.querySelector('a[href*="/products/"], .home_section_top_container, [data-invoice]') ||
                       (k.hasAttribute && k.hasAttribute('data-invoice'));
        if (isCard || isServer) { stop = true; return; }
        hideThanksRow(k);
      });
    }

    if (document.querySelector('.akkad-thanks-card')) return true;

    container.style.marginTop = '40px';
    container.style.paddingBottom = '44px';
    container.style.justifyContent = 'flex-start';
    if (!(container.classList && container.classList.contains('thanks_container'))) {
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
    }

    var card = document.createElement('div');
    card.className = 'akkad-thanks-card';
    card.setAttribute('data-akkad-thanks', '1');
    card.innerHTML =
      '<div class="akkad-thanks-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></div>' +
      '<h1 class="akkad-thanks-title">شكراً لطلبك من <span>أكاد</span></h1>' +
      '<p class="akkad-thanks-sub">تم استلام طلبك بنجاح</p>' +
      '<p class="akkad-thanks-msg">سيتم التواصل معك عبر الهاتف خلال 24 ساعة لتأكيد البيانات قبل الشحن.</p>' +
      '<div class="akkad-thanks-steps">' +
        '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">1</span><div><b>استلام الطلب</b><br><small>تم تسجيل طلبك بنجاح</small></div></div>' +
        '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">2</span><div><b>التواصل للتأكيد</b><br><small>التواصل عبر الواتساب</small></div></div>' +
        '<div class="akkad-thanks-step"><span class="akkad-thanks-step-num">3</span><div><b>الشحن والتسليم</b><br><small>تجهيز طلبك وتسليمه إليك</small></div></div>' +
      '</div>' +
      '<div class="akkad-thanks-divider"></div>' +
      '<div class="akkad-thanks-wa">' +
        '<div class="akkad-thanks-wa-icon">' + WA_SVG + '</div>' +
        '<p class="akkad-thanks-wa-before">أو يمكنك التواصل معنا</p>' +
        '<a class="akkad-thanks-wa-btn" href="' + THANKS_WA_LINK + '" target="_blank" rel="noopener">من هنا</a>' +
        '<p class="akkad-thanks-wa-after">لتأكيد الطلب سريعاً</p>' +
      '</div>' +
      '<a class="akkad-thanks-home" href="/">متابعة التسوق</a>';

    /* The order id comes straight from the query string, so it is untrusted
       input. It is written as a text node, never as markup — otherwise
       /thanks?order_id=<img onerror=...> executes on the live site. */
    if (orderId) {
      var orderRow = document.createElement('div');
      orderRow.className = 'akkad-thanks-order';
      orderRow.textContent = 'رقم الطلب: ' + orderId;
      card.insertBefore(orderRow, card.querySelector('.akkad-thanks-msg'));
    }

    container.insertBefore(card, container.firstChild);
    return true;
  }

  /* non-destructive hide — never removes nodes React owns */
  function hideThanksRow(el) {
    el.style.setProperty('display', 'none', 'important');
    el.setAttribute('data-akkad-thanks-hidden', '1');
  }

  var thanksRunning = false;

  function runThanksPage() {
    if (thanksRunning) return;
    thanksRunning = true;
    /* Wait for the page to settle before the first injection: the thanks
       container is React-managed, and inserting into it while React is still
       hydrating causes hydration errors (React #418/#423). After the wait the
       self-healing loop keeps the card correct even if the app renders late
       or swaps the container. */
    whenSettled(function() {
      if (window.location.pathname.indexOf('thanks') === -1) {
        thanksRunning = false;
        return;
      }
      /* Keep watching while we are on /thanks instead of giving up after a
         fixed number of tries. On a slow mobile first load the EasyOrders
         thank-you block renders late — and the app can replace the container
         it first paints — so a one-shot injection is lost until the next
         reload. This self-heals and stops only once we leave /thanks. */
      var iv = setInterval(function() {
        if (window.location.pathname.indexOf('thanks') === -1) {
          clearInterval(iv);
          thanksRunning = false;
          return;
        }
        var container = document.querySelector('.thanks_container') ||
                        document.querySelector('main div.mt-20') ||
                        document.querySelector('div.mt-20');
        if (container && !container._akkadThanksObs) {
          container._akkadThanksObs = true;
          /* observe only the container (not the whole body) so we never thrash
             the app into extra renders while it hydrates */
          new MutationObserver(function() { buildThanksPage(); }).observe(container, { childList: true });
        }
        buildThanksPage();
      }, 300);
    });
  }

  /* Wait for the page to settle (window load + a beat) before touching any
     React-managed node, with a cap so a slow/hung subresource cannot block
     us forever. */
  function whenSettled(fn) {
    var done = false;
    function go() { if (done) return; done = true; fn(); }
    if (document.readyState === 'complete') { setTimeout(go, 50); return; }
    window.addEventListener('load', function() { setTimeout(go, 400); }, { once: true });
    setTimeout(go, 2500);
  }

  /* ---- route dispatch ------------------------------------------------
     Runs at load and again whenever the SPA changes the URL, so reaching
     /thanks (e.g. right after an order placed on the checkout route) injects
     the card without a manual reload. */
  var lastPath = null;

  function routeTick() {
    var p = window.location.pathname;
    if (p === lastPath) return;
    lastPath = p;
    if (p.indexOf('thanks') !== -1) runThanksPage();
    if (p.indexOf('checkout') === -1) document.documentElement.classList.remove('on-checkout');
  }

  try {
    ["pushState", "replaceState"].forEach(function (m) {
      var orig = history[m];
      history[m] = function () { var r = orig.apply(this, arguments); routeTick(); return r; };
    });
  } catch (e) {}
  window.addEventListener("popstate", routeTick);
  setInterval(routeTick, 400);

  routeTick();

  if (!window.location.pathname.includes('checkout')) {
    /* off-checkout pages (home / product / cart): do nothing heavy. The old
       code attached a body-wide subtree MutationObserver that ran the whole
       checkout pipeline on every DOM mutation of every page. SPA navigation
       into checkout is caught by this lightweight path poll instead — and
       routeTick() above handles navigation into /thanks. */
    var checkoutCheck = setInterval(function () {
      if (window.location.pathname.includes('checkout')) {
        clearInterval(checkoutCheck);
        setTimeout(run, 100);
        setTimeout(run, 500);
        setTimeout(run, 1500);
      }
    }, 500);
    return;
  }

  function injectReminder() {
    var containers = document.querySelectorAll('.checkout_container');
    for (var i = 0; i < containers.length; i++) {
      var c = containers[i];
      if (c.querySelector('.akkad-wa-reminder')) continue;
      var banner = document.createElement('div');
      banner.className = 'akkad-wa-reminder';
      banner.setAttribute('data-akkad-wa', '1');
      banner.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
        '<span role="note">سيتم التواصل معك عبر الواتساب لتأكيد الأوردر خلال 24 ساعة</span>';
      c.insertBefore(banner, c.firstChild);
    }
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


  /* On mobile the theme renders a second, control-less copy of the cart inside
     .checkout_mobile_bottom_summary (right after the client fields) and hides
     the real, React-wired one (with +/-/remove) behind the lower summary
     toggle. Give the mobile copy working controls by forwarding each click to
     the matching React button in the hidden lower list — React owns that list,
     so its handlers keep cart state (and both lists) in sync. The lower list
     stays mounted (just display:none) so those buttons remain clickable. */
  function makeMobileSummaryFunctional() {
    var upperList = document.querySelector('.checkout_mobile_cart_items_container');
    var lowerList = document.querySelector('#checkout-order-summary-content .checkout_cart_items_container');
    if (!upperList || !lowerList) return;

    function lowerItems() { return lowerList.querySelectorAll('.checkout_cart_item'); }
    function forwardByIndex(idx, label) {
      if (idx < 0) return;
      var item = lowerItems()[idx];
      if (!item) return;
      var btn = item.querySelector('[aria-label="' + label + '"]');
      if (btn) btn.click();
    }
    function lowerQtyAt(idx) {
      var item = lowerItems()[idx];
      return item ? item.querySelector('p.m-0.w-10') : null;
    }
    function indexWithinList(el) {
      if (!el) return -1;
      var items = Array.prototype.slice.call(upperList.querySelectorAll('.checkout_cart_item'));
      return items.indexOf(el);
    }
    /* Resolve the owning cart row from the CLICK TARGET (not a captured node):
       React re-renders these rows on every cart change, so a node captured at
       injection time goes stale and its index lookup would return -1. */
    function idxOfEvent(e) {
      return indexWithinList(e.currentTarget && e.currentTarget.closest('.checkout_cart_item'));
    }

    function sync() {
      var upperItems = upperList.querySelectorAll('.checkout_cart_item');
      Array.prototype.forEach.call(upperItems, function (uItem) {
        var content = uItem.querySelector('div.min-w-0.flex-1');
        if (!content) return;
        var row = content.querySelector('.akkad-qty-row');
        if (!row) {
          row = document.createElement('div');
          row.className = 'akkad-qty-row flex items-center gap-2';
          row.innerHTML =
            '<div class="flex items-center">' +
              '<button type="button" data-akkad="inc" aria-label="Increase quantity">+</button>' +
              '<p class="m-0 w-10 text-center text-sm" data-akkad="val">1</p>' +
              '<button type="button" data-akkad="dec" aria-label="Decrease quantity">&minus;</button>' +
            '</div>' +
            '<button type="button" data-akkad="del" aria-label="Remove item">&times;</button>';
          row.querySelector('[data-akkad="inc"]').addEventListener('click', function (e) { forwardByIndex(idxOfEvent(e), 'Increase quantity'); });
          row.querySelector('[data-akkad="dec"]').addEventListener('click', function (e) { forwardByIndex(idxOfEvent(e), 'Decrease quantity'); });
          row.querySelector('[data-akkad="del"]').addEventListener('click', function (e) { forwardByIndex(idxOfEvent(e), 'Remove item'); });
          content.appendChild(row);
        }
        var val = row.querySelector('[data-akkad="val"]');
        var lq = lowerQtyAt(indexWithinList(uItem));
        if (val && lq && val.textContent !== lq.textContent) val.textContent = lq.textContent;
      });
    }

    sync();
    if (upperList._akkadQtyObs) return;
    upperList._akkadQtyObs = true;
    new MutationObserver(sync).observe(upperList, { childList: true, subtree: true });
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
      /* Re-query the invoice each tick: React re-renders the summary on every
         cart change and can detach/re-attach (even re-create) our node, so a
         captured reference goes stale and the totals freeze. */
      var inv = document.querySelector('.akkad-invoice');
      if (!inv) return;
      var nameInput = document.querySelector('[name="full_name"]');
      var phoneInput = document.querySelector('[name="phone"]');
      var items = document.querySelectorAll('#checkout-order-summary-content .checkout_cart_item');
      var tbody = inv.querySelector('.inv-tbody');

      inv.querySelector('.inv-name').textContent = (nameInput && nameInput.value) || '— غير محدد —';
      inv.querySelector('.inv-phone').textContent = (phoneInput && phoneInput.value) || '— غير محدد —';

      var totalCount = 0, grandTotal = 0;
      tbody.innerHTML = '';

      items.forEach(function(item, i) {
        var name = item.querySelector('p.truncate');
        var priceEl = item.querySelector('.flex.shrink-0.flex-col.items-end span');
        var qtyEl = item.querySelector('p.m-0.w-10');
        var price = parseInt((priceEl ? priceEl.textContent : '0').replace(/[^0-9]/g, '')) || 0;
        var qty = parseInt(qtyEl ? qtyEl.textContent : '1') || 1;
        /* The theme's price span already shows the LINE total (qty x unit), not
           the unit price. Multiplying it by qty again double-counted. */
        var total = price;
        var unit = qty > 0 ? Math.round(total / qty) : total;
        totalCount += qty;
        grandTotal += total;

        var tr = document.createElement('tr');

        var tdIndex = document.createElement('td');
        tdIndex.textContent = String(i + 1);

        /* The product title is admin-supplied text, so it is written as a text
           node instead of being interpolated into markup. */
        var tdName = document.createElement('td');
        var nameWrap = document.createElement('div');
        nameWrap.style.fontWeight = '600';
        nameWrap.style.fontSize = '11px';
        nameWrap.textContent = name ? name.textContent : '';
        tdName.appendChild(nameWrap);

        var tdQty = document.createElement('td');
        tdQty.style.fontWeight = '700';
        tdQty.textContent = String(qty);

        var tdUnit = document.createElement('td');
        tdUnit.textContent = unit.toLocaleString() + ' ج';

        var tdTotal = document.createElement('td');
        tdTotal.className = 'item-total';
        tdTotal.textContent = total.toLocaleString() + ' ج';

        tr.appendChild(tdIndex);
        tr.appendChild(tdName);
        tr.appendChild(tdQty);
        tr.appendChild(tdUnit);
        tr.appendChild(tdTotal);
        tbody.appendChild(tr);
      });

      inv.querySelector('.inv-count').textContent = totalCount;

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

      var discountBox = inv.querySelector('.akkad-invoice-discount');
      if (discount > 0) {
        discountBox.style.display = 'block';
        discountBox.querySelector('.inv-discount-val').textContent = '-' + discount.toLocaleString() + ' ج';
      } else {
        discountBox.style.display = 'none';
      }

      inv.querySelector('.inv-shipping-val').textContent = shipping > 0 ? shipping.toLocaleString() + ' ج' : 'مجاني';
      inv.querySelector('.inv-grand').textContent = (grandTotal - discount + shipping).toLocaleString() + ' ج';
    }

    update();
    if (window.__akkadInvoiceTimer) clearInterval(window.__akkadInvoiceTimer);
    window.__akkadInvoiceTimer = setInterval(function() {
      /* Never clear on a transient disconnect — React briefly detaches the node
         mid-re-render, and clearing here froze the totals at shipping-only. If
         the invoice is momentarily gone, skip the tick; the body observer
         re-injects it when React settles. */
      if (!document.querySelector('.akkad-invoice')) return;
      update();
    }, 1000);
  }

  function fixInputs() {
    /* The two listeners that used to live here re-dispatched an `input` event
       on the very field they were attached to, so every keystroke re-entered
       the handler and blew the stack with a RangeError. They were also
       pointless: React already receives the native event, and a second event
       carrying the same value is swallowed by React's value tracker, so it
       could never change what the form ends up holding. Only the labelling
       below is still needed. */
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

  /* Self-healing: re-run the whole pipeline on any DOM change (debounced), so
     React re-renders and SPA navigations are caught without a manual reload.
     If this file is parsed from <head>, document.body is still null here and
     .observe(null) would throw — silently killing the self-heal loop, which is
     why fixes appeared to need a refresh. Wait for the body before observing. */
  (function startObserver() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', startObserver);
      return;
    }
    new MutationObserver(scheduleRun).observe(document.body, { childList: true, subtree: true });
  })();
})();