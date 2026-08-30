(function () {
  var ignoreNextScroll = false;
  var galleryDone = false;

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
    if (galleryDone) return;
    var container = document.querySelector(".swiper");
    if (!container) return;

    var galleryHost = container.parentElement || container;
    var existingGallery = galleryHost.querySelector(".akkad-gallery");

    if (existingGallery) {
      galleryDone = true;
      return;
    }

    var mediaEls = container.querySelectorAll(
      ".swiper-slide:not(.swiper-slide-duplicate) img, .swiper-slide:not(.swiper-slide-duplicate) video"
    );

    if (!mediaEls.length) return;

    var pagination = container.querySelector(".swiper-pagination");
    if (!pagination) return;

    if (existingGallery) {
      var hasVideoThumb = existingGallery.querySelector("div.akkad-thumb");
      if (hasVideoThumb) return;

      for (var v = 0; v < mediaEls.length; v++) {
        if (mediaEls[v].tagName === "VIDEO") {
          var videoDiv = document.createElement("div");
          videoDiv.className = "akkad-thumb";
          videoDiv.style.padding = "0";
          videoDiv.style.background = "#111";
          videoDiv.style.display = "flex";
          videoDiv.style.alignItems = "center";
          videoDiv.style.justifyContent = "center";
          var pIcon = document.createElement("span");
          pIcon.style.cssText = "width:30px;height:30px;background:rgba(255,255,255,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;";
          pIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="#111" width="16" height="16" style="margin-left:2px;"><path d="M8 5v14l11-7z"/></svg>';
          videoDiv.appendChild(pIcon);
          (function (idx) {
            videoDiv.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              var bullets = container.querySelectorAll(".swiper-pagination-bullet");
              if (bullets[idx]) {
                bullets[idx].click();
                setTimeout(function () { updateActiveThumb(true); }, 100);
              }
            });
          })(v);
          existingGallery.appendChild(videoDiv);
        }
      }
      return;
    }

    /* =========================
       Gallery Wrapper
    ========================= */

    var wrapper = document.createElement("div");
    wrapper.className = "akkad-gallery-wrapper";

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "akkad-gallery-arrow akkad-gallery-prev";
    prevBtn.innerHTML = "&#10094;";
    prevBtn.setAttribute("aria-label", "Previous images");

    var gallery = document.createElement("div");
    gallery.className = "akkad-gallery";

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "akkad-gallery-arrow akkad-gallery-next";
    nextBtn.innerHTML = "&#10095;";
    nextBtn.setAttribute("aria-label", "Next images");

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(gallery);
    wrapper.appendChild(nextBtn);

    /* =========================
       Create Thumbnails
    ========================= */

    for (var i = 0; i < mediaEls.length; i++) {
      (function (index) {
        var el = mediaEls[index];
        var isVideo = el.tagName === "VIDEO";

        var clickHandler = function (e) {
          e.preventDefault();
          e.stopPropagation();
          var bullets = container.querySelectorAll(".swiper-pagination-bullet");
          if (bullets[index]) {
            bullets[index].click();
            setTimeout(function () { updateActiveThumb(true); }, 100);
          }
        };

        if (isVideo) {
          var thumbDiv = document.createElement("div");
          thumbDiv.className = "akkad-thumb";
          thumbDiv.style.padding = "0";
          thumbDiv.style.background = "#111";
          thumbDiv.style.display = "flex";
          thumbDiv.style.alignItems = "center";
          thumbDiv.style.justifyContent = "center";

          var playIcon = document.createElement("span");
          playIcon.style.cssText = "width:30px;height:30px;background:rgba(255,255,255,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;";
          playIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="#111" width="16" height="16" style="margin-left:2px;"><path d="M8 5v14l11-7z"/></svg>';
          thumbDiv.appendChild(playIcon);

          thumbDiv.addEventListener("click", clickHandler);
          gallery.appendChild(thumbDiv);
          return;
        }

        var thumb = document.createElement("img");
        thumb.src = el.src;
        thumb.className = "akkad-thumb";
        thumb.alt = el.alt || "";

        thumb.addEventListener("click", clickHandler);
        gallery.appendChild(thumb);
      })(i);
    }

    /* =========================
       Insert Gallery
    ========================= */

    pagination.insertAdjacentElement("afterend", wrapper);
    galleryDone = true;

    /* =========================
       Scroll Arrows
    ========================= */

    function getScrollAmount() {
      return Math.max(180, gallery.clientWidth * 0.7);
    }

    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var swiperInstance = container.swiper;
      if (swiperInstance) {
        swiperInstance.slidePrev();
      } else {
        gallery.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth"
        });
      }
    });

    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var swiperInstance = container.swiper;
      if (swiperInstance) {
        swiperInstance.slideNext();
      } else {
        gallery.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth"
        });
      }
    });

    /* =========================
       Active Thumbnail
    ========================= */

    function updateActiveThumb(shouldScroll) {
      var bullets = container.querySelectorAll(
        ".swiper-pagination-bullet"
      );

      var thumbs = container.querySelectorAll(".akkad-thumb");

      for (var j = 0; j < thumbs.length; j++) {
        thumbs[j].classList.remove("active");
      }

      for (var k = 0; k < bullets.length; k++) {
        if (
          bullets[k].classList.contains(
            "swiper-pagination-bullet-active"
          )
        ) {
          var activeThumb = thumbs[k];

          if (!activeThumb) return;

          activeThumb.classList.add("active");

          /* Auto scroll to active thumbnail */
          if (shouldScroll) {
            activeThumb.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest"
            });
          }

          break;
        }
      }
    }

    /* =========================
       Watch Swiper
    ========================= */

    var observer = new MutationObserver(function () {
      updateActiveThumb(true);
    });

    var bullets = container.querySelectorAll(
      ".swiper-pagination-bullet"
    );

    for (var m = 0; m < bullets.length; m++) {
      observer.observe(bullets[m], {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    updateActiveThumb(true);
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function goTopAfterNavigation() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        window.scrollTo(0, 0);

        if (document.scrollingElement) {
          document.scrollingElement.scrollTop = 0;
        }

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
  }

  // عند تحميل الصفحة
  window.addEventListener("load", goTop);

  // عند الرجوع/التنقل
  window.addEventListener("pageshow", goTop);

  // راقب تغيّر الـ URL في React/Next
  var lastUrl = location.href;

  new MutationObserver(function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      goTopAfterNavigation();
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });

  // احتياطي للـ SPA navigation
  var originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    goTopAfterNavigation();
  };

  var originalReplaceState = history.replaceState;
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    goTopAfterNavigation();
  };

  window.addEventListener("popstate", function () {
    goTopAfterNavigation();
  });

  try {

    // 2. Google Site Verification Meta Tag Injection
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      var meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
      (document.head || document.documentElement).appendChild(meta);
    }

    // 3. CSS Files Loader (CDN)
    var files = [
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/product-card.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/gallery.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/slider.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/header.css",
      "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/footer.css",
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

        ".akkad-gallery-wrapper {",
        "  display: flex !important;",
        "  flex-direction: row !important;",
        "  align-items: center !important;",
        "  width: 100% !important;",
        "  max-width: 100% !important;",
        "  gap: 6px !important;",
        "}",

        ".akkad-gallery {",
        "  display: flex !important;",
        "  flex-direction: row !important;",
        "  flex-wrap: nowrap !important;",
        "  justify-content: flex-start !important;",
        "  align-items: center !important;",
        "  gap: 10px !important;",
        "  margin-top: 15px !important;",
        "  width: 100% !important;",
        "  min-width: 0 !important;",
        "  flex: 1 1 auto !important;",
        "  overflow-x: auto !important;",
        "  overflow-y: hidden !important;",
        "  white-space: nowrap !important;",
        "  scrollbar-width: none !important;",
        "  -webkit-overflow-scrolling: touch !important;",
        "  touch-action: pan-x !important;",
        "  padding: 4px 2px 8px !important;",
        "}",

        ".akkad-gallery::-webkit-scrollbar {",
        "  display: none !important;",
        "}",

        ".akkad-gallery .akkad-thumb {",
        "  display: block !important;",
        "  width: 70px !important;",
        "  height: 70px !important;",
        "  min-width: 70px !important;",
        "  max-width: 70px !important;",
        "  flex: 0 0 70px !important;",
        "  object-fit: cover !important;",
        "  border-radius: 12px !important;",
        "  cursor: pointer !important;",
        "}",

        ".akkad-gallery .akkad-thumb.active {",
        "  border: 2px solid #d4af37 !important;",
        "  transform: scale(1.05);",
        "}",

        ".akkad-gallery-arrow {",
        "  display: flex !important;",
        "  align-items: center !important;",
        "  justify-content: center !important;",
        "  flex: 0 0 34px !important;",
        "  width: 34px !important;",
        "  height: 34px !important;",
        "  padding: 0 !important;",
        "  border: 1px solid #ddd !important;",
        "  border-radius: 50% !important;",
        "  background: #fff !important;",
        "  color: #040b1d !important;",
        "  font-size: 20px !important;",
        "  line-height: 1 !important;",
        "  cursor: pointer !important;",
        "  z-index: 20 !important;",
        "}",

        ".akkad-gallery-arrow:hover {",
        "  background: #040b1d !important;",
        "  color: #fff !important;",
        "}",

        ".swiper-pagination {",
        "  display: none !important;",
        "}",

        "@media (max-width: 768px) {",
        "  .akkad-gallery-arrow {",
        "    display: none !important;",
        "  }",
        "}",

        "header {",
        "  z-index: 1000 !important;",
        "  position: sticky !important;",
        "}",

        "div[sectionid='f73b18e7-79ff-457c-9cc5-ad151b4412c9'] > h3 {",
        "  display: none !important;",
        "}",

        "footer, .default_footer, footer.bg-gray-50 {",
        "  background: #040b1d !important;",
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
        "  border-bottom: 1px solid #040b1d;",
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
        "  color: #040b1d;",
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
      if (galleryDone) { galleryObserver.disconnect(); return; }
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

    // 9. Categories Navbar Execution
    if (document.readyState === "complete") {
      initNavbar();
    } else {
      window.addEventListener("load", initNavbar);
    }

  } catch (error) {
    console.error("Error in GTM akkad.js execution:", error);
  }
})();
