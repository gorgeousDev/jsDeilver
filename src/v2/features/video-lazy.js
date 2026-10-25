function disableAutoplay(video) {
  if (!video.hasAttribute("autoplay")) return;

  video.autoplay = false;
  video.removeAttribute("autoplay");
  video.pause();
}

function disableAutoplayIn(node) {
  if (node.nodeType !== 1) return;

  if (node.matches("video")) {
    disableAutoplay(node);
  }

  for (const video of node.querySelectorAll("video[autoplay]")) {
    disableAutoplay(video);
  }
}

export function initVideoLazy({ document, window }) {
  let observedRoot = document.body || document.documentElement;
  if (!observedRoot) return;

  const observer = new window.MutationObserver((mutations) => {
    if (document.body && observedRoot !== document.body) {
      observer.disconnect();
      observedRoot = document.body;
      disableAutoplayIn(observedRoot);
      observer.observe(observedRoot, { childList: true, subtree: true });
      return;
    }

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        disableAutoplayIn(node);
      }
    }
  });

  disableAutoplayIn(observedRoot);
  observer.observe(observedRoot, { childList: true, subtree: true });

  return () => observer.disconnect();
}
