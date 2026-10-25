const DEFAULT_CONFIG = Object.freeze({
  features: Object.freeze({})
});

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getConfig() {
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

  return {
    ...DEFAULT_CONFIG,
    features
  };
}
