const features = new Map();

export function registerFeature(feature) {
  // Fail early at registration time so a broken feature cannot silently vanish
  // from the storefront at startup.
  if (!feature || typeof feature.id !== "string" || !feature.id) {
    throw new TypeError("A feature must have a non-empty string id.");
  }
  if (typeof feature.init !== "function") {
    throw new TypeError(`Feature "${feature.id}" must provide an init function.`);
  }
  if (features.has(feature.id)) {
    throw new Error(`Feature "${feature.id}" is already registered.`);
  }

  // Store only the supported fields and freeze the record so later code cannot
  // accidentally change how the runtime initializes this feature.
  features.set(feature.id, Object.freeze({
    id: feature.id,
    enabledByDefault: feature.enabledByDefault === true,
    init: feature.init
  }));
}

export function getFeatures() {
  // Expose a snapshot rather than the mutable registry Map itself.
  return [...features.values()];
}
