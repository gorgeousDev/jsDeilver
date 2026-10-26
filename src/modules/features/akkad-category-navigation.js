(function () {
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

  function containsElement(node, selector) {
    return node.nodeType === 1 &&
      (node.matches(selector) || node.querySelector(selector));
  }

  var navTimer;
  var navObserver = null;

  function scheduleNavbarUpdate() {
    clearTimeout(navTimer);
    navTimer = setTimeout(initNavbar, 400);
  }

  function observeNavbarChanges() {
    if (navObserver) return;
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", observeNavbarChanges, { once: true });
      return;
    }

    navObserver = new MutationObserver(function (records) {
      var navExists = !!document.querySelector(".akkad-categories-nav");
      for (var i = 0; i < records.length; i++) {
        var changedNodes = navExists ? records[i].removedNodes : records[i].addedNodes;
        var selector = navExists ? ".akkad-categories-nav" : "header";

        for (var j = 0; j < changedNodes.length; j++) {
          if (containsElement(changedNodes[j], selector)) {
            scheduleNavbarUpdate();
            return;
          }
        }
      }
    });
    navObserver.observe(document.body, { childList: true, subtree: true });
  }

    // 9. Categories Navbar Execution
    if (document.readyState === "complete") {
      initNavbar();
    } else {
      window.addEventListener("load", initNavbar);
    }

    observeNavbarChanges();
    window.addEventListener("akkad:route-change", initNavbar);
})();
