import sliderCss from "../styles/graduation-slider.css";
import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const CLASSIC_PATH = "/products/high-school-graduation-gift-classic-design-2026";
const MODERN_PATH = "/products/high-school-graduation-gift-modern-design-2026";
const SLIDER_ID = "akkad-graduation-slider";
const IMAGE_URLS = [
  "https://files.easy-orders.net/1786365476227722534.webp",
  "https://files.easy-orders.net/1786365466534135347.webp",
  "https://files.easy-orders.net/1786365458894914294.webp",
  "https://files.easy-orders.net/1786365451845303830.webp",
  "https://files.easy-orders.net/1786365447594796680.webp",
  "https://files.easy-orders.net/1786365441649159061.webp",
  "https://files.easy-orders.net/1786365434307345455.webp"
];

export function initGraduationGiftSlider({ document, dom, navigation, styles, window }) {
  let slider = null;
  let autoplayTimer = 0;
  let currentPath = "";
  let originals = new Map();
  let currentIndex = 0;
  let stopImages = null;
  const removeStyle = styles.add("akkad-v2-graduation-slider-css", sliderCss);

  function isTarget(pathname = window.location.pathname) {
    return pathname === CLASSIC_PATH || pathname === MODERN_PATH;
  }

  function remember(element) {
    if (!originals.has(element)) {
      originals.set(element, captureInlineProperties(element, ["display"]));
    }
  }

  function setAutoplay(paused) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (paused || reducedMotion || !slider?.isConnected || document.hidden) return;
    autoplayTimer = window.setInterval(() => goTo((currentIndex + 1) % IMAGE_URLS.length), 4500);
  }

  function goTo(index) {
    if (!slider) return;
    currentIndex = (index + IMAGE_URLS.length) % IMAGE_URLS.length;
    slider.querySelector(".akkad-track").style.transform = `translate3d(-${currentIndex * 100}%,0,0)`;
    slider.querySelectorAll(".akkad-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
      dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
    });
  }

  function buildSlider() {
    if (!isTarget() || document.getElementById(SLIDER_ID)) return;
    const sourceImages = Array.from(document.querySelectorAll("img")).filter((image) =>
      IMAGE_URLS.includes((image.currentSrc || image.src || "").split("?")[0])
    );
    if (sourceImages.length !== IMAGE_URLS.length) return;

    const orderedImages = IMAGE_URLS.map((url) =>
      sourceImages.find((image) => (image.currentSrc || image.src || "").split("?")[0] === url)
    );
    if (orderedImages.some((image) => !image)) return;
    const firstSource = orderedImages[0];
    const insertionPoint = firstSource.closest("p") || firstSource.parentElement;
    if (!insertionPoint?.parentNode) return;

    slider = document.createElement("section");
    slider.id = SLIDER_ID;
    slider.setAttribute("aria-label", "صور هدية التخرج");
    const track = document.createElement("div");
    track.className = "akkad-track";
    const alt = window.location.pathname === CLASSIC_PATH
      ? "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم كلاسيك بالاسم والصورة"
      : "هدية نجاح الثانوية العامة 2026 | برواز مخصص بتصميم عصري بالاسم والصورة";

    for (let index = 0; index < IMAGE_URLS.length; index += 1) {
      const slide = document.createElement("div");
      slide.className = "akkad-slide";
      const image = document.createElement("img");
      image.src = IMAGE_URLS[index];
      image.alt = alt;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      slide.appendChild(image);
      track.appendChild(slide);
    }

    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "akkad-arrow akkad-prev";
    previous.setAttribute("aria-label", "الصورة السابقة");
    previous.textContent = "‹";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "akkad-arrow akkad-next";
    next.setAttribute("aria-label", "الصورة التالية");
    next.textContent = "›";
    const dots = document.createElement("div");
    dots.className = "akkad-dots";
    IMAGE_URLS.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `akkad-dot${index === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `الصورة ${index + 1}`);
      dot.addEventListener("click", () => {
        goTo(index);
        setAutoplay(false);
      });
      dots.appendChild(dot);
    });

    slider.append(track, previous, next, dots);
    insertionPoint.parentNode.insertBefore(slider, insertionPoint);
    for (const source of orderedImages) {
      const parent = source.closest("p") || source;
      remember(parent);
      parent.style.setProperty("display", "none", "important");
    }

    previous.addEventListener("click", () => goTo(currentIndex - 1));
    next.addEventListener("click", () => goTo(currentIndex + 1));
    slider.addEventListener("mouseenter", () => setAutoplay(true));
    slider.addEventListener("mouseleave", () => setAutoplay(false));
    slider.addEventListener("focusin", () => setAutoplay(true));
    slider.addEventListener("focusout", () => setAutoplay(false));

    let startX = 0;
    let startY = 0;
    slider.addEventListener("touchstart", (event) => {
      if (!event.touches.length) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      setAutoplay(true);
    }, { passive: true });
    slider.addEventListener("touchend", (event) => {
      if (!event.changedTouches.length) return;
      const deltaX = startX - event.changedTouches[0].clientX;
      const deltaY = startY - event.changedTouches[0].clientY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(currentIndex + (deltaX > 0 ? 1 : -1));
      }
      setAutoplay(false);
    }, { passive: true });

    setAutoplay(false);
  }

  function clearSlider() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
    slider?.remove();
    slider = null;
    for (const [element, originalStyle] of originals) {
      restoreInlineProperties(element, originalStyle);
    }
    originals = new Map();
    currentIndex = 0;
  }

  function syncRoute({ pathname }) {
    if (!isTarget(pathname)) {
      stopImages?.();
      stopImages = null;
      clearSlider();
      currentPath = "";
      return;
    }
    if (currentPath !== pathname) {
      clearSlider();
      currentPath = pathname;
    }
    if (!stopImages) stopImages = dom.subscribe(imageSelector, buildSlider);
    buildSlider();
  }

  const imageSelector = IMAGE_URLS.map((url) => `img[src*="${url.split("/").pop().split(".")[0]}"]`).join(",");
  const stopNavigation = navigation.subscribe(syncRoute);
  const onVisibilityChange = () => setAutoplay(document.visibilityState !== "visible");
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    stopImages?.();
    stopNavigation();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    clearSlider();
    removeStyle();
  };
}
