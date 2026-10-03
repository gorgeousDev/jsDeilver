/* =========================================
   Akkad Slider Drag
   Mouse, touch and pen drag-to-slide for the product sliders built by
   section 14 of akkad-v2.js.

   Everything is delegated from document, so the sliders can be rebuilt
   (show-all toggle, theme re-render) without re-attaching anything, and
   this file does not care whether it loads before or after akkad-v2.js.

   Vertical gestures are left to the browser (touch-action: pan-y) so the
   page still scrolls normally; we only take over horizontal movement.
   ========================================= */
(function () {
    "use strict";

    var CFG = {
        viewportSelector: ".akkad-slider-viewport",
        threshold: 6,          /* px before a press becomes a drag */
        friction: 0.94,        /* momentum decay per frame */
        minVelocity: 0.02,     /* px/ms - below this momentum stops */
        maxVelocity: 55,       /* px/ms clamp */
        frameMs: 16,
        clickGuardMs: 400,     /* how long a drag keeps eating the next click */
        draggingClass: "akkad-dragging",
        styleId: "akkad-drag-css"
    };

    var drag = null;
    var momentumRaf = 0;
    var momentumViewport = null;
    var suppressClick = false;
    var suppressTimer = 0;

    /* =========================================
       Helpers
       ========================================= */
    function closest(node, selector) {
        while (node && node.nodeType === 1) {
            if (node.matches ? node.matches(selector)
                : node.msMatchesSelector ? node.msMatchesSelector(selector)
                    : false) {
                return node;
            }
            node = node.parentElement;
        }
        return null;
    }

    function stopMomentum() {
        if (momentumRaf) cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
        momentumViewport = null;
    }

    function injectStyles() {
        if (document.getElementById(CFG.styleId)) return;

        var css = "\
.akkad-slider-viewport{cursor:grab;touch-action:pan-y}\n\
.akkad-slider-viewport." + CFG.draggingClass + "{cursor:grabbing;scroll-behavior:auto!important;user-select:none;-webkit-user-select:none}\n\
.akkad-slider-viewport img,.akkad-slider-viewport a{-webkit-user-drag:none}\n\
.akkad-slider-viewport." + CFG.draggingClass + " a{pointer-events:none}\n";

        var style = document.createElement("style");
        style.id = CFG.styleId;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    /* =========================================
       Momentum
       ========================================= */
    function startMomentum(viewport, velocity) {
        stopMomentum();

        var v = velocity;
        if (Math.abs(v) < CFG.minVelocity) return;
        if (Math.abs(v) > CFG.maxVelocity) v = CFG.maxVelocity * (v < 0 ? -1 : 1);

        momentumViewport = viewport;

        (function step() {
            if (momentumViewport !== viewport) return;

            v *= CFG.friction;
            var before = viewport.scrollLeft;
            viewport.scrollLeft = before + v * CFG.frameMs;
            var moved = Math.abs(viewport.scrollLeft - before);

            if (Math.abs(v) >= CFG.minVelocity && moved > 0.5) {
                momentumRaf = requestAnimationFrame(step);
            } else {
                momentumRaf = 0;
                momentumViewport = null;
            }
        })();
    }

    /* =========================================
       Drag
       ========================================= */
    function beginDrag(viewport) {
        /* The slider CSS sets scroll-behavior:smooth, which makes direct
           scrollLeft assignment animate and the drag feel laggy. */
        viewport.style.setProperty("scroll-behavior", "auto", "important");
        viewport.classList.add(CFG.draggingClass);
    }

    function endDrag(viewport, velocity) {
        viewport.classList.remove(CFG.draggingClass);
        viewport.style.removeProperty("scroll-behavior");
        startMomentum(viewport, velocity);
    }

    function onPointerDown(event) {
        if (drag) return;
        if (event.button !== undefined && event.button !== 0) return;

        var viewport = closest(event.target, CFG.viewportSelector);
        if (!viewport) return;
        if (closest(event.target, ".akkad-arrow")) return;

        stopMomentum();

        drag = {
            viewport: viewport,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startScroll: viewport.scrollLeft,
            lastX: event.clientX,
            lastT: Date.now(),
            velocity: 0,
            active: false
        };

        try { viewport.setPointerCapture(event.pointerId); } catch (e) {}
    }

    function onPointerMove(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;

        var dx = event.clientX - drag.startX;
        var dy = event.clientY - drag.startY;

        if (!drag.active) {
            if (Math.abs(dx) < CFG.threshold && Math.abs(dy) < CFG.threshold) return;

            /* Vertical intent belongs to the page, not to us. */
            if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }

            drag.active = true;
            beginDrag(drag.viewport);
        }

        if (event.cancelable) event.preventDefault();

        drag.viewport.scrollLeft = drag.startScroll - dx;

        var now = Date.now();
        var dt = now - drag.lastT;
        if (dt > 0) {
            var v = (drag.lastX - event.clientX) / dt;
            drag.velocity = drag.velocity * 0.7 + v * 0.3;
        }
        drag.lastX = event.clientX;
        drag.lastT = now;
    }

    function finishDrag(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;

        var viewport = drag.viewport;
        var wasActive = drag.active;
        var velocity = drag.velocity;

        try { viewport.releasePointerCapture(event.pointerId); } catch (e) {}
        drag = null;

        if (!wasActive) return;

        /* Swallow the click that the browser fires right after a real drag so
           a fling does not open a product page. */
        suppressClick = true;
        window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(function () { suppressClick = false; }, CFG.clickGuardMs);

        endDrag(viewport, velocity);
    }

    /* =========================================
       Click guard
       ========================================= */
    function onClickCapture(event) {
        if (!suppressClick) return;
        suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
    }

    /* =========================================
       Boot
       ========================================= */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            injectStyles();
            document.addEventListener("pointerdown", onPointerDown, true);
            document.addEventListener("pointermove", onPointerMove, { passive: false });
            document.addEventListener("pointerup", finishDrag, true);
            document.addEventListener("pointercancel", finishDrag, true);
            document.addEventListener("click", onClickCapture, true);
        }, { once: true });
    } else {
        injectStyles();
        document.addEventListener("pointerdown", onPointerDown, true);
        document.addEventListener("pointermove", onPointerMove, { passive: false });
        document.addEventListener("pointerup", finishDrag, true);
        document.addEventListener("pointercancel", finishDrag, true);
        document.addEventListener("click", onClickCapture, true);
    }
})();