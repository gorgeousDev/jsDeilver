(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function hideOKKA() {
        document.querySelectorAll("h3").forEach(function (heading) {
            if (heading.textContent.toUpperCase().includes("OKKA")) {
                heading.style.display = "none";
            }
        });
    }

    hideOKKA();
    var okkaTimer;
    new MutationObserver(function () {
        clearTimeout(okkaTimer);
        okkaTimer = setTimeout(hideOKKA, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
