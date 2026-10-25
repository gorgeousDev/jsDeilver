(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var base = selfSrc.replace(/(?:features|dist)\/[^\/]*$/, "");
  var versionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var version = versionMatch ? "?v=" + versionMatch[1] : "";

  var fallback = "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@a31398856c2e7c74374c46c5ca28006573b6d04d/src/modules/";
  var files = [
    "product-card.css",
    "gallery.css",
    "slider.css",
    "header.css",
    "footer.css"
  ].map(function (file) {
    return (base || fallback) + file + version;
  });
  files.push("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");

  function stylesheetLoaded(href) {
    var path = href.split("?")[0];
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.split("?")[0] === path) return true;
    }
    return false;
  }

  for (var i = 0; i < files.length; i++) {
    var href = files[i];
    if (stylesheetLoaded(href)) continue;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    (document.head || document.documentElement).appendChild(link);
  }
})();
