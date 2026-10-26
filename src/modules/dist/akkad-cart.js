/* v2-disable-cart-image-links */
try {
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function disableCartImageLinks() {
        document.querySelectorAll('[data-cart="item-image-wrapper"]').forEach(function (link) {
            link.removeAttribute("href");
            link.style.cursor = "default";
            link.onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            };
        });
    }

    var observer = null;
    var cartTimer = null;

    function isCartRoute() {
        var pathname = window.location.pathname;
        return pathname === "/cart" ||
            pathname.indexOf("/cart/") === 0 ||
            pathname.indexOf("/checkout") === 0;
    }

    function syncCartRoute() {
        if (!isCartRoute()) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(cartTimer);
            cartTimer = null;
            return;
        }

        disableCartImageLinks();
        if (observer || !document.body) return;

        observer = new MutationObserver(function () {
            clearTimeout(cartTimer);
            cartTimer = setTimeout(disableCartImageLinks, 250);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncCartRoute);
    syncCartRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: v2-disable-cart-image-links", error); }
