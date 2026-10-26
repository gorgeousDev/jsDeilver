import headerCss from "./header.css";
import footerCss from "./footer.css";
import galleryCss from "./gallery.css";
import productCardCss from "./product-card.css";
import sliderCss from "./slider.css";

export function installBaseStyles(styles) {
  return styles.add(
    "akkad-v2-base-css",
    [headerCss, footerCss, galleryCss, productCardCss, sliderCss].join("\n")
  );
}
