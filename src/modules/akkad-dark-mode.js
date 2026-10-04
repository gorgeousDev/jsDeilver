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
 *   #061c32 / #0a2a45 / #0d3557  navy surfaces for cards, panels, placeholders
 *   #12405f / #1c5c8a  borders
 *   #e6eef6 / #b9cbdb / #8ba3b8  text
 *   #004956 / #0f8478 / #d4af37  brand teal, checkout teal, gold (kept)
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
        surface:  "#061c32",
        surface2: "#0a2a45",
        surface3: "#0d3557",
        border:   "#12405f",
        border2:  "#1c5c8a",
        text:     "#e6eef6",
        text2:    "#b9cbdb",
        text3:    "#8ba3b8"
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

            /* product cards — keep the teal brand border, flip the fills */
            "html." + ROOT + " .fasty_product_card{",
            "    background:" + P.surface + " !important;",
            "    color:" + P.text + " !important;",
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
        var onChange = function () { if (!read()) paint(true); };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else if (mq.addListener) mq.addListener(onChange);
    } catch (e) {}

    /* re-apply after the SPA replaces the body (debounced: the subtree observer
       fires on every card animation otherwise) */
    var restoreTimer = null;
    new MutationObserver(function () {
        if (document.getElementById(STYLE_ID) && document.getElementById(BTN_ID)) return;
        clearTimeout(restoreTimer);
        restoreTimer = setTimeout(function () {
            if (!document.getElementById(STYLE_ID)) injectStyle();
            if (!document.getElementById(BTN_ID)) mountButton();
        }, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });
})();