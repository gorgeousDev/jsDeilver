"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MODULES_DIR = path.join(ROOT, "src", "modules");
const FEATURES_DIR = path.join(MODULES_DIR, "features");
const DIST_DIR = path.join(MODULES_DIR, "dist");
const MANIFEST_PATH = path.join(FEATURES_DIR, "manifest.json");

const OUTPUTS = {
  akkad: path.join(DIST_DIR, "akkad-features.js"),
  core: path.join(DIST_DIR, "akkad-core.js"),
  home: path.join(DIST_DIR, "akkad-home.js"),
  product: path.join(DIST_DIR, "akkad-product.js"),
  cart: path.join(DIST_DIR, "akkad-cart.js"),
  checkout: path.join(DIST_DIR, "akkad-checkout.js"),
  funnel: path.join(DIST_DIR, "akkad-funnel.js"),
  office: path.join(DIST_DIR, "akkad-office.js"),
  graduation: path.join(DIST_DIR, "akkad-graduation.js")
};

function buildBundle(names, outputPath) {
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error(`Feature manifest for ${path.basename(outputPath)} must be a non-empty array`);
  }

  const seen = new Set();
  const sections = names.map((name) => {
    if (typeof name !== "string" || !/^[a-z0-9-]+$/.test(name)) {
      throw new Error(`Invalid feature name in manifest: ${name}`);
    }
    if (seen.has(name)) {
      throw new Error(`Duplicate feature in manifest: ${name}`);
    }
    seen.add(name);

    const featurePath = path.join(FEATURES_DIR, `${name}.js`);
    if (!fs.existsSync(featurePath)) {
      throw new Error(`Missing feature source: ${path.relative(ROOT, featurePath)}`);
    }

    const source = fs.readFileSync(featurePath, "utf8").trim();
    return [
      `/* ${name} */`,
      "try {",
      source,
      `} catch (error) { console.error("[Akkad] feature failed: ${name}", error); }`
    ].join("\n");
  });

  return `${sections.join("\n;\n")}\n`;
}

function run({ checkOnly = false } = {}) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const listed = new Set(Object.values(manifest).flat());
  const sourceFeatures = fs.readdirSync(FEATURES_DIR)
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.basename(file, ".js"));
  const unlisted = sourceFeatures.filter((name) => !listed.has(name));
  if (unlisted.length) {
    throw new Error(`Feature sources missing from manifest: ${unlisted.join(", ")}`);
  }

  for (const [key, outputPath] of Object.entries(OUTPUTS)) {
    const output = buildBundle(manifest[key], outputPath);
    if (checkOnly) {
      if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== output) {
        throw new Error(`${path.relative(ROOT, outputPath)} is stale; run npm run build`);
      }
      continue;
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);
    console.log(`Built ${path.relative(ROOT, outputPath)}`);
  }
}

try {
  run({ checkOnly: process.argv.includes("--check") });
} catch (error) {
  console.error(`[Akkad] ${error.message}`);
  process.exitCode = 1;
}
