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
