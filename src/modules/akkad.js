(function () {
  try {
// 4. fixAlt - Fix Image Alt Attributes
    function fixAlt() {
      const productName = document.querySelector("h1")?.textContent.trim() || document.title;
      document.querySelectorAll("img").forEach(img => {
        if (!img.alt || img.alt.startsWith("http://") || img.alt.startsWith("https://")) {
          img.alt = productName;
        }
      });
    }
    fixAlt();
    new MutationObserver(fixAlt).observe(document.body, {
      childList: true,
      subtree: true
    });

    // 5. initGallery - Swiper Thumbnails Gallery
    function initGallery() {
      const container = document.querySelector(".swiper");
      if (!container) return;
      if (container.querySelector(".akkad-gallery")) return;

      const pagination = container.querySelector(".swiper-pagination");
      if (!pagination) return;

      const slides = container.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate) img");
      if (!slides.length) return;

      const gallery = document.createElement("div");
      gallery.className = "akkad-gallery";

      slides.forEach((img, index) => {
        const thumb = document.createElement("img");
        thumb.src = img.src;
        thumb.className = "akkad-thumb";
        thumb.alt = img.alt || "";

        thumb.addEventListener("click", () => {
          const bullets = container.querySelectorAll(".swiper-pagination-bullet");
          if (bullets[index]) {
            bullets[index].click();
          }
        });
        gallery.appendChild(thumb);
      });

      pagination.insertAdjacentElement("afterend", gallery);

      function updateActiveThumb() {
        const bullets = container.querySelectorAll(".swiper-pagination-bullet");
        const thumbs = container.querySelectorAll(".akkad-thumb");

        thumbs.forEach(thumb => thumb.classList.remove("active"));
        bullets.forEach((bullet, index) => {
          if (bullet.classList.contains("swiper-pagination-bullet-active")) {
            if (thumbs[index]) {
              thumbs[index].classList.add("active");
            }
          }
        });
      }

      const observer = new MutationObserver(updateActiveThumb);
      container.querySelectorAll(".swiper-pagination-bullet").forEach(bullet => {
        observer.observe(bullet, {
          attributes: true,
          attributeFilter: ["class"]
        });
      });

      updateActiveThumb();
    }

    let galleryTimer;
    const galleryObserver = new MutationObserver(() => {
      clearTimeout(galleryTimer);
      galleryTimer = setTimeout(initGallery, 300);
    });
    galleryObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      setTimeout(initGallery, 500);
    } else {
      window.addEventListener("load", () => {
        setTimeout(initGallery, 500);
      });
    }

    // 6. moveButtons - Mobile Gallery Navigation Buttons Relocation
    function moveButtons() {
      const btns = document.querySelector(".product_gallery_btns_container");
      if (!btns) return;

      if (window.innerWidth <= 1024) {
        btns.style.top = "12px";
        btns.style.left = "12px";
        btns.style.right = "auto";
        btns.style.bottom = "auto";
        btns.style.display = "flex";
        btns.style.flexDirection = "row";
        btns.style.alignItems = "center";
        btns.style.gap = "8px";
        btns.style.zIndex = "1";
      } else {
        btns.style.top = "";
        btns.style.left = "";
        btns.style.right = "";
        btns.style.bottom = "";
      }
    }

    const moveBtnsObserver = new MutationObserver(() => {
      setTimeout(moveButtons, 100);
    });
    moveBtnsObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      moveButtons();
    } else {
      window.addEventListener("load", moveButtons);
    }
    window.addEventListener("resize", moveButtons);

    // 7. addCopyButton - Copy Product Link Button in Popover
    function addCopyButton() {
      const panel = document.querySelector('div[id^="headlessui-popover-panel"]');
      if (!panel) return;

      const container = panel.querySelector('.flex.gap-3');
      if (!container) return;
      if (container.querySelector('.akkad-copy')) return;

      const copy = document.createElement("a");
      copy.href = "#";
      copy.className = "flex items-center gap-3 akkad-copy";
      copy.innerHTML = `<i class="fa-solid fa-link h-6 w-6"></i>`;

      copy.onclick = async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(location.href);
          copy.style.color = "#16a34a";
          setTimeout(() => {
            copy.style.color = "";
          }, 1500);
        } catch (err) {
          console.error("Clipboard copy failed:", err);
        }
      };

      container.appendChild(copy);
    }

    const copyBtnObserver = new MutationObserver(addCopyButton);
    copyBtnObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 8. addHome - Homepage Link in Selected Mobile Menu Tab Panel
    function addHome() {
      const panel = document.querySelector(
        'div[id^="headlessui-tabs-panel"][data-headlessui-state="selected"]'
      );
      if (!panel) return;
      if (panel.querySelector(".akkad-home")) return;

      const item = document.createElement("div");
      item.className = "flow-root akkad-home";
      item.innerHTML = `
        <a href="/" class="-m-2 block cursor-pointer p-2 font-medium text-gray-900">
          الرئيسية
        </a>
      `;
      panel.insertBefore(item, panel.firstChild);
    }

    document.addEventListener("click", e => {
      const menuBtn = e.target.closest('button');
      if (!menuBtn) return;
      if (!menuBtn.querySelector('svg')) return;
      setTimeout(addHome, 300);
    });

    // 9. saveCategories & buildNavbar - Save categories to localStorage and build sticky bar
    function saveCategories() {
      const cards = document.querySelectorAll(".default_category_card");
      if (!cards.length) return;

      const categories = [];
      cards.forEach(card => {
        const name = card.querySelector("h4")?.childNodes[0]?.textContent.trim();
        let link = null;
        const a = card.closest("a");
        if (a) link = a.href;

        if (!link) {
          const onclick = card.getAttribute("onclick");
          if (onclick) {
            const m = onclick.match(/'(.*?)'/);
            if (m) link = m[1];
          }
        }

        if (name && link) {
          categories.push({ name, link });
        }
      });

      if (categories.length) {
        localStorage.setItem("akkad_categories", JSON.stringify(categories));
      }
    }

    function buildNavbar() {
      if (document.querySelector(".akkad-categories-nav")) return;
      const header = document.querySelector("header");
      if (!header) return;

      const data = localStorage.getItem("akkad_categories");
      if (!data) return;

      const categories = JSON.parse(data);
      if (!categories.length) return;

      const nav = document.createElement("div");
      nav.className = "akkad-categories-nav";

      const inner = document.createElement("div");
      inner.className = "akkad-categories-inner";
      inner.innerHTML = '<a href="/">الرئيسية</a>';

      categories.forEach(cat => {
        inner.innerHTML += `
          <a href="${cat.link}">
            ${cat.name}
          </a>
        `;
      });

      nav.appendChild(inner);
      header.insertAdjacentElement("afterend", nav);
    }

    function initNavbar() {
      saveCategories();
      buildNavbar();
    }

    const navbarObserver = new MutationObserver(() => {
      setTimeout(initNavbar, 500);
    });
    navbarObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "complete") {
      setTimeout(initNavbar, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(initNavbar, 1000);
      });
    }

    // 10. URL change automatic scroll to top
    let ignoreNextScroll = false;
    document.addEventListener("click", e => {
      if (e.target.closest('button[data-variant="slim"]')) {
        ignoreNextScroll = true;
        setTimeout(() => {
          ignoreNextScroll = false;
        }, 3000);
      }
    });

    function goTop() {
      if (ignoreNextScroll) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      });
    }

    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        goTop();
      }
    }, 100);

  } catch (error) {
    console.error("Error in GTM akkad.js execution:", error);
  }
})();
