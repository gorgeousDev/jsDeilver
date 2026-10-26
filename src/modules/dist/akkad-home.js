/* v2-floating-live-counter */
try {
/* =========================================
   9. Floating Live Counter
   ========================================= */
(function () {
    var counterObserver = null;
    var counterTimer = null;
    var updateTimer = null;

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
            updateTimer = setTimeout(loop, Math.random() * 5000 + 3000);
        }

        loop();
    }

    function initCounter() {
        if (!isHomePage()) {
            var el = document.getElementById("akkad-floating-counter");
            if (el) el.remove();
            clearTimeout(updateTimer);
            updateTimer = null;
            return;
        }

        if (document.getElementById("akkad-floating-counter")) return;
        createFloatingCounter();
    }

    function syncCounterRoute() {
        if (!isHomePage()) {
            if (counterObserver) counterObserver.disconnect();
            counterObserver = null;
            clearTimeout(counterTimer);
            counterTimer = null;
            initCounter();
            return;
        }

        if (!counterObserver && document.body) {
            counterObserver = new MutationObserver(function () {
                clearTimeout(counterTimer);
                counterTimer = setTimeout(initCounter, 500);
            });
            counterObserver.observe(document.body, { childList: true, subtree: true });
        }

        clearTimeout(counterTimer);
        counterTimer = setTimeout(initCounter, 500);
    }

    window.addEventListener("akkad:route-change", syncCounterRoute);
    syncCounterRoute();
})();
} catch (error) { console.error("[Akkad] feature failed: v2-floating-live-counter", error); }
