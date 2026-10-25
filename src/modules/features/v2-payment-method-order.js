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

    setTimeout(swapPayments, 1000);

    var swapTimer;
    new MutationObserver(function () {
        clearTimeout(swapTimer);
        swapTimer = setTimeout(swapPayments, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
