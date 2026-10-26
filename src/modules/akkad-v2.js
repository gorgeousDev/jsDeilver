function __akkad_isHomePage() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path === "/";
}

(function () {
    var selfSrc = (document.currentScript && document.currentScript.src) || "";
    var base = selfSrc
        ? selfSrc.replace(/[^\/]*$/, "")
        : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
    var versionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
    var version = versionMatch ? "?v=" + versionMatch[1] : "";
    var loaded = {};

    function loadLayer(name) {
        if (loaded[name]) return;
        loaded[name] = true;

        var script = document.createElement("script");
        script.src = base + "dist/akkad-" + name + ".js" + version;
        script.async = false;
        script.onerror = function () {
            delete loaded[name];
            console.error("[Akkad] failed to load layer:", name);
        };
        document.head.appendChild(script);
    }

    function loadRouteLayers() {
        var pathname = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
        var href = window.location.href || pathname;

        loadLayer("core");

        if (pathname === "/") loadLayer("home");
        if (pathname.indexOf("/products/") === 0) loadLayer("product");
        if (pathname === "/cart" || pathname.indexOf("/cart/") === 0) loadLayer("cart");
        if (pathname.indexOf("/checkout") === 0) {
            loadLayer("cart");
            loadLayer("checkout");
        }
        if (href.indexOf("funnels") !== -1) loadLayer("funnel");
        if (pathname.toLowerCase().indexOf("office-supplies") !== -1) loadLayer("office");

        if (
            pathname === "/products/high-school-graduation-gift-classic-design-2026" ||
            pathname === "/products/high-school-graduation-gift-modern-design-2026"
        ) {
            loadLayer("graduation");
        }
    }

    function wrapHistoryMethod(method) {
        var original = window.history[method];
        window.history[method] = function () {
            var result = original.apply(this, arguments);
            setTimeout(loadRouteLayers, 0);
            return result;
        };
    }

    loadRouteLayers();
    wrapHistoryMethod("pushState");
    wrapHistoryMethod("replaceState");
    window.addEventListener("popstate", loadRouteLayers);
})();
