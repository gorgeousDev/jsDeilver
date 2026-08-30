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

    '#transfer-receipt-upload { display: none !important; }',
    '.payment_card_img_container { display: none !important; }',

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

    '.akkad-elec-box { display: none; flex-direction: column; gap: 14px; margin-top: 14px; padding-top: 14px; border-top: 1px dashed #A8DDD4; }',
    '.akkad-elec-box.show { display: flex; }',
    '.akkad-elec-option { border-radius: 14px; padding: 18px; border: 1px solid; display: flex; flex-direction: column; align-items: center; text-align: center; }',
    '.akkad-elec-title { font-size: 16px; font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }',
    '.akkad-elec-desc { font-size: 12px; opacity: 0.7; margin-bottom: 14px; line-height: 1.4; }',
    '.akkad-elec-instapay { border-color: #ede9fe; background: linear-gradient(135deg, #faf7ff, #fff); }',
    '.akkad-elec-instapay .akkad-elec-title { color: #4c1d95; }',
    '.akkad-elec-instapay .akkad-elec-desc { color: #6d28d9; }',
    '.akkad-elec-wallet { border-color: #dbeafe; background: linear-gradient(135deg, #f8fbff, #fff); }',
    '.akkad-elec-wallet .akkad-elec-title { color: #1d4ed8; }',
    '.akkad-elec-wallet .akkad-elec-desc { color: #2563eb; }',
    '.akkad-elec-btn { display: flex; align-items: center; justify-content: center; padding: 14px 28px; background: linear-gradient(135deg, #6d28d9, #7c3aed); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; width: 100%; box-shadow: 0 4px 12px rgba(109,40,217,0.3); transition: transform 0.15s; }',
    '.akkad-elec-btn:active { transform: scale(0.97); }',
    '.akkad-elec-num-box { width: 100%; background: #fff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 10px; }',
    '.akkad-elec-num { font-size: 24px; font-weight: 800; color: #1d4ed8; letter-spacing: 1px; direction: ltr; display: block; }',
    '.akkad-elec-copy { border: none; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; width: 100%; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: transform 0.15s; }',
    '.akkad-elec-copy:active { transform: scale(0.97); }',

    '@media (max-width: 480px) { .akkad-elec-option { padding: 14px; } .akkad-elec-title { font-size: 14px; } .akkad-elec-btn, .akkad-elec-copy { padding: 16px; font-size: 17px; } .akkad-elec-num { font-size: 22px; } }',
    '@media (max-width: 1024px) { .checkout_order_summary { margin-bottom: 140px; } }'
  ].join('\n');

  document.head.appendChild(style);

  function run() {
    fixPayments();
    hideSenderNumber();
  }

  function fixPayments() {
    var cards = document.querySelectorAll('.payment_card');
    if (cards.length < 2) return;
    if (document.querySelector('.akkad-elec-box')) return;

    var electronic = cards[1];

    var box = document.createElement('div');
    box.className = 'akkad-elec-box';
    box.id = 'akkad-elec-box';
    box.innerHTML = '<div class="akkad-elec-option akkad-elec-instapay">' +
      '<div class="akkad-elec-title">💜 الدفع عبر InstaPay</div>' +
      '<div class="akkad-elec-desc">حوّل من أي بنك أو محفظة عبر تطبيق InstaPay</div>' +
      '<a href="https://ipn.eg/S/akkad.one/instapay/3yzMRQ" target="_blank" class="akkad-elec-btn">فتح رابط الدفع</a>' +
      '</div>' +
      '<div class="akkad-elec-option akkad-elec-wallet">' +
      '<div class="akkad-elec-title">📱 الدفع عبر محفظة الكاش</div>' +
      '<div class="akkad-elec-desc">أرسل المبلغ على هذا الرقم</div>' +
      '<div class="akkad-elec-num-box"><span class="akkad-elec-num">01508331823</span></div>' +
      '<button class="akkad-elec-copy" onclick="navigator.clipboard.writeText(\'01508331823\');this.textContent=\'✔ تم النسخ\';var b=this;setTimeout(function(){b.textContent=\'نسخ الرقم\';},2000)">نسخ الرقم</button>' +
      '</div>';
    electronic.appendChild(box);

    electronic.addEventListener('click', function(e) {
      if (e.target.closest('.akkad-elec-box')) return;
      box.classList.add('show');
    }, true);

    var cod = cards[0];
    cod.addEventListener('click', function() {
      box.classList.remove('show');
    }, true);
  }

  function hideSenderNumber() {
    var el = document.getElementById('transfer-receipt-upload');
    if (el) el.style.display = 'none';
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
  }).observe(document.body, { childList: true, subtree: true });
})();
