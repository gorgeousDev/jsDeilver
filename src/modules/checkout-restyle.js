/**
 * Checkout Restyle Script
 * Pure CSS restyling for EasyOrders checkout
 * No DOM manipulation - only visual changes
 */
(function() {
  'use strict';

  // Only run on checkout page
  if (!window.location.pathname.includes('checkout')) return;

  const style = document.createElement('style');
  style.textContent = `
    /* ============================================
       CHECKOUT RESTYLE - CSS ONLY
       ============================================ */

    /* --- Hide unnecessary elements --- */
    .fasty_header,
    #akkad-nav,
    .akkad-social-section,
    footer,
    .default_footer,
    .akkad-sale-badge {
      display: none !important;
    }

    /* --- Main container: single column --- */
    .checkout_container {
      grid-template-columns: 1fr !important;
      max-width: 640px !important;
      padding: 0 16px !important;
      gap: 0 !important;
    }

    /* --- Order summary: move below form --- */
    .checkout_order_summary {
      order: 2 !important;
      background: #fff !important;
      border: 2px solid var(--primary-color, #040b1d) !important;
      border-radius: 16px !important;
      padding: 20px !important;
      margin-top: 16px !important;
      margin-bottom: 120px !important;
    }

    /* --- Form section --- */
    .checkout_form {
      order: 1 !important;
      padding-top: 20px !important;
    }

    /* --- Section headers with numbers --- */
    .contact-info-heading > h2,
    #contact-info-heading {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      color: var(--primary-color, #040b1d) !important;
      margin-bottom: 16px !important;
      padding-bottom: 12px !important;
      border-bottom: 2px solid var(--primary-color, #040b1d) !important;
    }

    .contact-info-heading > h2::before,
    #contact-info-heading::before {
      content: '1' !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      background: var(--primary-color, #040b1d) !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      flex-shrink: 0 !important;
    }

    /* --- Section 2: Payment --- */
    .payments_container::before {
      content: '2' !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      background: var(--primary-color, #040b1d) !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      margin-left: 10px !important;
      flex-shrink: 0 !important;
    }

    .payments_container > span:first-child {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      color: var(--primary-color, #040b1d) !important;
      margin-bottom: 16px !important;
    }

    /* --- Form inputs --- */
    .global_input,
    .global_textarea {
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      padding: 12px 16px !important;
      font-size: 15px !important;
      background: #f9fafb !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }

    .global_input:focus,
    .global_textarea:focus {
      border-color: var(--primary-color, #040b1d) !important;
      box-shadow: 0 0 0 3px rgba(4, 11, 29, 0.1) !important;
      background: #fff !important;
    }

    /* --- Labels --- */
    .contact-info-heading label,
    #contact-info-heading ~ div label,
    .checkout_form label {
      font-weight: 700 !important;
      font-size: 14px !important;
      color: #374151 !important;
      margin-bottom: 6px !important;
    }

    /* --- Payment cards --- */
    .payment_card {
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin-bottom: 12px !important;
      background: #f9fafb !important;
      transition: all 0.2s !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }

    .payment_card:hover {
      border-color: var(--primary-color, #040b1d) !important;
      background: #fff !important;
    }

    .payment_card[class*="border-blue-600"],
    .payment_card:has(.radio_circle[class*="bg-blue"]) {
      border-color: var(--primary-color, #040b1d) !important;
      background: rgba(4, 11, 29, 0.03) !important;
    }

    .radio_container {
      width: 22px !important;
      height: 22px !important;
      border-radius: 50% !important;
      border: 2px solid #d1d5db !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      margin-top: 2px !important;
    }

    .radio_circle {
      width: 12px !important;
      height: 12px !important;
      border-radius: 50% !important;
      background: #d1d5db !important;
      transition: background 0.2s !important;
    }

    .radio_circle[class*="bg-blue"] {
      background: var(--primary-color, #040b1d) !important;
    }

    .payment_card_name {
      font-weight: 700 !important;
      font-size: 15px !important;
      color: #111827 !important;
    }

    .payment_card_description {
      font-size: 13px !important;
      color: #6b7280 !important;
      margin-top: 2px !important;
    }

    /* --- Cart items in order summary --- */
    .checkout_cart_items_container {
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      margin: 16px 0 !important;
    }

    .cart-item {
      padding: 16px !important;
      border-bottom: 1px solid #f3f4f6 !important;
    }

    .cart-item:last-child {
      border-bottom: none !important;
    }

    .cart-item a[data-cart="item-image-wrapper"] {
      border-radius: 10px !important;
      overflow: hidden !important;
      border: 1px solid #e5e7eb !important;
    }

    .cart-item h3[data-cart="item-name"] {
      font-weight: 700 !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
    }

    .cart-item [data-cart="item-price"] {
      font-weight: 700 !important;
      color: var(--primary-color, #040b1d) !important;
    }

    /* --- Quantity counter --- */
    .cart-item-quantity-counter {
      background: rgba(4, 11, 29, 0.05) !important;
      border: 1px solid rgba(4, 11, 29, 0.15) !important;
      border-radius: 10px !important;
      padding: 4px !important;
    }

    .cart-item-quantity-counter button {
      border-radius: 8px !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .cart-item-quantity-counter button:hover {
      background: rgba(4, 11, 29, 0.1) !important;
    }

    /* --- Invoice/pricing section --- */
    [data-invoice="invoice"] {
      background: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin-top: 16px !important;
    }

    [data-invoice="invoice-subtotal"],
    [data-invoice="invoice-shipping"],
    [data-invoice="invoice-total"] {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 8px 0 !important;
    }

    [data-invoice="invoice-total"] {
      border-top: 2px solid var(--primary-color, #040b1d) !important;
      padding-top: 12px !important;
      margin-top: 8px !important;
    }

    [data-invoice="invoice-total-value"] {
      font-size: 18px !important;
      font-weight: 800 !important;
      color: var(--primary-color, #040b1d) !important;
    }

    /* --- Coupon section --- */
    .shipping_cost_container + div {
      background: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 10px !important;
      padding: 12px !important;
      margin-top: 12px !important;
    }

    /* --- Submit button --- */
    .checkout_buy_now {
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      padding: 14px 24px !important;
      background: var(--primary-color, #040b1d) !important;
      color: #fff !important;
      border: none !important;
      transition: opacity 0.2s !important;
    }

    .checkout_buy_now:hover {
      opacity: 0.9 !important;
    }

    /* --- Fixed bottom bar --- */
    .fixed.bottom-0 {
      background: #fff !important;
      border-top: 1px solid #e5e7eb !important;
      padding: 12px 16px !important;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08) !important;
    }

    /* --- Order summary heading --- */
    #summary-heading {
      font-size: 16px !important;
      font-weight: 800 !important;
      color: var(--primary-color, #040b1d) !important;
      margin-bottom: 8px !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }

    #summary-heading::before {
      content: '🛒' !important;
      font-size: 18px !important;
    }

    /* --- Background adjustments --- */
    .checkout_bg_right,
    .checkout_bg_left {
      display: none !important;
    }

    .bg-white {
      background: #f8fafc !important;
    }

    /* --- Mobile adjustments --- */
    @media (max-width: 1024px) {
      .checkout_container {
        padding: 0 12px !important;
      }

      .checkout_order_summary {
        margin-bottom: 140px !important;
      }
    }

    /* --- Google/Governor dropdown --- */
    .gov_select,
    .css-1hf1o2u-container {
      border-radius: 12px !important;
    }

    .select__control {
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      min-height: 44px !important;
    }

    /* --- InstaPay section styling --- */
    div[style*="border:1px solid #ede9fe"],
    div[style*="border:1px solid #dbeafe"] {
      border-radius: 12px !important;
    }

    div[style*="background:#faf7ff"],
    div[style*="background:#f8fbff"] {
      background: #f9fafb !important;
    }
  `;

  document.head.appendChild(style);
})();
