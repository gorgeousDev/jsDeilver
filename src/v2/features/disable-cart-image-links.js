const IMAGE_LINK_SELECTOR = '[data-cart="item-image-wrapper"]';

export function initDisableCartImageLinks({ events, navigation, window }) {
  function isCartRoute(pathname = window.location.pathname) {
    return pathname === "/cart" || pathname.startsWith("/cart/") ||
      pathname.startsWith("/checkout");
  }

  const stopClick = events.on("click", IMAGE_LINK_SELECTOR, (event) => {
    if (!isCartRoute()) return;
    event.preventDefault();
    event.stopPropagation();
  }, { capture: true });

  return () => stopClick();
}
