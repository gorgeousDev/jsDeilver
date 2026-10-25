/* =========================================
   7. Image Preview Lightbox
   ========================================= */
(function () {
    var isStatePushed = false;
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwipe = false;

    document.addEventListener("touchstart", function (e) {
        if (!e.touches || e.touches.length === 0) return;
        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isSwipe = false;
    }, { passive: true });

    document.addEventListener("touchmove", function (e) {
        if (!e.touches || e.touches.length === 0) return;
        var touch = e.touches[0];
        var diffX = Math.abs(touch.clientX - touchStartX);
        var diffY = Math.abs(touch.clientY - touchStartY);

        if (diffX > 10 || diffY > 10) {
            isSwipe = true;
        }
    }, { passive: true });

    function init() {
        if (!location.pathname.startsWith("/products/")) return;
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
            document.body.style.overflow = "";
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

        document.addEventListener("click", handle, { capture: true });

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

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                if (isStatePushed) {
                    history.back();
                } else {
                    close();
                }
            }
        });

        window.addEventListener("popstate", function (e) {
            if (e.state && e.state.akkadPreview) {
                open(e.state.src, true);
            } else {
                close();
            }
        });

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

    function checkAndInit() {
        if (location.pathname.startsWith("/products/")) {
            init();
        } else {
            var existingPreview = document.getElementById("akkad-preview");
            if (existingPreview) existingPreview.remove();
            var existingStyle = document.getElementById("akkad-preview-style");
            if (existingStyle) existingStyle.remove();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checkAndInit);
    } else {
        checkAndInit();
    }

    var originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        setTimeout(checkAndInit, 100);
    };

    var originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        setTimeout(checkAndInit, 100);
    };

    window.addEventListener("popstate", checkAndInit);

    var checkTimer;
    var observer = new MutationObserver(function () {
        if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
        clearTimeout(checkTimer);
        checkTimer = setTimeout(checkAndInit, 500);
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
