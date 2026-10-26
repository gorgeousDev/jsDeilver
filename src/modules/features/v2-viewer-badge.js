(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    var styledBadges = new WeakSet();

    function styleBadge(badge) {
        if (styledBadges.has(badge) || !/^\d+$/.test(badge.textContent.trim())) return;

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
        styledBadges.add(badge);
    }

    function styleNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.matches("span")) styleBadge(node);

        var badges = node.querySelectorAll("span");
        for (var i = 0; i < badges.length; i++) styleBadge(badges[i]);
    }

    var observer = null;

    function syncProductRoute() {
        if (window.location.pathname.indexOf("/products/") !== 0) {
            if (observer) observer.disconnect();
            observer = null;
            return;
        }

        if (!document.body) {
            document.addEventListener("DOMContentLoaded", syncProductRoute, { once: true });
            return;
        }

        styleNode(document.body);
        if (observer) return;

        observer = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                if (records[i].target.nodeType === 1 && records[i].target.matches("span")) {
                    styleBadge(records[i].target);
                }
                for (var j = 0; j < records[i].addedNodes.length; j++) {
                    styleNode(records[i].addedNodes[j]);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncProductRoute);
    syncProductRoute();
})();
