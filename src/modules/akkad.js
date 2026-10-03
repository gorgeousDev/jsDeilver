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
      var hasVideoThumb = existingGallery.querySelector("div.akkad-thumb");
      if (hasVideoThumb) { galleryDone = true; return; }

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

      var existingThumbs = existingGallery.querySelectorAll(".akkad-thumb");
      for (var t = 0; t < existingThumbs.length; t++) {
        (function (idx) {
          if (existingThumbs[idx].tagName === "IMG") {
            existingThumbs[idx].addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              var bullets = container.querySelectorAll(".swiper-pagination-bullet");
              if (bullets[idx]) {
                bullets[idx].click();
                setTimeout(function () { updateActiveThumb(true); }, 100);
              }
            });
          }
        })(t);
      }

      galleryDone = true;
      return;
    }

    var mediaEls = container.querySelectorAll(
      ".swiper-slide:not(.swiper-slide-duplicate) img, .swiper-slide:not(.swiper-slide-duplicate) video"
    );

    if (!mediaEls.length) return;

    var pagination = container.querySelector(".swiper-pagination");
    if (!pagination) return;

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

          /* Auto scroll to active thumbnail (horizontal only, no page scroll) */
          if (shouldScroll) {
            var target = activeThumb.offsetLeft - (gallery.clientWidth / 2) + (activeThumb.offsetWidth / 2);
            gallery.scrollTo({
              left: target,
              behavior: "smooth"
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

  // Removed goTop, load, and pageshow listeners.
  // The load event fires AFTER all resources finish loading — if the user scrolls
  // before that, goTop() scrolls them back to top. Next.js handles scroll
  // restoration natively via its router.

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



    // 5. fixAlt Execution
    fixAlt();
    new MutationObserver(fixAlt).observe(document.body, {
      childList: true,
      subtree: true
    });

    // 6. initGallery Execution
    var galleryTimer;
    var galleryObserver = new MutationObserver(function () {
      if (galleryDone || (typeof __akkad_isHomePage === "function" && __akkad_isHomePage())) {
        galleryObserver.disconnect(); return;
      }
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
      if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
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
    var copyBtnObserver = new MutationObserver(function () {
      if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
      addCopyButton();
    });
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
