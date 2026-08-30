(function () {
    'use strict';

    /* ==========================================
       PROMO SYSTEM — 10% discount, max 200 EGP
       Paste this entire block in your <head>
    ========================================== */

    var PROMO_PERCENT = 10;
    var MAX_DISCOUNT = 200;
    var STORAGE_KEY = 'akkad_active_promo';

    /* ==========================================
       PROMO CODES — edit this array to add/remove
    ========================================== */
    var PROMO_CODES = [
        'ZD@UQ3Q','T-9XT1N','3&XF0T@','%S#9H1$','1#%M83N',
        'LC@G_2D','4$EVQ&F','$22BE0Z','&9&1RA7','24A#F*0',
        'HHY&-N0','0J78QJ&','5AQ-TLT','G-_RJ35','H1SGOC&',
        'S9$Y76K','Z5#Q$JM','GQ*#8GD','7RT@WA-','@C08@2K',
        '_G$QJ52','13@$_OR','55TC%46','WZH&3D5','D502$MU',
        'IOD#S7K','1GS*2IR','JG8#-_W','33QN_22','Y19D%F2',
        'COOBRA10'
    ];

    /* build Set once for O(1) lookup */
    var CODES_SET = {};
    for (var i = 0; i < PROMO_CODES.length; i++) {
        CODES_SET[PROMO_CODES[i].toUpperCase()] = true;
    }

    /* ==========================================
       Helpers
    ========================================== */

    function isCheckout() {
        var p = location.pathname;
        return p === '/checkout' || p.indexOf('/checkout/') === 0;
    }

    function normalizeCode(v) {
        return String(v || '').trim().toUpperCase();
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
       Promo Storage
    ========================================== */

    function savePromoCode(code) {
        var normalized = normalizeCode(code);
        if (!CODES_SET[normalized]) return false;
        try { sessionStorage.setItem(STORAGE_KEY, normalized); } catch (e) {}
        return true;
    }

    function getActivePromo() {
        try {
            var code = normalizeCode(sessionStorage.getItem(STORAGE_KEY));
            return CODES_SET[code] ? code : null;
        } catch (e) { return null; }
    }

    function clearPromo() {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    /* ==========================================
       Input Monitoring
    ========================================== */

    function inspectInput(target) {
        if (!target) return;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;
        var value = normalizeCode(target.value);
        if (CODES_SET[value]) {
            savePromoCode(value);
            scheduleUpdate();
        }
    }

    document.addEventListener('input', function (e) { inspectInput(e.target); }, true);
    document.addEventListener('change', function (e) { inspectInput(e.target); }, true);
    document.addEventListener('paste', function (e) {
        var t = e.target;
        setTimeout(function () { inspectInput(t); }, 0);
    }, true);

    /* ==========================================
       DOM Helpers
    ========================================== */

    function findDiscountElement(invoice) {
        if (!invoice) return null;
        var ps = invoice.querySelectorAll('p');
        for (var i = 0; i < ps.length; i++) {
            var t = (ps[i].textContent || '').trim();
            if (t.indexOf('\u062E\u0635\u0645') === 0 || t.indexOf('\u0627\u0644\u062E\u0635\u0645') === 0) {
                return ps[i];
            }
        }
        return null;
    }

    function setMoney(el, amount) {
        if (!el) return;
        var current = getMoney(el);
        if (Number.isFinite(current) && Math.abs(current - amount) < 0.001 && el.textContent.indexOf('\u062C.\u0645') !== -1) return;
        el.replaceChildren(document.createTextNode(formatMoney(amount)), createCurrency());
    }

    function setDiscountText(el, amount) {
        if (!el) return;
        var current = getMoney(el);
        if (Number.isFinite(current) && Math.abs(current - amount) < 0.001 && el.textContent.indexOf('\u062C.\u0645') !== -1) return;
        el.replaceChildren(document.createTextNode('\u062E\u0635\u0645: ' + formatMoney(amount) + ' '), createCurrency());
    }

    /* ==========================================
       Main Update
    ========================================== */

    function updatePromoDisplay() {
        if (!isCheckout()) return;

        var activeCode = getActivePromo();
        if (!activeCode) return;

        var invoice = document.querySelector('[data-invoice="invoice"]');
        if (!invoice) return;

        var subtotalEl = invoice.querySelector('[data-invoice="invoice-subtotal-value"]');
        var originalTotalEl = invoice.querySelector('[data-invoice="invoice-total-value"]');
        var discountedRow = invoice.querySelector('[data-invoice="invoice-discounted-total"]');
        var discountedTotalEl = invoice.querySelector('[data-invoice="invoice-discounted-total-value"]');
        var discountEl = findDiscountElement(invoice);

        if (!subtotalEl || !originalTotalEl || !discountedRow || !discountedTotalEl || !discountEl) return;

        var subtotal = getMoney(subtotalEl);
        var originalTotal = getMoney(originalTotalEl);

        if (!Number.isFinite(subtotal) || !Number.isFinite(originalTotal)) return;

        var calculatedDiscount = subtotal * (PROMO_PERCENT / 100);
        var finalDiscount = Math.min(calculatedDiscount, MAX_DISCOUNT);
        var visualTotal = Math.max(0, originalTotal - finalDiscount);

        setDiscountText(discountEl, finalDiscount);
        setMoney(discountedTotalEl, visualTotal);

        invoice.dataset.akkadPromo = activeCode;
        invoice.dataset.akkadDiscount = String(finalDiscount);
        invoice.dataset.akkadVisualTotal = String(visualTotal);
    }

    /* ==========================================
       Cancel Button
    ========================================== */

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var invoice = btn.closest('[data-invoice="invoice"]');
        if (!invoice) return;
        if ((btn.textContent || '').trim() === '\u0625\u0644\u063A\u0627\u0621') {
            clearPromo();
            setTimeout(scheduleUpdate, 100);
        }
    }, true);

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
       MutationObserver + Route Watcher
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
        document.querySelectorAll('input, textarea').forEach(inspectInput);
        scheduleUpdate();
        setInterval(function () { if (isCheckout()) scheduleUpdate(); }, 750);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

})();
