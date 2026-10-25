(function () {
    'use strict';

    var MAX_DISCOUNT = 200;
    var INVOICE_SELECTOR = '[data-invoice="invoice"]';
    var SAVINGS_SELECTOR = '[data-invoice="invoice-total-savings"]';
    var TOTAL_SELECTOR = '[data-invoice="invoice-total-value"]';
    var MOBILE_SAVINGS_SELECTOR = '[data-invoice="checkout-mobile-total-savings"]';
    var observer = null;
    var observedBody = null;
    var waitingForBody = false;
    var updateScheduled = false;

    function isCheckout() {
        var path = window.location.pathname;
        return path === '/checkout' || path.indexOf('/checkout/') === 0;
    }

    function normalizeDigits(value) {
        return String(value)
            .replace(/[\u0660-\u0669]/g, function (digit) {
                return String('\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'.indexOf(digit));
            })
            .replace(/[\u06F0-\u06F9]/g, function (digit) {
                return String('\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9'.indexOf(digit));
            });
    }

    function parseAmount(value) {
        var normalized = normalizeDigits(value)
            .replace(/[\s,\u066C]/g, '')
            .replace(/\u066B/g, '.');
        var match = normalized.match(/-?\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : NaN;
    }

    function formatAmount(amount) {
        var rounded = Math.round(amount * 100) / 100;
        return new Intl.NumberFormat('en-EG', {
            maximumFractionDigits: 2
        }).format(rounded);
    }

    function readOriginalAmount(element, currentAmount) {
        // React can reuse these nodes, so recover the backend value rather than
        // applying the cap repeatedly to our own displayed value.
        var renderedValue = element.getAttribute('data-akkad-promo-rendered');
        var originalValue = element.getAttribute('data-akkad-promo-original');
        if (renderedValue === null || originalValue === null) return currentAmount;

        var renderedAmount = Number(renderedValue);
        var originalAmount = Number(originalValue);

        if (Number.isFinite(renderedAmount) &&
            Number.isFinite(originalAmount) &&
            Math.abs(currentAmount - renderedAmount) < 0.001) {
            return originalAmount;
        }
        return currentAmount;
    }

    function writeAmount(element, amount) {
        var amountPattern = /-?\s*[\d\u0660-\u0669\u06F0-\u06F9](?:[\d\u0660-\u0669\u06F0-\u06F9.,\u066B\u066C\s]*[\d\u0660-\u0669\u06F0-\u06F9])?/;
        var walker = document.createTreeWalker(element, 4);
        var textNode;

        while ((textNode = walker.nextNode())) {
            if (!amountPattern.test(textNode.nodeValue || '')) continue;
            textNode.nodeValue = textNode.nodeValue.replace(amountPattern, formatAmount(amount));
            return true;
        }
        return false;
    }

    function applyDiscountCap(savingsElement, totalElement) {
        if (!savingsElement || !totalElement) return;

        var currentSavings = parseAmount(savingsElement.textContent);
        var currentTotal = parseAmount(totalElement.textContent);
        if (!Number.isFinite(currentSavings) || !Number.isFinite(currentTotal)) return;

        var originalSavings = readOriginalAmount(savingsElement, currentSavings);
        var originalTotal = readOriginalAmount(totalElement, currentTotal);
        var positiveSavings = Math.max(0, originalSavings);
        var displayedSavings = Math.min(positiveSavings, MAX_DISCOUNT);
        var displayedTotal = Math.max(0, originalTotal + positiveSavings - displayedSavings);

        if (Math.abs(currentSavings - displayedSavings) >= 0.001 &&
            !writeAmount(savingsElement, displayedSavings)) return;
        if (Math.abs(currentTotal - displayedTotal) >= 0.001 &&
            !writeAmount(totalElement, displayedTotal)) return;

        savingsElement.setAttribute('data-akkad-promo-original', String(originalSavings));
        savingsElement.setAttribute('data-akkad-promo-rendered', String(displayedSavings));
        totalElement.setAttribute('data-akkad-promo-original', String(originalTotal));
        totalElement.setAttribute('data-akkad-promo-rendered', String(displayedTotal));
    }

    function getMobileTotal(savingsRow) {
        // The collapsed mobile summary puts its total on the row immediately
        // before savings; desktop and expanded summaries use invoice selectors.
        var totalRow = savingsRow.previousElementSibling;
        var summary = savingsRow.closest('.checkout_mobile_total_toggle');
        if (!totalRow || (summary && !summary.contains(totalRow))) return null;

        var values = totalRow.querySelectorAll('span');
        for (var i = 0; i < values.length; i++) {
            if (Number.isFinite(parseAmount(values[i].textContent))) return values[i];
        }
        return null;
    }

    function removeLegacyNotice() {
        var notices = document.querySelectorAll('.akkad-promo-cap-note');
        for (var i = 0; i < notices.length; i++) {
            if (notices[i].parentNode) notices[i].parentNode.removeChild(notices[i]);
        }
    }

    function updatePromoDisplay() {
        if (!isCheckout()) return;

        removeLegacyNotice();

        // This is display-only. EasyOrders still calculates and charges the
        // original order total; we only align the savings and shown total.
        var invoices = document.querySelectorAll(INVOICE_SELECTOR);
        for (var i = 0; i < invoices.length; i++) {
            applyDiscountCap(
                invoices[i].querySelector(SAVINGS_SELECTOR),
                invoices[i].querySelector(TOTAL_SELECTOR)
            );
        }

        var mobileRows = document.querySelectorAll(MOBILE_SAVINGS_SELECTOR);
        for (var j = 0; j < mobileRows.length; j++) {
            applyDiscountCap(mobileRows[j], getMobileTotal(mobileRows[j]));
        }
    }

    function scheduleUpdate() {
        if (updateScheduled) return;
        updateScheduled = true;
        window.requestAnimationFrame(function () {
            updateScheduled = false;
            updatePromoDisplay();
        });
    }

    function syncObserver() {
        if (!isCheckout()) {
            if (observer) observer.disconnect();
            observer = null;
            observedBody = null;
            return;
        }

        if (!document.body) {
            if (!waitingForBody) {
                waitingForBody = true;
                document.addEventListener('DOMContentLoaded', function onBodyReady() {
                    waitingForBody = false;
                    syncObserver();
                }, { once: true });
            }
            return;
        }

        if (observedBody !== document.body) {
            if (observer) observer.disconnect();
            observedBody = document.body;
            // Observe only while checkout is active to avoid work on other pages.
            observer = new MutationObserver(scheduleUpdate);
            observer.observe(observedBody, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
        scheduleUpdate();
    }

    function installRouteEvents() {
        if (!window.__akkadRouteWatcherInstalled) {
            window.__akkadRouteWatcherInstalled = true;
            var originalPushState = window.history.pushState;
            var originalReplaceState = window.history.replaceState;

            window.history.pushState = function () {
                var result = originalPushState.apply(this, arguments);
                window.dispatchEvent(new Event('akkad-route-change'));
                return result;
            };
            window.history.replaceState = function () {
                var result = originalReplaceState.apply(this, arguments);
                window.dispatchEvent(new Event('akkad-route-change'));
                return result;
            };
            window.addEventListener('popstate', function () {
                window.dispatchEvent(new Event('akkad-route-change'));
            });
        }

        window.addEventListener('akkad-route-change', syncObserver);
        window.addEventListener('hashchange', syncObserver);
    }

    installRouteEvents();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncObserver, { once: true });
    } else {
        syncObserver();
    }
})();
