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
   Meta tag (Google Site Verification)
   ========================================= */
__akkadLoadV2Feature("v2-google-site-verification");

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
                 : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a87d4b2/src/modules/akkad.js";
    s.defer = true;
    document.head.appendChild(s);
})();

/* =========================================
   2. WhatsApp Widget
   ========================================= */
__akkadLoadV2Feature("v2-whatsapp-widget");

/* =========================================
   3. Styles
   ========================================= */
__akkadLoadV2Feature("v2-store-style-overrides");
/* =========================================
   3.1 Mobile Product Grid — 2 Columns
   ========================================= */
__akkadLoadV2Feature("v2-mobile-product-grid");

/* =========================================
   4. Disable Cart Image Links
   ========================================= */
__akkadLoadV2Feature("v2-disable-cart-image-links");

/* =========================================
   5. Style Viewer Badge
   ========================================= */
__akkadLoadV2Feature("v2-viewer-badge");

/* =========================================
   6. Move Product Details
   ========================================= */
__akkadLoadV2Feature("v2-product-details-position");

/* =========================================
   7. Image Preview Lightbox
   ========================================= */
__akkadLoadV2Feature("v2-image-preview-lightbox");

/* =========================================
   8. Hide OKKA
   ========================================= */
__akkadLoadV2Feature("v2-hide-okka-heading");

/* =========================================
   9. Floating Live Counter
   ========================================= */
__akkadLoadV2Feature("v2-floating-live-counter");

/* =========================================
   10. Funnel Price Overrides
   ========================================= */
__akkadLoadV2Feature("v2-funnel-price-overrides");

/* =========================================
   11. Swap Payment Methods
   ========================================= */
__akkadLoadV2Feature("v2-payment-method-order");

/* =========================================
   12. Graduation Gift Slider
   ========================================= */
__akkadLoadV2Feature("v2-graduation-gift-slider");

/* =========================================
   13. Small "SALE" tag + remove theme "تخفيضات"
   ========================================= */
__akkadLoadV2Feature("v2-sale-tags");

/* =========================================
   14. Office Supplies Sections
   ========================================= */
__akkadLoadV2Feature("v2-office-supplies-sections");

/* =========================================
   16. Featured banner white frame
   =========================================
   The exported webp 1784395371176817130 is 1964x801, but the photograph only
   occupies rows 185-615: 1964x431, aspect 4.557. The rest is pure white, and
   the theme sizes .feature-img to the file aspect, so those bars render as a
   white band above and below the photo in dark mode.

   Giving the box the photo's own aspect makes object-fit:cover crop exactly
   those two bars away - 185px of padding scales to precisely the 35.2px that
   a 374x82 box has to trim. Keyed on the asset id, so replacing the banner
   just drops the rule. The file should still be re-exported without the
   padding; this only exists so the live banner is not white. */
(function () {
    "use strict";

    var STYLE_ID = "akkad-feature-frame-css";

    function inject() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = [
            'img.feature-img[src*="1784395371176817130"]{',
            '    aspect-ratio: 1964 / 431 !important;',
            '    height: auto !important;',
            '}',
            /* the photo is dark, so if it ever fails to load the slot should
               read as an empty dark panel rather than a white one */
            '.feature-img{ background:#1B1931; }',
            'html.akkad-dark .feature-img{ background:#1B1931 !important; }'
        ].join("\n");

        (document.head || document.documentElement).appendChild(style);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inject, { once: true });
    } else {
        inject();
    }
})();
