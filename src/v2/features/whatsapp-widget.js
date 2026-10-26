const SCRIPT_URL = "https://cdn.pickyassist.com/WhatsApp/embed.js";
const WIDGET_CONFIG = Object.freeze({
  t: "Icon-Only-Black",
  s: "",
  i: "WhatsApp Us",
  a: "animation-Floating",
  n: "201508331823",
  m: "مرحبًا، لدي بعض الأسئلة قبل إتمام عملية الشراء.",
  w: 3,
  b: "#44174E",
  c: "#ffffff",
  mr: "0",
  ml: "0",
  mb: "0",
  z: "9999",
  p: "position-right"
});

export function initWhatsAppWidget({ document, window }) {
  const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
  const script = existing || document.createElement("script");
  let retryTimer = 0;
  let attempts = 0;
  let active = true;

  function initialize() {
    if (!active) return;
    if (typeof window._waBtn === "function") {
      try {
        window._waBtn(WIDGET_CONFIG);
      } catch (error) {
        window.console.error("[Akkad] WhatsApp widget initialization failed.", error);
      }
      return;
    }
    if (attempts >= 25) {
      window.console.error("[Akkad] WhatsApp widget API did not become available.");
      return;
    }
    attempts += 1;
    retryTimer = window.setTimeout(initialize, 200);
  }

  function onScriptError() {
    window.console.error("[Akkad] Failed to load the WhatsApp widget script.");
  }

  if (!existing) {
    script.src = SCRIPT_URL;
    script.async = true;
    script.addEventListener("error", onScriptError, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }
  retryTimer = window.setTimeout(initialize, 500);

  return () => {
    active = false;
    window.clearTimeout(retryTimer);
    if (!existing) script.removeEventListener("error", onScriptError);
  };
}
