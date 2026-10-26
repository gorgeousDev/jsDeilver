(function () {
    var observer = null;
    var timer = null;
    var hiddenHeadings = new Map();

    function isProductRoute() {
        return window.location.pathname.indexOf("/products/") === 0;
    }

    function hideHeading(heading) {
        if (heading.matches("h3") && heading.textContent.toUpperCase().includes("OKKA") &&
            !hiddenHeadings.has(heading)) {
            hiddenHeadings.set(heading, heading.style.display);
            heading.style.display = "none";
        }
    }

    function hideHeadings(node) {
        if (!node || node.nodeType !== 1) return;
        hideHeading(node);
        var headings = node.querySelectorAll("h3");
        for (var i = 0; i < headings.length; i++) hideHeading(headings[i]);
    }

    function restoreHeadings() {
        hiddenHeadings.forEach(function (display, heading) {
            heading.style.display = display;
        });
        hiddenHeadings.clear();
    }

    function syncProductRoute() {
        if (!isProductRoute()) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(timer);
            timer = null;
            restoreHeadings();
            return;
        }

        hideHeadings(document.body);
        if (observer || !document.body) return;

        observer = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                for (var j = 0; j < records[i].addedNodes.length; j++) {
                    hideHeadings(records[i].addedNodes[j]);
                }
                if (records[i].target.nodeType === 1) hideHeading(records[i].target);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncProductRoute);
    syncProductRoute();
})();
