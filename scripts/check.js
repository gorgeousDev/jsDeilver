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

console.log(`OK  ${scripts.length} file(s) parse as classic scripts.`);
