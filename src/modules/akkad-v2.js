/* =========================================
   0. Global Helpers
   ========================================= */
function __akkad_isHomePage() {
    var p = window.location.pathname.replace(/\/+$/, "") || "/";
    return p === "/";
}

(function () {
    var selfSrc = (document.currentScript && document.currentScript.src) || "";
    var base = selfSrc
        ? selfSrc.replace(/[^\/]*$/, "")
        : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
    var versionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
    var version = versionMatch ? "?v=" + versionMatch[1] : "";
    var script = document.createElement("script");

    script.src = base + "dist/akkad-all-features.js" + version;
    script.async = true;
    script.onerror = function () {
        console.error("[Akkad] failed to load feature bundle:", script.src);
    };
    document.head.appendChild(script);
})();
