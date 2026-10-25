(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var featureBase = selfSrc
    ? selfSrc.replace(/[^\/]*$/, "")
    : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
  var featureVersionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var featureVersion = featureVersionMatch ? "?v=" + featureVersionMatch[1] : "";
  var features = [
    "akkad-product-gallery",
    "akkad-stylesheets",
    "akkad-image-alt",
    "akkad-gallery-controls",
    "akkad-copy-link",
    "akkad-category-navigation"
  ];

  for (var i = 0; i < features.length; i++) {
    var script = document.createElement("script");
    script.src = featureBase + "features/" + features[i] + ".js" + featureVersion;
    script.async = false;
    (function (featureName) {
      script.onerror = function () {
        console.error("[Akkad] failed to load feature:", featureName);
      };
    })(features[i]);
    document.head.appendChild(script);
  }
})();
