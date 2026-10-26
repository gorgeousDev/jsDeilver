const STORAGE_KEY = "akkad_categories";

function safeCategoryHref(value, origin, URLConstructor) {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URLConstructor(value, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}

export function initCategoryNavigation({ document, dom, navigation, window }) {
  let savedCategories = [];

  function readCategories() {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      savedCategories = data ? JSON.parse(data) : [];
      if (!Array.isArray(savedCategories)) savedCategories = [];
    } catch (error) {
      savedCategories = [];
      window.console.warn("[Akkad] Could not read saved category navigation.", error);
    }
  }

  function saveCategories() {
    const cards = document.querySelectorAll(".default_category_card");
    if (!cards.length) return;

    const categories = [];
    for (const card of cards) {
      const name = card.querySelector("h4")?.textContent.trim() || "";
      const anchor = card.closest("a");
      let link = anchor?.href || "";
      if (!link) {
        const match = (card.getAttribute("onclick") || "").match(/'([^']+)'/);
        if (match) link = match[1];
      }
      if (name && link) categories.push({ name, link });
    }

    if (!categories.length) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      savedCategories = categories;
    } catch (error) {
      window.console.warn("[Akkad] Could not save category navigation.", error);
    }
  }

  function buildNavigation() {
    const header = document.querySelector("header");
    if (!header || !savedCategories.length) return;

    let nav = document.querySelector(".akkad-categories-nav");
    if (nav && nav.previousElementSibling === header) return;
    nav?.remove();

    nav = document.createElement("nav");
    nav.className = "akkad-categories-nav";
    nav.setAttribute("aria-label", "روابط الأقسام");
    const inner = document.createElement("div");
    inner.className = "akkad-categories-inner";

    const links = [{ href: "/", name: "الرئيسية" }];
    for (const category of savedCategories) {
      if (!category || typeof category.name !== "string") continue;
      const href = safeCategoryHref(category.link, window.location.origin, window.URL);
      if (href) links.push({ href, name: category.name });
    }

    for (const item of links) {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.name;
      inner.appendChild(link);
    }
    nav.appendChild(inner);
    header.insertAdjacentElement("afterend", nav);
  }

  function refresh() {
    saveCategories();
    if (!savedCategories.length) readCategories();
    buildNavigation();
  }

  readCategories();
  const stopCards = dom.subscribe(".default_category_card", refresh);
  const stopHeaders = dom.subscribe("header", buildNavigation);
  const stopNavigation = navigation.subscribe(refresh);

  return () => {
    stopCards();
    stopHeaders();
    stopNavigation();
    document.querySelector(".akkad-categories-nav")?.remove();
  };
}
