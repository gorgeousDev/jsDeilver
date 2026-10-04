/**
 * AKKAD — dark mode
 * Standalone file. No dependency on akkad-v2.js.
 *
 * - Follows the OS (prefers-color-scheme) until the visitor taps the button.
 * - One tap = explicit override, remembered in localStorage.
 * - Works on every page, checkout included.
 *
 * Palette supplied by the client:
 *   #1B1931  page background
 *   #44174E  cards and panels
 *   #662249  nested surfaces: inputs, image placeholders, hover
 *   #A34054  rose - card edges, sale tag, cart counter
 *   #ED9E59  apricot - the single accent: links, focus, sale price
 *   #E9BCB9  blush - primary text
 *
 * #CAA4A5 and #AB8B90 are #E9BCB9 mixed back toward the page colour, for
 * secondary and tertiary ink; #5C2151 is the quiet border between the two
 * surface steps. Nothing else is invented.
 *
 * Contrast against every fill it lands on:
 *   #E9BCB9  10.05 / 8.36 / 6.54   on page / card / nested
 *   #CAA4A5   7.61 / 6.33 / 4.95
 *   #AB8B90   5.55 / 4.62 / 3.61   (tertiary only: struck price, placeholder)
 *   #ED9E59   7.83 / 6.52 / 5.10
 *   white on #A34054 6.14, on #ED9E59 only 2.18 - so the accent always
 *   carries #1B1931 ink and never white.
 */
(function () {
    "use strict";

    var KEY = "akkad_theme";          /* 'light' | 'dark' — absent means follow the OS */
    var ROOT = "akkad-dark";
    var FADE = "akkad-theme-fading";
    var STYLE_ID = "akkad-dark-css";
    var BTN_ID = "akkad-theme-toggle";

    /* ---------------------------------------------------------------
       Palette
       --------------------------------------------------------------- */
    var P = {
        page:     "#1B1931",
        surface:  "#44174E",
        surface2: "#662249",
        /* hover needs to be a visible step above #662249, so #662249 lightened */
        surfaceHi: "#7C2E58",
        border:   "#5C2151",
        border2:  "#A34054",
        rose:     "#A34054",
        accent:   "#ED9E59",
        text:     "#E9BCB9",
        text2:    "#CAA4A5",
        text3:    "#AB8B90",
        /* the theme's teal card edge is #004956 in gallery.css; the rose is
           the palette's equivalent, and reads at 2.31:1 on the card */
        cardEdge: "#A34054"
    };

    /* ---------------------------------------------------------------
       Storage helpers (Safari private mode throws on setItem)
       --------------------------------------------------------------- */
    function read() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function write(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
    }

    function systemDark() {
        try { return window.matchMedia("(prefers-color-scheme: dark)").matches; }
        catch (e) { return false; }
    }

    function resolve() {
        var s = read();
        if (s === "dark" || s === "light") return s;
        return systemDark() ? "dark" : "light";
    }

    /* ---------------------------------------------------------------
       CSS
       --------------------------------------------------------------- */
    function css() {
        return [
            "html." + ROOT + "{",
            "    color-scheme:dark;",
            /* the theme paints <html> white, which stops the body background
               propagating to the canvas. Without a ground here, any strip the
               body does not cover shows white: a 6px band down the left edge
               on mobile, where the header row runs a few px past the viewport */
            "    background:" + P.page + " !important;",
            "}",

            /* page */
            "html." + ROOT + " body{",
            "    background:" + P.page + " !important;",
            "    color:" + P.text + " !important;",
            "}",
            "html." + ROOT + " .app_container{",
            "    background:" + P.page + " !important;",
            "}",

            /* surfaces */
            "html." + ROOT + " .bg-white{ background:" + P.surface + " !important; }",
            "html." + ROOT + " .bg-white\\/95{ background:rgba(27,25,49,.95) !important; }",
            "html." + ROOT + " .bg-gray-50{ background:" + P.surface + " !important; }",
            "html." + ROOT + " .bg-gray-100{ background:" + P.surface + " !important; }",
            "html." + ROOT + " .bg-gray-200{ background:" + P.surface2 + " !important; }",
            "html." + ROOT + " .bg-gray-300{ background:" + P.surface2 + " !important; }",
            "html." + ROOT + " .bg-heading{ background:" + P.surface + " !important; }",
            "html." + ROOT + " .bg-\\[\\#f3f3f3\\]{ background:" + P.surface2 + " !important; }",
            "html." + ROOT + " .bg-\\[\\#f8fafc\\]{ background:" + P.page + " !important; }",
            "html." + ROOT + " .bg-\\[\\#fafafa\\]{ background:" + P.surface + " !important; }",

            /* text */
            "html." + ROOT + " .text-heading{ color:" + P.text + " !important; }",
            "html." + ROOT + " .text-black{ color:" + P.text + " !important; }",
            "html." + ROOT + " .text-gray-900{ color:" + P.text + " !important; }",
            "html." + ROOT + " .text-gray-800{ color:" + P.text2 + " !important; }",
            "html." + ROOT + " .text-gray-700{ color:" + P.text2 + " !important; }",
            "html." + ROOT + " .text-gray-600{ color:" + P.text2 + " !important; }",
            "html." + ROOT + " .text-gray-500{ color:" + P.text3 + " !important; }",
            "html." + ROOT + " .text-gray-400{ color:" + P.text3 + " !important; }",
            "html." + ROOT + " .placeholder-gray-400::placeholder{ color:" + P.text3 + " !important; }",
            "html." + ROOT + " .placeholder-gray-500::placeholder{ color:" + P.text3 + " !important; }",

            /* borders */
            "html." + ROOT + " .border-gray-100{ border-color:" + P.border + " !important; }",
            "html." + ROOT + " .border-gray-200{ border-color:" + P.border + " !important; }",
            "html." + ROOT + " .border-gray-300{ border-color:" + P.border + " !important; }",
            "html." + ROOT + " .border-gray-400{ border-color:" + P.border2 + " !important; }",
            "html." + ROOT + " .border-heading{ border-color:" + P.border + " !important; }",

            /* product cards — keep the rose edge from the palette, flip the fills.
               gallery.css pins the border with !important, so the dark value
               needs matching importance and higher specificity. */
            "html." + ROOT + " .fasty_product_card{",
            "    background:" + P.surface + " !important;",
            "    color:" + P.text + " !important;",
            "    border-color:" + P.cardEdge + " !important;",
            "}",
            "html." + ROOT + " .fasty_product_card_img{ background:" + P.surface2 + " !important; }",
            "html." + ROOT + " .fasty_product_card_name{ color:" + P.text + " !important; }",
            "html." + ROOT + " .fasty_product_card_price{ color:" + P.text + " !important; }",
            "html." + ROOT + " .fasty_product_card_price del{ color:" + P.text3 + " !important; }",

            /* --- the one accent ---------------------------------------
               The theme paints the sale price text-red-400 (#f87171) and
               that appears 212 times on the home page alone. A cool pink
               on a plum ground reads as a clash; #ED9E59 is the palette's
               own accent and still clears 5.10:1 on the deepest fill.
               text-red-* generally becomes the accent too, and only ever
               carries #1B1931 ink, never white (white on it is 2.18:1). */
            "html." + ROOT + " .text-red-400,",
            "html." + ROOT + " .text-red-500,",
            "html." + ROOT + " .text-red-600{ color:" + P.accent + " !important; }",
            "html." + ROOT + " .fasty_product_card_price del,",
            "html." + ROOT + " .text-heading,",
            "html." + ROOT + " a{ transition:color .15s ease; }",
            "html." + ROOT + " a:hover{ color:" + P.accent + " !important; }",

            /* akkad section 14 */
            "html." + ROOT + " .akkad-products-section,",
            "html." + ROOT + " .akkad-section-title{ color:" + P.text + " !important; }",

            /* section 14 arrows are white circles with an inherited glyph
               colour, so both the fill and the chevron have to be set.
               Scoped so the graduation slider is left alone. */
            "html." + ROOT + " .akkad-products-section .akkad-arrow{",
            "    background:" + P.surface2 + " !important;",
            "    color:" + P.text + " !important;",
            "    border:1px solid " + P.border + " !important;",
            "    box-shadow:0 2px 10px rgba(0,0,0,.5) !important;",
            "}",
            "html." + ROOT + " .akkad-products-section .akkad-arrow:hover{",
            "    background:" + P.surfaceHi + " !important;",
            "}",

            /* --- leaks the utility sweep cannot reach -----------------
               These are painted by rules with no colour utility to hook:
               #akkad-nav has no class at all, .home_section_container is a
               hashed emotion class, and the product tab / swiper dots use
               !bg-black, which is black on a near-black page. */

            /* the promo strip above the header: was pure #fff with #555
               links and white text, so its own text was invisible */
            "html." + ROOT + " #akkad-nav{",
            "    background:" + P.surface + " !important;",
            "    color:" + P.text2 + " !important;",
            "    border-bottom:1px solid " + P.border + " !important;",
            "}",
            "html." + ROOT + " #akkad-nav a{ color:" + P.text2 + " !important; }",
            "html." + ROOT + " #akkad-nav a.school-link{ color:#fff !important; }",
            "html." + ROOT + " #akkad-nav .star{ color:" + P.accent + " !important; }",
            "html." + ROOT + " #akkad-nav span{ color:" + P.text + " !important; }",

            /* hashed emotion class, two 1268px white blocks on the home page */
            "html." + ROOT + " .home_section_container{",
            "    background:" + P.surface + " !important;",
            "    color:" + P.text + " !important;",
            "}",

            /* wishlist heart: a white 38x38 tile */
            "html." + ROOT + " span.rounded-xl.border.p-2{",
            "    background:" + P.surface2 + " !important;",
            "    border-color:" + P.border + " !important;",
            "    color:" + P.text + " !important;",
            "}",

            /* gallery thumbs sit on a white mat from .akkad-thumb{background:#fff
               !important} in akkad-v2.js. That rule is injected into <body>,
               so an equal-specificity override in <head> would still lose on
               document order — hence the extra class in the selector. */
            "html." + ROOT + " img.akkad-thumb,",
            "html." + ROOT + " .akkad-thumb{",
            "    background:" + P.surface2 + " !important;",
            "    border-color:" + P.border + " !important;",
            "}",

            /* the selected product tab is bg-black: harsh on a dark page and
               only 1.1:1 against it */
            "html." + ROOT + " [role=\"tab\"].bg-black,",
            "html." + ROOT + " [role=\"tab\"][class*=\"bg-black\"]{",
            "    background:" + P.surface2 + " !important;",
            "    color:" + P.text + " !important;",
            "    border:1px solid " + P.border + " !important;",
            "    box-shadow:none !important;",
            "}",

            /* swiper dots carry !bg-black / bg-white via !important */
            "html." + ROOT + " .swiper-pagination-bullet{",
            "    background:" + P.text3 + " !important;",
            "    opacity:.55 !important;",
            "}",
            "html." + ROOT + " .swiper-pagination-bullet-active{",
            "    background:" + P.text + " !important;",
            "    opacity:1 !important;",
            "}",

            /* the primary CTA carries text-skin-primary (#040b1d), which on a
               dark card measures 1.14:1 — give it the brand edge instead */
            "html." + ROOT + " .add_to_cart_btn,",
            "html." + ROOT + " button[class*=\"add_to_cart\"]{",
            "    background:" + P.surface2 + " !important;",
            "    color:" + P.text + " !important;",
            "    border-color:" + P.cardEdge + " !important;",
            "}",
            "html." + ROOT + " .add_to_cart_btn:hover,",
            "html." + ROOT + " button[class*=\"add_to_cart\"]:hover{",
            "    background:" + P.surfaceHi + " !important;",
            "}",

            /* the page edges. header.css pins the header to #040b1d with
               !important in BOTH modes, so dark mode overrides it here
               rather than depending on that file being republished. */
            "html." + ROOT + " header,",
            "html." + ROOT + " .fasty_header_container{",
            "    background:" + P.page + " !important;",
            "}",
            "html." + ROOT + " header.fasty_header,",
            "html." + ROOT + " header > div[class*=\"bg-white/95\"]{",
            "    border-bottom:1px solid " + P.border + " !important;",
            "}",

            /* the cart counter is also pinned by header.css */
            "html." + ROOT + " .fasty_header_container .bg-skin-primary{",
            "    background:" + P.rose + " !important;",
            "    color:#fff !important;",
            "}",

            /* the social band above the footer sits on the theme's navy;
               dark mode brings it back to the page colour so the footer
               reads as one plum block with a single edge */
            "html." + ROOT + " .akkad-social-section{",
            "    background:" + P.page + " !important;",
            "    color:" + P.text2 + " !important;",
            "}",

            /* the four brand circles and the contact icon chips inside it are
               painted with the theme's navy, which on the page colour would
               sit at dLum 0.008 - all but invisible */
            "html." + ROOT + " .akkad-social-section a[target=\"_blank\"],",
            "html." + ROOT + " .akkad-social-section i.fa-solid{",
            "    background:" + P.surface2 + " !important;",
            "    color:" + P.text + " !important;",
            "}",
            /* the footer text carries its own navy chips on the theme's
               grey-utility classes; on the plum footer they read as faint
               dark rectangles behind each link, so drop them.
               .default_footer is the element that actually paints the band -
               styling <footer> alone leaves the theme's navy showing. */
            "html." + ROOT + " footer .text-gray-400,",
            "html." + ROOT + " footer .text-gray-500,",
            "html." + ROOT + " footer .text-gray-600,",
            "html." + ROOT + " footer .text-gray-700,",
            "html." + ROOT + " .default_footer_link,",
            "html." + ROOT + " .default_footer_links_container,",
            "html." + ROOT + " .default_footer .animate-slideIn,",
            "html." + ROOT + " .footer_store_info,",
            "html." + ROOT + " .footer_store_info div,",
            "html." + ROOT + " .footer_store_info span,",
            "html." + ROOT + " .default_footer p,",
            "html." + ROOT + " .default_footer a{ background:transparent !important; }",

            "html." + ROOT + " footer,",
            "html." + ROOT + " .default_footer{",
            "    background:" + P.surface + " !important;",
            "    border-top:1px solid " + P.border + " !important;",
            "}",

            /* inputs */
            "html." + ROOT + " input,",
            "html." + ROOT + " textarea,",
            "html." + ROOT + " select{",
            "    background:" + P.surface2 + " !important;",
            "    color:" + P.text + " !important;",
            "    border-color:" + P.border + " !important;",
            "    color-scheme:dark;",
            "}",
            "html." + ROOT + " input::placeholder,",
            "html." + ROOT + " textarea::placeholder{ color:" + P.text3 + " !important; }",

            /* checkout — checkout-restyle.js owns this flow. It ships a
               --co-* variable set that swaps wholesale under html.akkad-dark,
               so every card, input, payment option, invoice, coupon box and
               the mobile sticky bar is plum in dark mode by construction.
               Only the page ground is kept here, as a safety net for the
               moment React paints before that script runs. */
            "html." + ROOT + " .checkout_container,",
            "html." + ROOT + " .checkout_bg{ background:" + P.page + " !important; }",

            /* short cross-fade, only while the mode is being switched */
            "html." + FADE + " body,",
            "html." + FADE + " .app_container,",
            "html." + FADE + " .bg-white,",
            "html." + FADE + " .bg-gray-50,",
            "html." + FADE + " .bg-gray-300,",
            "html." + FADE + " .fasty_product_card,",
            "html." + FADE + " .akkad-arrow,",
            "html." + FADE + " .text-heading,",
            "html." + FADE + " .text-gray-800,",
            "html." + FADE + " .border-gray-300,",
            "html." + FADE + " .checkout_order_summary{",
            "    transition:background-color .28s ease, color .28s ease, border-color .28s ease !important;",
            "}",
            "@media (prefers-reduced-motion:reduce){",
            "    html." + FADE + " *{ transition:none !important; }",
            "}",

/* -------------------------------------------------------------
   Toggle button. The header is the page colour in dark mode and the
   site's own navy in light, so the icon is white either way.
   ------------------------------------------------------------- */
            "#" + BTN_ID + "{",
            "    flex:0 0 auto;",
            "    width:36px;",
            "    height:36px;",
            "    display:inline-flex;",
            "    align-items:center;",
            "    justify-content:center;",
            "    border-radius:8px;",
            "    border:1px solid rgba(255,255,255,.18);",
            "    background:rgba(255,255,255,.08);",
            "    color:#fff !important;",
            "    cursor:pointer;",
            "    padding:0;",
            "    transition:background-color .2s ease, transform .15s ease;",
            "}",
            "#" + BTN_ID + ":hover{ background:rgba(255,255,255,.17); }",
            "#" + BTN_ID + ":active{ transform:scale(.94); }",
            "#" + BTN_ID + ":focus-visible{",
            "    outline:2px solid " + P.border2 + " !important;",
            "    outline-offset:2px;",
            "}",
            /* header.css forces fill:#fff on every svg, so the icon rules need
               an id to out-specify it */
            "#" + BTN_ID + " svg{",
            "    width:18px;",
            "    height:18px;",
            "    fill:none !important;",
            "    stroke:#fff !important;",
            "    stroke-width:1.9;",
            "    stroke-linecap:round;",
            "    stroke-linejoin:round;",
            "}",
            "@media(max-width:768px){",
            "    #" + BTN_ID + "{ width:32px; height:32px; border-radius:7px; }",
            "    #" + BTN_ID + " svg{ width:16px; height:16px; }",
            "}"
        ].join("\n");
    }

    function injectStyle() {
        var el = document.getElementById(STYLE_ID);
        if (!el) {
            el = document.createElement("style");
            el.id = STYLE_ID;
            el.textContent = css();
            (document.head || document.documentElement).appendChild(el);
        }
        return el;
    }

    /* ---------------------------------------------------------------
       Apply
       --------------------------------------------------------------- */
    var fadeTimer = null;

    function paint(animate) {
        var mode = resolve();
        var root = document.documentElement;

        if (animate && !reducedMotion()) {
            root.classList.add(FADE);
            /* force a reflow so the transition property is live before the
               colour swaps, otherwise the browser sees it added in the same
               tick as the change and skips the animation */
            void root.offsetWidth;
            clearTimeout(fadeTimer);
            fadeTimer = setTimeout(function () {
                root.classList.remove(FADE);
            }, 320);
        } else {
            clearTimeout(fadeTimer);
            root.classList.remove(FADE);
        }

        if (mode === "dark") root.classList.add(ROOT);
        else root.classList.remove(ROOT);

        root.setAttribute("data-akkad-theme", mode);
        syncMeta(mode);
        syncButton(mode);
        return mode;
    }

    function reducedMotion() {
        try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
        catch (e) { return false; }
    }

    /* keeps the mobile browser chrome in step with the page */
    function syncMeta(mode) {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "theme-color");
            (document.head || document.documentElement).appendChild(meta);
        }
        meta.setAttribute("content", mode === "dark" ? P.page : "#ffffff");
    }

    /* ---------------------------------------------------------------
       Toggle button
       --------------------------------------------------------------- */
    var ICON_SUN =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="12" r="4.1"/>' +
        '<path d="M12 2.7v2.3M12 19v2.3M2.7 12h2.3M19 12h2.3' +
        'M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/>' +
        "</svg>";

    var ICON_MOON =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M20.4 14.5A8.6 8.6 0 0 1 9.5 3.6a8.6 8.6 0 1 0 10.9 10.9Z"/>' +
        "</svg>";

    var LABEL_TO_LIGHT = "التبديل إلى الوضع الفاتح";
    var LABEL_TO_DARK = "التبديل إلى الوضع الليلي";

    function syncButton(mode) {
        var btn = document.getElementById(BTN_ID);
        if (!btn) return;
        btn.innerHTML = mode === "dark" ? ICON_SUN : ICON_MOON;
        btn.setAttribute("aria-label", mode === "dark" ? LABEL_TO_LIGHT : LABEL_TO_DARK);
        btn.setAttribute("title", mode === "dark" ? LABEL_TO_LIGHT : LABEL_TO_DARK);
        btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
    }

    /* The header row is div.h-[72px].flex; its first child is the visually
       right-hand group (search, wishlist, menu) on this RTL layout. */
    function mountButton() {
        if (document.getElementById(BTN_ID)) return true;

        var header = document.querySelector("header.fasty_header") ||
                     document.querySelector("header");
        if (!header) return false;

        var row = header.querySelector(".h-\\[72px\\]");
        if (!row) {
            var logo = header.querySelector(".fasty_header_logo");
            row = logo ? logo.closest("div.flex") : null;
        }
        if (!row) return false;

        var group = row.children[0];
        if (!group) return false;

        var btn = document.createElement("button");
        btn.id = BTN_ID;
        btn.type = "button";
        btn.setAttribute("aria-label", LABEL_TO_DARK);
        btn.addEventListener("click", function () {
            var next = document.documentElement.classList.contains(ROOT) ? "light" : "dark";
            write(next);
            paint(true);
            scheduleInk();
        });

        group.insertBefore(btn, group.firstChild);
        syncButton(resolve());
        return true;
    }

    /* the header can re-render, so keep trying for a short while */
    var tries = 0;
    var timer = setInterval(function () {
        if (mountButton() || ++tries > 60) clearInterval(timer);
    }, 250);

    /* ---------------------------------------------------------------
       Ink sweep — the safety net for text CSS cannot reach.

       The theme paints text with colours that have no dark-mode
       counterpart: text-skin-primary (#040b1d) on the add-to-cart label,
       #555 on the promo links, and so on. Once the surfaces flip, that
       ink is the same colour as its own background — the add-to-cart
       label measured 1.14:1, i.e. invisible. Rather than chase each
       utility, measure every text node against its real background and
       repair only what is genuinely unreadable.
       --------------------------------------------------------------- */
    var INK = "data-akkad-ink";
    var MIN_CONTRAST = 3.2;      /* below this, treat as unreadable */
    var DARK_BG_LUM = 0.2;       /* only touch text sitting on a dark fill */

    function rgb(str) {
        var m = (str || "").match(/[\d.]+/g);
        if (!m || m.length < 3 || +m[3] === 0) return null;
        return [+m[0], +m[1], +m[2]];
    }

    function lum(c) {
        var a = c[0] / 255, b = c[1] / 255, d = c[2] / 255;
        a = a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        d = d <= 0.03928 ? d / 12.92 : Math.pow((d + 0.055) / 1.055, 2.4);
        return 0.2126 * a + 0.7152 * b + 0.0722 * d;
    }

    function ratio(fg, bg) {
        var a = lum(fg), b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }

    /* nearest painted background, so transparent wrappers inherit correctly */
    function behind(el) {
        var n = el;
        while (n && n.nodeType === 1) {
            var c = rgb(getComputedStyle(n).backgroundColor);
            if (c) return c;
            n = n.parentElement;
        }
        return [255, 255, 255];
    }

    /* a flat grey reads as secondary; anything with real chroma is a
       deliberate accent, so only greys get softened to text2 */
    function isGrey(c) {
        return Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) < 26;
    }

    function sweepInk() {
        if (!document.body) return;
        var dark = document.documentElement.classList.contains(ROOT);
        if (!dark) return restoreInk();

        var all = document.body.querySelectorAll("*");
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.closest("#" + BTN_ID)) continue;

            var s = getComputedStyle(el);
            if (s.display === "none" || s.visibility === "hidden") continue;

            /* only elements that own a text node, so a wrapper keeps the
               colour its children resolve against */
            var owns = false;
            for (var k = 0; k < el.childNodes.length; k++) {
                if (el.childNodes[k].nodeType === 3 && el.childNodes[k].nodeValue.trim()) {
                    owns = true;
                    break;
                }
            }
            if (!owns) continue;

            var fg = rgb(s.color);
            var bg = behind(el);
            if (!fg) continue;
            if (lum(bg) > DARK_BG_LUM) continue;
            if (ratio(fg, bg) >= MIN_CONTRAST) continue;

            if (!el.hasAttribute(INK)) el.setAttribute(INK, el.style.color || "");
            el.style.color = isGrey(fg) ? P.text2 : P.text;
        }
    }

    function restoreInk() {
        var fixed = document.querySelectorAll("[" + INK + "]");
        for (var i = 0; i < fixed.length; i++) {
            fixed[i].style.color = fixed[i].getAttribute(INK) || "";
            fixed[i].removeAttribute(INK);
        }
    }

    /* the theme repaints constantly (sliders, swipers), so debounce hard and
       also re-check on a timer to catch late renders */
    var inkTimer = null;
    function scheduleInk() {
        clearTimeout(inkTimer);
        inkTimer = setTimeout(sweepInk, 220);
    }

    var inkPasses = 0;
    var inkTicker = setInterval(function () {
        sweepInk();
        if (++inkPasses > 20) clearInterval(inkTicker);
    }, 900);

    /* ---------------------------------------------------------------
       Go — synchronous so the first paint is already the right mode
       --------------------------------------------------------------- */
    injectStyle();
    paint(false);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            mountButton();
            paint(false);
        });
    } else {
        mountButton();
    }

    /* follow the OS live, unless the visitor has chosen */
    try {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        var onChange = function () { if (!read()) { paint(true); scheduleInk(); } };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else if (mq.addListener) mq.addListener(onChange);
    } catch (e) {}

    /* re-apply after the SPA replaces the body (debounced: the subtree observer
       fires on every card animation otherwise) */
    var restoreTimer = null;
    new MutationObserver(function () {
        scheduleInk();
        if (document.getElementById(STYLE_ID) && document.getElementById(BTN_ID)) return;
        clearTimeout(restoreTimer);
        restoreTimer = setTimeout(function () {
            if (!document.getElementById(STYLE_ID)) injectStyle();
            if (!document.getElementById(BTN_ID)) mountButton();
            sweepInk();
        }, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });

    sweepInk();
})();