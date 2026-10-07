/* =========================================
   0. Global Helpers
   ========================================= */
function __akkad_isHomePage() {
    var p = window.location.pathname.replace(/\/+$/, "") || "/";
    return p === "/";
}

/* =========================================
   Meta tag (Google Site Verification)
   ========================================= */
(function () {
    if (!document.querySelector('meta[name="google-site-verification"]')) {
        var meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
        document.head.appendChild(meta);
    }
})();

/* =========================================
   1. Load akkad.js
   ========================================= */
(function () {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a87d4b2/src/modules/akkad.js";
    s.defer = true;
    document.head.appendChild(s);
})();

/* =========================================
   2. WhatsApp Widget
   ========================================= */
(function () {
    var ws = document.createElement("script");
    ws.src = "https://cdn.pickyassist.com/WhatsApp/embed.js";
    ws.async = true;
    document.head.appendChild(ws);

    var c = {
        t: "Icon-Only-Black",
        s: "",
        i: "WhatsApp Us",
        a: "animation-Floating",
        n: "201508331823",
        m: "مرحبًا، لدي بعض الأسئلة قبل إتمام عملية الشراء.",
        w: 3,
        b: "#44174E",
        c: "#ffffff",
        mr: "0",
        ml: "0",
        mb: "0",
        z: "9999",
        p: "position-right"
    };

    function loadWhatsApp() {
        if (typeof window._waBtn === "function") {
            window._waBtn(c);
        } else {
            setTimeout(loadWhatsApp, 200);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(loadWhatsApp, 500);
        });
    } else {
        setTimeout(loadWhatsApp, 500);
    }
})();

/* =========================================
   3. Styles
   ========================================= */
(function () {
    var style = document.createElement("style");
    style.id = "akkad-v2-styles";
    style.textContent = "\n\
/* مربعات العداد */\n\
.mt-3.flex.justify-center.gap-5 > div{\n\
    background:#fff5f5 !important;\n\
    border:1px solid #ef4444 !important;\n\
    border-radius:12px !important;\n\
}\n\
\n\
/* الأرقام */\n\
.mt-3.flex.justify-center.gap-5 > div span:first-child{\n\
    color:#dc2626 !important;\n\
    font-size:24px !important;\n\
    font-weight:800 !important;\n\
}\n\
\n\
/* النص (أيام - ساعات...) */\n\
.mt-3.flex.justify-center.gap-5 > div span:last-child{\n\
    color:#7f1d1d !important;\n\
    font-weight:700 !important;\n\
}\n\
\n\
/* عنوان العداد */\n\
.mt-4.flex.flex-col.justify-center p{\n\
    color:#b91c1c !important;\n\
    font-weight:700 !important;\n\
}\n\
@media (max-width:768px){\n\
    [id^=\"headlessui-popover-panel\"]{\n\
        position: absolute !important;\n\
        left: 0 !important;\n\
        right: auto !important;\n\
        top: calc(100% + 4px) !important;\n\
        bottom: auto !important;\n\
        transform: none !important;\n\
    }\n\
}\n\
@media (max-width:768px){\n\
\n\
/* إزالة أي مسافات خارجية */\n\
.content_container{\n\
    padding-left:8px !important;\n\
    padding-right:8px !important;\n\
}\n\
\n\
.carouselWrapper{\n\
    margin:10 !important;\n\
    padding:10 !important;\n\
}\n\
\n\
.home_slider_container{\n\
    padding:10 !important;\n\
}\n\
\n\
/* إزالة الحواف من الكارد */\n\
.home_slider_card{\n\
    margin:0 !important;\n\
}\n\
\n\
.home_slider_card > a > div{\n\
    border-radius:0 !important;\n\
    overflow:hidden !important;\n\
}\n\
\n\
/* زووم بسيط للصورة */\n\
.home_slider_card img{\n\
    transform:scale(1.08);\n\
    transition:transform .3s ease;\n\
}\n\
\n\
}\n\
";
    document.head.appendChild(style);
})();
/* =========================================
   3.1 Mobile Product Grid — 2 Columns
   ========================================= */
(function () {
    var style = document.createElement("style");

    style.id = "akkad-mobile-product-grid";

    style.textContent = `
        @media (max-width: 639px) {

            .category_products_grid_container {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 12px !important;
                width: 100% !important;
            }

            .category_products_grid_container > div {
                width: 100% !important;
                min-width: 0 !important;
            }

            .category_products_grid_container .fasty_product_card {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
            }

        }
    `;

    document.head.appendChild(style);
})();

/* =========================================
   4. Disable Cart Image Links
   ========================================= */
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
    function disableCartImageLinks() {
        document.querySelectorAll('[data-cart="item-image-wrapper"]').forEach(function (link) {
            link.removeAttribute("href");
            link.style.cursor = "default";
            link.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        });
    }

    disableCartImageLinks();
    var cartTimer;
    new MutationObserver(function () {
        clearTimeout(cartTimer);
        cartTimer = setTimeout(disableCartImageLinks, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* =========================================
   5. Style Viewer Badge
   ========================================= */
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
    function styleViewer() {
        document.querySelectorAll("span").forEach(function (badge) {
            if (!/^\d+$/.test(badge.textContent.trim())) return;

            var parent = badge.parentElement;
            if (!parent) return;
            if (!parent.textContent.includes("يشاهد هذا المنتج")) return;

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
        });
    }

    styleViewer();
    var viewerTimer;
    new MutationObserver(function () {
        clearTimeout(viewerTimer);
        viewerTimer = setTimeout(styleViewer, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* =========================================
   6. Move Product Details
   ========================================= */
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

    moveProductDetails();
    var moveTimer;
    new MutationObserver(function () {
        clearTimeout(moveTimer);
        moveTimer = setTimeout(moveProductDetails, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

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

/* =========================================
   8. Hide OKKA
   ========================================= */
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
    function hideOKKA() {
        document.querySelectorAll("h3").forEach(function (h3) {
            if (h3.textContent.toUpperCase().includes("OKKA")) {
                h3.style.display = "none";
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

/* =========================================
   9. Floating Live Counter
   ========================================= */
(function () {
    function isHomePage() {
        var path = window.location.pathname.replace(/\/+$/, "") || "/";
        return path === "/";
    }

    function createFloatingCounter() {
        if (document.getElementById("akkad-floating-counter")) return;

        var box = document.createElement("div");
        box.id = "akkad-floating-counter";

        box.innerHTML = '\
            <div class="live-dot"></div>\
            <span class="text">\
                <b id="akkad-live-number">42</b>\
                عميل يشاهد هذه الصفحة\
            </span>';

        document.body.appendChild(box);

        var style = document.createElement("style");
        style.id = "akkad-floating-counter-style";

        style.textContent = "\n\
#akkad-floating-counter{\n\
    position:fixed;\n\
    left:20px;\n\
    bottom:20px;\n\
    z-index:99999;\n\
    display:flex;\n\
    align-items:center;\n\
    gap:10px;\n\
    width:270px;\n\
    height:54px;\n\
    padding:0 16px;\n\
    background:#44174E;\n\
    color:#fff;\n\
    border-radius:999px;\n\
    box-sizing:border-box;\n\
    font-size:14px;\n\
    font-weight:600;\n\
    white-space:nowrap;\n\
}\n\
\n\
#akkad-floating-counter .text{\n\
    flex:1;\n\
    display:flex;\n\
    align-items:center;\n\
    justify-content:center;\n\
    gap:5px;\n\
    overflow:hidden;\n\
}\n\
\n\
#akkad-floating-counter b{\n\
    flex:0 0 48px;\n\
    text-align:center;\n\
    color:#7dd3fc;\n\
    font-size:18px;\n\
    font-weight:700;\n\
}\n\
\n\
.live-dot{\n\
    flex-shrink:0;\n\
    width:10px;\n\
    height:10px;\n\
    border-radius:50%;\n\
    background:#22c55e;\n\
    display:block;\n\
    animation:pulse 1.5s infinite;\n\
}\n\
\n\
@keyframes pulse{\n\
    0%{\n\
        transform:scale(1);\n\
        box-shadow:0 0 0 0 rgba(34,197,94,.7);\n\
    }\n\
    70%{\n\
        transform:scale(1.15);\n\
        box-shadow:0 0 0 10px rgba(34,197,94,0);\n\
    }\n\
    100%{\n\
        transform:scale(1);\n\
        box-shadow:0 0 0 0 rgba(34,197,94,0);\n\
    }\n\
}\n\
\n\
@media(max-width:768px){\n\
\n\
#akkad-floating-counter{\n\
    left:12px;\n\
    bottom:20px;\n\
    width:245px;\n\
    height:48px;\n\
    font-size:12px;\n\
}\n\
\n\
#akkad-floating-counter b{\n\
    flex:0 0 44px;\n\
    font-size:16px;\n\
}\n\
\n\
}\n\
";

        if (!document.getElementById("akkad-floating-counter-style")) {
            document.head.appendChild(style);
        }

        var number = document.getElementById("akkad-live-number");

        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(".0", "") + "M";
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(".0", "") + "K";
            }
            return num;
        }

        function updateNumber() {
            var random = Math.floor(Math.random() * 5000) + 1;
            number.textContent = formatNumber(random);
        }

        function loop() {
            if (!document.getElementById("akkad-floating-counter")) return;
            updateNumber();
            setTimeout(loop, Math.random() * 5000 + 3000);
        }

        loop();
    }

    function initCounter() {
        if (!isHomePage()) {
            var el = document.getElementById("akkad-floating-counter");
            if (el) el.remove();
            return;
        }

        if (document.getElementById("akkad-floating-counter")) return;
        createFloatingCounter();
    }

    window.addEventListener("load", function () {
        setTimeout(initCounter, 500);
    });

    var counterTimer;
    new MutationObserver(function () {
        clearTimeout(counterTimer);
        counterTimer = setTimeout(initCounter, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* =========================================
   10. Funnel Price Overrides
   ========================================= */
(function () {
    if (!location.href.includes("funnels")) return;

    setInterval(function () {
        var shipping = document.querySelector(".shipping_cost");
        if (shipping) {
            shipping.innerHTML = '\
                <span style="\
                    display:inline-block;\
                    background:#9896a4;\
                    border:1px solid #9896a4;\
                    border-radius:8px;\
                    padding:4px 10px;\
                    font-size:14px;\
                    font-weight:700;\
                    color:#374151;\
                ">\
                    50 ج.م\
                </span>';
        }

        var total = document.querySelector(".total_price");
        if (total) {
            total.innerHTML = '\
                419.99\
                <span class="font-[inherit]">ج.م</span>';
        }

        document.querySelectorAll("#salePrice").forEach(function (salePrice) {
            salePrice.innerHTML = '\
                <span style="\
                    display:inline-flex;\
                    align-items:center;\
                    gap:4px;\
                    white-space:nowrap;\
                    background:#f8fafc;\
                    border:none;\
                    border-radius:10px;\
                    padding:6px 12px;\
                    font-size:30px;\
                    font-weight:800;\
                    color:#111827;\
                    line-height:1;\
                ">\
                    <span>369.99</span>\
                    <span style="\
                        font-size:30px;\
                        font-weight:800;\
                        white-space:nowrap;\
                    ">\
                        ج.م\
                    </span>\
                </span>';
        });
    }, 200);
})();

/* =========================================
   11. Swap Payment Methods
   ========================================= */
(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
    function swapPayments() {
        var container = document.querySelector(".payments_container");
        if (!container) return;

        var cards = Array.from(container.children);

        var transfer = cards.find(function (el) {
            return el.textContent.includes("صورة التحويل");
        });

        var cod = cards.find(function (el) {
            return el.textContent.includes("دفع عند الاستلام");
        });

        if (!transfer || !cod) return;

        if (container.firstElementChild !== cod) {
            container.insertBefore(cod, transfer);
        }
    }

    setTimeout(swapPayments, 1000);

    var swapTimer;
    new MutationObserver(function () {
        clearTimeout(swapTimer);
        swapTimer = setTimeout(swapPayments, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

(function () {
    if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
    var initialized = false;

    var timer = setInterval(function () {
        var container = document.querySelector(".payments_container");
        if (!container) return;

        var cards = Array.from(container.children);

        var transfer = cards.find(function (card) {
            return card.textContent.includes("صورة التحويل");
        });

        var cod = cards.find(function (card) {
            return card.textContent.includes("دفع عند الاستلام");
        });

        if (!transfer || !cod) return;

        if (container.firstElementChild !== cod) {
            container.insertBefore(cod, transfer);
        }

        // Auto-click disabled to fix payment toggle bug
        // Users can now click payment options freely
    }, 200);
})();

/* =========================================
   12. Graduation Gift Slider
   ========================================= */
(function () {
    var TARGET_1 = "/products/high-school-graduation-gift-classic-design-2026";
    var TARGET_2 = "/products/high-school-graduation-gift-modern-design-2026";

    var currentPath = window.location.pathname;

    if (currentPath !== TARGET_1 && currentPath !== TARGET_2) {
        return;
    }

    var PRODUCT_ALT = currentPath === TARGET_1
        ? "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم كلاسيك بالاسم والصورة"
        : "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم عصري بالاسم والصورة";

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
            img.alt = PRODUCT_ALT;

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
        if (window.location.pathname !== TARGET_1 && window.location.pathname !== TARGET_2) return;
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

/* =========================================
   13. Small "SALE" tag + remove theme "تخفيضات"
   ========================================= */
(function () {

    var TAG_CLASS = "akkad-sale-tag";
    var DISCOUNT_WORD = "تخفيضات";
    var GONE = "display:none !important; visibility:hidden !important;";

    /* =========================================
       CSS (one-time injection into body, not head
       so Next.js hydration doesn't remove it)
       ========================================= */
    function addStyles() {
        if (document.getElementById("akkad-sale-tag-css")) return;

        var style = document.createElement("style");
        style.id = "akkad-sale-tag-css";
        style.textContent = [
            /* — wrapper: pinned to the card's top-left corner — */
            '.akkad-sale-tag{',
            '    position:absolute !important;',
            '    top:0 !important;',
            '    left:0 !important;',
            '    z-index:15 !important;',
            '    display:block !important;',
            '    line-height:1 !important;',
            '    pointer-events:none !important;',
            '}',
            '',
            /* — the label itself — */
            '.akkad-sale-tag > span{',
            '    display:inline-block !important;',
            '    padding:3px 7px !important;',
            '    background:#A34054 !important;',
            '    color:#fff !important;',
            '    font-family:Tajawal,sans-serif !important;',
            '    font-size:11px !important;',
            '    font-weight:700 !important;',
            '    letter-spacing:.4px !important;',
            '    border-radius:0 5px 5px 0 !important;',
            '    box-shadow:0 1px 4px rgba(0,0,0,.18) !important;',
            '    white-space:nowrap !important;',
            '}',
            '',
            /* — mobile — */
            '@media(max-width:768px){',
            '    .akkad-sale-tag > span{',
            '        padding:2px 6px !important;',
            '        font-size:10px !important;',
            '        border-radius:0 4px 4px 0 !important;',
            '    }',
            '}'
        ].join('\n');

        /* append to body, not head — survives Next.js hydration */
        (document.body || document.documentElement).appendChild(style);
    }

    /* =========================================
       Drop the theme's "تخفيضات" chip on every page.
       Inline style, so a React re-render on that node
       cannot bring it back.
       ========================================= */
    function removeDiscountLabels() {
        var spans = document.querySelectorAll("span");
        for (var i = 0; i < spans.length; i++) {
            var span = spans[i];
            if (span.textContent.trim() !== DISCOUNT_WORD) continue;

            span.style.cssText = GONE;

            /* also hide the wrapper if the chip is its only child */
            var parent = span.parentElement;
            if (parent && parent.children.length === 1 &&
                parent.textContent.trim() === DISCOUNT_WORD) {
                parent.style.cssText = GONE;
            }
        }
    }

    /* =========================================
       Small "SALE" tag on cards that are genuinely
       on sale (a struck-through old price).
       ========================================= */
    function buildTag() {
        var tag = document.createElement("div");
        tag.className = TAG_CLASS;
        tag.setAttribute("aria-hidden", "true");
        tag.innerHTML = "<span>SALE</span>";
        return tag;
    }

    /* the card's <a> is the positioning context; make sure of it */
    function hostFor(card) {
        var link = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
        if (!link) return null;
        if (window.getComputedStyle(link).position === "static") {
            link.style.position = "relative";
        }
        return link;
    }

    function processCards() {
        /* clear the old sparkled badge left behind by a previous build */
        var legacy = document.querySelectorAll(".akkad-sale-badge");
        for (var l = 0; l < legacy.length; l++) {
            legacy[l].parentNode.removeChild(legacy[l]);
        }

        var cards = document.querySelectorAll(".fasty_product_card");
        for (var c = 0; c < cards.length; c++) {
            var card = cards[c];

            var priceBox = card.querySelector(".fasty_product_card_price");
            if (!priceBox || !priceBox.querySelector("del")) continue;

            var host = hostFor(card);
            if (!host || host.querySelector("." + TAG_CLASS)) continue;

            host.appendChild(buildTag());
        }
    }

    /* =========================================
       Run
       ========================================= */
    function run() {
        addStyles();
        removeDiscountLabels();
        processCards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    var timer;
    new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(run, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

var styleId = "akkad-v2-styles";

if (!document.getElementById(styleId)) {

  var css = [

    /* =========================================================
       AKKAD GALLERY
       ========================================================= */

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
    "  color: #1B1931 !important;",
    "  font-size: 20px !important;",
    "  line-height: 1 !important;",
    "  cursor: pointer !important;",
    "  z-index: 20 !important;",
    "}",

    ".akkad-gallery-arrow:hover {",
    "  background: #1B1931 !important;",
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


    /* =========================================================
       HEADER
       ========================================================= */

    "header {",
    "  z-index: 1000 !important;",
    "  position: sticky !important;",
    "}",


    /* =========================================================
       SECTION TITLE
       ========================================================= */

    "div[sectionid='f73b18e7-79ff-457c-9cc5-ad151b4412c9'] > h3 {",
    "  display: none !important;",
    "}",


    /* =========================================================
       FOOTER
       ========================================================= */

    "footer,",
    ".default_footer,",
    "footer.bg-gray-50 {",
    "  background: #1B1931 !important;",
    "  color: #fff !important;",
    "}",

    ".default_footer {",
    "  padding-bottom: 0 !important;",
    "}",

    ".default_footer > div:nth-child(3) {",
    "  display: none !important;",
    "}",

    ".default_footer a,",
    ".default_footer p {",
    "  color: #fff !important;",
    "}",

    ".default_footer_links_container {",
    "  padding-bottom: 20px;",
    "  margin-bottom: 20px;",
    "}",


    /* =========================================================
       PAGE
       ========================================================= */

    "html, body {",
    "  overflow-x: hidden !important;",
    "}",


    /* =========================================================
       FEATURED PRODUCT IMAGE
       ========================================================= */

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


    /* =========================================================
       CATEGORIES NAV
       ========================================================= */

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
    "  color: #1B1931;",
    "  font-weight: 700;",
    "}",

    ".akkad-categories-inner a:hover {",
    "  color: #A34054;",
    "}",


    /* =========================================================
       MOBILE PRODUCT GRID
       ========================================================= */

    "@media (max-width: 639px) {",

    "  .category_products_grid_container {",
    "    display: grid !important;",
    "    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
    "    gap: 12px !important;",
    "    width: 100% !important;",
    "  }",

    "  .category_products_grid_container > div {",
    "    width: 100% !important;",
    "    min-width: 0 !important;",
    "  }",

    "  .category_products_grid_container .fasty_product_card {",
    "    width: 100% !important;",
    "    max-width: 100% !important;",
    "    min-width: 0 !important;",
    "  }",

    "}",


    /* =========================================================
       FEATURED PRODUCTS GRID
       ========================================================= */

    "@media (max-width: 767px) {",

    "  .fasty_product_featured_container {",
    "    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
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

/* =========================================
   14. Office Supplies Sections
   ========================================= */
(function () {
    "use strict";

    var CFG = {
        slug: "office-supplies",
        categoryId: "c340b549-b502-4052-9828-3485543191be",
        api: "https://api.easy-orders.net/api/v1/products",
        sort: "position,desc",
        fields: "id,name,thumb,price,sale_price,sale_end_date,slug,position,disable_orders_for_no_stock,quantity,is_free_shipping",
        themeKey: "fasty",
        currency: "ج.م",
        moreLabel: "المزيد",
        lessLabel: "إخفاء الكل",
        allTitle: "كل المنتجات",
        buckets: [
            {
                key: "study",
                title: "احصل على افضل ادوات للدراسة ✏️",
                keywords: [
                    "casio", "كاسيو", "fx-",
                    "calculator", "حاسبة",
                    "multi-office", "مالتي أوفيس",
                    "copy-paper", "ورق طباعة", "ورق a4"
                ]
            },
            {
                key: "stickers",
                title: "ستيكرز A6",
                keywords: [ "sticker", "ستيكر", "ملصق" ]
            },
            {
                key: "notebook-tickets",
                title: "تيكتات شخصية لكل كراسة 📝",
                keywords: [
                    "notebook-ticket", "تيكتات", "تيكت",
                    "تذكرة", "كراسات"
                ]
            },
            {
                key: "notebooks",
                title: "📒 نوت بوك بتصميمات مميزة",
                keywords: [ "notebook" ]
            },
            {
                key: "general",
                title: "منتجات عملية لكل يوم ☕",
                keywords: []
            }
        ],
        renderOrder: [ "study", "stickers", "general", "notebook-tickets", "notebooks" ]
    };

    var state = {
        products: [],
        fromApi: false,
        signature: "",
        built: false,
        building: false,
        showAll: false,
        wired: false,
        lastUrl: "",
        started: false
    };

    /* =========================================
       Page / DOM helpers
       ========================================= */
/* The store has used /collections/office-supplies, /category/office-supplies
       and a bare /office-supplies over time, and __NEXT_DATA__ is not always
       present. Accept any of them rather than silently rendering nothing. */
    var PATH_PREFIXES = ["collections", "category", "categories", "c", "shop", "store"];

    function pathMatchesSlug() {
        var p = (window.location.pathname || "").replace(/\/+$/, "").toLowerCase();
        if (!p) return false;

        var slug = CFG.slug.toLowerCase();
        var segs = p.split("/").filter(Boolean);

        if (segs.length === 1) return segs[0] === slug;
        if (segs.length !== 2) return false;

        return segs[1] === slug && PATH_PREFIXES.indexOf(segs[0]) !== -1;
    }

    function nextDataMatchesSlug() {
        var el = document.getElementById("__NEXT_DATA__");
        if (!el) return false;

        try {
            var nd = JSON.parse(el.textContent);
            var q = nd && nd.query;
            if (!q) return false;

            var slug = CFG.slug.toLowerCase();
            var candidates = [q.id, q.slug, q.handle];
            for (var i = 0; i < candidates.length; i++) {
                if (typeof candidates[i] === "string"
                    && candidates[i].toLowerCase() === slug) return true;
            }
        } catch (e) {}

        return false;
    }

    function isOfficePage() {
        return pathMatchesSlug() || nextDataMatchesSlug();
    }

    function getGrid() {
        return document.querySelector(".category_products_grid_container")
            || document.querySelector('[class*="category_products_grid"]');
    }

    /* The theme ships display:grid!important on small screens, which beats a
       plain inline display:none and would leave the whole grid visible under
       the sliders. Inline !important wins. */
    function hideGrid(grid) {
        grid.style.setProperty("display", "none", "important");
    }

    function showGrid(grid) {
        grid.style.removeProperty("display");
    }

    /* The theme's "تحميل المزيد" REPLACES the product list instead of appending
       (20 cards -> 7 on this collection) and destroys anything we moved out of
       the grid. We read every product from the API, so the button is useless. */
    function hideThemePagination() {
        var words = [ "تحميل المزيد", "عرض المزيد", "Load more", "Show more" ];
        var btns = document.querySelectorAll("button");

        for (var i = 0; i < btns.length; i++) {
            var label = (btns[i].textContent || "").replace(/\s+/g, " ").trim();
            if (words.indexOf(label) === -1) continue;
            if (btns[i].className.indexOf("akkad-") !== -1) continue;

            var node = btns[i];
            for (var up = 0; up < 4 && node.parentElement; up++) {
                node = node.parentElement;
                if (node.className.indexOf("text-center") !== -1) break;
            }
            node.style.setProperty("display", "none", "important");
        }
    }

    /* =========================================
       Data
       ========================================= */
    function fetchProducts() {
        var url = CFG.api
            + "?limit=100&page=1"
            + "&sort=" + encodeURIComponent(CFG.sort)
            + "&fields=" + encodeURIComponent(CFG.fields)
            + "&category_id=" + CFG.categoryId
            + "&join=variants"
            + "&theme_key=" + CFG.themeKey;

        return window.fetch(url, { headers: { "Accept": "application/json" } })
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(function (json) {
                var list = null;
                if (json && Array.isArray(json.data)) list = json.data;
                else if (Array.isArray(json)) list = json;
                if (!list || !list.length) throw new Error("empty payload");
                return list;
            });
    }

    /* Fallback so a failed API call never makes the page worse than before. */
    function productsFromDom(grid) {
        var out = [];
        if (!grid) return out;

        var cards = grid.querySelectorAll(".fasty_product_card");
        for (var i = 0; i < cards.length; i++) {
            var a = cards[i].querySelector('a[href*="/products/"]');
            if (!a) continue;

            var slug = (a.getAttribute("href") || "").replace(/^\/products\//, "").split("/")[0];
            var nameEl = cards[i].querySelector(".fasty_product_card_name");
            var img = cards[i].querySelector("img");
            var priceEl = cards[i].querySelector(".fasty_product_card_price");

            out.push({
                slug: slug,
                name: nameEl ? (nameEl.textContent || "").replace(/\s+/g, " ").trim() : "",
                thumb: img ? img.getAttribute("src") || "" : "",
                priceText: priceEl ? (priceEl.textContent || "").replace(/\s+/g, " ").trim() : "",
                saleText: null,
                card: cards[i]
            });
        }
        return out;
    }

    function classify(product) {
        var hay = ((product.slug || "") + " " + (product.name || "")).toLowerCase();
        var last = CFG.buckets.length - 1;

        for (var i = 0; i < last; i++) {
            var words = CFG.buckets[i].keywords;
            for (var j = 0; j < words.length; j++) {
                if (hay.indexOf(words[j].toLowerCase()) !== -1) return CFG.buckets[i].key;
            }
        }
        return CFG.buckets[last].key;
    }

    function groupProducts() {
        var order = [];
        var map = {};

        for (var i = 0; i < CFG.buckets.length; i++) {
            var group = { key: CFG.buckets[i].key, title: CFG.buckets[i].title, products: [] };
            map[group.key] = group;
            order.push(group.key);
        }

        for (var k = 0; k < state.products.length; k++) {
            map[classify(state.products[k])].products.push(state.products[k]);
        }

        var seq = CFG.renderOrder || order;
        var out = [];
        for (var m = 0; m < seq.length; m++) {
            if (map[seq[m]].products.length) out.push(map[seq[m]]);
        }
        return out;
    }

    function signature() {
        var parts = [];
        for (var i = 0; i < state.products.length; i++) parts.push(state.products[i].slug);
        return (state.fromApi ? "api:" : "dom:") + parts.join("|");
    }

    /* =========================================
       Cards
       ========================================= */
    function detectCurrency(node) {
        if (node) {
            var box = node.querySelector(".fasty_product_card_price");
            if (box) {
                var inner = box.querySelector("span span");
                if (inner && inner.textContent) return (inner.textContent || "").trim();
            }
        }
        return CFG.currency;
    }

    function hasSale(product) {
        var sale = product.sale_price;
        var price = product.price;
        if (sale === undefined || sale === null || sale === "") return false;
        if (price === undefined || price === null || price === "") return true;
        return Number(sale) < Number(price);
    }

    function priceMarkup(product, currency) {
        var cur = '<span class="font-[inherit]">' + currency + "</span>";

        if (hasSale(product)) {
            return '<span class="text-red-400 flex items-center gap-1">' + product.sale_price + cur + "</span>"
                + '<del class="font-normal text-gray-800 opacity-60 sm:text-base flex items-center gap-1">' + product.price + cur + "</del>";
        }
        if (product.price !== undefined && product.price !== null && product.price !== "") {
            return '<span class="text-heading flex items-center gap-1">' + product.price + cur + "</span>";
        }
        return '<span class="text-heading">' + (product.priceText || "") + "</span>";
    }

    /* Reuse a real theme card when one exists anywhere (the grid, or a section
       from a previous build), otherwise clone the theme's own markup and patch
       it so products missing from page 1 still look identical. */
    function collectExistingCards() {
        var map = {};
        var nodes = document.querySelectorAll(".fasty_product_card");

        for (var i = 0; i < nodes.length; i++) {
            var a = nodes[i].querySelector('a[href*="/products/"]');
            if (!a) continue;

            var href = (a.getAttribute("href") || "").toLowerCase();
            var idx = href.indexOf("/products/");
            if (idx === -1) continue;

            var slug = href.slice(idx + 10).split("/")[0];
            if (slug && !map[slug]) map[slug] = nodes[i];
        }
        return map;
    }

    function resolveCard(existing, product, template, currency) {
        var real = existing[((product.slug || "") + "").toLowerCase()];
        if (real) return real;

        if (!template) return null;

        var card = template.cloneNode(true);
        card.removeAttribute("data-akkad-order");
        card.removeAttribute("data-akkad-section");
        card.removeAttribute("style");

        var link = card.querySelector('a[href*="/products/"]');
        if (link) {
            link.setAttribute("href", "/products/" + product.slug);
            link.setAttribute("title", product.name || "");
        }

        var img = card.querySelector("img");
        if (img && product.thumb) {
            img.setAttribute("src", product.thumb);
            img.setAttribute("alt", product.name || "");
        }
        var placeholder = card.querySelector("img");
        if (placeholder && placeholder.getAttribute("src") === null && product.thumb) {
            placeholder.setAttribute("src", product.thumb);
        }

        var nameEl = card.querySelector(".fasty_product_card_name");
        if (nameEl) nameEl.textContent = product.name || "";

var priceBox = card.querySelector(".fasty_product_card_price");
        if (priceBox) priceBox.innerHTML = priceMarkup(product, currency);

        /* the template card carries its own SALE tag; it must not leak onto a
           different product, so drop it and re-add only if this one is on sale */
        var inherited = card.querySelectorAll(".akkad-sale-tag");
        for (var t = 0; t < inherited.length; t++) {
            inherited[t].parentNode.removeChild(inherited[t]);
        }
        if (hasSale(product)) {
            var saleLink = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
            if (saleLink) {
                if (window.getComputedStyle(saleLink).position === "static") {
                    saleLink.style.position = "relative";
                }
                var tag = document.createElement("div");
                tag.className = "akkad-sale-tag";
                tag.setAttribute("aria-hidden", "true");
                tag.innerHTML = "<span>SALE</span>";
                saleLink.appendChild(tag);
            }
        }

        /* React binds these on real cards; a clone would ship a dead button,
           so the options button becomes a plain link to the product. */
        var btnBox = card.querySelector(".fasty_product_card_btn_container");
        if (btnBox) {
            var wish = btnBox.querySelector(".fasty_product_card_wishlist_btn");
            if (wish) wish.remove();

            var btn = btnBox.querySelector(".fasty_product_card_btn");
            if (btn) {
                var a = document.createElement("a");
                a.className = btn.className;
                a.setAttribute("href", "/products/" + product.slug);
                a.textContent = (btn.textContent || "").replace(/\s+/g, " ").trim() || "عرض المنتج";
                btnBox.replaceChild(a, btn);
            }
        }

        return card;
    }

    /* =========================================
       Markup
       ========================================= */
    function createSection(title, isGrid) {
        var section = document.createElement("section");
        section.className = "akkad-products-section";
        section.setAttribute("data-akkad-section", "true");

        var head = document.createElement("div");
        head.className = "akkad-section-header";

        var h = document.createElement("h2");
        h.className = "akkad-section-title";
        h.textContent = " " + title + " ";

        head.appendChild(h);
        section.appendChild(head);

        if (isGrid) {
            var wrap = document.createElement("div");
            wrap.className = "akkad-grid";
            section.appendChild(wrap);
            return section;
        }

        var slider = document.createElement("div");
        slider.className = "akkad-slider";

        var prev = document.createElement("button");
        prev.type = "button";
        prev.className = "akkad-arrow akkad-prev";
        prev.setAttribute("aria-label", "السابق");
        prev.textContent = "‹";

        var viewport = document.createElement("div");
        viewport.className = "akkad-slider-viewport";

        var track = document.createElement("div");
        track.className = "akkad-slider-track";
        viewport.appendChild(track);

        var next = document.createElement("button");
        next.type = "button";
        next.className = "akkad-arrow akkad-next";
        next.setAttribute("aria-label", "التالي");
        next.textContent = "›";

        slider.appendChild(prev);
        slider.appendChild(viewport);
        slider.appendChild(next);
        section.appendChild(slider);

        section._track = track;
        section._viewport = viewport;
        section._prev = prev;
        section._next = next;

        return section;
    }

    function setupSlider(section) {
        var viewport = section._viewport;
        var track = section._track;
        var prev = section._prev;
        var next = section._next;

        function step() {
            var item = track.querySelector(".akkad-slider-item");
            if (!item) return 0;
            var w = item.getBoundingClientRect().width;
            if (!w) return 0;
            var styles = window.getComputedStyle(track);
            var gap = parseFloat(styles.columnGap || styles.gap || "8") || 8;
            return w + gap;
        }

        function sync() {
            var max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
            var cur = Math.abs(viewport.scrollLeft);
            prev.disabled = cur <= 2;
            next.disabled = cur >= max - 2;
        }

        prev.addEventListener("click", function (e) {
            e.preventDefault();
            var s = step();
            if (s) viewport.scrollBy({ left: -s, behavior: "smooth" });
        });

        next.addEventListener("click", function (e) {
            e.preventDefault();
            var s = step();
            if (s) viewport.scrollBy({ left: s, behavior: "smooth" });
        });

        viewport.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        setTimeout(sync, 120);
        setTimeout(sync, 600);
        setTimeout(sync, 1400);
    }

    function fillSlider(section, products, existing, template, currency) {
        for (var i = 0; i < products.length; i++) {
            var card = resolveCard(existing, products[i], template, currency);
            if (!card) continue;

            var item = document.createElement("div");
            item.className = "akkad-slider-item";
            item.appendChild(card);
            section._track.appendChild(item);
        }
        setupSlider(section);
    }

    function fillGrid(section, products, existing, template, currency) {
        var wrap = section.querySelector(".akkad-grid");

        for (var i = 0; i < products.length; i++) {
            var card = resolveCard(existing, products[i], template, currency);
            if (!card) continue;

            var cell = document.createElement("div");
            cell.className = "akkad-grid-cell";
            cell.appendChild(card);
            wrap.appendChild(cell);
        }
    }

    function removeSections() {
        var nodes = document.querySelectorAll('[data-akkad-section="true"]');
        for (var i = 0; i < nodes.length; i++) nodes[i].remove();
    }

    /* =========================================
       Build
       ========================================= */
    function build() {
        if (!isOfficePage()) return;
        if (state.building) return;
        if (!state.products.length) return;

        var grid = getGrid();
        if (!grid) return;

        var sig = signature();
        if (state.built && sig === state.signature) return;

        state.building = true;

        try {
            var existing = collectExistingCards();
            var template = null;
            for (var key in existing) {
                if (Object.prototype.hasOwnProperty.call(existing, key)) {
                    template = existing[key];
                    break;
                }
            }
            var currency = detectCurrency(template);
            var parent = grid.parentElement;
            if (!parent) return;

            injectStyles();
            hideThemePagination();
            removeSections();

            if (state.showAll) {
                var allSection = createSection(CFG.allTitle, true);
                fillGrid(allSection, state.products, existing, template, currency);
                parent.insertBefore(allSection, grid);
            } else {
                var groups = groupProducts();

                for (var i = 0; i < groups.length; i++) {
                    var section = createSection(groups[i].title, false);
                    fillSlider(section, groups[i].products, existing, template, currency);
                    parent.insertBefore(section, grid);
                }
            }

            hideGrid(grid);
            state.built = true;
            state.signature = sig;
        } catch (e) {
            console.error("[Akkad] office supplies build failed:", e);
            showGrid(grid);
        } finally {
            state.building = false;
        }
    }

    function invalidate() {
        state.built = false;
        state.signature = "";
    }

    function setView(all) {
        if (state.showAll === all) return;
        state.showAll = all;
        invalidate();

        var grid = getGrid();
        if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });

        build();
    }

    function wireControls() {
        if (state.wired) return;
        state.wired = true;

        document.addEventListener("click", function (event) {
            var target = event.target && event.target.closest
                ? event.target.closest(".akkad-section-more, .akkad-toggle-all")
                : null;
            if (!target) return;

            event.preventDefault();
            event.stopPropagation();
            setView(!state.showAll);
        }, true);
    }

    /* =========================================
       Boot
       ========================================= */
    function waitForGrid(timeout) {
        return new Promise(function (resolve) {
            var started = Date.now();

            (function tick() {
                var grid = getGrid();
                if (grid && grid.querySelector(".fasty_product_card")) return resolve(grid);
                if (Date.now() - started > timeout) return resolve(grid);
                setTimeout(tick, 200);
            })();
        });
    }

    function start() {
        if (!isOfficePage()) return;
        if (state.started) return;
        state.started = true;

        state.lastUrl = window.location.href;
        wireControls();
        injectStyles();
        ensureOfficeWatchers();

        fetchProducts()
            .then(function (list) {
                state.products = list;
                state.fromApi = true;
            })
            .catch(function (err) {
                console.warn("[Akkad] product API failed, using DOM:", err);
                state.products = productsFromDom(getGrid());
                state.fromApi = false;
            })
            .then(function () {
                return waitForGrid(12000);
            })
            .then(function () {
                if (!state.products.length) state.products = productsFromDom(getGrid());
                build();
                setTimeout(build, 800);
                setTimeout(build, 2000);
            });

        }
    /* This file is parsed once on whatever page the store opened. If that page
       was not the office URL, start() bailed above and left no observer and no
       URL poll behind — so navigating to the office page in-app (soft routing)
       rendered nothing until the user hard-refreshed. Keep one observer and one
       poll alive for the whole session; build() and start() re-check
       isOfficePage(), so the watchers are inert on any other page. */
    var officeObserverReady = false;

    function ensureOfficeWatchers() {
        if (officeObserverReady) return;
        officeObserverReady = true;

        /* If the theme re-renders its grid (filter, language, pagination) we
           must regroup — the API list is the source of truth either way. */
        var observer = new MutationObserver(function () {
            if (!isOfficePage()) return;
            if (state.showAll) return;
            window.clearTimeout(window.__akkadOfficeTimer);
            window.__akkadOfficeTimer = setTimeout(build, 250);
        });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    /* This poll is deliberately UNCONDITIONAL — it runs on every page for the
       whole session. Soft navigation never reloads this file, so if it only
       existed once start() had run, an in-app arrival at the office URL would
       never be noticed (the very bug it is here to fix). */
    setInterval(function () {
        if (!isOfficePage()) return;
        if (!state.started) {
            start();
            return;
        }
        if (window.location.href !== state.lastUrl) {
            state.lastUrl = window.location.href;
            invalidate();
        }
        build();
    }, 1000);

    function injectStyles() {
        if (document.getElementById("akkad-office-css")) return;

        var css = "\n\
.akkad-products-section{width:100%;margin:0 0 38px;position:relative}\n\
.akkad-section-header{width:100%;display:flex;align-items:center;justify-content:space-between;direction:rtl;margin-bottom:12px;padding:0 4px;box-sizing:border-box}\n\
.akkad-section-title{margin:0;padding:0;font-size:20px;line-height:1.4;font-weight:800}\n\
.akkad-section-more{font-size:12px;color:inherit;text-decoration:none;white-space:nowrap;opacity:.85;background:none;border:0;padding:0;cursor:pointer;font-family:inherit}\n\
.akkad-section-more:hover{opacity:1;text-decoration:underline}\n\
.akkad-slider{width:100%;position:relative}\n\
.akkad-slider-viewport{width:100%;overflow-x:auto;overflow-y:visible;direction:ltr;scroll-behavior:smooth;scrollbar-width:none;-webkit-overflow-scrolling:touch}\n\
.akkad-slider-viewport::-webkit-scrollbar{display:none}\n\
.akkad-slider-track{display:flex;flex-wrap:nowrap;align-items:stretch;gap:8px;width:max-content;direction:ltr}\n\
.akkad-slider-item{flex:0 0 calc((100vw - 48px)/4);width:calc((100vw - 48px)/4);min-width:0;box-sizing:border-box}\n\
.akkad-slider-item .fasty_product_card{width:100%!important;max-width:100%!important;box-sizing:border-box}\n\
.akkad-arrow{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18);z-index:100;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;line-height:1;padding:0;appearance:none;-webkit-appearance:none}\n\
.akkad-prev{left:4px}\n\
.akkad-next{right:4px}\n\
.akkad-arrow:disabled{opacity:.3;cursor:default;pointer-events:none}\n\
.akkad-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\n\
.akkad-grid-cell{min-width:0;box-sizing:border-box}\n\
.akkad-grid-cell .fasty_product_card{width:100%!important;max-width:100%!important;box-sizing:border-box}\n\
.akkad-toggle-all{display:block;margin:16px auto 8px;padding:9px 22px;font-family:inherit;font-size:13px;font-weight:600;color:#fff;background:#44174E;border:0;border-radius:999px;cursor:pointer}\n\
@media (max-width:900px){.akkad-slider-item{flex:0 0 calc((100vw - 32px)/3);width:calc((100vw - 32px)/3)}.akkad-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n\
@media (max-width:600px){.akkad-slider-item{flex:0 0 calc((100vw - 24px)/2);width:calc((100vw - 24px)/2)}.akkad-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.akkad-section-title{font-size:18px}.akkad-arrow{width:30px;height:30px;font-size:20px}}\n";

        var style = document.createElement("style");
        style.id = "akkad-office-css";
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();

/* =========================================
   16. Featured banner white frame
   =========================================
   The exported webp 1784395371176817130 is 1964x801, but the photograph only
   occupies rows 185-615: 1964x431, aspect 4.557. The rest is pure white, and
   the theme sizes .feature-img to the file aspect, so those bars render as a
   white band above and below the photo in dark mode.

   Giving the box the photo's own aspect makes object-fit:cover crop exactly
   those two bars away - 185px of padding scales to precisely the 35.2px that
   a 374x82 box has to trim. Keyed on the asset id, so replacing the banner
   just drops the rule. The file should still be re-exported without the
   padding; this only exists so the live banner is not white. */
(function () {
    "use strict";

    var STYLE_ID = "akkad-feature-frame-css";

    function inject() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = [
            'img.feature-img[src*="1784395371176817130"]{',
            '    aspect-ratio: 1964 / 431 !important;',
            '    height: auto !important;',
            '}',
            /* the photo is dark, so if it ever fails to load the slot should
               read as an empty dark panel rather than a white one */
            '.feature-img{ background:#1B1931; }',
            'html.akkad-dark .feature-img{ background:#1B1931 !important; }'
        ].join("\n");

        (document.head || document.documentElement).appendChild(style);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inject, { once: true });
    } else {
        inject();
    }
})();
