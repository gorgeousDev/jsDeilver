/**
 * gallery-thumbnails.js
 * Creates a clickable thumbnail gallery for Swiper.js sliders.
 */

export function initGallery(containerSelector = ".swiper") {

    const container = document.querySelector(containerSelector);

    if (!container) return;

    if (container.querySelector(".akkad-gallery")) return;


}
  const pagination = container.querySelector('.swiper-pagination');
  if (!pagination) return;

  if (container.querySelector('.akkad-gallery')) return;

  const gallery = document.createElement('div');
  gallery.className = 'akkad-gallery';

  const slides = container.querySelectorAll(
    '.swiper-slide:not(.swiper-slide-duplicate) img'
  );

  function updateActiveThumb() {
    const bullets = container.querySelectorAll('.swiper-pagination-bullet');
    const thumbs = container.querySelectorAll('.akkad-thumb');

    thumbs.forEach((thumb) => thumb.classList.remove('active'));

    bullets.forEach((bullet, index) => {
      if (bullet.classList.contains('swiper-pagination-bullet-active')) {
        if (thumbs[index]) thumbs[index].classList.add('active');
      }
    });
  }

  slides.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.src = img.src;
    thumb.className = 'akkad-thumb';
    thumb.alt = img.alt || '';

    thumb.addEventListener('click', () => {
      const bullets = container.querySelectorAll('.swiper-pagination-bullet');
      if (bullets[index]) {
        bullets[index].click();
        setTimeout(updateActiveThumb, 100);
      }
    });

    gallery.appendChild(thumb);
  });

  pagination.insertAdjacentElement('afterend', gallery);

  const observer = new MutationObserver(() => updateActiveThumb());
  container.querySelectorAll('.swiper-pagination-bullet').forEach((bullet) => {
    observer.observe(bullet, { attributes: true, attributeFilter: ['class'] });
  });

  updateActiveThumb();
}
