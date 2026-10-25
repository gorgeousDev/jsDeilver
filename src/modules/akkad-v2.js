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


/* =========================================
   14. Office Supplies Sections
   ========================================= */
(function () {
    "use strict";

    var CFG = {
        slug: "office-supplies",
        categoryId: "c340b549-b502-4052-9828-3485543191be",
        api: "https://api.easy-orders.net/api/v1/products",
        sort: "position,desc",
        fields: "id,name,thumb,price,sale_price,sale_end_date,slug,position,disable_orders_for_no_stock,quantity,is_free_shipping",
        themeKey: "fasty",
        currency: "ج.م",
        moreLabel: "المزيد",
        lessLabel: "إخفاء الكل",
        allTitle: "كل المنتجات",
        buckets: [
            {
                key: "study",
                title: "احصل على افضل ادوات للدراسة ✏️",
                keywords: [
                    "casio", "كاسيو", "fx-",
                    "calculator", "حاسبة",
                    "multi-office", "مالتي أوفيس",
                    "copy-paper", "ورق طباعة", "ورق a4"
                ]
            },
            {
                key: "stickers",
                title: "ستيكرز A6",
                keywords: [ "sticker", "ستيكر", "ملصق" ]
            },
            {
                key: "notebook-tickets",
                title: "تيكتات شخصية لكل كراسة 📝",
                keywords: [
                    "notebook-ticket", "تيكتات", "تيكت",
                    "تذكرة", "كراسات"
                ]
            },
            {
                key: "notebooks",
                title: "📒 نوت بوك بتصميمات مميزة",
                keywords: [ "notebook" ]
            },
            {
                key: "general",
                title: "منتجات عملية لكل يوم ☕",
                keywords: []
            }
        ],
        renderOrder: [ "study", "stickers", "general", "notebook-tickets", "notebooks" ]
    };

    var state = {
        products: [],
        fromApi: false,
        signature: "",
        built: false,
        building: false,
        showAll: false,
        wired: false,
        lastUrl: "",
        started: false
    };

    /* =========================================
       Page / DOM helpers
       ========================================= */
/* The store has used /collections/office-supplies, /category/office-supplies
       and a bare /office-supplies over time, and __NEXT_DATA__ is not always
       present. Accept any of them rather than silently rendering nothing. */
    var PATH_PREFIXES = ["collections", "category", "categories", "c", "shop", "store"];

    function pathMatchesSlug() {
        var p = (window.location.pathname || "").replace(/\/+$/, "").toLowerCase();
        if (!p) return false;

        var slug = CFG.slug.toLowerCase();
        var segs = p.split("/").filter(Boolean);

        if (segs.length === 1) return segs[0] === slug;
        if (segs.length !== 2) return false;

        return segs[1] === slug && PATH_PREFIXES.indexOf(segs[0]) !== -1;
    }

    function nextDataMatchesSlug() {
        var el = document.getElementById("__NEXT_DATA__");
        if (!el) return false;

        try {
            var nd = JSON.parse(el.textContent);
            var q = nd && nd.query;
            if (!q) return false;

            var slug = CFG.slug.toLowerCase();
            var candidates = [q.id, q.slug, q.handle];
            for (var i = 0; i < candidates.length; i++) {
                if (typeof candidates[i] === "string"
                    && candidates[i].toLowerCase() === slug) return true;
            }
        } catch (e) {}

        return false;
    }

    function isOfficePage() {
        return pathMatchesSlug() || nextDataMatchesSlug();
    }

    function getGrid() {
        return document.querySelector(".category_products_grid_container")
            || document.querySelector('[class*="category_products_grid"]');
    }

    /* The theme ships display:grid!important on small screens, which beats a
       plain inline display:none and would leave the whole grid visible under
       the sliders. Inline !important wins. */
    function hideGrid(grid) {
        grid.style.setProperty("display", "none", "important");
    }

    function showGrid(grid) {
        grid.style.removeProperty("display");
    }

    /* The theme's "تحميل المزيد" REPLACES the product list instead of appending
       (20 cards -> 7 on this collection) and destroys anything we moved out of
       the grid. We read every product from the API, so the button is useless. */
    function hideThemePagination() {
        var words = [ "تحميل المزيد", "عرض المزيد", "Load more", "Show more" ];
        var btns = document.querySelectorAll("button");

        for (var i = 0; i < btns.length; i++) {
            var label = (btns[i].textContent || "").replace(/\s+/g, " ").trim();
            if (words.indexOf(label) === -1) continue;
            if (btns[i].className.indexOf("akkad-") !== -1) continue;

            var node = btns[i];
            for (var up = 0; up < 4 && node.parentElement; up++) {
                node = node.parentElement;
                if (node.className.indexOf("text-center") !== -1) break;
            }
            node.style.setProperty("display", "none", "important");
        }
    }

    /* =========================================
       Data
       ========================================= */
    function fetchProducts() {
        var url = CFG.api
            + "?limit=100&page=1"
            + "&sort=" + encodeURIComponent(CFG.sort)
            + "&fields=" + encodeURIComponent(CFG.fields)
            + "&category_id=" + CFG.categoryId
            + "&join=variants"
            + "&theme_key=" + CFG.themeKey;

        return window.fetch(url, { headers: { "Accept": "application/json" } })
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(function (json) {
                var list = null;
                if (json && Array.isArray(json.data)) list = json.data;
                else if (Array.isArray(json)) list = json;
                if (!list || !list.length) throw new Error("empty payload");
                return list;
            });
    }

    /* Fallback so a failed API call never makes the page worse than before. */
    function productsFromDom(grid) {
        var out = [];
        if (!grid) return out;

        var cards = grid.querySelectorAll(".fasty_product_card");
        for (var i = 0; i < cards.length; i++) {
            var a = cards[i].querySelector('a[href*="/products/"]');
            if (!a) continue;

            var slug = (a.getAttribute("href") || "").replace(/^\/products\//, "").split("/")[0];
            var nameEl = cards[i].querySelector(".fasty_product_card_name");
            var img = cards[i].querySelector("img");
            var priceEl = cards[i].querySelector(".fasty_product_card_price");

            out.push({
                slug: slug,
                name: nameEl ? (nameEl.textContent || "").replace(/\s+/g, " ").trim() : "",
                thumb: img ? img.getAttribute("src") || "" : "",
                priceText: priceEl ? (priceEl.textContent || "").replace(/\s+/g, " ").trim() : "",
                saleText: null,
                card: cards[i]
            });
        }
        return out;
    }

    function classify(product) {
        var hay = ((product.slug || "") + " " + (product.name || "")).toLowerCase();
        var last = CFG.buckets.length - 1;

        for (var i = 0; i < last; i++) {
            var words = CFG.buckets[i].keywords;
            for (var j = 0; j < words.length; j++) {
                if (hay.indexOf(words[j].toLowerCase()) !== -1) return CFG.buckets[i].key;
            }
        }
        return CFG.buckets[last].key;
    }

    function groupProducts() {
        var order = [];
        var map = {};

        for (var i = 0; i < CFG.buckets.length; i++) {
            var group = { key: CFG.buckets[i].key, title: CFG.buckets[i].title, products: [] };
            map[group.key] = group;
            order.push(group.key);
        }

        for (var k = 0; k < state.products.length; k++) {
            map[classify(state.products[k])].products.push(state.products[k]);
        }

        var seq = CFG.renderOrder || order;
        var out = [];
        for (var m = 0; m < seq.length; m++) {
            if (map[seq[m]].products.length) out.push(map[seq[m]]);
        }
        return out;
    }

    function signature() {
        var parts = [];
        for (var i = 0; i < state.products.length; i++) parts.push(state.products[i].slug);
        return (state.fromApi ? "api:" : "dom:") + parts.join("|");
    }

    /* =========================================
       Cards
       ========================================= */
    function detectCurrency(node) {
        if (node) {
            var box = node.querySelector(".fasty_product_card_price");
            if (box) {
                var inner = box.querySelector("span span");
                if (inner && inner.textContent) return (inner.textContent || "").trim();
            }
        }
        return CFG.currency;
    }

    function hasSale(product) {
        var sale = product.sale_price;
        var price = product.price;
        if (sale === undefined || sale === null || sale === "") return false;
        if (price === undefined || price === null || price === "") return true;
        return Number(sale) < Number(price);
    }

    function priceMarkup(product, currency) {
        var cur = '<span class="font-[inherit]">' + currency + "</span>";

        if (hasSale(product)) {
            return '<span class="text-red-400 flex items-center gap-1">' + product.sale_price + cur + "</span>"
                + '<del class="font-normal text-gray-800 opacity-60 sm:text-base flex items-center gap-1">' + product.price + cur + "</del>";
        }
        if (product.price !== undefined && product.price !== null && product.price !== "") {
            return '<span class="text-heading flex items-center gap-1">' + product.price + cur + "</span>";
        }
        return '<span class="text-heading">' + (product.priceText || "") + "</span>";
    }

    /* Reuse a real theme card when one exists anywhere (the grid, or a section
       from a previous build), otherwise clone the theme's own markup and patch
       it so products missing from page 1 still look identical. */
    function collectExistingCards() {
        var map = {};
        var nodes = document.querySelectorAll(".fasty_product_card");

        for (var i = 0; i < nodes.length; i++) {
            var a = nodes[i].querySelector('a[href*="/products/"]');
            if (!a) continue;

            var href = (a.getAttribute("href") || "").toLowerCase();
            var idx = href.indexOf("/products/");
            if (idx === -1) continue;

            var slug = href.slice(idx + 10).split("/")[0];
            if (slug && !map[slug]) map[slug] = nodes[i];
        }
        return map;
    }

    function resolveCard(existing, product, template, currency) {
        var real = existing[((product.slug || "") + "").toLowerCase()];
        if (real) return real;

        if (!template) return null;

        var card = template.cloneNode(true);
        card.removeAttribute("data-akkad-order");
        card.removeAttribute("data-akkad-section");
        card.removeAttribute("style");

        var link = card.querySelector('a[href*="/products/"]');
        if (link) {
            link.setAttribute("href", "/products/" + product.slug);
            link.setAttribute("title", product.name || "");
        }

        var img = card.querySelector("img");
        if (img && product.thumb) {
            img.setAttribute("src", product.thumb);
            img.setAttribute("alt", product.name || "");
        }
        var placeholder = card.querySelector("img");
        if (placeholder && placeholder.getAttribute("src") === null && product.thumb) {
            placeholder.setAttribute("src", product.thumb);
        }

        var nameEl = card.querySelector(".fasty_product_card_name");
        if (nameEl) nameEl.textContent = product.name || "";

var priceBox = card.querySelector(".fasty_product_card_price");
        if (priceBox) priceBox.innerHTML = priceMarkup(product, currency);

        /* the template card carries its own SALE tag; it must not leak onto a
           different product, so drop it and re-add only if this one is on sale */
        var inherited = card.querySelectorAll(".akkad-sale-tag");
        for (var t = 0; t < inherited.length; t++) {
            inherited[t].parentNode.removeChild(inherited[t]);
        }
        if (hasSale(product)) {
            var saleLink = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
            if (saleLink) {
                if (window.getComputedStyle(saleLink).position === "static") {
                    saleLink.style.position = "relative";
                }
                var tag = document.createElement("div");
                tag.className = "akkad-sale-tag";
                tag.setAttribute("aria-hidden", "true");
                tag.innerHTML = "<span>SALE</span>";
                saleLink.appendChild(tag);
            }
        }

        /* React binds these on real cards; a clone would ship a dead button,
           so the options button becomes a plain link to the product. */
        var btnBox = card.querySelector(".fasty_product_card_btn_container");
        if (btnBox) {
            var wish = btnBox.querySelector(".fasty_product_card_wishlist_btn");
            if (wish) wish.remove();

            var btn = btnBox.querySelector(".fasty_product_card_btn");
            if (btn) {
                var a = document.createElement("a");
                a.className = btn.className;
                a.setAttribute("href", "/products/" + product.slug);
                a.textContent = (btn.textContent || "").replace(/\s+/g, " ").trim() || "عرض المنتج";
                btnBox.replaceChild(a, btn);
            }
        }

        return card;
    }

    /* =========================================
       Markup
       ========================================= */
    function createSection(title, isGrid) {
        var section = document.createElement("section");
        section.className = "akkad-products-section";
        section.setAttribute("data-akkad-section", "true");

        var head = document.createElement("div");
        head.className = "akkad-section-header";

        var h = document.createElement("h2");
        h.className = "akkad-section-title";
        h.textContent = " " + title + " ";

        head.appendChild(h);
        section.appendChild(head);

        if (isGrid) {
            var wrap = document.createElement("div");
            wrap.className = "akkad-grid";
            section.appendChild(wrap);
            return section;
        }

        var slider = document.createElement("div");
        slider.className = "akkad-slider";

        var prev = document.createElement("button");
        prev.type = "button";
        prev.className = "akkad-arrow akkad-prev";
        prev.setAttribute("aria-label", "السابق");
        prev.textContent = "‹";

        var viewport = document.createElement("div");
        viewport.className = "akkad-slider-viewport";

        var track = document.createElement("div");
        track.className = "akkad-slider-track";
        viewport.appendChild(track);

        var next = document.createElement("button");
        next.type = "button";
        next.className = "akkad-arrow akkad-next";
        next.setAttribute("aria-label", "التالي");
        next.textContent = "›";

        slider.appendChild(prev);
        slider.appendChild(viewport);
        slider.appendChild(next);
        section.appendChild(slider);

        section._track = track;
        section._viewport = viewport;
        section._prev = prev;
        section._next = next;

        return section;
    }

    function setupSlider(section) {
        var viewport = section._viewport;
        var track = section._track;
        var prev = section._prev;
        var next = section._next;

        function step() {
            var item = track.querySelector(".akkad-slider-item");
            if (!item) return 0;
            var w = item.getBoundingClientRect().width;
            if (!w) return 0;
            var styles = window.getComputedStyle(track);
            var gap = parseFloat(styles.columnGap || styles.gap || "8") || 8;
            return w + gap;
        }

        function sync() {
            var max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
            var cur = Math.abs(viewport.scrollLeft);
            prev.disabled = cur <= 2;
            next.disabled = cur >= max - 2;
        }

        prev.addEventListener("click", function (e) {
            e.preventDefault();
            var s = step();
            if (s) viewport.scrollBy({ left: -s, behavior: "smooth" });
        });

        next.addEventListener("click", function (e) {
            e.preventDefault();
            var s = step();
            if (s) viewport.scrollBy({ left: s, behavior: "smooth" });
        });

        viewport.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        setTimeout(sync, 120);
        setTimeout(sync, 600);
        setTimeout(sync, 1400);
    }

    function fillSlider(section, products, existing, template, currency) {
        for (var i = 0; i < products.length; i++) {
            var card = resolveCard(existing, products[i], template, currency);
            if (!card) continue;

            var item = document.createElement("div");
            item.className = "akkad-slider-item";
            item.appendChild(card);
            section._track.appendChild(item);
        }
        setupSlider(section);
    }

    function fillGrid(section, products, existing, template, currency) {
        var wrap = section.querySelector(".akkad-grid");

        for (var i = 0; i < products.length; i++) {
            var card = resolveCard(existing, products[i], template, currency);
            if (!card) continue;

            var cell = document.createElement("div");
            cell.className = "akkad-grid-cell";
            cell.appendChild(card);
            wrap.appendChild(cell);
        }
    }

    function removeSections() {
        var nodes = document.querySelectorAll('[data-akkad-section="true"]');
        for (var i = 0; i < nodes.length; i++) nodes[i].remove();
    }

    /* =========================================
       Build
       ========================================= */
    function build() {
        if (!isOfficePage()) return;
        if (state.building) return;
        if (!state.products.length) return;

        var grid = getGrid();
        if (!grid) return;

        var sig = signature();
        if (state.built && sig === state.signature) return;

        state.building = true;

        try {
            var existing = collectExistingCards();
            var template = null;
            for (var key in existing) {
                if (Object.prototype.hasOwnProperty.call(existing, key)) {
                    template = existing[key];
                    break;
                }
            }
            var currency = detectCurrency(template);
            var parent = grid.parentElement;
            if (!parent) return;

            injectStyles();
            hideThemePagination();
            removeSections();

            if (state.showAll) {
                var allSection = createSection(CFG.allTitle, true);
                fillGrid(allSection, state.products, existing, template, currency);
                parent.insertBefore(allSection, grid);
            } else {
                var groups = groupProducts();

                for (var i = 0; i < groups.length; i++) {
                    var section = createSection(groups[i].title, false);
                    fillSlider(section, groups[i].products, existing, template, currency);
                    parent.insertBefore(section, grid);
                }
            }

            hideGrid(grid);
            state.built = true;
            state.signature = sig;
        } catch (e) {
            console.error("[Akkad] office supplies build failed:", e);
            showGrid(grid);
        } finally {
            state.building = false;
        }
    }

    function invalidate() {
        state.built = false;
        state.signature = "";
    }

    function setView(all) {
        if (state.showAll === all) return;
        state.showAll = all;
        invalidate();

        var grid = getGrid();
        if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });

        build();
    }

    function wireControls() {
        if (state.wired) return;
        state.wired = true;

        document.addEventListener("click", function (event) {
            var target = event.target && event.target.closest
                ? event.target.closest(".akkad-section-more, .akkad-toggle-all")
                : null;
            if (!target) return;

            event.preventDefault();
            event.stopPropagation();
            setView(!state.showAll);
        }, true);
    }

    /* =========================================
       Boot
       ========================================= */
    function waitForGrid(timeout) {
        return new Promise(function (resolve) {
            var started = Date.now();

            (function tick() {
                var grid = getGrid();
                if (grid && grid.querySelector(".fasty_product_card")) return resolve(grid);
                if (Date.now() - started > timeout) return resolve(grid);
                setTimeout(tick, 200);
            })();
        });
    }

    function start() {
        if (!isOfficePage()) return;
        if (state.started) return;
        state.started = true;

        state.lastUrl = window.location.href;
        wireControls();
        injectStyles();
        ensureOfficeWatchers();

        fetchProducts()
            .then(function (list) {
                state.products = list;
                state.fromApi = true;
            })
            .catch(function (err) {
                console.warn("[Akkad] product API failed, using DOM:", err);
                state.products = productsFromDom(getGrid());
                state.fromApi = false;
            })
            .then(function () {
                return waitForGrid(12000);
            })
            .then(function () {
                if (!state.products.length) state.products = productsFromDom(getGrid());
                build();
                setTimeout(build, 800);
                setTimeout(build, 2000);
            });

        }
    /* This file is parsed once on whatever page the store opened. If that page
       was not the office URL, start() bailed above and left no observer and no
       URL poll behind — so navigating to the office page in-app (soft routing)
       rendered nothing until the user hard-refreshed. Keep one observer and one
       poll alive for the whole session; build() and start() re-check
       isOfficePage(), so the watchers are inert on any other page. */
    var officeObserverReady = false;

    function ensureOfficeWatchers() {
        if (officeObserverReady) return;
        officeObserverReady = true;

        /* If the theme re-renders its grid (filter, language, pagination) we
           must regroup — the API list is the source of truth either way. */
        var observer = new MutationObserver(function () {
            if (!isOfficePage()) return;
            if (state.showAll) return;
            window.clearTimeout(window.__akkadOfficeTimer);
            window.__akkadOfficeTimer = setTimeout(build, 250);
        });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    /* This poll is deliberately UNCONDITIONAL — it runs on every page for the
       whole session. Soft navigation never reloads this file, so if it only
       existed once start() had run, an in-app arrival at the office URL would
       never be noticed (the very bug it is here to fix). */
    setInterval(function () {
        if (!isOfficePage()) return;
        if (!state.started) {
            start();
            return;
        }
        if (window.location.href !== state.lastUrl) {
            state.lastUrl = window.location.href;
            invalidate();
        }
        build();
    }, 1000);

    function injectStyles() {
        if (document.getElementById("akkad-office-css")) return;

        var css = "\n\
.akkad-products-section{width:100%;margin:0 0 38px;position:relative}\n\
.akkad-section-header{width:100%;display:flex;align-items:center;justify-content:space-between;direction:rtl;margin-bottom:12px;padding:0 4px;box-sizing:border-box}\n\
.akkad-section-title{margin:0;padding:0;font-size:20px;line-height:1.4;font-weight:800}\n\
.akkad-section-more{font-size:12px;color:inherit;text-decoration:none;white-space:nowrap;opacity:.85;background:none;border:0;padding:0;cursor:pointer;font-family:inherit}\n\
.akkad-section-more:hover{opacity:1;text-decoration:underline}\n\
.akkad-slider{width:100%;position:relative}\n\
.akkad-slider-viewport{width:100%;overflow-x:auto;overflow-y:visible;direction:ltr;scroll-behavior:smooth;scrollbar-width:none;-webkit-overflow-scrolling:touch}\n\
.akkad-slider-viewport::-webkit-scrollbar{display:none}\n\
.akkad-slider-track{display:flex;flex-wrap:nowrap;align-items:stretch;gap:8px;width:max-content;direction:ltr}\n\
.akkad-slider-item{flex:0 0 calc((100vw - 48px)/4);width:calc((100vw - 48px)/4);min-width:0;box-sizing:border-box}\n\
.akkad-slider-item .fasty_product_card{width:100%!important;max-width:100%!important;box-sizing:border-box}\n\
.akkad-arrow{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18);z-index:100;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;line-height:1;padding:0;appearance:none;-webkit-appearance:none}\n\
.akkad-prev{left:4px}\n\
.akkad-next{right:4px}\n\
.akkad-arrow:disabled{opacity:.3;cursor:default;pointer-events:none}\n\
.akkad-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\n\
.akkad-grid-cell{min-width:0;box-sizing:border-box}\n\
.akkad-grid-cell .fasty_product_card{width:100%!important;max-width:100%!important;box-sizing:border-box}\n\
.akkad-toggle-all{display:block;margin:16px auto 8px;padding:9px 22px;font-family:inherit;font-size:13px;font-weight:600;color:#fff;background:#44174E;border:0;border-radius:999px;cursor:pointer}\n\
@media (max-width:900px){.akkad-slider-item{flex:0 0 calc((100vw - 32px)/3);width:calc((100vw - 32px)/3)}.akkad-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n\
@media (max-width:600px){.akkad-slider-item{flex:0 0 calc((100vw - 24px)/2);width:calc((100vw - 24px)/2)}.akkad-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.akkad-section-title{font-size:18px}.akkad-arrow{width:30px;height:30px;font-size:20px}}\n";

        var style = document.createElement("style");
        style.id = "akkad-office-css";
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();

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
