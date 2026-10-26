(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function swapPayments() {
        var container = document.querySelector(".payments_container");
        if (!container) return;

        var cards = Array.from(container.children);
        var transfer = cards.find(function (element) {
            return element.textContent.includes("صورة التحويل");
        });
        var cashOnDelivery = cards.find(function (element) {
            return element.textContent.includes("دفع عند الاستلام");
        });

        if (!transfer || !cashOnDelivery) return;

        if (container.firstElementChild !== cashOnDelivery) {
            container.insertBefore(cashOnDelivery, transfer);
        }
    }

    var observer = null;
    var swapTimer = null;

    function syncCheckoutRoute() {
        if (window.location.pathname.indexOf("/checkout") !== 0) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(swapTimer);
            swapTimer = null;
            return;
        }

        swapPayments();
        if (observer || !document.body) return;

        observer = new MutationObserver(function () {
            clearTimeout(swapTimer);
            swapTimer = setTimeout(swapPayments, 250);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncCheckoutRoute);
    syncCheckoutRoute();
})();
