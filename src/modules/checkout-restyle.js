/**
 * Checkout Restyle Script
 */
(function() {
  'use strict';

  if (!window.location.pathname.includes('checkout')) return;

  var style = document.createElement('style');
  style.id = 'akkad-checkout-style';

  style.textContent = [
    '.fasty_header, #akkad-nav, .akkad-social-section, footer, .default_footer, .akkad-sale-badge { display: none !important; }',
    '[data-cart="item-name"] { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; text-overflow: ellipsis !important; max-height: 2.8em !important; line-height: 1.4 !important; }',
    '.checkout_container { grid-template-columns: 1fr !important; max-width: 640px !important; padding: 0 16px !important; }',
    '.checkout_order_summary { order: 2 !important; background: #fff !important; border: 2px solid #A8DDD4 !important; border-radius: 16px !important; padding: 16px !important; margin-top: 16px !important; margin-bottom: 120px !important; }',
    '.checkout_form { order: 1 !important; padding-top: 20px !important; }',
    '.checkout_bg_right, .checkout_bg_left { display: none !important; }',
    '.bg-white { background: #f8fafc !important; }',
    '#summary-heading { display: none !important; }',

    '#contact-info-heading { display: flex !important; align-items: center !important; gap: 10px !important; font-size: 16px !important; font-weight: 800 !important; color: #0F5E55 !important; margin-bottom: 16px !important; padding-bottom: 12px !important; border-bottom: 2px solid #0F8478 !important; }',
    '#contact-info-heading::before { content: "1" !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 28px !important; height: 28px !important; border-radius: 50% !important; background: #0F8478 !important; color: #fff !important; font-size: 14px !important; font-weight: 700 !important; flex-shrink: 0 !important; }',
    '.payments_container > span:first-child { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 16px !important; font-weight: 800 !important; color: #0F5E55 !important; margin-bottom: 16px !important; }',
    '.payments_container > span:first-child::before { content: "2" !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 28px !important; height: 28px !important; border-radius: 50% !important; background: #0F8478 !important; color: #fff !important; font-size: 14px !important; font-weight: 700 !important; flex-shrink: 0 !important; }',

    '.global_input, .global_textarea { border: 2px solid #A8DDD4 !important; border-radius: 12px !important; padding: 12px 16px !important; font-size: 15px !important; background: #f9fafb !important; }',
    '.global_input:focus, .global_textarea:focus { border-color: #0F8478 !important; box-shadow: 0 0 0 3px rgba(15,132,120,0.1) !important; background: #fff !important; }',
    '.checkout_form label { font-weight: 700 !important; font-size: 14px !important; color: #0F5E55 !important; margin-bottom: 6px !important; }',

    '.payment_card { border: 2px solid #A8DDD4 !important; border-radius: 12px !important; padding: 16px !important; margin-bottom: 12px !important; background: linear-gradient(to left, #EFFAF8, white, #EFFAF8) !important; transition: all 0.2s !important; }',
    '.payment_card_name { font-weight: 700 !important; font-size: 15px !important; color: #0F5E55 !important; }',
    '.payment_card_description { font-size: 13px !important; color: #3F8C81 !important; margin-top: 2px !important; }',
    '.radio_container { width: 22px !important; height: 22px !important; border-radius: 50% !important; border: 2px solid #A8DDD4 !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }',
    '.radio_circle { width: 12px !important; height: 12px !important; border-radius: 50% !important; background: #d1d5db !important; }',
    '.radio_circle[class*="bg-blue"] { background: #0F8478 !important; }',
    '.payment_card[class*="border-blue-600"] { border-color: #0F8478 !important; }',

    '.checkout_cart_items_container { border: 1px solid #A8DDD4 !important; border-radius: 12px !important; overflow: hidden !important; margin: 16px 0 !important; }',
    '.cart-item { padding: 16px !important; border-bottom: 1px solid #EFFAF8 !important; }',
    '.cart-item:last-child { border-bottom: none !important; }',
    '.cart-item h3[data-cart="item-name"] { font-weight: 700 !important; font-size: 14px !important; color: #0F5E55 !important; }',
    '.cart-item [data-cart="item-price"] { font-weight: 700 !important; color: #0F5E55 !important; }',

    '.cart-item-quantity-counter { background: rgba(15,132,120,0.05) !important; border: 1px solid rgba(15,132,120,0.2) !important; border-radius: 10px !important; padding: 4px !important; }',
    '.cart-item-quantity-counter button { border-radius: 8px !important; width: 32px !important; height: 32px !important; }',

    '[data-invoice="invoice"] { background: #EFFAF8 !important; border: 1px solid #A8DDD4 !important; border-radius: 12px !important; padding: 16px !important; margin-top: 16px !important; }',
    '[data-invoice="invoice-subtotal"], [data-invoice="invoice-shipping"], [data-invoice="invoice-total"] { display: flex !important; justify-content: space-between !important; padding: 8px 0 !important; }',
    '[data-invoice="invoice-total"] { border-top: 2px solid #0F8478 !important; margin-top: 8px !important; }',
    '[data-invoice="invoice-total-value"] { font-size: 18px !important; font-weight: 800 !important; color: #0F5E55 !important; }',

    '.checkout_buy_now { border-radius: 12px !important; font-size: 16px !important; font-weight: 700 !important; padding: 14px 24px !important; background: #0F8478 !important; color: #fff !important; border: none !important; }',
    '.fixed.bottom-0 { background: #fff !important; border-top: 1px solid #A8DDD4 !important; padding: 12px 16px !important; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important; box-shadow: 0 -4px 12px rgba(0,0,0,0.08) !important; }',
    '.select__control { border: 2px solid #A8DDD4 !important; border-radius: 12px !important; }',

    '.payment_card_content { display: flex !important; flex-direction: column !important; }',

    '.akkad-elec-box { display: none; margin-top: 10px; }',
    '.akkad-elec-box.show { display: flex !important; flex-direction: column !important; gap: 10px; }',
    '.akkad-elec-box a { display: block; padding: 10px 14px; background: #6d28d9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; }',
    '.akkad-elec-box .akkad-num-wrap { background: #f0f4ff; border: 1px dashed #93c5fd; border-radius: 8px; padding: 12px; }',
    '.akkad-elec-box .akkad-num-label { font-size: 13px; font-weight: 700; color: #1d4ed8; margin-bottom: 8px; }',
    '.akkad-elec-box .akkad-num { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #93c5fd; border-radius: 6px; padding: 10px 12px; }',
    '.akkad-elec-box .akkad-num span { font-size: 16px; font-weight: 700; color: #1d4ed8; direction: ltr; }',
    '.akkad-elec-box .akkad-num button { border: none; background: #2563eb; color: #fff; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; }',

    '.akkad-invoice { direction: rtl; width: 100%; background: linear-gradient(to bottom right, #EAF7F5, #DCF1EE, white); border: 2px solid #A8DDD4; border-radius: 12px; padding: 14px; font-family: Tajawal, sans-serif; color: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 16px; }',
    '.akkad-invoice-header { border-bottom: 2px solid #5EBFB1; padding-bottom: 14px; margin-bottom: 14px; }',
    '.akkad-invoice-brand { text-align: center; margin-bottom: 10px; }',
    '.akkad-invoice-brand h2 { font-size: 18px; font-weight: 900; color: #0F5E55; margin: 0; }',
    '.akkad-invoice-brand h2 span { color: #0E8478; }',
    '.akkad-invoice-brand p { font-size: 11px; font-weight: 600; color: #3F8C81; margin: 4px 0 0 0; }',
    '.akkad-invoice-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }',
    '.akkad-invoice-meta-label { font-weight: 700; font-size: 14px; }',
    '.akkad-invoice-meta-details { text-align: left; }',
    '.akkad-invoice-meta-details p { margin: 2px 0; direction: ltr; text-align: right; }',
    '.akkad-invoice-meta-details span { font-weight: 700; }',
    '.akkad-invoice-customer { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; font-size: 11px; }',
    '.akkad-invoice-customer-info { display: flex; flex-direction: column; gap: 3px; }',
    '.akkad-invoice-customer-info span { font-weight: 700; }',
    '.akkad-invoice-customer-count { text-align: left; }',
    '.akkad-invoice-table-wrapper { border-radius: 10px; overflow: hidden; border: 1px solid #A8DDD4; }',
    '.akkad-invoice-table { width: 100%; border-collapse: collapse; font-size: 12px; }',
    '.akkad-invoice-table thead tr { background: #0F8478; color: #fff; }',
    '.akkad-invoice-table th { border: 1px solid #0F8478; padding: 10px 4px; text-align: center; font-weight: 700; }',
    '.akkad-invoice-table td { border: 1px solid #A8DDD4; padding: 10px 6px; text-align: center; }',
    '.akkad-invoice-table td:nth-child(2) { text-align: right; font-weight: 600; font-size: 11px; }',
    '.akkad-invoice-table tbody tr:nth-child(odd) { background: #EFFAF8; }',
    '.akkad-invoice-table tfoot tr { background: #0F8478; color: #fff; }',
    '.akkad-invoice-table tfoot td { border: 1px solid #0F8478; padding: 10px 6px; font-weight: 900; }',
    '.akkad-invoice-table tfoot td:last-child { font-size: 13px; color: #FFD98A; }',
    '.akkad-invoice-table .item-total { font-weight: 700; color: #0F5E55; }',
    '.akkad-invoice-footer-msg { margin-top: 14px; border-radius: 10px; overflow: hidden; border: 1px solid #A8DDD4; }',
    '.akkad-invoice-footer-msg-top { background: linear-gradient(to left, #0F8478, #14A090); color: #fff; text-align: center; padding: 10px 14px; }',
    '.akkad-invoice-footer-msg-top p { font-weight: 900; font-size: 12px; margin: 0; }',
    '.akkad-invoice-footer-msg-top span { color: #FFD98A; }',
    '.akkad-invoice-row { display: flex !important; justify-content: space-between !important; padding: 6px 0 !important; font-size: 12px !important; }',
    '.akkad-invoice-row span:first-child { font-weight: 700 !important; color: #3F8C81 !important; }',
    '.akkad-invoice-discount span:last-child { color: #dc2626 !important; font-weight: 800 !important; }',
    '.akkad-invoice-shipping span:last-child { color: #0F5E55 !important; font-weight: 700 !important; }',
    '.akkad-invoice-total-row { display: flex !important; justify-content: space-between !important; padding: 10px 0 0 0 !important; margin-top: 6px !important; border-top: 2px solid #0F8478 !important; }',
    '.akkad-invoice-total-row span:first-child { font-weight: 800 !important; font-size: 14px !important; color: #0F5E55 !important; }',
    '.akkad-invoice-total-row span:last-child { font-weight: 900 !important; font-size: 16px !important; color: #0F5E55 !important; }',

    '.mt-2.flex.items-end.justify-between { background: #f0fdf9 !important; border: 1.5px solid #A8DDD4 !important; border-radius: 12px !important; padding: 14px 16px !important; margin-top: 14px !important; display: flex !important; align-items: flex-end !important; gap: 12px !important; }',
    '.mt-2.flex.items-end.justify-between label { font-weight: 700 !important; font-size: 14px !important; color: #0F5E55 !important; margin-bottom: 6px !important; }',
    '.mt-2.flex.items-end.justify-between .relative { flex: 1 !important; }',
    '.mt-2.flex.items-end.justify-between .global_input { border: 2px solid #A8DDD4 !important; border-radius: 10px !important; padding: 10px 14px !important; font-size: 14px !important; height: 42px !important; background: #fff !important; }',
    '.mt-2.flex.items-end.justify-between .global_input:focus { border-color: #0F8478 !important; box-shadow: 0 0 0 3px rgba(15,132,120,0.1) !important; outline: none !important; }',
    '.mt-2.flex.items-end.justify-between button { background: #0F8478 !important; color: #fff !important; border: none !important; border-radius: 10px !important; padding: 10px 24px !important; font-weight: 700 !important; font-size: 14px !important; white-space: nowrap !important; height: 42px !important; transition: all 0.2s !important; cursor: pointer !important; }',
    '.mt-2.flex.items-end.justify-between button:hover { background: #0D6F64 !important; transform: scale(1.02) !important; }',

    '.mt-2.flex.items-center.justify-between { background: linear-gradient(135deg, #fef2f2, #fff1f1) !important; border: 1.5px solid #f87171 !important; border-radius: 12px !important; padding: 14px 16px !important; margin-top: 14px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; }',
    '.mt-2.flex.items-center.justify-between p { font-weight: 700 !important; font-size: 15px !important; color: #b91c1c !important; margin: 0 !important; display: flex !important; align-items: center !important; gap: 6px !important; }',
    '.mt-2.flex.items-center.justify-between p::before { content: "🏷" !important; font-size: 14px !important; }',
    '.mt-2.flex.items-center.justify-between button { background: #fee2e2 !important; border: 1.5px solid #fca5a5 !important; color: #b91c1c !important; border-radius: 8px !important; padding: 8px 16px !important; font-weight: 700 !important; font-size: 13px !important; transition: all 0.2s !important; cursor: pointer !important; }',
    '.mt-2.flex.items-center.justify-between button:hover { background: #dc2626 !important; border-color: #dc2626 !important; color: #fff !important; transform: scale(1.02) !important; }',

    '@media (max-width: 1024px) { .checkout_order_summary { margin-bottom: 140px; } }',
    '@media (max-width: 480px) { .akkad-invoice-table { font-size: 10px; } .akkad-invoice-table th, .akkad-invoice-table td { padding: 8px 2px; } .akkad-invoice-table td:nth-child(4), .akkad-invoice-table th:nth-child(4) { display: none; } .akkad-invoice-table td:nth-child(5), .akkad-invoice-table th:nth-child(5) { display: none; } }'
  ].join('\n');

  document.head.appendChild(style);

  function run() {
    fixPayments();
    injectInvoice();
    fixInputs();
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
          '<p class="akkad-invoice-meta-label">نموذج طلب</p>' +
          '<div class="akkad-invoice-meta-details">' +
            '<p><span>التاريخ:</span> ' + new Date().toLocaleDateString('ar-EG', {day:'2-digit',month:'2-digit',year:'numeric'}) + '</p>' +
            '<p><span>رقم الطلب:</span> #' + Math.floor(100000 + Math.random() * 900000) + '</p>' +
          '</div>' +
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
    setInterval(update, 1000);
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

  new MutationObserver(function() {
    if (!document.querySelector('.akkad-elec-box')) run();
    if (!document.querySelector('.akkad-invoice')) run();
  }).observe(document.body, { childList: true, subtree: true });
})();
