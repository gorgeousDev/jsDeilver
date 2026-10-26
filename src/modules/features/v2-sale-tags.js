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
    function hideDiscountLabel(span) {
        if (span.textContent.trim() !== DISCOUNT_WORD) return;

        span.style.cssText = GONE;
        var parent = span.parentElement;
        if (parent && parent.children.length === 1 &&
            parent.textContent.trim() === DISCOUNT_WORD) {
            parent.style.cssText = GONE;
        }
    }

    function removeLegacyBadges(root) {
        var legacy = [];
        if (root.matches && root.matches(".akkad-sale-badge")) legacy.push(root);
        var descendants = root.querySelectorAll ? root.querySelectorAll(".akkad-sale-badge") : [];
        for (var i = 0; i < descendants.length; i++) legacy.push(descendants[i]);
        for (var l = 0; l < legacy.length; l++) {
            legacy[l].remove();
        }
    }

    function processCard(card) {
        var priceBox = card.querySelector(".fasty_product_card_price");
        if (!priceBox || !priceBox.querySelector("del")) return;

        var host = hostFor(card);
        if (!host || host.querySelector("." + TAG_CLASS)) return;

        host.appendChild(buildTag());
    }

    function processNode(node) {
        if (!node || node.nodeType !== 1) return;

        removeLegacyBadges(node);
        if (node.matches("span")) hideDiscountLabel(node);
        var spans = node.querySelectorAll("span");
        for (var i = 0; i < spans.length; i++) hideDiscountLabel(spans[i]);

        if (node.matches(".fasty_product_card")) processCard(node);
        var cards = node.querySelectorAll(".fasty_product_card");
        for (var c = 0; c < cards.length; c++) processCard(cards[c]);

        var card = node.closest(".fasty_product_card");
        if (card) processCard(card);
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

    /* =========================================
       Run
       ========================================= */
    function run() {
        addStyles();
        processNode(document.body);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
            processNode(records[i].target);
            for (var j = 0; j < records[i].addedNodes.length; j++) {
                processNode(records[i].addedNodes[j]);
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
