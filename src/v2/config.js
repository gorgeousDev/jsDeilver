const DEFAULT_CONFIG = Object.freeze({
  features: Object.freeze({})
});

// Treat arrays and null as invalid config objects instead of accepting them
// just because JavaScript reports their type as "object".
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getConfig() {
  // The storefront can set window.AkkadV2Config before loading the bundle.
  // Only boolean flags are accepted so a typo cannot accidentally enable a
  // feature through truthy strings such as "false".
  const supplied = window.AkkadV2Config;
  const suppliedFeatures = isRecord(supplied) && isRecord(supplied.features)
    ? supplied.features
    : {};
  const features = {};

  for (const [id, enabled] of Object.entries(suppliedFeatures)) {
    if (typeof enabled === "boolean") {
      features[id] = enabled;
    }
  }

  // Return a fresh feature map: callers can use it without mutating defaults
  // shared by every boot.
  return {
    ...DEFAULT_CONFIG,
    features
  };
}
