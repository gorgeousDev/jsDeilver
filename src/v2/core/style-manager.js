export function createStyleManager(document) {
  const ownedStyles = new Set();

  function add(id, cssText) {
    if (typeof id !== "string" || !id) {
      throw new TypeError("A stylesheet requires a non-empty id.");
    }
    if (typeof cssText !== "string") {
      throw new TypeError(`Stylesheet "${id}" must be provided as text.`);
    }

    const existing = document.getElementById(id);
    if (existing) return () => {};

    const element = document.createElement("style");
    element.id = id;
    element.textContent = cssText;
    (document.head || document.documentElement).appendChild(element);
    ownedStyles.add(element);

    return () => {
      if (!ownedStyles.delete(element)) return;
      element.remove();
    };
  }

  function destroy() {
    for (const element of ownedStyles) {
      element.remove();
    }
    ownedStyles.clear();
  }

  return { add, destroy };
}
