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
