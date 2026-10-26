const PANEL_SELECTOR = 'div[id^="headlessui-popover-panel"]';
const COPY_CLASS = "akkad-copy";

export function initProductCopyLink({ document, dom, events, navigation, window }) {
  let feedbackTimer = 0;
  let stopPanel = null;

  function addButton(panel) {
    if (!window.location.pathname.startsWith("/products/")) return;
    const container = panel.querySelector(".flex.gap-3");
    if (!container || container.querySelector(`.${COPY_CLASS}`)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `flex items-center gap-3 ${COPY_CLASS}`;
    button.setAttribute("aria-label", "نسخ رابط المنتج");
    button.innerHTML = '<i class="fa-solid fa-link h-6 w-6" aria-hidden="true"></i>';
    container.appendChild(button);
  }

  async function copyToClipboard(text) {
    if (window.navigator.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    Object.assign(textarea.style, { position: "fixed", opacity: "0" });
    document.body.appendChild(textarea);
    let copied = false;
    try {
      textarea.select();
      copied = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    if (!copied) throw new Error("The browser rejected the clipboard copy.");
  }

  async function copyLink(event, button) {
    event.preventDefault();
    if (!window.location.pathname.startsWith("/products/")) return;

    try {
      await copyToClipboard(window.location.href);
      button.style.color = "#16a34a";
      window.clearTimeout(feedbackTimer);
      feedbackTimer = window.setTimeout(() => {
        if (button.isConnected) button.style.color = "";
      }, 1500);
    } catch (error) {
      window.console.error("[Akkad] Could not copy the product link.", error);
    }
  }

  const stopClick = events.on("click", `.${COPY_CLASS}`, copyLink);
  const stopNavigation = navigation.subscribe(({ pathname }) => {
    if (!pathname.startsWith("/products/")) {
      stopPanel?.();
      stopPanel = null;
      document.querySelectorAll(`.${COPY_CLASS}`).forEach((button) => button.remove());
    } else {
      if (!stopPanel) stopPanel = dom.subscribe(PANEL_SELECTOR, addButton);
      document.querySelectorAll(PANEL_SELECTOR).forEach(addButton);
    }
  });

  return () => {
    stopPanel?.();
    stopClick();
    stopNavigation();
    window.clearTimeout(feedbackTimer);
    document.querySelectorAll(`.${COPY_CLASS}`).forEach((button) => button.remove());
  };
}
