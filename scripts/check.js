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

function verifyFeatureEntry(entryName, pathname, expectedLayers, manifest) {
  const entryPath = path.join(MODULES_DIR, entryName);
  const currentScript = {
    src: `https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/${entryName}?v=15`
  };
  const appended = [];
  const location = {
    pathname,
    href: `https://www.akkad.one${pathname}`
  };
  const window = {
    location,
    history: {
      pushState(state, title, url) {
        location.href = new URL(url, location.href).href;
        location.pathname = new URL(location.href).pathname;
      },
      replaceState(state, title, url) {
        location.href = new URL(url, location.href).href;
        location.pathname = new URL(location.href).pathname;
      }
    },
    addEventListener() {},
    dispatchEvent() {}
  };
  const document = {
    currentScript,
    createEvent() {
      return { initEvent(type) { this.type = type; } };
    },
    createElement() {
      return {};
    },
    head: {
      appendChild(script) {
        appended.push(script);
      }
    }
  };
  const context = vm.createContext({ document, window, console, URL, setTimeout: (callback) => callback() });
  const source = fs.readFileSync(entryPath, "utf8");

  new vm.Script(source, { filename: entryPath }).runInContext(context);

  const bundleFile = (layer) => layer === "akkad" ? "akkad-features.js" : `akkad-${layer}.js`;
  const expectedUrls = expectedLayers.map(
    (layer) => `https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/dist/${bundleFile(layer)}?v=15`
  );
  const bundleScripts = appended.filter((script) => script.src.includes("/dist/"));
  assert.deepStrictEqual(
    bundleScripts.map((script) => script.src),
    expectedUrls,
    `${entryName} should load only the route layers for ${pathname} with the entry version`
  );
  for (const script of bundleScripts) {
    assert.strictEqual(
      script.async,
      entryName === "akkad.js",
      `${script.src} should use the appropriate async strategy`
    );
  }

  for (const layer of expectedLayers) {
    const bundleName = bundleFile(layer);
    const bundlePath = path.join(MODULES_DIR, "dist", bundleName);
    assert(fs.existsSync(bundlePath), `${bundleName} should exist`);
    const bundle = fs.readFileSync(bundlePath, "utf8");
    for (const name of manifest[layer]) {
      assert(bundle.includes(`/* ${name} */`), `${bundleName} should contain ${name}`);
    }
  }

  if (entryName === "akkad-v2.js") {
    const beforeNavigation = bundleScripts.length;
    window.history.pushState({}, "", "/products/example");
    assert(
      appended.some((script) => script.src.endsWith("/dist/akkad-product.js?v=15")),
      "akkad-v2.js should load the product layer on SPA navigation"
    );
    assert(
      appended.filter((script) => script.src.endsWith("/dist/akkad-core.js?v=15")).length === 1,
      "akkad-v2.js should load the core layer only once"
    );
    assert(beforeNavigation <= appended.length, "SPA route dispatch should retain previously loaded layers");
  }

  return appended;
}

const manifest = JSON.parse(fs.readFileSync(path.join(MODULES_DIR, "features", "manifest.json"), "utf8"));
verifyFeatureEntry("akkad.js", "/", ["akkad"], manifest);
verifyFeatureEntry("akkad-v2.js", "/", ["core", "home"], manifest);
verifyFeatureEntry("akkad-v2.js", "/products/example", ["core", "product"], manifest);
verifyFeatureEntry("akkad-v2.js", "/checkout", ["core", "cart", "checkout"], manifest);
verifyFeatureEntry("akkad-v2.js", "/funnels/example", ["core", "funnel"], manifest);
verifyFeatureEntry("akkad-v2.js", "/collections/office-supplies", ["core", "office"], manifest);
verifyFeatureEntry(
  "akkad-v2.js",
  "/products/high-school-graduation-gift-classic-design-2026",
  ["core", "product", "graduation"],
  manifest
);

const officeFeature = fs.readFileSync(
  path.join(MODULES_DIR, "features", "v2-office-supplies-sections.js"),
  "utf8"
);
assert(!officeFeature.includes("setInterval("), "the office feature should not rely on polling intervals");

console.log(`OK  ${scripts.length} file(s) parse as classic scripts; route layers load in order with shared versions.`);
