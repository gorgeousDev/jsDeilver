const IMAGE_SELECTOR = "img";
const HEADING_SELECTOR = "h1";

export function initImageAlt({ document, dom, navigation, window }) {
  let productName = "";

  function resolveProductName() {
    const heading = document.querySelector(HEADING_SELECTOR);
    productName = heading?.textContent.trim() || document.title;
  }

  function updateImage(image) {
    if (!productName) resolveProductName();
    const alt = image.getAttribute("alt") || "";
    if (!alt || /^https?:\/\//i.test(alt)) image.alt = productName;
  }

  function updateAllImages() {
    resolveProductName();
    for (const image of document.querySelectorAll(IMAGE_SELECTOR)) updateImage(image);
  }

  const stopImages = dom.subscribe(IMAGE_SELECTOR, updateImage);
  const stopHeadings = dom.subscribe(HEADING_SELECTOR, updateAllImages);
  const stopNavigation = navigation.subscribe(() => {
    window.requestAnimationFrame(updateAllImages);
  });

  return () => {
    stopImages();
    stopHeadings();
    stopNavigation();
  };
}
