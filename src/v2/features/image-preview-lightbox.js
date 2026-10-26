const GALLERY_IMAGE_SELECTOR = ".p_gallery_container img";
const PREVIEW_ID = "akkad-preview";
const STYLE_ID = "akkad-v2-preview-css";

const PREVIEW_CSS = `
#${PREVIEW_ID}{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s;touch-action:none}
#${PREVIEW_ID}.show{opacity:1;visibility:visible}
#${PREVIEW_ID} img{max-width:95vw;max-height:95vh;object-fit:contain;user-select:none;-webkit-user-drag:none;transform:scale(.96)}
#${PREVIEW_ID}.show img{transform:scale(1)}
#${PREVIEW_ID} button{position:absolute;top:20px;right:20px;width:48px;height:48px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:32px;line-height:1;cursor:pointer}
`;

export function initImagePreviewLightbox({ document, events, navigation, styles, window }) {
  let overlay = null;
  let image = null;
  let historyStatePushed = false;
  let savedOverflow = "";
  let scale = 1;
  let lastScale = 1;
  let startDistance = 0;
  let translateX = 0;
  let translateY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let panning = false;

  const removeStyle = styles.add(STYLE_ID, PREVIEW_CSS);

  function resetZoom() {
    scale = 1;
    lastScale = 1;
    translateX = 0;
    translateY = 0;
    panning = false;
    if (image) image.style.transform = "";
  }

  function renderTransform() {
    if (image) image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function createOverlay() {
    if (overlay?.isConnected || !document.body) return;
    overlay = document.createElement("div");
    overlay.id = PREVIEW_ID;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "معاينة صورة المنتج");
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "إغلاق معاينة الصورة");
    close.textContent = "×";
    image = document.createElement("img");
    image.alt = "";
    overlay.append(close, image);
    document.body.appendChild(overlay);

    close.addEventListener("click", closePreview);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePreview();
    });
    image.addEventListener("touchstart", onTouchStart, { passive: false });
    image.addEventListener("touchmove", onTouchMove, { passive: false });
    image.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  function openPreview(src, alt, fromHistory = false) {
    createOverlay();
    if (!overlay || !image) return;
    resetZoom();
    image.src = src;
    image.alt = alt || "";
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.classList.add("show");
    if (!fromHistory) {
      const state = window.history.state;
      const previousState = state && typeof state === "object" ? state : {};
      window.history.pushState({ ...previousState, akkadPreview: true, akkadPreviewSrc: src }, "");
      historyStatePushed = true;
    } else {
      historyStatePushed = true;
    }
    overlay.querySelector("button")?.focus();
  }

  function hidePreview() {
    if (!overlay) return;
    overlay.classList.remove("show");
    if (document.body) document.body.style.overflow = savedOverflow;
    historyStatePushed = false;
    resetZoom();
  }

  function closePreview() {
    if (!overlay?.classList.contains("show")) return;
    if (historyStatePushed) {
      historyStatePushed = false;
      window.history.back();
    } else {
      hidePreview();
    }
  }

  function onGalleryClick(event, target) {
    if (!window.location.pathname.startsWith("/products/") || target.closest(".akkad-gallery")) return;
    const src = target.currentSrc || target.src;
    if (!src) return;
    event.preventDefault();
    event.stopPropagation();
    openPreview(src, target.alt);
  }

  function onKeydown(event) {
    if (!overlay?.classList.contains("show")) return;
    if (event.key === "Escape") closePreview();
  }

  function onPopstate(event) {
    if (!window.location.pathname.startsWith("/products/")) {
      hidePreview();
    } else if (event.state?.akkadPreview && event.state.akkadPreviewSrc) {
      openPreview(event.state.akkadPreviewSrc, image?.alt || "", true);
    } else {
      hidePreview();
    }
  }

  function distance(first, second) {
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  }

  function onTouchStart(event) {
    if (event.touches.length === 2) {
      startDistance = distance(event.touches[0], event.touches[1]);
      lastScale = scale;
    } else if (event.touches.length === 1 && scale > 1) {
      panning = true;
      panStartX = event.touches[0].clientX - translateX;
      panStartY = event.touches[0].clientY - translateY;
    }
  }

  function onTouchMove(event) {
    if (event.touches.length === 2 && startDistance) {
      event.preventDefault();
      scale = Math.min(4, Math.max(1, lastScale * distance(event.touches[0], event.touches[1]) / startDistance));
      renderTransform();
    } else if (event.touches.length === 1 && panning) {
      event.preventDefault();
      translateX = event.touches[0].clientX - panStartX;
      translateY = event.touches[0].clientY - panStartY;
      renderTransform();
    }
  }

  function onTouchEnd(event) {
    if (event.touches.length < 2) lastScale = scale;
    if (!event.touches.length) {
      panning = false;
      if (scale <= 1.01) resetZoom();
    }
  }

  function onRoute({ pathname }) {
    if (!pathname.startsWith("/products/")) {
      hidePreview();
      overlay?.remove();
      overlay = null;
      image = null;
    }
  }

  const stopGalleryClicks = events.on("click", GALLERY_IMAGE_SELECTOR, onGalleryClick, { capture: true });
  const stopKeydown = events.on("keydown", null, onKeydown);
  const stopNavigation = navigation.subscribe(onRoute);
  window.addEventListener("popstate", onPopstate);

  return () => {
    stopGalleryClicks();
    stopKeydown();
    stopNavigation();
    window.removeEventListener("popstate", onPopstate);
    hidePreview();
    overlay?.remove();
    removeStyle();
  };
}
