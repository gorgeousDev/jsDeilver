/* =========================================
   10. Funnel Price Overrides
   ========================================= */
(function () {
    /* The path used to be checked once, at parse time, so the overrides only
       appeared when the store was opened directly on a funnel - arriving at one
       through a soft navigation left the prices untouched. The route is now
       watched, and the interval only runs while a funnel is actually on
       screen instead of on every page of the store. */
    var timer = null;

    function isFunnel() {
        return location.href.includes("funnels");
    }

    function applyFunnelPrices() {
        var shipping = document.querySelector(".shipping_cost");
        if (shipping) {
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
        if (total) {
            total.innerHTML = '\
                419.99\
                <span class="font-[inherit]">ج.م</span>';
        }

        document.querySelectorAll("#salePrice").forEach(function (salePrice) {
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
        if (isFunnel()) {
            if (timer) return;
            applyFunnelPrices();
            timer = setInterval(applyFunnelPrices, 200);
            return;
        }
        if (!timer) return;
        clearInterval(timer);
        timer = null;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", syncFunnel);
    } else {
        syncFunnel();
    }

    var funnelPush = history.pushState;
    var funnelReplace = history.replaceState;
    history.pushState = function () { var r = funnelPush.apply(this, arguments); setTimeout(syncFunnel, 0); return r; };
    history.replaceState = function () { var r = funnelReplace.apply(this, arguments); setTimeout(syncFunnel, 0); return r; };
    window.addEventListener("popstate", syncFunnel);
})();
