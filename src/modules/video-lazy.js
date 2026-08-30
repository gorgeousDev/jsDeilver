(function () {
    function disableVideoAutoplay() {
        var videos = document.querySelectorAll('video[autoplay]');
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            video.autoplay = false;
            video.removeAttribute('autoplay');
            video.preload = 'none';
            var sources = video.querySelectorAll('source');
            for (var j = 0; j < sources.length; j++) {
                if (!sources[j].dataset.origSrc) {
                    sources[j].dataset.origSrc = sources[j].src;
                    sources[j].removeAttribute('src');
                }
            }
            if (video.src && !video.dataset.origSrc) {
                video.dataset.origSrc = video.src;
                video.removeAttribute('src');
            }
            if (!video.dataset.lazyBound) {
                video.dataset.lazyBound = '1';
                video.addEventListener('play', function handler() {
                    var v = this;
                    if (!v.dataset.loaded) {
                        if (v.dataset.origSrc) v.src = v.dataset.origSrc;
                        var s = v.querySelectorAll('source');
                        for (var k = 0; k < s.length; k++) {
                            if (s[k].dataset.origSrc) s[k].src = s[k].dataset.origSrc;
                        }
                        v.load();
                        v.dataset.loaded = '1';
                    }
                    v.removeEventListener('play', handler);
                });
            }
        }
    }

    disableVideoAutoplay();
    new MutationObserver(disableVideoAutoplay).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
