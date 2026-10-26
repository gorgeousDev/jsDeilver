import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const SLUG = "office-supplies";
const CATEGORY_ID = "c340b549-b502-4052-9828-3485543191be";
const API_URL = "https://api.easy-orders.net/api/v1/products";
const GRID_SELECTOR = ".category_products_grid_container, [class*='category_products_grid']";
const PATH_PREFIXES = new Set(["collections", "category", "categories", "c", "shop", "store"]);

const BUCKETS = [
  {
    key: "study",
    title: "احصل على افضل ادوات للدراسة ✏️",
    keywords: ["casio", "كاسيو", "fx-", "calculator", "حاسبة", "multi-office", "مالتي أوفيس", "copy-paper", "ورق طباعة", "ورق a4"]
  },
  { key: "stickers", title: "ستيكرز A6", keywords: ["sticker", "ستيكر", "ملصق"] },
  {
    key: "notebook-tickets",
    title: "تيكتات شخصية لكل كراسة 📝",
    keywords: ["notebook-ticket", "تيكتات", "تيكت", "تذكرة", "كراسات"]
  },
  { key: "notebooks", title: "📒 نوت بوك بتصميمات مميزة", keywords: ["notebook"] },
  { key: "general", title: "منتجات عملية لكل يوم ☕", keywords: [] }
];
const RENDER_ORDER = ["study", "stickers", "general", "notebook-tickets", "notebooks"];

const OFFICE_CSS = `
.akkad-products-section{width:100%;margin:0 0 38px;position:relative}
.akkad-section-header{width:100%;display:flex;align-items:center;justify-content:space-between;direction:rtl;margin-bottom:12px;padding:0 4px;box-sizing:border-box}
.akkad-section-title{margin:0;padding:0;font-size:20px;line-height:1.4;font-weight:800}
.akkad-slider{width:100%;position:relative}
.akkad-slider-viewport{width:100%;overflow-x:auto;overflow-y:visible;direction:ltr;scroll-behavior:smooth;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.akkad-slider-viewport::-webkit-scrollbar{display:none}
.akkad-slider-track{display:flex;flex-wrap:nowrap;align-items:stretch;gap:8px;width:max-content;direction:ltr}
.akkad-slider-item{flex:0 0 calc((100vw - 48px)/4);width:calc((100vw - 48px)/4);min-width:0;box-sizing:border-box}
.akkad-slider-item .fasty_product_card,.akkad-grid-cell .fasty_product_card{width:100%!important;max-width:100%!important;box-sizing:border-box}
.akkad-products-section .akkad-arrow{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18);z-index:10;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;line-height:1;padding:0}
.akkad-products-section .akkad-prev{left:4px}.akkad-products-section .akkad-next{right:4px}.akkad-products-section .akkad-arrow:disabled{opacity:.3;cursor:default;pointer-events:none}
.akkad-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.akkad-grid-cell{min-width:0;box-sizing:border-box}
.akkad-toggle-all{display:block;margin:16px auto 8px;padding:9px 22px;font-family:inherit;font-size:13px;font-weight:600;color:#fff;background:#44174E;border:0;border-radius:999px;cursor:pointer}
@media(max-width:900px){.akkad-slider-item{flex-basis:calc((100vw - 32px)/3);width:calc((100vw - 32px)/3)}.akkad-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.akkad-slider-item{flex-basis:calc((100vw - 24px)/2);width:calc((100vw - 24px)/2)}.akkad-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.akkad-section-title{font-size:18px}.akkad-products-section .akkad-arrow{width:30px;height:30px;font-size:20px}}
`;

function normalizeSlug(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/products\//, "")
    .split(/[/?#]/, 1)[0];
  return slug && slug !== "." && slug !== ".." ? slug : "";
}

export function initOfficeSuppliesSections({ document, dom, navigation, styles, window }) {
  let products = [];
  let active = false;
  let showAll = false;
  let requestController = null;
  let gridObserverCleanup = null;
  let gridElement = null;
  let buildTimer = 0;
  let savedGridDisplay = null;
  let gridStyleSaved = false;
  let savedPagination = new Map();
  let generatedSections = [];
  const removeStyle = styles.add("akkad-v2-office-supplies-css", OFFICE_CSS);

  function isOfficePage(pathname = window.location.pathname) {
    const segments = pathname.toLowerCase().replace(/\/+$/, "").split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === SLUG) return true;
    if (segments.length === 2 && PATH_PREFIXES.has(segments[0]) && segments[1] === SLUG) return true;
    return false;
  }

  function getGrid() {
    return document.querySelector(GRID_SELECTOR);
  }

  function readProductsFromGrid(grid) {
    if (!grid) return [];
    return Array.from(grid.querySelectorAll(".fasty_product_card")).map((card) => {
      const link = card.querySelector('a[href*="/products/"]');
      if (!link) return null;
      return {
        slug: normalizeSlug(link.getAttribute("href")),
        name: card.querySelector(".fasty_product_card_name")?.textContent.replace(/\s+/g, " ").trim() || "",
        thumb: card.querySelector("img")?.getAttribute("src") || "",
        priceText: card.querySelector(".fasty_product_card_price")?.textContent.replace(/\s+/g, " ").trim() || "",
        price: null,
        sale_price: null
      };
    }).filter(Boolean);
  }

  async function fetchProducts(signal) {
    const params = new URLSearchParams({
      limit: "100",
      page: "1",
      sort: "position,desc",
      fields: "id,name,thumb,price,sale_price,sale_end_date,slug,position,disable_orders_for_no_stock,quantity,is_free_shipping",
      category_id: CATEGORY_ID,
      join: "variants",
      theme_key: "fasty"
    });
    const response = await window.fetch(`${API_URL}?${params}`, {
      headers: { Accept: "application/json" },
      signal
    });
    if (!response.ok) throw new Error(`Product API returned HTTP ${response.status}.`);
    const json = await response.json();
    const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : null;
    const products = list?.filter((product) =>
      product && typeof product === "object" && !Array.isArray(product)
    ) || [];
    if (!products.length) throw new Error("Product API returned an empty collection.");
    return products;
  }

  function classify(product) {
    const text = `${product.slug || ""} ${product.name || ""}`.toLowerCase();
    for (const bucket of BUCKETS.slice(0, -1)) {
      if (bucket.keywords.some((word) => text.includes(word.toLowerCase()))) return bucket.key;
    }
    return "general";
  }

  function groupedProducts() {
    const groups = new Map(BUCKETS.map((bucket) => [
      bucket.key,
      { ...bucket, products: [] }
    ]));
    for (const product of products) groups.get(classify(product)).products.push(product);
    return RENDER_ORDER.map((key) => groups.get(key)).filter((group) => group.products.length);
  }

  function getTemplate(grid) {
    return grid?.querySelector(".fasty_product_card") ||
      document.querySelector(".fasty_product_card");
  }

  function hasSale(product) {
    if (product.sale_price === undefined || product.sale_price === null || product.sale_price === "") return false;
    if (product.price === undefined || product.price === null || product.price === "") return true;
    return Number(product.sale_price) < Number(product.price);
  }

  function createPrice(box, product, currency) {
    box.replaceChildren();
    const amount = (value, className) => {
      const span = document.createElement("span");
      span.className = className;
      span.append(document.createTextNode(String(value)));
      const unit = document.createElement("span");
      unit.className = "font-[inherit]";
      unit.textContent = currency;
      span.appendChild(unit);
      return span;
    };
    if (hasSale(product)) {
      box.append(amount(product.sale_price, "text-red-400 flex items-center gap-1"));
      const original = amount(product.price, "font-normal text-gray-800 opacity-60 sm:text-base flex items-center gap-1");
      const del = document.createElement("del");
      del.className = original.className;
      del.append(...original.childNodes);
      box.appendChild(del);
    } else if (product.price !== undefined && product.price !== null && product.price !== "") {
      box.appendChild(amount(product.price, "text-heading flex items-center gap-1"));
    } else {
      const text = document.createElement("span");
      text.className = "text-heading";
      text.textContent = product.priceText || "";
      box.appendChild(text);
    }
  }

  function createCard(product, template, currency) {
    const card = template.cloneNode(true);
    card.removeAttribute("data-akkad-order");
    card.removeAttribute("data-akkad-section");
    card.removeAttribute("style");
    const slug = normalizeSlug(product.slug);
    if (!slug || !/^[\p{L}\p{N}_%-]+$/u.test(slug)) return null;

    const href = `/products/${slug}`;
    const link = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
    if (link) {
      link.href = href;
      link.title = product.name || "";
    }
    const image = card.querySelector("img");
    if (image && product.thumb) {
      image.src = product.thumb;
      image.alt = product.name || "";
      image.loading = "lazy";
    }
    const name = card.querySelector(".fasty_product_card_name");
    if (name) name.textContent = product.name || "";
    const price = card.querySelector(".fasty_product_card_price");
    if (price) createPrice(price, product, currency);

    card.querySelectorAll(".akkad-sale-tag, .akkad-sale-badge").forEach((tag) => tag.remove());
    if (hasSale(product) && link) {
      const tag = document.createElement("span");
      tag.className = "akkad-sale-tag";
      tag.setAttribute("aria-hidden", "true");
      tag.innerHTML = "<span>SALE</span>";
      link.appendChild(tag);
    }
    const buttonBox = card.querySelector(".fasty_product_card_btn_container");
    if (buttonBox) {
      buttonBox.querySelector(".fasty_product_card_wishlist_btn")?.remove();
      const button = buttonBox.querySelector(".fasty_product_card_btn");
      if (button) {
        const anchor = document.createElement("a");
        anchor.className = button.className;
        anchor.href = href;
        anchor.textContent = button.textContent.trim() || "عرض المنتج";
        button.replaceWith(anchor);
      }
    }
    return card;
  }

  function createSection(title, isGrid) {
    const section = document.createElement("section");
    section.className = "akkad-products-section";
    section.dataset.akkadSection = "true";
    const heading = document.createElement("h2");
    heading.className = "akkad-section-title";
    heading.textContent = title;
    section.appendChild(heading);
    if (isGrid) {
      const grid = document.createElement("div");
      grid.className = "akkad-grid";
      section.appendChild(grid);
      return { section, target: grid };
    }

    const slider = document.createElement("div");
    slider.className = "akkad-slider";
    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "akkad-arrow akkad-prev";
    previous.textContent = "‹";
    previous.setAttribute("aria-label", "السابق");
    const next = document.createElement("button");
    next.type = "button";
    next.className = "akkad-arrow akkad-next";
    next.textContent = "›";
    next.setAttribute("aria-label", "التالي");
    const viewport = document.createElement("div");
    viewport.className = "akkad-slider-viewport";
    const track = document.createElement("div");
    track.className = "akkad-slider-track";
    viewport.appendChild(track);
    slider.append(previous, viewport, next);
    section.appendChild(slider);

    function step() {
      return track.querySelector(".akkad-slider-item")?.getBoundingClientRect().width || viewport.clientWidth;
    }
    previous.addEventListener("click", () => viewport.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => viewport.scrollBy({ left: step(), behavior: "smooth" }));
    viewport.addEventListener("scroll", () => {
      previous.disabled = viewport.scrollLeft <= 2;
      next.disabled = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    }, { passive: true });
    return { section, target: track, slider: true };
  }

  function appendProducts(target, list, template, currency, slider) {
    for (const product of list) {
      const card = createCard(product, template, currency);
      if (!card) continue;
      const cell = document.createElement("div");
      cell.className = slider ? "akkad-slider-item" : "akkad-grid-cell";
      cell.appendChild(card);
      target.appendChild(cell);
    }
  }

  function saveAndHideGrid(grid) {
    if (!gridStyleSaved) {
      savedGridDisplay = captureInlineProperties(grid, ["display"]);
      gridStyleSaved = true;
    }
    grid.style.setProperty("display", "none", "important");
  }

  function restoreGridDisplay(grid = gridElement) {
    if (grid && gridStyleSaved) {
      restoreInlineProperties(grid, savedGridDisplay);
    }
    savedGridDisplay = null;
    gridStyleSaved = false;
  }

  function hidePagination() {
    const labels = new Set(["تحميل المزيد", "عرض المزيد", "Load more", "Show more"]);
    for (const button of document.querySelectorAll("button")) {
      if (!labels.has(button.textContent.replace(/\s+/g, " ").trim()) ||
          button.className.includes("akkad-")) continue;
      let parent = button;
      for (let i = 0; i < 4 && parent.parentElement; i += 1) {
        parent = parent.parentElement;
        if (String(parent.className).includes("text-center")) break;
      }
      if (!savedPagination.has(parent)) {
        savedPagination.set(parent, captureInlineProperties(parent, ["display"]));
      }
      parent.style.setProperty("display", "none", "important");
    }
  }

  function clearSections() {
    for (const section of generatedSections) section.remove();
    generatedSections = [];
  }

  function render() {
    const grid = getGrid();
    if (!active || !grid || !products.length || !grid.parentNode) return;
    const template = getTemplate(grid);
    if (!template) return;
    const priceBox = template.querySelector(".fasty_product_card_price");
    const currency = priceBox?.querySelector("span span")?.textContent.trim() || "ج.م";

    clearSections();
    hidePagination();
    const groups = showAll
      ? [{ title: "كل المنتجات", products }]
      : groupedProducts();
    for (const group of groups) {
      const generated = createSection(group.title, showAll);
      appendProducts(generated.target, group.products, template, currency, generated.slider);
      grid.parentNode.insertBefore(generated.section, grid);
      generatedSections.push(generated.section);
    }
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "akkad-toggle-all";
    toggle.textContent = showAll ? "إخفاء الكل" : "المزيد";
    toggle.addEventListener("click", () => {
      showAll = !showAll;
      render();
      getGrid()?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    grid.parentNode.insertBefore(toggle, grid);
    generatedSections.push(toggle);
    saveAndHideGrid(grid);
  }

  function queueRender() {
    window.clearTimeout(buildTimer);
    buildTimer = window.setTimeout(render, 150);
  }

  function stopRoute() {
    active = false;
    requestController?.abort();
    requestController = null;
    gridObserverCleanup?.();
    gridObserverCleanup = null;
    const renderedGrid = gridElement;
    gridElement = null;
    window.clearTimeout(buildTimer);
    clearSections();
    restoreGridDisplay(renderedGrid);
    for (const [element, style] of savedPagination) {
      restoreInlineProperties(element, style);
    }
    savedPagination.clear();
  }

  async function startRoute() {
    if (!isOfficePage()) {
      if (active) stopRoute();
      return;
    }
    active = true;
    const grid = getGrid();
    if (grid && grid !== gridElement) {
      gridObserverCleanup?.();
      clearSections();
      restoreGridDisplay();
      gridElement = grid;
      gridObserverCleanup = dom.observe(grid, queueRender);
      if (!products.length) products = readProductsFromGrid(grid);
    }
    if (!products.length) {
      requestController?.abort();
      const controller = new window.AbortController();
      requestController = controller;
      try {
        const fetchedProducts = await fetchProducts(controller.signal);
        if (requestController !== controller || !active || !isOfficePage()) return;
        products = fetchedProducts;
      } catch (error) {
        if (error.name === "AbortError") return;
        if (requestController !== controller || !active || !isOfficePage()) return;
        window.console.warn("[Akkad] Office collection API failed; using visible products.", error);
        products = readProductsFromGrid(getGrid());
      } finally {
        if (requestController === controller) requestController = null;
      }
    }
    render();
  }

  const stopGrid = dom.subscribe(GRID_SELECTOR, () => {
    if (active) startRoute();
  });
  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!isOfficePage(pathname)) {
      stopRoute();
      products = [];
      showAll = false;
    } else {
      startRoute();
    }
  });

  return () => {
    stopGrid();
    stopNavigation();
    stopRoute();
    removeStyle();
  };
}
