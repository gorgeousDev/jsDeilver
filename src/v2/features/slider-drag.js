const VIEWPORT_SELECTOR = ".akkad-slider-viewport";
const DRAGGING_CLASS = "akkad-dragging";
const STYLE_ID = "akkad-drag-css";
const THRESHOLD = 6;
const ENGAGE_RATIO = 0.8;
const FRICTION = 0.94;
const MIN_VELOCITY = 0.02;
const MAX_VELOCITY = 55;
const FRAME_MS = 16;
const CLICK_GUARD_MS = 400;

export function initSliderDrag({ document, window }) {
  let drag = null;
  let momentumFrame = 0;
  let momentumViewport = null;
  let suppressClick = false;
  let suppressTimer = 0;
  let ownedStyle = null;

  function closest(target, selector) {
    return target && typeof target.closest === "function"
      ? target.closest(selector)
      : null;
  }

  function stopMomentum() {
    if (momentumFrame) window.cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
    momentumViewport = null;
  }

  function startMomentum(viewport, velocity) {
    stopMomentum();
    if (Math.abs(velocity) < MIN_VELOCITY) return;

    let currentVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
    momentumViewport = viewport;

    function step() {
      if (momentumViewport !== viewport) return;

      currentVelocity *= FRICTION;
      const previousScroll = viewport.scrollLeft;
      viewport.scrollLeft = previousScroll + currentVelocity * FRAME_MS;
      const moved = Math.abs(viewport.scrollLeft - previousScroll);

      if (Math.abs(currentVelocity) >= MIN_VELOCITY && moved > 0.5) {
        momentumFrame = window.requestAnimationFrame(step);
      } else {
        momentumFrame = 0;
        momentumViewport = null;
      }
    }

    step();
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    ownedStyle = document.createElement("style");
    ownedStyle.id = STYLE_ID;
    ownedStyle.textContent = `
      ${VIEWPORT_SELECTOR} { cursor: grab; }
      ${VIEWPORT_SELECTOR} {
        overscroll-behavior-x: contain !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch;
      }
      ${VIEWPORT_SELECTOR}.${DRAGGING_CLASS} {
        cursor: grabbing;
        scroll-behavior: auto !important;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }
      ${VIEWPORT_SELECTOR} img,
      ${VIEWPORT_SELECTOR} a { -webkit-user-drag: none; }
      ${VIEWPORT_SELECTOR}.${DRAGGING_CLASS} a { pointer-events: none; }
    `;
    (document.head || document.documentElement).appendChild(ownedStyle);
  }

  function onPointerDown(event) {
    if (drag || (event.button !== undefined && event.button !== 0)) return;

    const viewport = closest(event.target, VIEWPORT_SELECTOR);
    if (!viewport || closest(event.target, ".akkad-arrow")) return;

    stopMomentum();
    drag = {
      viewport,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: viewport.scrollLeft,
      lastX: event.clientX,
      lastTime: Date.now(),
      velocity: 0,
      active: false
    };
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.active) {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < THRESHOLD && absY < THRESHOLD) return;
      if (absX < absY * ENGAGE_RATIO) return;

      drag.active = true;
      drag.viewport.style.setProperty("scroll-behavior", "auto", "important");
      drag.viewport.classList.add(DRAGGING_CLASS);
      try {
        drag.viewport.setPointerCapture(event.pointerId);
      } catch {}
    }

    if (event.cancelable) event.preventDefault();
    drag.viewport.scrollLeft = drag.startScroll - dx;

    const now = Date.now();
    const elapsed = now - drag.lastTime;
    if (elapsed > 0) {
      const velocity = (drag.lastX - event.clientX) / elapsed;
      drag.velocity = drag.velocity * 0.7 + velocity * 0.3;
    }
    drag.lastX = event.clientX;
    drag.lastTime = now;
  }

  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const { viewport, active, velocity } = drag;
    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch {}
    drag = null;

    if (!active) return;

    suppressClick = true;
    window.clearTimeout(suppressTimer);
    suppressTimer = window.setTimeout(() => {
      suppressClick = false;
    }, CLICK_GUARD_MS);

    viewport.classList.remove(DRAGGING_CLASS);
    viewport.style.removeProperty("scroll-behavior");
    startMomentum(viewport, velocity);
  }

  function onClickCapture(event) {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  injectStyles();
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("pointermove", onPointerMove, { passive: false });
  document.addEventListener("pointerup", finishDrag, true);
  document.addEventListener("pointercancel", finishDrag, true);
  document.addEventListener("click", onClickCapture, true);

  return () => {
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("pointermove", onPointerMove, { passive: false });
    document.removeEventListener("pointerup", finishDrag, true);
    document.removeEventListener("pointercancel", finishDrag, true);
    document.removeEventListener("click", onClickCapture, true);
    window.clearTimeout(suppressTimer);
    stopMomentum();

    if (drag && drag.active) {
      drag.viewport.classList.remove(DRAGGING_CLASS);
      drag.viewport.style.removeProperty("scroll-behavior");
    }
    drag = null;
    if (ownedStyle) ownedStyle.remove();
  };
}
