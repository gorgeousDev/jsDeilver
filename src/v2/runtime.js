import { getFeatures } from "./features/registry.js";
import { createDelegatedEvents } from "./core/delegated-events.js";
import { createDomObserver } from "./core/dom-observer.js";
import { createNavigation } from "./core/navigation.js";
import { createStyleManager } from "./core/style-manager.js";
import { installBaseStyles } from "./styles/index.js";

const RUNTIME_KEY = "__akkadV2Runtime";

export function start(config) {
  // Protect against duplicate script tags or repeated entry initialization.
  if (window[RUNTIME_KEY]) return window[RUNTIME_KEY];

  const runtime = {
    cleanups: [],
    stopped: false,
    stop() {
      if (runtime.stopped) return;
      runtime.stopped = true;
      for (const cleanup of runtime.cleanups.reverse()) {
        try {
          cleanup();
        } catch (error) {
          console.error("[Akkad] Runtime cleanup failed.", error);
        }
      }
      runtime.cleanups.length = 0;
      if (window[RUNTIME_KEY] === runtime) delete window[RUNTIME_KEY];
    }
  };
  window[RUNTIME_KEY] = runtime;

  // Features receive services rather than constructing global observers and
  // listeners themselves. This keeps setup consistent and cleanup centralized.
  const context = {
    config,
    document,
    dom: createDomObserver(document, window),
    events: createDelegatedEvents(document),
    navigation: createNavigation(window),
    styles: createStyleManager(document),
    window
  };

  runtime.cleanups.push(context.dom.destroy);
  runtime.cleanups.push(context.events.destroy);
  runtime.cleanups.push(context.navigation.destroy);
  runtime.cleanups.push(context.styles.destroy);
  // Install base CSS before feature initialization so header styling is ready
  // without a second stylesheet request or a separate admin <link> tag.
  installBaseStyles(context.styles);

  for (const feature of getFeatures()) {
    // Explicit config overrides the feature's default, including `false`.
    const isEnabled = config.features[feature.id] ?? feature.enabledByDefault;
    if (!isEnabled) continue;

    // Feature setup stays isolated; its returned function is called during
    // runtime teardown, if the storefront later adds that lifecycle.
    try {
      const cleanup = feature.init(context);
      if (typeof cleanup === "function") {
        runtime.cleanups.push(cleanup);
      }
    } catch (error) {
      console.error(`[Akkad] Feature initialization failed: ${feature.id}`, error);
    }
  }

  return runtime;
}
