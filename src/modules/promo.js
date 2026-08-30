(function () {
    'use strict';

    /* ==========================================
       PROMO SYSTEM — 10% discount, max 200 EGP
       Auto-detects EasyOrders discount and caps it
    ========================================== */

    var MAX_DISCOUNT = 200;
    var PROMO_PERCENT = 10;

    function isCheckout() {
        var p = location.pathname;
        return p === '/checkout' || p.indexOf('/checkout/') === 0;
    }

    function normalizeDigits(v) {
        return String(v)
            .replace(/[\u0660-\u0669]/g, function (d) {
                return String('\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'.indexOf(d));
            })
            .replace(/[\u06F0-\u06F9]/g, function (d) {
                return String('\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9'.indexOf(d));
            });
    }

    function getMoney(el) {
        if (!el) return NaN;
        var text = normalizeDigits(el.textContent || '').replace(/,/g, '');
        var m = text.match(/-?\d+(?:\.\d+)?/);
        return m ? parseFloat(m[0]) : NaN;
    }

    function formatMoney(n) {
        n = Math.round(n * 100) / 100;
        return n.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    }

    function createCurrency() {
        var span = document.createElement('span');
        span.className = 'font-[inherit]';
        span.textContent = '\u062C.\u0645';
        return span;
    }

    /* ==========================================
       Find discount line — searches all elements
    ========================================== */

    function findDiscountRow(invoice) {
        if (!invoice) return null;

        /* look inside the invoice's direct children divs */
        var divs = invoice.querySelectorAll('div');
        for (var i = 0; i < divs.length; i++) {
            var p = divs[i].querySelector('p');
            if (!p) continue;
            var t = (p.textContent || '').trim();
            if (t.indexOf('\u062E\u0635\u0645') === 0 || t.indexOf('\u0627\u0644\u062E\u0635\u0645') === 0) {
                return { row: divs[i], textEl: p };
            }
        }

        /* fallback: any <p> starting with خصم */
        var ps = invoice.querySelectorAll('p');
        for (var j = 0; j < ps.length; j++) {
            var txt = (ps[j].textContent || '').trim();
            if (txt.indexOf('\u062E\u0635\u0645') === 0 || txt.indexOf('\u0627\u0644\u062E\u0635\u0645') === 0) {
                return { row: ps[j].parentElement, textEl: ps[j] };
            }
        }

        return null;
    }

    /* ==========================================
       Main Update
    ========================================== */

    function updatePromoDisplay() {
        if (!isCheckout()) return;

        var invoice = document.querySelector('[data-invoice="invoice"]');
        if (!invoice) return;

        var subtotalEl = invoice.querySelector('[data-invoice="invoice-subtotal-value"]');
        var originalTotalEl = invoice.querySelector('[data-invoice="invoice-total-value"]');
        var discountedRow = invoice.querySelector('[data-invoice="invoice-discounted-total"]');
        var discountedTotalEl = invoice.querySelector('[data-invoice="invoice-discounted-total-value"]');

        if (!subtotalEl || !originalTotalEl || !discountedRow || !discountedTotalEl) return;

        var subtotal = getMoney(subtotalEl);
        var originalTotal = getMoney(originalTotalEl);
        var currentDiscountedTotal = getMoney(discountedTotalEl);

        if (!Number.isFinite(subtotal) || !Number.isFinite(originalTotal)) return;

        /* find the discount line */
        var discount = findDiscountRow(invoice);
        if (!discount) return;

        var currentDiscount = getMoney(discount.textEl);

        /* calculate what the discount SHOULD be (capped) */
        var expectedDiscount = Math.min(subtotal * (PROMO_PERCENT / 100), MAX_DISCOUNT);

        /* if current discount is already correct, skip */
        if (Number.isFinite(currentDiscount) && Math.abs(currentDiscount - expectedDiscount) < 0.001) {
            return;
        }

        /* override discount text */
        discount.textEl.replaceChildren(
            document.createTextNode('\u062E\u0635\u0645: ' + formatMoney(expectedDiscount) + ' '),
            createCurrency()
        );

        /* override discounted total */
        var visualTotal = Math.max(0, originalTotal - expectedDiscount);
        discountedTotalEl.replaceChildren(
            document.createTextNode(formatMoney(visualTotal)),
            createCurrency()
        );

        /* debug info */
        invoice.dataset.promoOriginal = String(currentDiscount);
        invoice.dataset.promoCapped = String(expectedDiscount);
    }

    /* ==========================================
       Scheduler
    ========================================== */

    var scheduled = false;

    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            updatePromoDisplay();
        });
    }

    /* ==========================================
       MutationObserver
    ========================================== */

    if (document.body) {
        new MutationObserver(scheduleUpdate).observe(document.body, {
            childList: true, subtree: true, characterData: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            new MutationObserver(scheduleUpdate).observe(document.body, {
                childList: true, subtree: true, characterData: true
            });
        }, { once: true });
    }

    /* Next.js route changes */
    if (!window.__akkadRouteWatcherInstalled) {
        window.__akkadRouteWatcherInstalled = true;

        var _push = history.pushState;
        var _replace = history.replaceState;

        history.pushState = function () {
            var r = _push.apply(this, arguments);
            window.dispatchEvent(new Event('akkad-route-change'));
            return r;
        };
        history.replaceState = function () {
            var r = _replace.apply(this, arguments);
            window.dispatchEvent(new Event('akkad-route-change'));
            return r;
        };
        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event('akkad-route-change'));
        });
        window.addEventListener('akkad-route-change', function () {
            setTimeout(scheduleUpdate, 0);
            setTimeout(scheduleUpdate, 100);
            setTimeout(scheduleUpdate, 300);
            setTimeout(scheduleUpdate, 800);
        });
    }

    /* ==========================================
       Init
    ========================================== */

    function start() {
        scheduleUpdate();
        setInterval(function () { if (isCheckout()) scheduleUpdate(); }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

})();
