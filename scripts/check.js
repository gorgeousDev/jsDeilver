/* Syntax check for every script that ships to the browser.
 *
 * The store injects these files as classic scripts, so they are compiled with
 * vm.Script - the classic-script goal, the same one the browser uses - rather
 * than with `node --check`, which reads a .js file as CommonJS and therefore
 * accepts the top-level `return` that a browser rejects. gallery-thumbnails.js
 * passed `node --check` and was unparsable on the live site.
 *
 * No dependencies: `npm run check`.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const MODULES_DIR = path.join(ROOT, "src", "modules");

function collectScripts(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectScripts(full));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      found.push(full);
    }
  }
  return found;
}

const scripts = collectScripts(MODULES_DIR).sort();
const failures = [];

for (const file of scripts) {
  const source = fs.readFileSync(file, "utf8");
  try {
    // eslint-disable-next-line no-new
    new vm.Script(source, { filename: file });
  } catch (err) {
    failures.push({ file: path.relative(ROOT, file), message: err.message });
  }
}

for (const { file, message } of failures) {
  console.error(`FAIL ${file}\n     ${message}`);
}

if (failures.length) {
  console.error(`\n${failures.length} of ${scripts.length} file(s) failed to parse.`);
  process.exit(1);
}

function verifyFeatureEntry(entryName, expectedFeatures) {
  const entryPath = path.join(MODULES_DIR, entryName);
  const currentScript = {
    src: `https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/${entryName}?v=15`
  };
  const appended = [];
  const document = {
    currentScript,
    createElement() {
      return {};
    },
    head: {
      appendChild(script) {
        appended.push(script);
      }
    }
  };
  const context = vm.createContext({
    document,
    window: { location: { pathname: "/" } },
    console
  });
  const source = fs.readFileSync(entryPath, "utf8");

  new vm.Script(source, { filename: entryPath }).runInContext(context);

  const featureScripts = appended.filter((script) => script.src.includes("/features/"));
  assert.deepStrictEqual(
    featureScripts.map((script) => script.src),
    expectedFeatures.map((name) => `https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/features/${name}.js?v=15`),
    `${entryName} should load its feature manifest in order with the entry version`
  );

  for (const script of featureScripts) {
    assert.strictEqual(script.async, false, `${script.src} must preserve feature execution order`);
    assert(
      fs.existsSync(path.join(MODULES_DIR, "features", path.basename(script.src).split("?")[0])),
      `${script.src} should point to an existing feature`
    );
  }

  return appended;
}

verifyFeatureEntry("akkad.js", [
  "akkad-product-gallery",
  "akkad-stylesheets",
  "akkad-image-alt",
  "akkad-gallery-controls",
  "akkad-copy-link",
  "akkad-category-navigation"
]);

const v2Scripts = verifyFeatureEntry("akkad-v2.js", [
  "v2-google-site-verification",
  "v2-whatsapp-widget",
  "v2-store-style-overrides",
  "v2-mobile-product-grid",
  "v2-disable-cart-image-links",
  "v2-viewer-badge",
  "v2-product-details-position",
  "v2-image-preview-lightbox",
  "v2-hide-okka-heading",
  "v2-floating-live-counter",
  "v2-funnel-price-overrides",
  "v2-payment-method-order",
  "v2-graduation-gift-slider",
  "v2-sale-tags",
  "v2-office-supplies-sections",
  "v2-featured-banner-frame"
]);
assert(
  v2Scripts.some((script) => script.src === "https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad.js?v=15"),
  "akkad-v2.js should load akkad.js from the same versioned directory"
);

console.log(`OK  ${scripts.length} file(s) parse as classic scripts; feature entrypoints load their versioned manifests.`);
