(function () {
  var lastProductName = "";

  function getProductName() {
    var titleEl = document.querySelector("h1");
    return (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : document.title;
  }

  function fixImage(img, productName) {
    if (!img.alt || img.alt.indexOf("http://") === 0 || img.alt.indexOf("https://") === 0) {
      img.alt = productName;
    }
  }

  function fixImages(root, productName) {
    var imgs = [];
    if (root.matches && root.matches("img")) imgs.push(root);
    var descendants = root.querySelectorAll ? root.querySelectorAll("img") : [];
    for (var i = 0; i < descendants.length; i++) imgs.push(descendants[i]);

    for (var i = 0; i < imgs.length; i++) {
      fixImage(imgs[i], productName);
    }
  }

  function fixAllImages(productName) {
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      fixImage(imgs[i], productName);
    }
  }

  function containsHeading(node) {
    if (!node) return false;
    if (node.nodeType === 3) node = node.parentElement;
    if (!node || node.nodeType !== 1) return false;
    return node.matches("h1") || !!node.closest("h1") || !!node.querySelector("h1");
  }

  function isHeadingMutationTarget(node) {
    if (node.nodeType === 3) node = node.parentElement;
    return !!node && node.nodeType === 1 && (node.matches("h1") || !!node.closest("h1"));
  }

  function updateForHeading() {
    var productName = getProductName();
    if (productName !== lastProductName) {
      lastProductName = productName;
      fixAllImages(productName);
    }
  }

  function processNode(node) {
    if (!node || node.nodeType !== 1) return;
    if (containsHeading(node)) {
      updateForHeading();
      return;
    }

    fixImages(node, getProductName());
  }

  var initialProductName = getProductName();
  lastProductName = initialProductName;
  fixAllImages(initialProductName);

  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      if (isHeadingMutationTarget(records[i].target)) updateForHeading();
      for (var j = 0; j < records[i].addedNodes.length; j++) {
        var node = records[i].addedNodes[j];
        if (containsHeading(node)) {
          updateForHeading();
        } else {
          processNode(node);
        }
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
