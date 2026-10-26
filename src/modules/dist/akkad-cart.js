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

    disableCartImageLinks();
    var cartTimer;
    new MutationObserver(function () {
        clearTimeout(cartTimer);
        cartTimer = setTimeout(disableCartImageLinks, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
} catch (error) { console.error("[Akkad] feature failed: v2-disable-cart-image-links", error); }
