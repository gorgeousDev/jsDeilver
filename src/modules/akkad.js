(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var featureBase = selfSrc
    ? selfSrc.replace(/[^\/]*$/, "")
    : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
  var featureVersionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var featureVersion = featureVersionMatch ? "?v=" + featureVersionMatch[1] : "";

  function loadFeature(name) {
    var script = document.createElement("script");
    script.src = featureBase + "features/" + name + ".js" + featureVersion;
    script.async = false;
    script.onerror = function () {
      console.error("[Akkad] failed to load feature:", name);
    };
    document.head.appendChild(script);
  }

  loadFeature("akkad-product-gallery");

  function moveButtons() {
    var btns = document.querySelector(".product_gallery_btns_container");
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

  function addCopyButton() {
    var panel = document.querySelector('div[id^="headlessui-popover-panel"]');
    if (!panel) return;

    var container = panel.querySelector('.flex.gap-3');
    if (!container) return;
    if (container.querySelector('.akkad-copy')) return;

    var copy = document.createElement("a");
    copy.href = "#";
    copy.className = "flex items-center gap-3 akkad-copy";
    copy.innerHTML = '<i class="fa-solid fa-link h-6 w-6"></i>';

    copy.onclick = function (e) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href)
          .then(function () {
            copy.style.color = "#16a34a";
            setTimeout(function () {
              copy.style.color = "";
            }, 1500);
          })
          .catch(function (err) {
            console.error("Clipboard copy failed:", err);
          });
      } else {
        // Fallback for older browsers
        var textarea = document.createElement("textarea");
        textarea.value = location.href;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          copy.style.color = "#16a34a";
          setTimeout(function () {
            copy.style.color = "";
          }, 1500);
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
      }
    };

    container.appendChild(copy);
  }

  function saveCategories() {
    var cards = document.querySelectorAll(".default_category_card");
    if (!cards.length) return;

    var categories = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var nameEl = card.querySelector("h4");
      var name = (nameEl && nameEl.childNodes[0]) ? nameEl.childNodes[0].textContent.trim() : "";
      var link = null;
      var a = card.closest("a");
      if (a) link = a.href;

      if (!link) {
        var onclick = card.getAttribute("onclick");
        if (onclick) {
          var m = onclick.match(/'(.*?)'/);
          if (m) link = m[1];
        }
      }

      if (name && link) {
        categories.push({ name: name, link: link });
      }
    }

    if (categories.length) {
      localStorage.setItem("akkad_categories", JSON.stringify(categories));
    }
  }

  /* Category names and links are read back out of localStorage, so they are
     treated as untrusted input: the name is written as a text node and the
     link is only accepted when it resolves to this origin. */
  function safeCategoryHref(url) {
    if (!url) return null;
    try {
      var parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin) return null;
      return parsed.pathname + parsed.search + parsed.hash;
    } catch (e) {
      return null;
    }
  }

  function buildNavbar() {
    if (document.querySelector(".akkad-categories-nav")) return;
    var header = document.querySelector("header");
    if (!header) return;

    var data;
    try {
      data = localStorage.getItem("akkad_categories");
    } catch (e) {
      return;
    }
    if (!data) return;

    var categories;
    try {
      categories = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (!categories || !categories.length) return;

    var nav = document.createElement("div");
    nav.className = "akkad-categories-nav";

    var inner = document.createElement("div");
    inner.className = "akkad-categories-inner";

    function addCategoryLink(href, text) {
      var link = document.createElement("a");
      link.href = href;
      link.textContent = text;
      inner.appendChild(link);
    }

    addCategoryLink("/", "الرئيسية");

    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      if (!cat) continue;
      var href = safeCategoryHref(cat.link);
      if (!href) continue;
      addCategoryLink(href, cat.name || "");
    }

    nav.appendChild(inner);
    header.insertAdjacentElement("afterend", nav);
  }

  function initNavbar() {
    saveCategories();
    buildNavbar();
  }

  // Removed goTop, load, and pageshow listeners.
  // The load event fires AFTER all resources finish loading — if the user scrolls
  // before that, goTop() scrolls them back to top. Next.js handles scroll
  // restoration natively via its router.

  try {

    // 2. Google Site Verification Meta Tag Injection
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      var meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
      (document.head || document.documentElement).appendChild(meta);
    }

    // 3. Stylesheets
    loadFeature("akkad-stylesheets");

    loadFeature("akkad-image-alt");

    // 7. moveButtons Execution
    var moveBtnsObserver = new MutationObserver(function () {
      if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
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

    // 8. addCopyButton Execution
    var copyBtnObserver = new MutationObserver(function () {
      if (typeof __akkad_isHomePage === "function" && __akkad_isHomePage()) return;
      addCopyButton();
    });
    copyBtnObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 9. Categories Navbar Execution
    if (document.readyState === "complete") {
      initNavbar();
    } else {
      window.addEventListener("load", initNavbar);
    }

    // The header is re-rendered by a soft navigation, which drops the injected
    // categories bar; re-add it whenever the DOM settles rather than only once at load.
    if (document.body) {
      var navTimer;
      new MutationObserver(function () {
        if (document.querySelector(".akkad-categories-nav")) return;
        clearTimeout(navTimer);
        navTimer = setTimeout(initNavbar, 400);
      }).observe(document.body, {
        childList: true,
        subtree: true
      });
    }

  } catch (error) {
    console.error("Error in GTM akkad.js execution:", error);
  }
})();
