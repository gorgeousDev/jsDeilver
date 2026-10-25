/* =========================================
   12. Graduation Gift Slider
   ========================================= */
(function () {
    var TARGET_1 = "/products/high-school-graduation-gift-classic-design-2026";
    var TARGET_2 = "/products/high-school-graduation-gift-modern-design-2026";

    /* Deciding at parse time whether this page is a target page was what made the
       slider work only after a full refresh: this file is parsed once on whatever
       page the store opened on, and a soft navigation to one of these two products
       never re-runs it, so the early return above left no init, no timer and no
       observer behind. The path is now checked every time init() runs. */
    function isTarget() {
        var p = window.location.pathname;
        return p === TARGET_1 || p === TARGET_2;
    }

    /* Computed at build time rather than at parse time, so a soft navigation to
       the other of the two products picks up the right alt text too. */
    var ALT_CLASSIC = "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم كلاسيك بالاسم والصورة";
    var ALT_MODERN = "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم عصري بالاسم والصورة";

    function productAlt() {
        return window.location.pathname === TARGET_1 ? ALT_CLASSIC : ALT_MODERN;
    }

    var SLIDER_IMAGES = [
        "https://files.easy-orders.net/1786365476227722534.webp",
        "https://files.easy-orders.net/1786365466534135347.webp",
        "https://files.easy-orders.net/1786365458894914294.webp",
        "https://files.easy-orders.net/1786365451845303830.webp",
        "https://files.easy-orders.net/1786365447594796680.webp",
        "https://files.easy-orders.net/1786365441649159061.webp",
        "https://files.easy-orders.net/1786365434307345455.webp"
    ];

    var ID = "akkad-graduation-slider";

    function addStyles() {
        if (document.getElementById("akkad-graduation-slider-css")) return;

        var style = document.createElement("style");
        style.id = "akkad-graduation-slider-css";

        style.textContent = "\n\
#akkad-graduation-slider {\n\
    width: 100% !important;\n\
    max-width: 100% !important;\n\
    position: relative !important;\n\
    overflow: hidden !important;\n\
    margin: 15px 0 !important;\n\
    padding: 0 !important;\n\
    box-sizing: border-box !important;\n\
    direction: ltr !important;\n\
    background: transparent !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-track {\n\
    display: flex !important;\n\
    flex-direction: row !important;\n\
    width: 100% !important;\n\
    margin: 0 !important;\n\
    padding: 0 !important;\n\
    transition: transform .45s ease !important;\n\
    will-change: transform !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-slide {\n\
    flex: 0 0 100% !important;\n\
    width: 100% !important;\n\
    min-width: 100% !important;\n\
    max-width: 100% !important;\n\
    margin: 0 !important;\n\
    padding: 0 !important;\n\
    display: block !important;\n\
    box-sizing: border-box !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-slide img {\n\
    display: block !important;\n\
    width: 100% !important;\n\
    height: auto !important;\n\
    max-width: 100% !important;\n\
    margin: 0 !important;\n\
    padding: 0 !important;\n\
    border: 0 !important;\n\
    border-radius: 0 !important;\n\
    object-fit: contain !important;\n\
    user-select: none !important;\n\
    -webkit-user-drag: none !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-arrow {\n\
    position: absolute !important;\n\
    top: 50% !important;\n\
    transform: translateY(-50%) !important;\n\
    width: 42px !important;\n\
    height: 42px !important;\n\
    display: flex !important;\n\
    align-items: center !important;\n\
    justify-content: center !important;\n\
    box-sizing: border-box !important;\n\
    padding: 0 !important;\n\
    margin: 0 !important;\n\
    border: 1px solid rgba(255,255,255,.65) !important;\n\
    border-radius: 50% !important;\n\
    background: rgba(27,25,49,.72) !important;\n\
    color: #fff !important;\n\
    font-family: Arial, sans-serif !important;\n\
    font-size: 0 !important;\n\
    line-height: 0 !important;\n\
    text-align: center !important;\n\
    cursor: pointer !important;\n\
    z-index: 50 !important;\n\
    box-shadow: 0 3px 12px rgba(0,0,0,.25) !important;\n\
    transition: background .2s ease, transform .2s ease, box-shadow .2s ease !important;\n\
    -webkit-tap-highlight-color: transparent !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-arrow svg {\n\
    width: 22px !important;\n\
    height: 22px !important;\n\
    display: block !important;\n\
    flex-shrink: 0 !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-arrow:hover {\n\
    background: rgba(27,25,49,.92) !important;\n\
    box-shadow: 0 5px 16px rgba(0,0,0,.35) !important;\n\
    transform: translateY(-50%) scale(1.06) !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-arrow:active {\n\
    transform: translateY(-50%) scale(.94) !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-prev {\n\
    left: 12px !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-next {\n\
    right: 12px !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-dots {\n\
    position: absolute !important;\n\
    bottom: 10px !important;\n\
    left: 50% !important;\n\
    transform: translateX(-50%) !important;\n\
    display: flex !important;\n\
    align-items: center !important;\n\
    justify-content: center !important;\n\
    gap: 6px !important;\n\
    z-index: 50 !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-dot {\n\
    width: 7px !important;\n\
    height: 7px !important;\n\
    padding: 0 !important;\n\
    margin: 0 !important;\n\
    border: 0 !important;\n\
    border-radius: 50% !important;\n\
    background: rgba(255,255,255,.65) !important;\n\
    cursor: pointer !important;\n\
    transition: width .2s ease, background .2s ease !important;\n\
}\n\
\n\
#akkad-graduation-slider .akkad-dot.active {\n\
    width: 20px !important;\n\
    border-radius: 10px !important;\n\
    background: #fff !important;\n\
}\n\
\n\
@media (max-width: 768px) {\n\
    #akkad-graduation-slider {\n\
        width: 100% !important;\n\
        margin: 10px 0 !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-arrow {\n\
        width: 36px !important;\n\
        height: 36px !important;\n\
        border-color: rgba(255,255,255,.55) !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-arrow svg {\n\
        width: 19px !important;\n\
        height: 19px !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-prev {\n\
        left: 8px !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-next {\n\
        right: 8px !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-dots {\n\
        bottom: 7px !important;\n\
        gap: 5px !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-dot {\n\
        width: 6px !important;\n\
        height: 6px !important;\n\
    }\n\
    #akkad-graduation-slider .akkad-dot.active {\n\
        width: 17px !important;\n\
    }\n\
}\n\
";

        document.head.appendChild(style);
    }

    function findImages() {
        var result = [];

        document.querySelectorAll("img").forEach(function (img) {
            var src = (img.currentSrc || img.src || "").split("?")[0];
            if (SLIDER_IMAGES.includes(src)) {
                result.push(img);
            }
        });

        return result;
    }

    function buildSlider() {
        if (document.getElementById(ID)) return;

        var found = findImages();
        if (found.length !== SLIDER_IMAGES.length) return;

        var ordered = SLIDER_IMAGES.map(function (src) {
            return found.find(function (img) {
                var current = (img.currentSrc || img.src || "").split("?")[0];
                return current === src;
            });
        });

        if (ordered.some(function (img) { return !img; })) return;

        var firstImage = ordered[0];
        var firstParagraph = firstImage.closest("p");
        var insertionParent = firstParagraph || firstImage.parentElement;

        if (!insertionParent) return;

        var slider = document.createElement("div");
        slider.id = ID;

        var track = document.createElement("div");
        track.className = "akkad-track";

        ordered.forEach(function (oldImg, index) {
            var slide = document.createElement("div");
            slide.className = "akkad-slide";

            var img = document.createElement("img");
            img.src = oldImg.currentSrc || oldImg.src;
            img.alt = productAlt();

            if (index === 0) {
                img.loading = "eager";
            } else {
                img.loading = "lazy";
            }

            slide.appendChild(img);
            track.appendChild(slide);
        });

        var prev = document.createElement("button");
        prev.type = "button";
        prev.className = "akkad-arrow akkad-prev";
        prev.innerHTML = '\
            <svg viewBox="0 0 24 24" aria-hidden="true">\
                <path d="M15 5L8 12L15 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
            </svg>';
        prev.setAttribute("aria-label", "الصورة السابقة");

        var next = document.createElement("button");
        next.type = "button";
        next.className = "akkad-arrow akkad-next";
        next.innerHTML = '\
            <svg viewBox="0 0 24 24" aria-hidden="true">\
                <path d="M9 5L16 12L9 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
            </svg>';
        next.setAttribute("aria-label", "الصورة التالية");

        var dots = document.createElement("div");
        dots.className = "akkad-dots";

        SLIDER_IMAGES.forEach(function (_, index) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "akkad-dot";
            if (index === 0) {
                dot.classList.add("active");
            }
            dot.setAttribute("aria-label", "الصورة " + (index + 1));
            dots.appendChild(dot);
        });

        slider.appendChild(track);
        slider.appendChild(prev);
        slider.appendChild(next);
        slider.appendChild(dots);

        insertionParent.parentNode.insertBefore(slider, insertionParent);

        ordered.forEach(function (img) {
            var p = img.closest("p");
            if (p) {
                var otherImages = p.querySelectorAll("img");
                var text = p.textContent.trim();
                if (otherImages.length === 1 && text === "") {
                    p.remove();
                    return;
                }
            }
            img.remove();
        });

        var current = 0;
        var autoSlide;

        function goTo(index) {
            current = index;
            track.style.transform = "translate3d(-" + (current * 100) + "%,0,0)";

            dots.querySelectorAll(".akkad-dot").forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }

        function startAutoSlide() {
            clearInterval(autoSlide);
            autoSlide = setInterval(function () {
                goTo((current + 1) % SLIDER_IMAGES.length);
            }, 2000);
        }

        startAutoSlide();

        next.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            goTo((current + 1) % SLIDER_IMAGES.length);
            startAutoSlide();
        });

        prev.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            goTo((current - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
            startAutoSlide();
        });

        dots.querySelectorAll(".akkad-dot").forEach(function (dot, index) {
            dot.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                goTo(index);
                startAutoSlide();
            });
        });

        var startX = 0;
        var startY = 0;

        slider.addEventListener("touchstart", function (e) {
            if (!e.touches.length) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        slider.addEventListener("touchend", function (e) {
            if (!e.changedTouches.length) return;
            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var diffX = startX - endX;
            var diffY = startY - endY;

            if (Math.abs(diffX) < 40 || Math.abs(diffX) < Math.abs(diffY)) return;

            if (diffX > 0) {
                goTo((current + 1) % SLIDER_IMAGES.length);
            } else {
                goTo((current - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
            }

            startAutoSlide();
        }, { passive: true });

        slider.addEventListener("mouseenter", function () {
            clearInterval(autoSlide);
        });

        slider.addEventListener("mouseleave", function () {
            startAutoSlide();
        });

        slider.addEventListener("touchstart", function () {
            clearInterval(autoSlide);
        }, { passive: true });

        slider.addEventListener("touchend", function () {
            startAutoSlide();
        }, { passive: true });
    }

    function init() {
        if (!isTarget()) return;
        addStyles();
        buildSlider();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(init, 1000);
        });
    } else {
        setTimeout(init, 1000);
    }

    /* Soft navigation: the observer below catches the DOM churn a route change
       makes, but a route hook removes any doubt for the case where the target
       product is already fully rendered before the observer's debounce lands. */
    var lastHref = window.location.href;
    function routeTick() {
        if (!isTarget()) return;
        if (window.location.href === lastHref) return;
        lastHref = window.location.href;
        clearTimeout(timer);
        timer = setTimeout(init, 300);
    }
    var _push = history.pushState;
    var _replace = history.replaceState;
    history.pushState = function () { var r = _push.apply(this, arguments); setTimeout(routeTick, 0); return r; };
    history.replaceState = function () { var r = _replace.apply(this, arguments); setTimeout(routeTick, 0); return r; };
    window.addEventListener("popstate", routeTick);

    var timer;
    var observer = new MutationObserver(function () {
        if (document.getElementById(ID)) return;
        clearTimeout(timer);
        timer = setTimeout(init, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
