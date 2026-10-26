(function () {
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

    // 7. moveButtons Execution
    var moveBtnsObserver = null;
    var moveTimer = null;

    function syncGalleryRoute() {
      if (window.location.pathname.indexOf("/products/") !== 0) {
        if (moveBtnsObserver) moveBtnsObserver.disconnect();
        moveBtnsObserver = null;
        window.removeEventListener("resize", moveButtons);
        clearTimeout(moveTimer);
        moveTimer = null;
        return;
      }

      if (!moveBtnsObserver && document.body) {
        moveBtnsObserver = new MutationObserver(function () {
          clearTimeout(moveTimer);
          moveTimer = setTimeout(moveButtons, 100);
        });
        moveBtnsObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("resize", moveButtons);
      }

      moveButtons();
    }

    window.addEventListener("akkad:route-change", syncGalleryRoute);
    syncGalleryRoute();
})();
