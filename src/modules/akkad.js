(function () {
  var ignoreNextScroll = false;

  // 1. Function declarations at IIFE function scope (Valid ES5)
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

  function initGallery() {
    var container = document.querySelector(".swiper");
    if (!container) return;
    if (container.querySelector(".akkad-gallery")) return;

    var pagination = container.querySelector(".swiper-pagination");
    if (!pagination) return;

    var slides = container.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate) img");
    if (!slides.length) return;

    var gallery = document.createElement("div");
    gallery.className = "akkad-gallery";

    for (var i = 0; i < slides.length; i++) {
      (function (index) {
        var img = slides[index];
        var thumb = document.createElement("img");
        thumb.src = img.src;
        thumb.className = "akkad-thumb";
        thumb.alt = img.alt || "";

        thumb.addEventListener("click", function () {
          var bullets = container.querySelectorAll(".swiper-pagination-bullet");
          if (bullets[index]) {
            bullets[index].click();
          }
        });
        gallery.appendChild(thumb);
      })(i);
    }

    pagination.insertAdjacentElement("afterend", gallery);

    var updateActiveThumb = function () {
      var bullets = container.querySelectorAll(".swiper-pagination-bullet");
      var thumbs = container.querySelectorAll(".akkad-thumb");

      for (var j = 0; j < thumbs.length; j++) {
        thumbs[j].classList.remove("active");
      }
      for (var k = 0; k < bullets.length; k++) {
        if (bullets[k].classList.contains("swiper-pagination-bullet-active")) {
          if (thumbs[k]) {
            thumbs[k].classList.add("active");
          }
        }
      }
    };

    var observer = new MutationObserver(updateActiveThumb);
    var bullets = container.querySelectorAll(".swiper-pagination-bullet");
    for (var m = 0; m < bullets.length; m++) {
      observer.observe(bullets[m], {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    updateActiveThumb();
  }

  function moveButtons() {
    var btns = document.querySelector(".product_gallery_btns_container");
    if (!btns) return;

    if (window.innerWidth <= 1024) {
      btns.style.top = "12px";
      btns.style.left = "12px";
      btns.style.right = "auto";
      btns.style.bottom = "auto";
      btns.style.display = "flex";
      btns.style.flexDirection = "row";
      btns.style.alignItems = "center";
      btns.style.gap = "8px";
      btns.style.zIndex = "1";
    } else {
      btns.style.top = "";
      btns.style.left = "";
      btns.style.right = "";
      btns.style.bottom = "";
    }
  }

  function addCopyButton() {
    var panel = document.querySelector('div[id^="headlessui-popover-panel"]');
    if (!panel) return;

    var container = panel.querySelector('.flex.gap-3');
    if (!container) return;
    if (container.querySelector('.akkad-copy')) return;

    var copy = document.createElement("a");
    copy.href = "#";
    copy.className = "flex items-center gap-3 akkad-copy";
    copy.innerHTML = '<i class="fa-solid fa-link h-6 w-6"></i>';

    copy.onclick = function (e) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href)
          .then(function () {
            copy.style.color = "#16a34a";
            setTimeout(function () {
              copy.style.color = "";
            }, 1500);
          })
          .catch(function (err) {
            console.error("Clipboard copy failed:", err);
          });
      } else {
        // Fallback for older browsers
        var textarea = document.createElement("textarea");
        textarea.value = location.href;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          copy.style.color = "#16a34a";
          setTimeout(function () {
            copy.style.color = "";
          }, 1500);
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
      }
    };

    container.appendChild(copy);
  }

  function addHome() {
    var panel = document.querySelector(
      'div[id^="headlessui-tabs-panel"][data-headlessui-state="selected"]'
    );
    if (!panel) return;
    if (panel.querySelector(".akkad-home")) return;

    var item = document.createElement("div");
    item.className = "flow-root akkad-home";
    item.innerHTML = [
      '<a href="/" class="-m-2 block cursor-pointer p-2 font-medium text-gray-900">',
      '    الرئيسية',
      '</a>'
    ].join("\n");
    panel.insertBefore(item, panel.firstChild);
  }

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

  function buildNavbar() {
    if (document.querySelector(".akkad-categories-nav")) return;
    var header = document.querySelector("header");
    if (!header) return;

    var data = localStorage.getItem("akkad_categories");
    if (!data) return;

    var categories = JSON.parse(data);
    if (!categories.length) return;

    var nav = document.createElement("div");
    nav.className = "akkad-categories-nav";

    var inner = document.createElement("div");
    inner.className = "akkad-categories-inner";
    inner.innerHTML = '<a href="/">الرئيسية</a>';

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      inner.innerHTML += '<a href="' + cat.link + '">' + cat.name + '</a>';
    }

    nav.appendChild(inner);
    header.insertAdjacentElement("afterend", nav);
  }

  function initNavbar() {
    saveCategories();
    buildNavbar();
  }

  function goTop() {
    if (ignoreNextScroll) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
  }

  try {
    console.log("INLINE SCRIPT WORKING");

    // 2. Google Site Verification Meta Tag Injection
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      var meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
      (document.head || document.documentElement).appendChild(meta);
    }

    // 3. CSS Files Loader (CDN)
    var files = [
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/product-card.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/gallery.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/slider.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/header.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/footer.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    ];

    for (var i = 0; i < files.length; i++) {
      var href = files[i];
      if (!document.querySelector('link[href="' + href + '"]')) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        (document.head || document.documentElement).appendChild(link);
      }
    }

    // 4. Custom CSS Style Injection
    var styleId = "akkad-custom-styles";
    if (!document.getElementById(styleId)) {
      var css = [
        "header {",
        "  z-index: 1000 !important;",
        "  position: sticky !important;",
        "}",
        "div[sectionid='f73b18e7-79ff-457c-9cc5-ad151b4412c9'] > h3 {",
        "  display: none !important;",
        "}",
        "footer, .default_footer, footer.bg-gray-50 {",
        "  background: #000 !important;",
        "  color: #fff !important;",
        "}",
        ".default_footer {",
        "  padding-bottom: 0 !important;",
        "}",
        ".default_footer > div:nth-child(3) {",
        "  display: none !important;",
        "}",
        ".default_footer a, .default_footer p {",
        "  color: #fff !important;",
        "}",
        ".default_footer_links_container {",
        "  border-bottom: 1px solid #1f2937;",
        "  padding-bottom: 20px;",
        "  margin-bottom: 20px;",
        "}",
        "html, body {",
        "  overflow-x: hidden !important;",
        "}",
        ".fasty_product_featured_container > div:first-child .fasty_product_card_img {",
        "  height: 100% !important;",
        "  overflow: hidden !important;",
        "}",
        ".fasty_product_featured_container > div:first-child .fasty_product_card_img img {",
        "  width: 100% !important;",
        "  height: 100% !important;",
        "  object-fit: contain !important;",
        "  object-position: top center !important;",
        "}",
        ".akkad-categories-nav {",
        "  position: sticky;",
        "  top: 72px;",
        "  z-index: 29;",
        "  background: #fff;",
        "  border-top: 1px solid #eee;",
        "  border-bottom: 1px solid #eee;",
        "  overflow-x: auto;",
        "  white-space: nowrap;",
        "  scrollbar-width: none;",
        "}",
        ".akkad-categories-nav::-webkit-scrollbar {",
        "  display: none;",
        "}",
        ".akkad-categories-inner {",
        "  display: flex;",
        "  gap: 20px;",
        "  padding: 12px 16px;",
        "  width: max-content;",
        "}",
        ".akkad-categories-inner a {",
        "  text-decoration: none;",
        "  color: #111;",
        "  font-weight: 700;",
        "}",
        ".akkad-categories-inner a:hover {",
        "  color: #004956;",
        "}",
        "@media (max-width: 639px) {",
        "  .grid {",
        "    grid-template-columns: 1fr !important;",
        "  }",
        "}",
        "@media (max-width: 767px) {",
        "  .fasty_product_featured_container {",
        "    grid-template-columns: 1fr !important;",
        "  }",
        "  .fasty_product_featured_container > .animate-slideIn {",
        "    grid-column: 1 / -1 !important;",
        "  }",
        "}"
      ].join("\n");

      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }

    // 5. fixAlt Execution
    fixAlt();
    new MutationObserver(fixAlt).observe(document.body, {
      childList: true,
      subtree: true
    });

    // 6. initGallery Execution
    var galleryTimer;
    var galleryObserver = new MutationObserver(function () {
      clearTimeout(galleryTimer);
      galleryTimer = setTimeout(initGallery, 300);
    });
    galleryObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      setTimeout(initGallery, 500);
    } else {
      window.addEventListener("load", function () {
        setTimeout(initGallery, 500);
      });
    }

    // 7. moveButtons Execution
    var moveBtnsObserver = new MutationObserver(function () {
      setTimeout(moveButtons, 100);
    });
    moveBtnsObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      moveButtons();
    } else {
      window.addEventListener("load", moveButtons);
    }
    window.addEventListener("resize", moveButtons);

    // 8. addCopyButton Execution
    var copyBtnObserver = new MutationObserver(addCopyButton);
    copyBtnObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 9. addHome Execution
    document.addEventListener("click", function (e) {
      var menuBtn = e.target.closest('button');
      if (!menuBtn) return;
      if (!menuBtn.querySelector('svg')) return;
      setTimeout(addHome, 300);
    });

    // 10. Categories Navbar Execution
    var navbarObserver = new MutationObserver(function () {
      setTimeout(initNavbar, 500);
    });
    navbarObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      setTimeout(initNavbar, 1000);
    } else {
      window.addEventListener("load", function () {
        setTimeout(initNavbar, 1000);
      });
    }

    // 11. URL change automatic scroll to top Execution
    document.addEventListener("click", function (e) {
      if (e.target.closest('button[data-variant="slim"]')) {
        ignoreNextScroll = true;
        setTimeout(function () {
          ignoreNextScroll = false;
        }, 3000);
      }
    });

    var lastUrl = location.href;
    setInterval(function () {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        goTop();
      }
    }, 100);

  } catch (error) {
    console.error("Error in GTM akkad.js execution:", error);
  }
})();
