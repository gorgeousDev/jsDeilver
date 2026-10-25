(function () {
  function fixAlt() {
    var titleEl = document.querySelector("h1");
    var productName = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : document.title;
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.alt || img.alt.indexOf("http://") === 0 || img.alt.indexOf("https://") === 0) {
        img.alt = productName;
      }
    }
  }

  fixAlt();
  new MutationObserver(fixAlt).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
