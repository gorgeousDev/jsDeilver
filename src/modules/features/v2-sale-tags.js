/* =========================================
   13. Small "SALE" tag + remove theme "تخفيضات"
   ========================================= */
(function () {

    var TAG_CLASS = "akkad-sale-tag";
    var DISCOUNT_WORD = "تخفيضات";
    var GONE = "display:none !important; visibility:hidden !important;";

    /* =========================================
       CSS (one-time injection into body, not head
       so Next.js hydration doesn't remove it)
       ========================================= */
    function addStyles() {
        if (document.getElementById("akkad-sale-tag-css")) return;

        var style = document.createElement("style");
        style.id = "akkad-sale-tag-css";
        style.textContent = [
            /* — wrapper: pinned to the card's top-left corner — */
            '.akkad-sale-tag{',
            '    position:absolute !important;',
            '    top:0 !important;',
            '    left:0 !important;',
            '    z-index:15 !important;',
            '    display:block !important;',
            '    line-height:1 !important;',
            '    pointer-events:none !important;',
            '}',
            '',
            /* — the label itself — */
            '.akkad-sale-tag > span{',
            '    display:inline-block !important;',
            '    padding:3px 7px !important;',
            '    background:#A34054 !important;',
            '    color:#fff !important;',
            '    font-family:Tajawal,sans-serif !important;',
            '    font-size:11px !important;',
            '    font-weight:700 !important;',
            '    letter-spacing:.4px !important;',
            '    border-radius:0 5px 5px 0 !important;',
            '    box-shadow:0 1px 4px rgba(0,0,0,.18) !important;',
            '    white-space:nowrap !important;',
            '}',
            '',
            /* — mobile — */
            '@media(max-width:768px){',
            '    .akkad-sale-tag > span{',
            '        padding:2px 6px !important;',
            '        font-size:10px !important;',
            '        border-radius:0 4px 4px 0 !important;',
            '    }',
            '}'
        ].join('\n');

        /* append to body, not head — survives Next.js hydration */
        (document.body || document.documentElement).appendChild(style);
    }

    /* =========================================
       Drop the theme's "تخفيضات" chip on every page.
       Inline style, so a React re-render on that node
       cannot bring it back.
       ========================================= */
    function removeDiscountLabels() {
        var spans = document.querySelectorAll("span");
        for (var i = 0; i < spans.length; i++) {
            var span = spans[i];
            if (span.textContent.trim() !== DISCOUNT_WORD) continue;

            span.style.cssText = GONE;

            /* also hide the wrapper if the chip is its only child */
            var parent = span.parentElement;
            if (parent && parent.children.length === 1 &&
                parent.textContent.trim() === DISCOUNT_WORD) {
                parent.style.cssText = GONE;
            }
        }
    }

    /* =========================================
       Small "SALE" tag on cards that are genuinely
       on sale (a struck-through old price).
       ========================================= */
    function buildTag() {
        var tag = document.createElement("div");
        tag.className = TAG_CLASS;
        tag.setAttribute("aria-hidden", "true");
        tag.innerHTML = "<span>SALE</span>";
        return tag;
    }

    /* the card's <a> is the positioning context; make sure of it */
    function hostFor(card) {
        var link = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
        if (!link) return null;
        if (window.getComputedStyle(link).position === "static") {
            link.style.position = "relative";
        }
        return link;
    }

    function processCards() {
        /* clear the old sparkled badge left behind by a previous build */
        var legacy = document.querySelectorAll(".akkad-sale-badge");
        for (var l = 0; l < legacy.length; l++) {
            legacy[l].parentNode.removeChild(legacy[l]);
        }

        var cards = document.querySelectorAll(".fasty_product_card");
        for (var c = 0; c < cards.length; c++) {
            var card = cards[c];

            var priceBox = card.querySelector(".fasty_product_card_price");
            if (!priceBox || !priceBox.querySelector("del")) continue;

            var host = hostFor(card);
            if (!host || host.querySelector("." + TAG_CLASS)) continue;

            host.appendChild(buildTag());
        }
    }

    /* =========================================
       Run
       ========================================= */
    function run() {
        addStyles();
        removeDiscountLabels();
        processCards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    var timer;
    new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(run, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
