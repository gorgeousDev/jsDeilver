(function () {
    function disableVideoAutoplay() {
        var videos = document.querySelectorAll('video');
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            if (video.hasAttribute('autoplay')) {
                video.autoplay = false;
                video.removeAttribute('autoplay');
                video.pause();
            }
        }
    }

    disableVideoAutoplay();

    /* Observe the body once it exists. This file runs from a <head> script tag,
       where document.body is still null — observing it directly threw and left
       videos autoplaying for the whole session until a refresh. */
    function watch() {
        if (!document.body) return false;
        new MutationObserver(disableVideoAutoplay).observe(document.body, {
            childList: true,
            subtree: true
        });
        return true;
    }

    if (!watch() && document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", watch, { once: true });
    }
})();
