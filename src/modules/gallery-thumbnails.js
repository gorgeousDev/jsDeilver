/**
 * gallery-thumbnails.js
 * Creates a clickable thumbnail gallery for Swiper.js sliders.
 */

export function initGallery(containerSelector = ".swiper") {
   console.log("INIT GALLERY");
    const container = document.querySelector(containerSelector);

    if (!container) return;

    if (container.querySelector(".akkad-gallery")) return;


}
  const pagination = container.querySelector('.swiper-pagination');
  if (!pagination) return;

  if (container.querySelector('.akkad-gallery')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'akkad-gallery-wrapper';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'akkad-gallery-arrow akkad-gallery-prev';
  prevBtn.type = 'button';
  prevBtn.innerHTML = '&#10094;';
  prevBtn.setAttribute('aria-label', 'Previous images');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'akkad-gallery-arrow akkad-gallery-next';
  nextBtn.type = 'button';
  nextBtn.innerHTML = '&#10095;';
  nextBtn.setAttribute('aria-label', 'Next images');

  const gallery = document.createElement('div');
  gallery.className = 'akkad-gallery';

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(gallery);
  wrapper.appendChild(nextBtn);

  const slides = container.querySelectorAll(
    '.swiper-slide:not(.swiper-slide-duplicate) img'
  );

  function updateActiveThumb() {
    const bullets = container.querySelectorAll('.swiper-pagination-bullet');
    const thumbs = container.querySelectorAll('.akkad-thumb');

    thumbs.forEach((thumb) => {
      thumb.classList.remove('active');
    });

    bullets.forEach((bullet, index) => {
      if (bullet.classList.contains('swiper-pagination-bullet-active')) {
        const thumb = thumbs[index];

        if (thumb) {
          thumb.classList.add('active');

          // تحريك الشريط تلقائيًا للـ thumbnail النشطة
          const galleryRect = gallery.getBoundingClientRect();
          const thumbRect = thumb.getBoundingClientRect();

          if (
            thumbRect.left < galleryRect.left ||
            thumbRect.right > galleryRect.right
          ) {
            const target =
              thumb.offsetLeft -
              (gallery.clientWidth / 2) +
              (thumb.offsetWidth / 2);

            gallery.scrollTo({
              left: target,
              behavior: 'smooth'
            });
          }
        }
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

        setTimeout(() => {
          updateActiveThumb();

          thumb.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }, 100);
      }
    });
    gallery.appendChild(thumb);
  });

pagination.insertAdjacentElement('afterend', wrapper);
prevBtn.addEventListener('click', () => {
  gallery.scrollBy({
    left: -240,
    behavior: 'smooth'
  });
});

nextBtn.addEventListener('click', () => {
  gallery.scrollBy({
    left: 240,
    behavior: 'smooth'
  });
});

  const observer = new MutationObserver(() => updateActiveThumb());
  container.querySelectorAll('.swiper-pagination-bullet').forEach((bullet) => {
    observer.observe(bullet, { attributes: true, attributeFilter: ['class'] });
  });

  updateActiveThumb();
}
