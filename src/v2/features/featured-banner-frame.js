export function initFeaturedBannerFrame({ styles }) {
  return styles.add("akkad-v2-featured-banner-frame", `
    img.feature-img[src*="1784395371176817130"] {
      aspect-ratio: 1964 / 431 !important;
      height: auto !important;
    }
    .feature-img { background: #1B1931; }
    html.akkad-dark .feature-img { background: #1B1931 !important; }
  `);
}
