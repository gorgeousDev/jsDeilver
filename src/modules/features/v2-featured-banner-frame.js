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
