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

    loadFeature("akkad-gallery-controls");

    loadFeature("akkad-copy-link");

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
