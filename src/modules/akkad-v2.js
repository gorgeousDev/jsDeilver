/* =========================================
   0. Global Helpers
   ========================================= */
function __akkad_isHomePage() {
    var p = window.location.pathname.replace(/\/+$/, "") || "/";
    return p === "/";
}

var __akkadV2ScriptSrc = document.currentScript && document.currentScript.src;
var __akkadV2Base = __akkadV2ScriptSrc
    ? __akkadV2ScriptSrc.replace(/[^\/]*$/, "")
    : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
var __akkadV2VersionMatch = __akkadV2ScriptSrc
    ? /[?&]v=([^&#]+)/.exec(__akkadV2ScriptSrc)
    : null;
var __akkadV2Version = __akkadV2VersionMatch ? "?v=" + __akkadV2VersionMatch[1] : "";

function __akkadLoadV2Feature(name) {
    var script = document.createElement("script");
    script.src = __akkadV2Base + "features/" + name + ".js" + __akkadV2Version;
    script.async = false;
    script.onerror = function () {
        console.error("[Akkad] failed to load feature:", name);
    };
    document.head.appendChild(script);
}

/* =========================================
   1. Load akkad.js
   ========================================= */
(function () {
    /* Load akkad.js from the same commit this file came from, not a commit that
       was pasted in once and forgotten. When akkad.js carried a stale pinned
       commit of its own, the stylesheets it injects were frozen at that commit
       and every later CSS change silently never reached the site.
       The cache-buster the admin puts on the script tag is carried over as
       well: without it akkad.js was the one file on the page with no version
       of its own, so the CDN was free to keep serving it long after every
       other file had been updated. */
    var base = "";
    var version = "";
    try {
        var self = document.currentScript && document.currentScript.src;
        if (self) {
            base = self.replace(/[^\/]*$/, "");
            var m = /[?&]v=([^&#]+)/.exec(self);
            if (m) version = "?v=" + m[1];
        }
    } catch (e) {}

    var s = document.createElement("script");
    s.src = base ? base + "akkad.js" + version
                 : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad.js";
    s.defer = true;
    document.head.appendChild(s);
})();

var __akkadV2Features = [
    "v2-google-site-verification",
    "v2-whatsapp-widget",
    "v2-store-style-overrides",
    "v2-mobile-product-grid",
    "v2-disable-cart-image-links",
    "v2-viewer-badge",
    "v2-product-details-position",
    "v2-image-preview-lightbox",
    "v2-hide-okka-heading",
    "v2-floating-live-counter",
    "v2-funnel-price-overrides",
    "v2-payment-method-order",
    "v2-graduation-gift-slider",
    "v2-sale-tags",
    "v2-office-supplies-sections",
    "v2-featured-banner-frame"
];

for (var i = 0; i < __akkadV2Features.length; i++) {
    __akkadLoadV2Feature(__akkadV2Features[i]);
}
