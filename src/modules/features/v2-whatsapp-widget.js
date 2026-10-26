(function () {
    var script = document.createElement("script");
    script.src = "https://cdn.pickyassist.com/WhatsApp/embed.js";
    script.async = true;
    script.onerror = function () {
        console.error("[Akkad] failed to load the WhatsApp widget script.");
    };
    document.head.appendChild(script);

    var config = {
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

    var attempts = 0;
    var maxAttempts = 20;

    function loadWhatsApp() {
        if (typeof window._waBtn === "function") {
            window._waBtn(config);
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(loadWhatsApp, 200);
        } else {
            console.error("[Akkad] WhatsApp widget API was unavailable after loading its script.");
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
