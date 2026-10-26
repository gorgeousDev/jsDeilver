(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var modulesBase = selfSrc
    ? selfSrc.replace(/[^\/]*$/, "")
    : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
  var versionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var version = versionMatch ? "?v=" + versionMatch[1] : "";
  var script = document.createElement("script");

  script.src = modulesBase + "dist/akkad-features.js" + version;
  script.async = true;
  script.onerror = function () {
    console.error("[Akkad] failed to load feature bundle:", script.src);
  };
  document.head.appendChild(script);
})();
