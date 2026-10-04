/**
 * AKKAD — dark mode
 * Standalone file. No dependency on akkad-v2.js.
 *
 * - Follows the OS (prefers-color-scheme) until the visitor taps the button.
 * - One tap = explicit override, remembered in localStorage.
 * - Works on every page, checkout included.
 *
 * Palette is derived from the colours already on the site:
 *   #040b1d header/footer navy -> page background
 *   #0a2a45 / #0d3557 / #10456b  navy surfaces for cards, panels, placeholders
 *   #1a4468 / #2a6ea0  borders
 *   #e6eef6 / #b9cbdb / #8ba3b8  text
 *   #1a8899 / #0f8478 / #d4af37  brand teal, checkout teal, gold (kept)
 *
 * The surface ramp deliberately starts well above the page colour. Cards at
 * #061c32 measured dLum 0.008 against #040b1d, which is too small to read as
 * a panel, so the whole grid looked like flat text on a void. #0a2a45 gives
 * dLum 0.018 and the cards separate without going grey.
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
        page:     "#040b1d",
        surface:  "#0a2a45",
        surface2: "#0d3557",
        surface3: "#10456b",
        border:   "#1a4468",
        border2:  "#2a6ea0",
        text:     "#e6eef6",
        text2:    "#b9cbdb",
        text3:    "#8ba3b8",
        /* the brand teal #004956 all but vanishes on a dark card, so the
           dark-mode border uses a lightened teal of the same hue */
        cardEdge: "#1a8899"
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
            "html." + ROOT + " .bg-white\\/95{ background:rgba(6,28,50,.95) !important; }",
            "html." + ROOT + " .bg-gray-50{ background:#04162c !important; }",
            "html." + ROOT + " .bg-gray-100{ background:" + P.surface + " !important; }",
            "html." + ROOT + " .bg-gray-200{ background:" + P.surface2 + " !important; }",
            "html." + ROOT + " .bg-gray-300{ background:" + P.surface3 + " !important; }",
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
            "html." + ROOT + " .border-gray-100{ border-color:#0e3050 !important; }",
            "html." + ROOT + " .border-gray-200{ border-color:#0e3050 !important; }",
            "html." + ROOT + " .border-gray-300{ border-color:" + P.border + " !important; }",
            "html." + ROOT + " .border-gray-400{ border-color:" + P.border2 + " !important; }",
            "html." + ROOT + " .border-heading{ border-color:" + P.border + " !important; }",

            /* product cards — keep the teal brand border, flip the fills.
               gallery.css pins the border to #004956 !important, so the
               dark value needs matching importance and higher specificity. */
            "html." + ROOT + " .fasty_product_card{",
            "    background:" + P.surface + " !important;",
            "    color:" + P.text + " !important;",
            "    border-color:" + P.cardEdge + " !important;",
            "}",
            "html." + ROOT + " .fasty_product_card_img{ background:" + P.surface3 + " !important; }",
            "html." + ROOT + " .fasty_product_card_name{ color:" + P.text + " !important; }",
            "html." + ROOT + " .fasty_product_card_price{ color:" + P.text + " !important; }",
            "html." + ROOT + " .fasty_product_card_price del{ color:" + P.text3 + " !important; }",

            /* akkad section 14 */
            "html." + ROOT + " .akkad-products-section,",
            "html." + ROOT + " .akkad-section-title{ color:" + P.text + " !important; }",

            /* section 14 arrows are white circles with an inherited glyph
               colour, so both the fill and the chevron have to be set.
               Scoped so the graduation slider keeps its own dark navy. */
            "html." + ROOT + " .akkad-products-section .akkad-arrow{",
            "    background:" + P.surface3 + " !important;",
            "    color:" + P.text + " !important;",
            "    border:1px solid " + P.border + " !important;",
            "    box-shadow:0 2px 10px rgba(0,0,0,.5) !important;",
            "}",
            "html." + ROOT + " .akkad-products-section .akkad-arrow:hover{",
            "    background:" + P.surface2 + " !important;",
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
            "html." + ROOT + " #akkad-nav .star{ color:#ffd83d !important; }",
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
            "    background:" + P.surface3 + " !important;",
            "}",

            /* header and footer are the same navy as the page (dLum 0.0000),
               so both ends of the page had no edge at all */
            "html." + ROOT + " header.fasty_header,",
            "html." + ROOT + " header > div[class*=\"bg-white/95\"]{",
            "    border-bottom:1px solid " + P.border + " !important;",
            "}",
            "html." + ROOT + " footer{",
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

            /* checkout — keep its teal identity, re-base only the neutrals */
            "html." + ROOT + " .checkout_container,",
            "html." + ROOT + " .checkout_bg{ background:" + P.page + " !important; }",
            "html." + ROOT + " .checkout_order_summary{",
            "    background:" + P.surface + " !important;",
            "    border-color:" + P.border + " !important;",
            "}",
            "html." + ROOT + " .checkout_form label{ color:" + P.text2 + " !important; }",
            "html." + ROOT + " #contact-info-heading{",
            "    color:" + P.text + " !important;",
            "    border-color:" + P.border + " !important;",
            "}",
            "html." + ROOT + " #contact-info-heading::before{ background:#0f8478 !important; }",

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
               Toggle button. Header and footer are #040b1d in both modes, so
               the icon is always white.
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