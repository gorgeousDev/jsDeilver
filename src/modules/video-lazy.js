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
    new MutationObserver(disableVideoAutoplay).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
