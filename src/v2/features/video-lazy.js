function disableAutoplay(video) {
  if (!video.hasAttribute("autoplay")) return;

  video.autoplay = false;
  video.removeAttribute("autoplay");
  video.pause();
}

export function initVideoLazy({ dom }) {
  return dom.subscribe("video[autoplay]", disableAutoplay);
}
