/* akkad-product-gallery */
try {
(function () {
  var ignoreNextScroll = false;
  /* Which page the gallery was built for. A plain "done" flag meant the gallery
     was built once on the first product visited and then never again: a soft
     navigation to a second product left the thumbnails missing until a refresh. */
  var galleryDone = false;
  var galleryPath = null;
  var bulletObserver = null;

  function markGalleryDone() {
    galleryDone = true;
    galleryPath = window.location.pathname;
  }

  function initGallery() {
    if (galleryDone && galleryPath === window.location.pathname) return;
    var container = document.querySelector(".swiper");
    if (!container) return;

    var mediaEls = container.querySelectorAll(
      ".swiper-slide:not(.swiper-slide-duplicate) img, .swiper-slide:not(.swiper-slide-duplicate) video"
    );

    var galleryHost = container.parentElement || container;
    var existingGallery = galleryHost.querySelector(".akkad-gallery");

    if (existingGallery) {
      var hasVideoThumb = existingGallery.querySelector("div.akkad-thumb");
      if (hasVideoThumb) { markGalleryDone(); return; }

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

      markGalleryDone();
      return;
    }

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
    markGalleryDone();

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

    if (bulletObserver) bulletObserver.disconnect();
    bulletObserver = new MutationObserver(function () {
      updateActiveThumb(true);
    });

    var bullets = container.querySelectorAll(
      ".swiper-pagination-bullet"
    );

    for (var m = 0; m < bullets.length; m++) {
      bulletObserver.observe(bullets[m], {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    updateActiveThumb(true);
  }

  var galleryTimer = null;
  var galleryObserver = null;

  function syncGalleryRoute() {
    if (window.location.pathname.indexOf("/products/") !== 0) {
      if (galleryObserver) galleryObserver.disconnect();
      galleryObserver = null;
      if (bulletObserver) bulletObserver.disconnect();
      bulletObserver = null;
      clearTimeout(galleryTimer);
      galleryTimer = null;
      galleryDone = false;
      return;
    }

    if (!galleryObserver && document.body) {
      galleryObserver = new MutationObserver(function () {
        clearTimeout(galleryTimer);
        galleryTimer = setTimeout(initGallery, 300);
      });
      galleryObserver.observe(document.body, { childList: true, subtree: true });
    }

    clearTimeout(galleryTimer);
    galleryTimer = setTimeout(initGallery, 300);
  }

  window.addEventListener("akkad:route-change", syncGalleryRoute);
  syncGalleryRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-product-gallery", error); }
;
/* akkad-gallery-controls */
try {
(function () {
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

    // 7. moveButtons Execution
    var moveBtnsObserver = null;
    var moveTimer = null;

    function syncGalleryRoute() {
      if (window.location.pathname.indexOf("/products/") !== 0) {
        if (moveBtnsObserver) moveBtnsObserver.disconnect();
        moveBtnsObserver = null;
        window.removeEventListener("resize", moveButtons);
        clearTimeout(moveTimer);
        moveTimer = null;
        return;
      }

      if (!moveBtnsObserver && document.body) {
        moveBtnsObserver = new MutationObserver(function () {
          clearTimeout(moveTimer);
          moveTimer = setTimeout(moveButtons, 100);
        });
        moveBtnsObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("resize", moveButtons);
      }

      moveButtons();
    }

    window.addEventListener("akkad:route-change", syncGalleryRoute);
    syncGalleryRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-gallery-controls", error); }
;
/* akkad-copy-link */
try {
(function () {
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

    // 8. addCopyButton Execution
    var copyBtnObserver = null;
    var copyBtnTimer = null;

    function syncCopyLinkRoute() {
      if (window.location.pathname.indexOf("/products/") !== 0) {
        if (copyBtnObserver) copyBtnObserver.disconnect();
        copyBtnObserver = null;
        clearTimeout(copyBtnTimer);
        copyBtnTimer = null;
        return;
      }

      addCopyButton();
      if (copyBtnObserver || !document.body) return;

      copyBtnObserver = new MutationObserver(function () {
        clearTimeout(copyBtnTimer);
        copyBtnTimer = setTimeout(addCopyButton, 100);
      });
      copyBtnObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncCopyLinkRoute);
    syncCopyLinkRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: akkad-copy-link", error); }
;
/* v2-viewer-badge */
try {
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    var styledBadges = new WeakSet();

    function styleBadge(badge) {
        if (styledBadges.has(badge) || !/^\d+$/.test(badge.textContent.trim())) return;

        var parent = badge.parentElement;
        if (!parent || !parent.textContent.includes("يشاهد هذا المنتج")) return;

        parent.style.marginTop = "18px";
        parent.style.marginBottom = "20px";
        parent.style.background = "#44174E";
        parent.style.border = "1px solid #662249";
        parent.style.borderRadius = "12px";
        parent.style.padding = "12px 16px";
        parent.style.color = "#ffffff";
        parent.style.fontWeight = "700";

        badge.style.background = "#A34054";
        badge.style.color = "#ffffff";
        badge.style.padding = "3px 10px";
        badge.style.borderRadius = "999px";
        badge.style.fontWeight = "800";
        styledBadges.add(badge);
    }

    function styleNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.matches("span")) styleBadge(node);

        var badges = node.querySelectorAll("span");
        for (var i = 0; i < badges.length; i++) styleBadge(badges[i]);
    }

    styleNode(document.body);

    new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
            if (records[i].target.nodeType === 1 && records[i].target.matches("span")) {
                styleBadge(records[i].target);
            }
            for (var j = 0; j < records[i].addedNodes.length; j++) {
                styleNode(records[i].addedNodes[j]);
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
} catch (error) { console.error("[Akkad] feature failed: v2-viewer-badge", error); }
;
/* v2-product-details-position */
try {
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function moveProductDetails() {
        var policies = document.querySelector(".flex.flex-col.mt-4.rounded-xl.border");
        var details = document.querySelector(".product_tabs_container");

        if (!policies || !details) return;

        if (policies.previousElementSibling !== details) {
            policies.parentNode.insertBefore(details, policies);
        }
    }

    var observer = null;
    var moveTimer = null;

    function syncProductRoute() {
        if (window.location.pathname.indexOf("/products/") !== 0) {
            if (observer) observer.disconnect();
            observer = null;
            clearTimeout(moveTimer);
            moveTimer = null;
            return;
        }

        moveProductDetails();
        if (observer || !document.body) return;

        observer = new MutationObserver(function () {
            clearTimeout(moveTimer);
            moveTimer = setTimeout(moveProductDetails, 250);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("akkad:route-change", syncProductRoute);
    syncProductRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: v2-product-details-position", error); }
;
/* v2-image-preview-lightbox */
try {
/* =========================================
   7. Image Preview Lightbox
   ========================================= */
(function () {
    var isStatePushed = false;
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwipe = false;
    var activeClickHandler = null;
    var activeKeydownHandler = null;
    var activePopstateHandler = null;
    var routeObserver = null;
    var checkTimer = null;

    function recordTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isSwipe = false;
    }

    function recordTouchMove(e) {
        if (!e.touches || e.touches.length === 0) return;
        var touch = e.touches[0];
        var diffX = Math.abs(touch.clientX - touchStartX);
        var diffY = Math.abs(touch.clientY - touchStartY);

        if (diffX > 10 || diffY > 10) {
            isSwipe = true;
        }
    }

    function init() {
        if (!window.location.pathname.startsWith("/products/")) return;
        if (document.getElementById("akkad-preview")) return;

        var gallery = document.querySelector(".p_gallery_container");
        if (!gallery) return;

        var overlay = document.createElement("div");
        overlay.innerHTML = '\
        <div id="akkad-preview">\
            <span class="close">&times;</span>\
            <img>\
        </div>';
        document.body.appendChild(overlay);

        var style = document.createElement("style");
        style.id = "akkad-preview-style";
        style.textContent = "\n\
#akkad-preview {\n\
    position: fixed;\n\
    inset: 0;\n\
    background: rgba(0, 0, 0, 0.85);\n\
    backdrop-filter: blur(8px);\n\
    -webkit-backdrop-filter: blur(8px);\n\
    display: flex;\n\
    justify-content: center;\n\
    align-items: center;\n\
    z-index: 999999;\n\
    opacity: 0;\n\
    visibility: hidden;\n\
    transition: opacity 0.25s, visibility 0.25s;\n\
    touch-action: none;\n\
}\n\
\n\
#akkad-preview.show {\n\
    opacity: 1;\n\
    visibility: visible;\n\
}\n\
\n\
#akkad-preview img {\n\
    max-width: 95vw;\n\
    max-height: 95vh;\n\
    object-fit: contain;\n\
    user-select: none;\n\
    -webkit-user-drag: none;\n\
    transform: scale(0.9);\n\
}\n\
\n\
#akkad-preview:not(.interactive) img {\n\
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n\
}\n\
\n\
#akkad-preview.show img {\n\
    transform: scale(1);\n\
}\n\
\n\
#akkad-preview .close {\n\
    position: absolute;\n\
    top: 24px;\n\
    right: 24px;\n\
    font-size: 36px;\n\
    color: rgba(255, 255, 255, 0.7);\n\
    cursor: pointer;\n\
    line-height: 1;\n\
    user-select: none;\n\
    z-index: 2;\n\
    width: 48px;\n\
    height: 48px;\n\
    display: flex;\n\
    justify-content: center;\n\
    align-items: center;\n\
    background: rgba(255, 255, 255, 0.1);\n\
    border-radius: 50%;\n\
    transition: background 0.2s, color 0.2s, transform 0.2s;\n\
}\n\
\n\
#akkad-preview .close:hover {\n\
    color: #fff;\n\
    background: rgba(255, 255, 255, 0.2);\n\
    transform: scale(1.05);\n\
}\n\
";
        document.head.appendChild(style);

        var box = document.getElementById("akkad-preview");
        var preview = box.querySelector("img");

        var scale = 1;
        var lastScale = 1;
        var startDistance = 0;
        var isPanning = false;
        var startX = 0, startY = 0;
        var translateX = 0, translateY = 0;

        function open(src, fromPopState) {
            resetZoom();
            preview.src = src;
            box.classList.add("show");
            document.body.style.overflow = "hidden";

            if (!fromPopState) {
                history.pushState({ akkadPreview: true, src: src }, "");
                isStatePushed = true;
            } else {
                isStatePushed = true;
            }
        }

        function close() {
            if (!box || !box.classList.contains("show")) return;
            box.classList.remove("show");
            if (document.body) document.body.style.overflow = "";
            isStatePushed = false;
            resetZoom();
        }

        function handle(e) {
            if (isSwipe) {
                isSwipe = false;
                return;
            }

            var img = e.target.closest(".p_gallery_container img");
            if (!img) return;
            if (img.closest(".akkad-gallery")) return;

            e.preventDefault();
            e.stopPropagation();

            open(img.currentSrc || img.src);
        }

        activeClickHandler = handle;
        document.addEventListener("click", activeClickHandler, { capture: true });

        function closePreview(e) {
            if (e.target === box || e.target.classList.contains("close")) {
                if (isStatePushed) {
                    history.back();
                } else {
                    close();
                }
            }
        }

        box.addEventListener("click", closePreview);

        activeKeydownHandler = function (e) {
            if (e.key === "Escape") {
                if (isStatePushed) {
                    history.back();
                } else {
                    close();
                }
            }
        };
        document.addEventListener("keydown", activeKeydownHandler);

        activePopstateHandler = function (e) {
            if (e.state && e.state.akkadPreview) {
                open(e.state.src, true);
            } else {
                close();
            }
        };
        window.addEventListener("popstate", activePopstateHandler);
        document.addEventListener("touchstart", recordTouchStart, { passive: true });
        document.addEventListener("touchmove", recordTouchMove, { passive: true });

        if (history.state && history.state.akkadPreview && history.state.src) {
            open(history.state.src, true);
        }

        preview.addEventListener("touchstart", function (e) {
            box.classList.add("interactive");
            if (e.touches.length === 2) {
                startDistance = getDistance(e.touches[0], e.touches[1]);
                lastScale = scale;
            } else if (e.touches.length === 1 && scale > 1) {
                isPanning = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        }, { passive: false });

        preview.addEventListener("touchmove", function (e) {
            if (e.touches.length === 2) {
                e.preventDefault();
                var dist = getDistance(e.touches[0], e.touches[1]);
                scale = Math.min(Math.max(1, lastScale * (dist / startDistance)), 4);
                updateTransform();
            } else if (e.touches.length === 1 && isPanning) {
                e.preventDefault();
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                limitTranslate();
                updateTransform();
            }
        }, { passive: false });

        preview.addEventListener("touchend", function (e) {
            if (e.touches.length < 2) {
                lastScale = scale;
            }
            if (e.touches.length === 0) {
                isPanning = false;
                box.classList.remove("interactive");
                if (scale <= 1.01) {
                    resetZoom();
                }
            }
        }, { passive: true });

        function getDistance(t1, t2) {
            return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        }

        function updateTransform() {
            preview.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
        }

        function limitTranslate() {
            if (scale <= 1) {
                translateX = 0;
                translateY = 0;
                return;
            }
            var rect = preview.getBoundingClientRect();
            var maxX = Math.max(0, (rect.width - window.innerWidth) / 2);
            var maxY = Math.max(0, (rect.height - window.innerHeight) / 2);

            translateX = Math.min(Math.max(translateX, -maxX), maxX);
            translateY = Math.min(Math.max(translateY, -maxY), maxY);
        }

        function resetZoom() {
            scale = 1;
            lastScale = 1;
            translateX = 0;
            translateY = 0;
            preview.style.transform = "";
        }
    }

    function deactivate() {
        if (activeClickHandler) {
            document.removeEventListener("click", activeClickHandler, true);
            activeClickHandler = null;
        }
        if (activeKeydownHandler) {
            document.removeEventListener("keydown", activeKeydownHandler);
            activeKeydownHandler = null;
        }
        if (activePopstateHandler) {
            window.removeEventListener("popstate", activePopstateHandler);
            activePopstateHandler = null;
        }
        document.removeEventListener("touchstart", recordTouchStart);
        document.removeEventListener("touchmove", recordTouchMove);

        var preview = document.getElementById("akkad-preview");
        if (preview) preview.remove();
        var style = document.getElementById("akkad-preview-style");
        if (style) style.remove();

        document.body.style.overflow = "";
        isStatePushed = false;
    }

    function checkAndInit() {
        if (window.location.pathname.startsWith("/products/")) {
            init();
            return;
        }
        deactivate();
    }

    function syncProductRoute() {
        if (!window.location.pathname.startsWith("/products/")) {
            if (routeObserver) routeObserver.disconnect();
            routeObserver = null;
            clearTimeout(checkTimer);
            checkTimer = null;
            deactivate();
            return;
        }

        if (!routeObserver) {
            routeObserver = new MutationObserver(function () {
                clearTimeout(checkTimer);
                checkTimer = setTimeout(checkAndInit, 300);
            });
            routeObserver.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        clearTimeout(checkTimer);
        checkTimer = setTimeout(checkAndInit, 100);
    }

    window.addEventListener("akkad:route-change", syncProductRoute);
    syncProductRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: v2-image-preview-lightbox", error); }
;
/* v2-hide-okka-heading */
try {
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;

    function hideOKKA() {
        document.querySelectorAll("h3").forEach(function (heading) {
            if (heading.textContent.toUpperCase().includes("OKKA")) {
                heading.style.display = "none";
            }
        });
    }

    hideOKKA();
    var okkaTimer;
    new MutationObserver(function () {
        clearTimeout(okkaTimer);
        okkaTimer = setTimeout(hideOKKA, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
} catch (error) { console.error("[Akkad] feature failed: v2-hide-okka-heading", error); }
