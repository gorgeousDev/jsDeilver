import { getFeatures } from "./features/registry.js";
import { createDomObserver } from "./core/dom-observer.js";

const RUNTIME_KEY = "__akkadV2Runtime";

export function start(config) {
  if (window[RUNTIME_KEY]) return;

  const runtime = { cleanups: [] };
  window[RUNTIME_KEY] = runtime;

  const context = {
    config,
    document,
    dom: createDomObserver(document, window),
    window
  };

  runtime.cleanups.push(context.dom.destroy);

  for (const feature of getFeatures()) {
    const isEnabled = config.features[feature.id] ?? feature.enabledByDefault;
    if (!isEnabled) continue;

    const cleanup = feature.init(context);
    if (typeof cleanup === "function") {
      runtime.cleanups.push(cleanup);
    }
  }
}
