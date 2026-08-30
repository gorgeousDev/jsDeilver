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

    '.payment_card_img_container { display: none !important; }',

    '.akkad-elec-box { display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #A8DDD4; }',
    '.akkad-elec-box.show { display: block; }',
    '.akkad-elec-box a { display: block; margin-bottom: 10px; padding: 10px 14px; background: #6d28d9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; }',
    '.akkad-elec-box .akkad-num { display: flex; align-items: center; justify-content: space-between; background: #f0f4ff; border: 1px dashed #93c5fd; border-radius: 8px; padding: 10px 12px; }',
    '.akkad-elec-box .akkad-num span { font-size: 16px; font-weight: 700; color: #1d4ed8; direction: ltr; }',
    '.akkad-elec-box .akkad-num button { border: none; background: #2563eb; color: #fff; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; }',

    '@media (max-width: 1024px) { .checkout_order_summary { margin-bottom: 140px; } }'
  ].join('\n');

  document.head.appendChild(style);

  function run() {
    fixPayments();
  }

  function fixPayments() {
    var cards = document.querySelectorAll('.payment_card');
    if (cards.length < 2) return;
    if (document.querySelector('.akkad-elec-box')) return;

    var electronic = cards[1];

    var box = document.createElement('div');
    box.className = 'akkad-elec-box';
    box.id = 'akkad-elec-box';
    box.innerHTML =
      '<a href="https://ipn.eg/S/akkad.one/instapay/3yzMRQ" target="_blank">💜 فتح رابط InstaPay</a>' +
      '<div class="akkad-num">' +
        '<span>01508331823</span>' +
        '<button onclick="navigator.clipboard.writeText(\'01508331823\');this.textContent=\'✔ تم\';var b=this;setTimeout(function(){b.textContent=\'نسخ\';},2000)">نسخ</button>' +
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
