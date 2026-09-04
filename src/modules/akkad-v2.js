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
    s.src = "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@f935c88/src/modules/akkad.js";
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
        b: "#040b1d",
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
            parent.style.background = "#00273d";
            parent.style.border = "1px solid #0b4b73";
            parent.style.borderRadius = "12px";
            parent.style.padding = "12px 16px";
            parent.style.color = "#ffffff";
            parent.style.fontWeight = "700";

            badge.style.background = "#0b4b73";
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
    background:#00273d;\n\
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
    background: rgba(4,11,29,.65) !important;\n\
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
    background: rgba(4,11,29,.9) !important;\n\
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
   13. Modern Sparkled Sale Badge
   ========================================= */
(function () {

    /* =========================================
       CSS (one-time injection into body, not head
       so Next.js hydration doesn't remove it)
       ========================================= */
    function addStyles() {
        if (document.getElementById("akkad-sale-badge-css")) return;

        var style = document.createElement("style");
        style.id = "akkad-sale-badge-css";
        style.textContent = [
            /* — new badge wrapper — */
            '.akkad-sale-badge{',
            '    position:absolute !important;',
            '    top:0 !important;',
            '    right:0 !important;',
            '    z-index:15 !important;',
            '    pointer-events:none !important;',
            '}',
            '',
            /* — pill — */
            '.akkad-sale-badge .akkad-badge-pill{',
            '    position:relative !important;',
            '    display:inline-flex !important;',
            '    align-items:center !important;',
            '    justify-content:center !important;',
            '    gap:5px !important;',
            '    padding:6px 14px 6px 10px !important;',
            '    background:linear-gradient(135deg, #ff2d55, #ff6b6b) !important;',
            '    color:#fff !important;',
            '    font-size:13px !important;',
            '    font-weight:800 !important;',
            '    font-family:Tajawal,sans-serif !important;',
            '    border-radius:0 0 0 14px !important;',
            '    box-shadow:0 4px 15px rgba(255,45,85,.4) !important;',
            '    overflow:hidden !important;',
            '    white-space:nowrap !important;',
            '}',
            '',
            /* — sparkles — */
            '.akkad-sale-badge .sparkle{',
            '    position:absolute !important;',
            '    width:3px !important;',
            '    height:3px !important;',
            '    background:#fff !important;',
            '    border-radius:50% !important;',
            '    opacity:0 !important;',
            '    animation:akkadSparkle 1.8s ease-in-out infinite !important;',
            '}',
            '.akkad-sale-badge .sparkle:nth-child(1){ top:4px; left:8px; animation-delay:0s; }',
            '.akkad-sale-badge .sparkle:nth-child(2){ top:12px; left:20px; animation-delay:.35s; width:2px; height:2px; }',
            '.akkad-sale-badge .sparkle:nth-child(3){ top:6px; right:10px; animation-delay:.7s; }',
            '.akkad-sale-badge .sparkle:nth-child(4){ bottom:4px; left:14px; animation-delay:1.05s; width:2px; height:2px; }',
            '.akkad-sale-badge .sparkle:nth-child(5){ bottom:6px; right:8px; animation-delay:1.4s; }',
            '',
            '@keyframes akkadSparkle{',
            '    0%,100%{ opacity:0; transform:scale(0) rotate(0deg); }',
            '    50%{ opacity:1; transform:scale(1) rotate(180deg); }',
            '}',
            '',
            /* — shine sweep — */
            '.akkad-sale-badge .akkad-badge-pill::before{',
            '    content:"" !important;',
            '    position:absolute !important;',
            '    top:-50% !important;',
            '    left:-80% !important;',
            '    width:40% !important;',
            '    height:200% !important;',
            '    background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent) !important;',
            '    transform:rotate(25deg) !important;',
            '    animation:akkadShine 2.5s ease-in-out infinite !important;',
            '}',
            '',
            '@keyframes akkadShine{',
            '    0%{ left:-80%; }',
            '    45%,100%{ left:140%; }',
            '}',
            '',
            /* — star icon — */
            '.akkad-sale-badge .akkad-star{',
            '    font-size:12px !important;',
            '    line-height:1 !important;',
            '    animation:akkadStarPulse 1.2s ease-in-out infinite !important;',
            '}',
            '',
            '@keyframes akkadStarPulse{',
            '    0%,100%{ transform:scale(1) rotate(0deg); }',
            '    50%{ transform:scale(1.3) rotate(15deg); }',
            '}',
            '',
            /* — mobile — */
            '@media(max-width:768px){',
            '    .akkad-sale-badge .akkad-badge-pill{',
            '        padding:5px 12px 5px 8px !important;',
            '        font-size:12px !important;',
            '        border-radius:0 0 0 12px !important;',
            '    }',
            '}'
        ].join('\n');

        /* append to body, not head — survives Next.js hydration */
        (document.body || document.documentElement).appendChild(style);
    }

    /* =========================================
       Hide "تخفيضات" spans using inline style
       (survives React re-renders on that element)
       ========================================= */
    function hideOriginalBadges() {
        var allSpans = document.querySelectorAll("span");
        for (var i = 0; i < allSpans.length; i++) {
            var span = allSpans[i];
            if (span.textContent.trim() === "تخفيضات" ||
                span.textContent.trim() === "تخفيضات") {
                span.style.cssText = "display:none !important; visibility:hidden !important; width:0 !important; height:0 !important; overflow:hidden !important; position:absolute !important;";
                /* also hide parent if it only contains this span */
                var parent = span.parentElement;
                if (parent && parent.children.length === 1 &&
                    parent.textContent.trim() === "تخفيضات") {
                    parent.style.cssText = "display:none !important; visibility:hidden !important; width:0 !important; height:0 !important; overflow:hidden !important; position:absolute !important;";
                }
            }
        }
    }

    /* =========================================
       Inject new badge into sale cards
       ========================================= */
    function processCards() {
        var cards = document.querySelectorAll(".fasty_product_card");
        for (var c = 0; c < cards.length; c++) {
            var card = cards[c];

            /* skip if already has our badge */
            if (card.querySelector(".akkad-sale-badge")) continue;

            /* only cards with a sale (old price with <del>) */
            var priceContainer = card.querySelector(".fasty_product_card_price");
            if (!priceContainer) continue;
            if (!priceContainer.querySelector("del")) continue;

            /* build badge */
            var badge = document.createElement("div");
            badge.className = "akkad-sale-badge";
            badge.innerHTML =
                '<div class="akkad-badge-pill">' +
                    '<span class="sparkle"></span>' +
                    '<span class="sparkle"></span>' +
                    '<span class="sparkle"></span>' +
                    '<span class="sparkle"></span>' +
                    '<span class="sparkle"></span>' +
                    '<span class="akkad-star">&#10022;</span>' +
                    '<span>SALE</span>' +
                '</div>';

            /* inject into the <a> wrapper (position:relative) */
            var link = card.querySelector("a");
            if (link) {
                link.appendChild(badge);
            }
        }
    }

    /* =========================================
       Run
       ========================================= */
    var isHome = typeof __akkad_isHomePage === "function" && __akkad_isHomePage();

    function run() {
        addStyles();
        if (!isHome) hideOriginalBadges();
        processCards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    var badgeTimer;
    new MutationObserver(function () {
        clearTimeout(badgeTimer);
        badgeTimer = setTimeout(function () {
            if (!isHome) hideOriginalBadges();
            processCards();
        }, 500);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
