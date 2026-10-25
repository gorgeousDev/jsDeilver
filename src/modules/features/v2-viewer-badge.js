(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function styleViewer() {
        document.querySelectorAll("span").forEach(function (badge) {
            if (!/^\d+$/.test(badge.textContent.trim())) return;

            var parent = badge.parentElement;
            if (!parent || !parent.textContent.includes("يشاهد هذا المنتج")) return;

            parent.style.marginTop = "18px";
            parent.style.marginBottom = "20px";
            parent.style.background = "#44174E";
            parent.style.border = "1px solid #662249";
            parent.style.borderRadius = "12px";
            parent.style.padding = "12px 16px";
            parent.style.color = "#ffffff";
            parent.style.fontWeight = "700";

            badge.style.background = "#A34054";
            badge.style.color = "#ffffff";
            badge.style.padding = "3px 10px";
            badge.style.borderRadius = "999px";
            badge.style.fontWeight = "800";
        });
    }

    styleViewer();
    var viewerTimer;
    new MutationObserver(function () {
        clearTimeout(viewerTimer);
        viewerTimer = setTimeout(styleViewer, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
