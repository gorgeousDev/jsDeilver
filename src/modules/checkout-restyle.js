/**
 * Checkout Restyle Script
 * CSS restyling + dynamic invoice injection for EasyOrders checkout
 */
(function() {
  'use strict';

  if (!window.location.pathname.includes('checkout')) return;

  // === CSS STYLES ===
  const style = document.createElement('style');
  style.textContent = `
    /* --- Hide unnecessary elements --- */
    .fasty_header,
    #akkad-nav,
    .akkad-social-section,
    footer,
    .default_footer,
    .akkad-sale-badge {
      display: none !important;
    }

    /* --- Product title: 2 lines max with ellipsis --- */
    [data-cart="item-name"] {
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-height: 2.8em !important;
      line-height: 1.4 !important;
    }

    /* --- Hide "رقم او حساب المرسل" --- */
    .payments_container button:has(.payment_card_name[style]),
    .payment_card:has(.payment_card_img_container) {
      position: relative;
    }

    /* Hide sender number field */
    [data-cart="item-actions"] .font-medium.ms-2 {
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
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      margin-top: 16px !important;
      margin-bottom: 120px !important;
    }

    #summary-heading {
      display: none !important;
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
      color: #0F5E55 !important;
      margin-bottom: 16px !important;
      padding-bottom: 12px !important;
      border-bottom: 2px solid #0F8478 !important;
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
      background: #0F8478 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      flex-shrink: 0 !important;
    }

    /* --- Section 2: Payment --- */
    .payments_container > span:first-child {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      color: #0F5E55 !important;
      margin-bottom: 16px !important;
    }

    .payments_container > span:first-child::before {
      content: '2' !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      background: #0F8478 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      flex-shrink: 0 !important;
    }

    /* --- Form inputs --- */
    .global_input,
    .global_textarea {
      border: 2px solid #A8DDD4 !important;
      border-radius: 12px !important;
      padding: 12px 16px !important;
      font-size: 15px !important;
      background: #f9fafb !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }

    .global_input:focus,
    .global_textarea:focus {
      border-color: #0F8478 !important;
      box-shadow: 0 0 0 3px rgba(15, 132, 120, 0.1) !important;
      background: #fff !important;
    }

    /* --- Labels --- */
    .contact-info-heading label,
    #contact-info-heading ~ div label,
    .checkout_form label {
      font-weight: 700 !important;
      font-size: 14px !important;
      color: #0F5E55 !important;
      margin-bottom: 6px !important;
    }

    /* --- Payment cards --- */
    .payment_card {
      border: 2px solid #A8DDD4 !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin-bottom: 12px !important;
      background: linear-gradient(to left, #EFFAF8, white, #EFFAF8) !important;
      transition: all 0.2s !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }

    .payment_card:hover {
      border-color: #0F8478 !important;
      background: #fff !important;
    }

    .payment_card[class*="border-blue-600"],
    .payment_card:has(.radio_circle[class*="bg-blue"]) {
      border-color: #0F8478 !important;
      background: linear-gradient(to left, #EFFAF8, white, #EFFAF8) !important;
    }

    .radio_container {
      width: 22px !important;
      height: 22px !important;
      border-radius: 50% !important;
      border: 2px solid #A8DDD4 !important;
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
      background: #0F8478 !important;
    }

    .payment_card_name {
      font-weight: 700 !important;
      font-size: 15px !important;
      color: #0F5E55 !important;
    }

    .payment_card_description {
      font-size: 13px !important;
      color: #3F8C81 !important;
      margin-top: 2px !important;
    }

    /* --- Cart items --- */
    .checkout_cart_items_container {
      border: 1px solid #A8DDD4 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      margin: 16px 0 !important;
    }

    .cart-item {
      padding: 16px !important;
      border-bottom: 1px solid #EFFAF8 !important;
    }

    .cart-item:last-child {
      border-bottom: none !important;
    }

    .cart-item a[data-cart="item-image-wrapper"] {
      border-radius: 10px !important;
      overflow: hidden !important;
      border: 1px solid #A8DDD4 !important;
    }

    .cart-item h3[data-cart="item-name"] {
      font-weight: 700 !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      color: #0F5E55 !important;
    }

    .cart-item [data-cart="item-price"] {
      font-weight: 700 !important;
      color: #0F5E55 !important;
    }

    /* --- Quantity counter --- */
    .cart-item-quantity-counter {
      background: rgba(15, 132, 120, 0.05) !important;
      border: 1px solid rgba(15, 132, 120, 0.2) !important;
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
      background: rgba(15, 132, 120, 0.1) !important;
    }

    /* --- Invoice/pricing section --- */
    [data-invoice="invoice"] {
      background: #EFFAF8 !important;
      border: 1px solid #A8DDD4 !important;
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
      border-top: 2px solid #0F8478 !important;
      padding-top: 12px !important;
      margin-top: 8px !important;
    }

    [data-invoice="invoice-total-value"] {
      font-size: 18px !important;
      font-weight: 800 !important;
      color: #0F5E55 !important;
    }

    /* --- Submit button --- */
    .checkout_buy_now {
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      padding: 14px 24px !important;
      background: #0F8478 !important;
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
      border-top: 1px solid #A8DDD4 !important;
      padding: 12px 16px !important;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08) !important;
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

    /* --- Governor dropdown --- */
    .gov_select,
    .css-1hf1o2u-container {
      border-radius: 12px !important;
    }

    .select__control {
      border: 2px solid #A8DDD4 !important;
      border-radius: 12px !important;
      min-height: 44px !important;
    }

    /* --- Akkad Invoice Styles --- */
    .akkad-invoice {
      direction: rtl;
      width: 100%;
      margin: 0 auto;
      background: linear-gradient(to bottom right, #EAF7F5, #DCF1EE, white);
      border: 2px solid #A8DDD4;
      border-radius: 12px;
      padding: 14px;
      font-family: 'Tajawal', sans-serif;
      color: #000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .akkad-invoice-header {
      border-bottom: 2px solid #5EBFB1;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }

    .akkad-invoice-brand {
      text-align: center;
      margin-bottom: 10px;
    }

    .akkad-invoice-brand h2 {
      font-size: 18px;
      font-weight: 900;
      color: #0F5E55;
      margin: 0;
      line-height: 1.3;
    }

    .akkad-invoice-brand h2 span {
      color: #0E8478;
    }

    .akkad-invoice-brand p {
      font-size: 11px;
      font-weight: 600;
      color: #3F8C81;
      margin: 4px 0 0 0;
      letter-spacing: 0.5px;
    }

    .akkad-invoice-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    .akkad-invoice-meta-label {
      font-weight: 700;
      font-size: 14px;
    }

    .akkad-invoice-meta-details {
      text-align: left;
      font-variant-numeric: lining-nums tabular-nums;
    }

    .akkad-invoice-meta-details p {
      margin: 2px 0;
      direction: ltr;
      text-align: right;
    }

    .akkad-invoice-meta-details span {
      font-weight: 700;
    }

    .akkad-invoice-customer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
      font-size: 11px;
    }

    .akkad-invoice-customer-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .akkad-invoice-customer-info span:first-child {
      font-weight: 700;
      color: #6b7280;
    }

    .akkad-invoice-customer-info span:last-child {
      font-weight: 700;
    }

    .akkad-invoice-customer-count {
      text-align: left;
    }

    .akkad-invoice-table-wrapper {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #A8DDD4;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .akkad-invoice-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      font-variant-numeric: lining-nums tabular-nums;
    }

    .akkad-invoice-table thead tr {
      background: #0F8478;
      color: #fff;
    }

    .akkad-invoice-table th {
      border: 1px solid #0F8478;
      padding: 10px 4px;
      text-align: center;
      font-weight: 700;
    }

    .akkad-invoice-table th:nth-child(1) { width: 36px; }
    .akkad-invoice-table th:nth-child(3) { width: 52px; }
    .akkad-invoice-table th:nth-child(4) { width: 72px; }
    .akkad-invoice-table th:nth-child(5) { width: 80px; }

    .akkad-invoice-table td {
      border: 1px solid #A8DDD4;
      padding: 10px 6px;
      text-align: center;
    }

    .akkad-invoice-table td:nth-child(2) {
      text-align: right;
      font-weight: 600;
      font-size: 11px;
      line-height: 1.4;
    }

    .akkad-invoice-table tbody tr:nth-child(odd) {
      background: #EFFAF8;
    }

    .akkad-invoice-table tfoot tr {
      background: #0F8478;
      color: #fff;
    }

    .akkad-invoice-table tfoot td {
      border: 1px solid #0F8478;
      padding: 10px 6px;
      font-weight: 900;
    }

    .akkad-invoice-table tfoot td:first-child {
      text-align: end;
      font-size: 12px;
    }

    .akkad-invoice-table tfoot td:last-child {
      font-size: 13px;
      color: #FFD98A;
    }

    .akkad-invoice-table .item-total {
      font-weight: 700;
      color: #0F5E55;
    }

    .akkad-invoice-footer-msg {
      margin-top: 14px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #A8DDD4;
    }

    .akkad-invoice-footer-msg-top {
      background: linear-gradient(to left, #0F8478, #14A090);
      color: #fff;
      text-align: center;
      padding: 10px 14px;
    }

    .akkad-invoice-footer-msg-top p {
      font-weight: 900;
      font-size: 12px;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .akkad-invoice-footer-msg-top span {
      color: #FFD98A;
    }

    .akkad-invoice-footer-msg-bottom {
      background: #EFFAF8;
      padding: 8px 14px;
      text-align: center;
      font-size: 10px;
      color: #0F5E55;
    }

    .akkad-invoice-footer-msg-bottom p {
      font-weight: 700;
      margin: 2px 0;
    }

    /* --- Payment content section (InstaPay/Wallet) --- */
    .akkad-payment-content {
      margin-top: 12px;
      border-top: 1px dashed #A8DDD4;
      padding-top: 12px;
    }

    .akkad-payment-content-box {
      display: none;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .akkad-payment-content-box.active {
      display: flex;
    }

    .akkad-payment-option {
      border-radius: 12px;
      padding: 16px;
      border: 1px solid;
    }

    .akkad-payment-option-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .akkad-instapay {
      border-color: #ede9fe;
      background: #faf7ff;
    }

    .akkad-instapay .akkad-payment-option-title {
      color: #4c1d95;
    }

    .akkad-wallet {
      border-color: #dbeafe;
      background: #f8fbff;
    }

    .akkad-wallet .akkad-payment-option-title {
      color: #1d4ed8;
    }

    .akkad-instapay-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 20px;
      background: #6d28d9;
      color: #fff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      transition: opacity 0.2s;
    }

    .akkad-instapay-btn:hover {
      opacity: 0.9;
    }

    .akkad-wallet-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    .akkad-wallet-number {
      background: #fff;
      border: 1px dashed #93c5fd;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #111;
    }

    .akkad-wallet-copy {
      border: none;
      background: #2563eb;
      color: #fff;
      padding: 12px 18px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .akkad-wallet-copy:hover {
      opacity: 0.9;
    }

    /* --- Mobile responsive for payment content --- */
    @media (max-width: 480px) {
      .akkad-payment-option {
        padding: 12px;
      }

      .akkad-payment-option-title {
        font-size: 14px;
      }

      .akkad-instapay-btn {
        width: 100%;
        justify-content: center;
        padding: 14px;
        font-size: 16px;
      }

      .akkad-wallet-row {
        flex-direction: column;
        align-items: stretch;
      }

      .akkad-wallet-number {
        text-align: center;
        font-size: 18px;
      }

      .akkad-wallet-copy {
        width: 100%;
        justify-content: center;
        padding: 14px;
        font-size: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // === PAYMENT BUG FIX ===
  function fixPaymentBug() {
    const paymentCards = document.querySelectorAll('.payment_card');
    if (paymentCards.length < 2) return;

    // Remove the auto-click from akkad-v2.js by preventing it
    const electronicCard = paymentCards[1]; // "دفع الكتروني"
    const codCard = paymentCards[0]; // "دفع عند الاستلام"

    // Track which one should be active
    let activePayment = 'cod'; // default

    // Override the click handlers
    electronicCard.addEventListener('click', function(e) {
      e.stopPropagation();
      activePayment = 'electronic';

      // Update visual state
      codCard.classList.remove('border-blue-600');
      codCard.querySelector('.radio_circle')?.classList.remove('bg-blue-500');
      electronicCard.classList.add('border-blue-600');
      electronicCard.querySelector('.radio_circle')?.classList.add('bg-blue-500');

      // Show payment content
      showPaymentContent('electronic');
    });

    codCard.addEventListener('click', function(e) {
      e.stopPropagation();
      activePayment = 'cod';

      // Update visual state
      electronicCard.classList.remove('border-blue-600');
      electronicCard.querySelector('.radio_circle')?.classList.remove('bg-blue-500');
      codCard.classList.add('border-blue-600');
      codCard.querySelector('.radio_circle')?.classList.add('bg-blue-500');

      // Hide payment content
      showPaymentContent('cod');
    });
  }

  // === PAYMENT CONTENT INJECTION ===
  function createPaymentContent() {
    const content = document.createElement('div');
    content.className = 'akkad-payment-content';
    content.innerHTML = `
      <div class="akkad-payment-content-box" id="akkad-electronic-content">
        <div class="akkad-payment-option akkad-instapay">
          <div class="akkad-payment-option-title">
            💜 الدفع عبر InstaPay
          </div>
          <a href="https://ipn.eg/S/akkad.one/instapay/3yzMRQ"
             target="_blank"
             class="akkad-instapay-btn">
            فتح رابط الدفع
          </a>
        </div>
        <div class="akkad-payment-option akkad-wallet">
          <div class="akkad-payment-option-title">
            📱 الدفع عبر محفظة الكاش
          </div>
          <div class="akkad-wallet-row">
            <div class="akkad-wallet-number">01508331823</div>
            <button class="akkad-wallet-copy"
                    onclick="navigator.clipboard.writeText('01508331823');this.innerHTML='✔ تم النسخ';setTimeout(()=>this.innerHTML='نسخ الرقم',2000)">
              نسخ الرقم
            </button>
          </div>
        </div>
      </div>
    `;
    return content;
  }

  function showPaymentContent(type) {
    const box = document.getElementById('akkad-electronic-content');
    if (box) {
      box.classList.toggle('active', type === 'electronic');
    }
  }

  function injectPaymentContent() {
    const paymentCards = document.querySelectorAll('.payment_card');
    if (paymentCards.length < 2) return;
    if (document.querySelector('.akkad-payment-content')) return;

    const electronicCard = paymentCards[1];
    const content = createPaymentContent();
    electronicCard.appendChild(content);

    // Fix the bug
    fixPaymentBug();
  }

  // === INVOICE INJECTION ===
  function buildInvoice() {
    const invoice = document.createElement('div');
    invoice.className = 'akkad-invoice';
    invoice.innerHTML = `
      <div class="akkad-invoice-header">
        <div class="akkad-invoice-brand">
          <h2><span>أكاد</span></h2>
          <p>أفضل عروض الأدوات المنزلية والعطور والأجهزة</p>
        </div>
        <div class="akkad-invoice-meta">
          <p class="akkad-invoice-meta-label">نموذج طلب</p>
          <div class="akkad-invoice-meta-details">
            <p><span>التاريخ:</span> ${new Date().toLocaleDateString('ar-EG', {day:'2-digit', month:'2-digit', year:'numeric'})}</p>
            <p><span>رقم الطلب:</span> #${Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        </div>
      </div>
      <div class="akkad-invoice-customer">
        <div class="akkad-invoice-customer-info">
          <div><span>العميل: </span><span class="inv-customer-name">— غير محدد —</span></div>
          <div><span>رقم العميل: </span><span class="inv-customer-phone" dir="ltr" style="font-variant-numeric:lining-nums tabular-nums;">— غير محدد —</span></div>
        </div>
        <div class="akkad-invoice-customer-count">
          <span>إجمالي القطع: </span><span class="inv-item-count">0</span>
        </div>
      </div>
      <div class="akkad-invoice-table-wrapper">
        <table class="akkad-invoice-table">
          <thead>
            <tr>
              <th>م</th>
              <th>الصنف</th>
              <th>العدد</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody class="inv-tbody"></tbody>
          <tfoot>
            <tr>
              <td colspan="4">الإجمالي الكلي</td>
              <td class="inv-grand-total">0 ج</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="akkad-invoice-footer-msg">
        <div class="akkad-invoice-footer-msg-top">
          <p>شكرًا لثقتكم في <span>أكاد</span> — نتشرف بخدمتكم دائمًا</p>
        </div>
      </div>
    `;
    return invoice;
  }

  function populateInvoice(invoice) {
    const nameInput = document.querySelector('[name="full_name"]');
    const phoneInput = document.querySelector('[name="phone"]');
    const items = document.querySelectorAll('.cart-item');
    const tbody = invoice.querySelector('.inv-tbody');
    const currency = document.querySelector('[data-invoice="invoice-subtotal-value"]')?.querySelector('span')?.textContent || 'ج.م';

    // Customer info
    const customerName = invoice.querySelector('.inv-customer-name');
    const customerPhone = invoice.querySelector('.inv-customer-phone');
    if (nameInput?.value) customerName.textContent = nameInput.value;
    if (phoneInput?.value) customerPhone.textContent = phoneInput.value;

    // Listen for input changes
    if (nameInput) nameInput.addEventListener('input', () => { customerName.textContent = nameInput.value || '— غير محدد —'; });
    if (phoneInput) phoneInput.addEventListener('input', () => { customerPhone.textContent = phoneInput.value || '— غير محدد —'; });

    // Items
    let totalCount = 0;
    let grandTotal = 0;
    tbody.innerHTML = '';

    items.forEach((item, i) => {
      const name = item.querySelector('[data-cart="item-name"]')?.textContent?.trim() || '';
      const priceEl = item.querySelector('[data-cart="item-price"]');
      const qtyEl = item.querySelector('[data-cart="item-quantity"]');
      const price = parseInt(priceEl?.textContent?.replace(/[^0-9]/g, '')) || 0;
      const qty = parseInt(qtyEl?.textContent) || 1;
      const total = price * qty;
      totalCount += qty;
      grandTotal += total;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td><div style="font-weight:600;font-size:11px;line-height:1.4;">${name}</div></td>
        <td style="font-weight:700;">${qty}</td>
        <td>${price.toLocaleString()} ${currency}</td>
        <td class="item-total">${total.toLocaleString()} ${currency}</td>
      `;
      tbody.appendChild(tr);
    });

    invoice.querySelector('.inv-item-count').textContent = totalCount;
    invoice.querySelector('.inv-grand-total').textContent = grandTotal.toLocaleString() + ' ' + currency;
  }

  function injectInvoice() {
    const orderSummary = document.querySelector('.checkout_order_summary');
    if (!orderSummary || document.querySelector('.akkad-invoice')) return;

    const invoice = buildInvoice();
    populateInvoice(invoice);
    orderSummary.prepend(invoice);

    // Re-populate on cart changes
    const observer = new MutationObserver(() => {
      setTimeout(() => populateInvoice(invoice), 300);
    });
    const cartContainer = document.querySelector('.checkout_cart_items_container');
    if (cartContainer) {
      observer.observe(cartContainer, { childList: true, subtree: true, characterData: true });
    }

    // Also re-populate on input changes
    document.querySelectorAll('.global_input, .global_textarea').forEach(input => {
      input.addEventListener('input', () => setTimeout(() => populateInvoice(invoice), 100));
    });
  }

  // === INITIALIZE ===
  function init() {
    injectInvoice();
    injectPaymentContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
  } else {
    setTimeout(init, 500);
  }
})();
