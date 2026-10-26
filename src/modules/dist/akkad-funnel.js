/* v2-funnel-price-overrides */
try {
/* =========================================
   10. Funnel Price Overrides
   ========================================= */
(function () {
    var observer = null;
    var applyTimer = null;

    function isFunnel() {
        return window.location.href.includes("funnels");
    }

    function normalizedText(node) {
        return node.textContent.replace(/\s/g, "");
    }

    function applyFunnelPrices() {
        var shipping = document.querySelector(".shipping_cost");
        var shippingChip = shipping && shipping.querySelector("span");
        if (shipping && (
            normalizedText(shipping) !== "50ج.م" ||
            !shippingChip ||
            shippingChip.style.display !== "inline-block"
        )) {
            shipping.innerHTML = '\
                <span style="\
                    display:inline-block;\
                    background:#9896a4;\
                    border:1px solid #9896a4;\
                    border-radius:8px;\
                    padding:4px 10px;\
                    font-size:14px;\
                    font-weight:700;\
                    color:#374151;\
                ">\
                    50 ج.م\
                </span>';
        }

        var total = document.querySelector(".total_price");
        if (total && (
            normalizedText(total) !== "419.99ج.م" ||
            !total.innerHTML.includes("font-[inherit]")
        )) {
            total.innerHTML = '\
                419.99\
                <span class="font-[inherit]">ج.م</span>';
        }

        document.querySelectorAll("#salePrice").forEach(function (salePrice) {
            var salePriceContent = salePrice.querySelector("span");
            if (
                normalizedText(salePrice) === "369.99ج.م" &&
                salePriceContent &&
                salePriceContent.style.display === "inline-flex"
            ) return;
            salePrice.innerHTML = '\
                <span style="\
                    display:inline-flex;\
                    align-items:center;\
                    gap:4px;\
                    white-space:nowrap;\
                    background:#f8fafc;\
                    border:none;\
                    border-radius:10px;\
                    padding:6px 12px;\
                    font-size:30px;\
                    font-weight:800;\
                    color:#111827;\
                    line-height:1;\
                ">\
                    <span>369.99</span>\
                    <span style="\
                        font-size:30px;\
                        font-weight:800;\
                        white-space:nowrap;\
                    ">\
                        ج.م\
                    </span>\
                </span>';
        });
    }

    function syncFunnel() {
        if (!isFunnel()) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(applyTimer);
            applyTimer = null;
            return;
        }

        applyFunnelPrices();
        if (observer || !document.body) return;
        observer = new MutationObserver(function () {
            clearTimeout(applyTimer);
            applyTimer = setTimeout(applyFunnelPrices, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncFunnel);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", syncFunnel);
    } else {
        syncFunnel();
    }
})();
} catch (error) { console.error("[Akkad] feature failed: v2-funnel-price-overrides", error); }
