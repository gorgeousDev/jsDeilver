function disableAutoplay(video) {
  // The browser autoplay attribute can start playback without a user gesture.
  // Remove it and pause immediately when the element is discovered.
  if (!video.hasAttribute("autoplay")) return;

  video.autoplay = false;
  video.removeAttribute("autoplay");
  video.pause();
}

export function initVideoLazy({ dom }) {
  // The shared DOM service handles both videos already on the page and videos
  // inserted later by React/Next.js.
  return dom.subscribe("video[autoplay]", disableAutoplay);
}
