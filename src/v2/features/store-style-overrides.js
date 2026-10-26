import storeOverridesCss from "../styles/store-overrides.css";

export function initStoreStyleOverrides({ styles }) {
  return styles.add("akkad-v2-store-overrides-css", storeOverridesCss);
}
