(function () {
  var selfSrc = (document.currentScript && document.currentScript.src) || "";
  var featureBase = selfSrc
    ? selfSrc.replace(/[^\/]*$/, "")
    : "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/";
  var featureVersionMatch = /[?&]v=([^&#]+)/.exec(selfSrc);
  var featureVersion = featureVersionMatch ? "?v=" + featureVersionMatch[1] : "";

  function loadFeature(name) {
    var script = document.createElement("script");
    script.src = featureBase + "features/" + name + ".js" + featureVersion;
    script.async = false;
    script.onerror = function () {
      console.error("[Akkad] failed to load feature:", name);
    };
    document.head.appendChild(script);
  }

  loadFeature("akkad-product-gallery");

  // Removed goTop, load, and pageshow listeners.
  // The load event fires AFTER all resources finish loading — if the user scrolls
  // before that, goTop() scrolls them back to top. Next.js handles scroll
  // restoration natively via its router.

  try {

    // 2. Google Site Verification Meta Tag Injection
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      var meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";
      (document.head || document.documentElement).appendChild(meta);
    }

    // 3. Stylesheets
    loadFeature("akkad-stylesheets");

    loadFeature("akkad-image-alt");

    loadFeature("akkad-gallery-controls");

    loadFeature("akkad-copy-link");

    loadFeature("akkad-category-navigation");

  } catch (error) {
    console.error("Error in GTM akkad.js execution:", error);
  }
})();
