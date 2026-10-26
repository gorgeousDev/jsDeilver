(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function moveProductDetails() {
        var policies = document.querySelector(".flex.flex-col.mt-4.rounded-xl.border");
        var details = document.querySelector(".product_tabs_container");

        if (!policies || !details) return;

        if (policies.previousElementSibling !== details) {
            policies.parentNode.insertBefore(details, policies);
        }
    }

    var observer = null;
    var moveTimer = null;

    function syncProductRoute() {
        if (window.location.pathname.indexOf("/products/") !== 0) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(moveTimer);
            moveTimer = null;
            return;
        }

        moveProductDetails();
        if (observer || !document.body) return;

        observer = new MutationObserver(function () {
            clearTimeout(moveTimer);
            moveTimer = setTimeout(moveProductDetails, 250);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncProductRoute);
    syncProductRoute();
})();
