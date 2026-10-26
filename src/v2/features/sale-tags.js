import saleTagCss from "../styles/sale-tags.css";
import { captureInlineProperties, restoreInlineProperties } from "../core/inline-style.js";

const TAG_CLASS = "akkad-sale-tag";
const DISCOUNT_LABEL = "تخفيضات";

export function initSaleTags({ document, dom, styles, window }) {
  const originals = new Map();
  const removeStyle = styles.add("akkad-v2-sale-tags-css", saleTagCss);

  function remember(element, properties) {
    if (!originals.has(element)) {
      originals.set(element, captureInlineProperties(element, properties));
    }
  }

  function hideDiscountLabel(span) {
    if (span.textContent.trim() !== DISCOUNT_LABEL) return;
    remember(span, ["display", "visibility"]);
    span.style.setProperty("display", "none", "important");
    span.style.setProperty("visibility", "hidden", "important");
    const parent = span.parentElement;
    if (parent && parent.children.length === 1 && parent.textContent.trim() === DISCOUNT_LABEL) {
      remember(parent, ["display", "visibility"]);
      parent.style.setProperty("display", "none", "important");
      parent.style.setProperty("visibility", "hidden", "important");
    }
  }

  function buildTag() {
    const tag = document.createElement("div");
    tag.className = TAG_CLASS;
    tag.setAttribute("aria-hidden", "true");
    tag.innerHTML = "<span>SALE</span>";
    return tag;
  }

  function processCard(card) {
    const price = card.querySelector(".fasty_product_card_price");
    if (!price?.querySelector("del")) return;
    const link = card.querySelector('a[href*="/products/"]') || card.querySelector("a");
    if (!link || link.querySelector(`.${TAG_CLASS}`)) return;
    if (window.getComputedStyle(link).position === "static") {
      remember(link, ["position"]);
      link.style.position = "relative";
    }
    link.appendChild(buildTag());
  }

  function processNode(node) {
    if (node.nodeType !== 1) return;
    if (node.matches("span")) hideDiscountLabel(node);
    node.querySelectorAll("span").forEach(hideDiscountLabel);
    node.querySelectorAll(".akkad-sale-badge").forEach((badge) => badge.remove());
    if (node.matches(".fasty_product_card")) processCard(node);
    node.querySelectorAll(".fasty_product_card").forEach(processCard);
    const containingCard = node.closest(".fasty_product_card");
    if (containingCard) processCard(containingCard);
  }

  const stopAddedNodes = dom.onNodesAdded(processNode);
  return () => {
    stopAddedNodes();
    document.querySelectorAll(`.${TAG_CLASS}, .akkad-sale-badge`).forEach((node) => node.remove());
    for (const [element, style] of originals) {
      restoreInlineProperties(element, style);
    }
    originals.clear();
    removeStyle();
  };
}
