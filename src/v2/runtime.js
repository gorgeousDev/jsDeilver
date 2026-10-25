import { getFeatures } from "./features/registry.js";

const RUNTIME_KEY = "__akkadV2Runtime";

export function start(config) {
  if (window[RUNTIME_KEY]) return;

  const runtime = { cleanups: [] };
  window[RUNTIME_KEY] = runtime;

  const context = {
    config,
    document,
    window
  };

  for (const feature of getFeatures()) {
    const isEnabled = config.features[feature.id] ?? feature.enabledByDefault;
    if (!isEnabled) continue;

    const cleanup = feature.init(context);
    if (typeof cleanup === "function") {
      runtime.cleanups.push(cleanup);
    }
  }
}
