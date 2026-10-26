/* v2-google-site-verification */
try {
(function () {
    if (document.querySelector('meta[name="google-site-verification"]')) return;

    var meta = document.createElement("meta");
    meta.name = "google-site-verification";
    meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
    document.head.appendChild(meta);
})();
} catch (error) { console.error("[Akkad] feature failed: v2-google-site-verification", error); }
;
/* v2-whatsapp-widget */
try {
(function () {
    var script = document.createElement("script");
    script.src = "https://cdn.pickyassist.com/WhatsApp/embed.js";
    script.async = true;
    document.head.appendChild(script);

    var config = {
        t: "Icon-Only-Black",
        s: "",
        i: "WhatsApp Us",
        a: "animation-Floating",
        n: "201508331823",
        m: "مرحبًا، لدي بعض الأسئلة قبل إتمام عملية الشراء.",
        w: 3,
        b: "#44174E",
        c: "#ffffff",
        mr: "0",
        ml: "0",
        mb: "0",
        z: "9999",
        p: "position-right"
    };

    function loadWhatsApp() {
        if (typeof window._waBtn === "function") {
            window._waBtn(config);
        } else {
            setTimeout(loadWhatsApp, 200);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(loadWhatsApp, 500);
        });
    } else {
        setTimeout(loadWhatsApp, 500);
    }
})();
} catch (error) { console.error("[Akkad] feature failed: v2-whatsapp-widget", error); }
;
/* v2-store-style-overrides */
try {
(function () {
    var style = document.createElement("style");
    style.id = "akkad-v2-styles";
    style.textContent = "\n\
/* مربعات العداد */\n\
.mt-3.flex.justify-center.gap-5 > div{\n\
    background:#fff5f5 !important;\n\
    border:1px solid #ef4444 !important;\n\
    border-radius:12px !important;\n\
}\n\
\n\
/* الأرقام */\n\
.mt-3.flex.justify-center.gap-5 > div span:first-child{\n\
    color:#dc2626 !important;\n\
    font-size:24px !important;\n\
    font-weight:800 !important;\n\
}\n\
\n\
/* النص (أيام - ساعات...) */\n\
.mt-3.flex.justify-center.gap-5 > div span:last-child{\n\
    color:#7f1d1d !important;\n\
    font-weight:700 !important;\n\
}\n\
\n\
/* عنوان العداد */\n\
.mt-4.flex.flex-col.justify-center p{\n\
    color:#b91c1c !important;\n\
    font-weight:700 !important;\n\
}\n\
@media (max-width:768px){\n\
    [id^=\"headlessui-popover-panel\"]{\n\
        position: absolute !important;\n\
        left: 0 !important;\n\
        right: auto !important;\n\
        top: calc(100% + 4px) !important;\n\
        bottom: auto !important;\n\
        transform: none !important;\n\
    }\n\
}\n\
@media (max-width:768px){\n\
\n\
/* إزالة أي مسافات خارجية */\n\
.content_container{\n\
    padding-left:8px !important;\n\
    padding-right:8px !important;\n\
}\n\
\n\
.carouselWrapper{\n\
    margin:10 !important;\n\
    padding:10 !important;\n\
}\n\
\n\
.home_slider_container{\n\
    padding:10 !important;\n\
}\n\
\n\
/* إزالة الحواف من الكارد */\n\
.home_slider_card{\n\
    margin:0 !important;\n\
}\n\
\n\
.home_slider_card > a > div{\n\
    border-radius:0 !important;\n\
    overflow:hidden !important;\n\
}\n\
\n\
/* زووم بسيط للصورة */\n\
.home_slider_card img{\n\
    transform:scale(1.08);\n\
    transition:transform .3s ease;\n\
}\n\
\n\
}\n\
";
    document.head.appendChild(style);
})();
} catch (error) { console.error("[Akkad] feature failed: v2-store-style-overrides", error); }
;
/* v2-mobile-product-grid */
try {
(function () {
    var style = document.createElement("style");
    style.id = "akkad-mobile-product-grid";
    style.textContent = `
        @media (max-width: 639px) {
            .category_products_grid_container {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 12px !important;
                width: 100% !important;
            }

            .category_products_grid_container > div {
                width: 100% !important;
                min-width: 0 !important;
            }

            .category_products_grid_container .fasty_product_card {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
            }
        }
    `;

    document.head.appendChild(style);
})();
} catch (error) { console.error("[Akkad] feature failed: v2-mobile-product-grid", error); }
;
/* akkad-stylesheets */
try {
(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var base = selfSrc.replace(/(?:features|dist)\/[^\/]*$/, "");
  var versionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var version = versionMatch ? "?v=" + versionMatch[1] : "";

  var fallback = "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/";
  var files = [
    "product-card.css",
    "gallery.css",
    "slider.css",
    "header.css",
    "footer.css"
  ].map(function (file) {
    return (base || fallback) + file + version;
  });
  files.push("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");

  function stylesheetLoaded(href) {
    var path = href.split("?")[0];
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.split("?")[0] === path) return true;
    }
    return false;
  }

  for (var i = 0; i < files.length; i++) {
    var href = files[i];
    if (stylesheetLoaded(href)) continue;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    (document.head || document.documentElement).appendChild(link);
  }
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-stylesheets", error); }
;
/* akkad-image-alt */
try {
(function () {
  function fixAlt() {
    var titleEl = document.querySelector("h1");
    var productName = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : document.title;
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.alt || img.alt.indexOf("http://") === 0 || img.alt.indexOf("https://") === 0) {
        img.alt = productName;
      }
    }
  }

  fixAlt();
  new MutationObserver(fixAlt).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-image-alt", error); }
;
/* akkad-category-navigation */
try {
(function () {
  function saveCategories() {
    var cards = document.querySelectorAll(".default_category_card");
    if (!cards.length) return;

    var categories = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var nameEl = card.querySelector("h4");
      var name = (nameEl && nameEl.childNodes[0]) ? nameEl.childNodes[0].textContent.trim() : "";
      var link = null;
      var a = card.closest("a");
      if (a) link = a.href;

      if (!link) {
        var onclick = card.getAttribute("onclick");
        if (onclick) {
          var m = onclick.match(/'(.*?)'/);
          if (m) link = m[1];
        }
      }

      if (name && link) {
        categories.push({ name: name, link: link });
      }
    }

    if (categories.length) {
      localStorage.setItem("akkad_categories", JSON.stringify(categories));
    }
  }

  /* Category names and links are read back out of localStorage, so they are
     treated as untrusted input: the name is written as a text node and the
     link is only accepted when it resolves to this origin. */
  function safeCategoryHref(url) {
    if (!url) return null;
    try {
      var parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin) return null;
      return parsed.pathname + parsed.search + parsed.hash;
    } catch (e) {
      return null;
    }
  }

  function buildNavbar() {
    if (document.querySelector(".akkad-categories-nav")) return;
    var header = document.querySelector("header");
    if (!header) return;

    var data;
    try {
      data = localStorage.getItem("akkad_categories");
    } catch (e) {
      return;
    }
    if (!data) return;

    var categories;
    try {
      categories = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (!categories || !categories.length) return;

    var nav = document.createElement("div");
    nav.className = "akkad-categories-nav";

    var inner = document.createElement("div");
    inner.className = "akkad-categories-inner";

    function addCategoryLink(href, text) {
      var link = document.createElement("a");
      link.href = href;
      link.textContent = text;
      inner.appendChild(link);
    }

    addCategoryLink("/", "الرئيسية");

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      if (!cat) continue;
      var href = safeCategoryHref(cat.link);
      if (!href) continue;
      addCategoryLink(href, cat.name || "");
    }

    nav.appendChild(inner);
    header.insertAdjacentElement("afterend", nav);
  }

  function initNavbar() {
    saveCategories();
    buildNavbar();
  }

    // 9. Categories Navbar Execution
    if (document.readyState === "complete") {
      initNavbar();
    } else {
      window.addEventListener("load", initNavbar);
    }

    // The header is re-rendered by a soft navigation, which drops the injected
    // categories bar; re-add it whenever the DOM settles rather than only once at load.
    if (document.body) {
      var navTimer;
      new MutationObserver(function () {
        if (document.querySelector(".akkad-categories-nav")) return;
        clearTimeout(navTimer);
        navTimer = setTimeout(initNavbar, 400);
      }).observe(document.body, {
        childList: true,
        subtree: true
      });
    }
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-category-navigation", error); }
;
/* v2-sale-tags */
try {
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
} catch (error) { console.error("[Akkad] feature failed: v2-sale-tags", error); }
;
/* v2-featured-banner-frame */
try {
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
} catch (error) { console.error("[Akkad] feature failed: v2-featured-banner-frame", error); }
