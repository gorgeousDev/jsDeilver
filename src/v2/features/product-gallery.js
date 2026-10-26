const PRODUCT_ROUTE = /^\/products\//;
const GALLERY_CLASS = "akkad-gallery-wrapper";

export function initProductGallery({ document, dom, navigation, window }) {
  let currentPath = "";
  let currentContainer = null;
  let stopContainerObserver = null;
  let stopSwiperSubscription = null;
  let wrapper = null;
  let bulletCleanups = [];

  function clearGallery() {
    for (const stop of bulletCleanups) stop();
    bulletCleanups = [];
    stopContainerObserver?.();
    stopContainerObserver = null;
    wrapper?.remove();
    wrapper = null;
    currentContainer = null;
  }

  function makeVideoThumb() {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "akkad-thumb akkad-video-thumb";
    thumb.setAttribute("aria-label", "عرض الفيديو");
    thumb.innerHTML = '<span aria-hidden="true">▶</span>';
    return thumb;
  }

  function initGallery(container) {
    if (!PRODUCT_ROUTE.test(window.location.pathname) || currentPath !== window.location.pathname) return;
    if (document.querySelector(".swiper") !== container) return;
    if (currentContainer !== container) {
      clearGallery();
      currentContainer = container;
      stopContainerObserver = dom.observe(container, () => initGallery(container));
    }
    if (wrapper?.isConnected) return;

    const media = container.querySelectorAll(
      ".swiper-slide:not(.swiper-slide-duplicate) img, .swiper-slide:not(.swiper-slide-duplicate) video"
    );
    const pagination = container.querySelector(".swiper-pagination");
    if (!media.length || !pagination) return;

    wrapper = document.createElement("div");
    wrapper.className = GALLERY_CLASS;
    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "akkad-gallery-arrow akkad-gallery-prev";
    previous.setAttribute("aria-label", "Previous images");
    previous.textContent = "‹";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "akkad-gallery-arrow akkad-gallery-next";
    next.setAttribute("aria-label", "Next images");
    next.textContent = "›";
    const thumbnails = document.createElement("div");
    thumbnails.className = "akkad-gallery";
    wrapper.append(previous, thumbnails, next);
    pagination.insertAdjacentElement("afterend", wrapper);

    const bullets = Array.from(container.querySelectorAll(".swiper-pagination-bullet"));
    const thumbs = Array.from(media, (item, index) => {
      const isVideo = item.tagName === "VIDEO";
      const thumb = isVideo ? makeVideoThumb() : document.createElement("img");
      thumb.classList.add("akkad-thumb");
      if (!isVideo) {
        thumb.src = item.currentSrc || item.src;
        thumb.alt = item.alt || `Product image ${index + 1}`;
        thumb.loading = "lazy";
        thumb.decoding = "async";
      }
      thumb.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        bullets[index]?.click();
        window.requestAnimationFrame(updateActiveThumb);
      });
      thumbnails.appendChild(thumb);
      return thumb;
    });

    function updateActiveThumb() {
      const activeIndex = bullets.findIndex((bullet) =>
        bullet.classList.contains("swiper-pagination-bullet-active")
      );
      thumbs.forEach((thumb, index) => {
        const active = index === activeIndex;
        thumb.classList.toggle("active", active);
        if (active) {
          thumbnails.scrollTo({
            left: thumb.offsetLeft - (thumbnails.clientWidth - thumb.offsetWidth) / 2,
            behavior: "smooth"
          });
        }
      });
    }

    previous.addEventListener("click", (event) => {
      event.preventDefault();
      if (container.swiper) container.swiper.slidePrev();
      else thumbnails.scrollBy({ left: -Math.max(180, thumbnails.clientWidth * 0.7), behavior: "smooth" });
    });
    next.addEventListener("click", (event) => {
      event.preventDefault();
      if (container.swiper) container.swiper.slideNext();
      else thumbnails.scrollBy({ left: Math.max(180, thumbnails.clientWidth * 0.7), behavior: "smooth" });
    });

    for (const bullet of bullets) {
      bulletCleanups.push(dom.observe(bullet, updateActiveThumb, {
        childList: false,
        attributes: true,
        attributeFilter: ["class"]
      }));
    }
    updateActiveThumb();
  }

  function syncRoute({ pathname }) {
    if (!PRODUCT_ROUTE.test(pathname)) {
      currentPath = "";
      clearGallery();
      stopSwiperSubscription?.();
      stopSwiperSubscription = null;
      return;
    }
    if (pathname !== currentPath) {
      currentPath = pathname;
      clearGallery();
    }
    if (!stopSwiperSubscription) {
      stopSwiperSubscription = dom.subscribe(".swiper", initGallery);
    }
    const container = document.querySelector(".swiper");
    if (container) initGallery(container);
  }

  const stopNavigation = navigation.subscribe(syncRoute);
  return () => {
    stopNavigation();
    stopSwiperSubscription?.();
    clearGallery();
  };
}
