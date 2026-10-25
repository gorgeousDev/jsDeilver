const features = new Map();

export function registerFeature(feature) {
  if (!feature || typeof feature.id !== "string" || !feature.id) {
    throw new TypeError("A feature must have a non-empty string id.");
  }
  if (typeof feature.init !== "function") {
    throw new TypeError(`Feature "${feature.id}" must provide an init function.`);
  }
  if (features.has(feature.id)) {
    throw new Error(`Feature "${feature.id}" is already registered.`);
  }

  features.set(feature.id, Object.freeze({
    id: feature.id,
    enabledByDefault: feature.enabledByDefault === true,
    init: feature.init
  }));
}

export function getFeatures() {
  return [...features.values()];
}
