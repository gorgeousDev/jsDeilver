console.log("MAIN LOADED");
import { initGallery } from "./gallery-thumbnails.js";

let initialized = false;

function startGallery() {

    const swiper = document.querySelector(".swiper");

    if (!swiper) {
        initialized = false;
        return;
    }

    if (swiper.querySelector(".akkad-gallery")) {
        initialized = true;
        return;
    }

    initialized = true;
    initGallery();

}

const observer = new MutationObserver(() => {

    clearTimeout(window.__akkadGalleryTimeout);

    window.__akkadGalleryTimeout = setTimeout(() => {

        initialized = false;
        startGallery();

    }, 300);

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

startGallery();