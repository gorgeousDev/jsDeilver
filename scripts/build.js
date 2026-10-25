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
  akkadAll: path.join(DIST_DIR, "akkad-all-features.js")
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
  manifest.akkadAll = manifest.akkad.concat(manifest.akkadV2);

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
