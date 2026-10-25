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

    moveProductDetails();
    var moveTimer;
    new MutationObserver(function () {
        clearTimeout(moveTimer);
        moveTimer = setTimeout(moveProductDetails, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
