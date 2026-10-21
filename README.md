# Akkad store modules

Browser scripts and stylesheets injected into the Akkad storefront
(`https://www.akkad.one`), which runs on the **EasyOrders** platform with the
**Fasty** theme (Next.js 4 + Tailwind).

There is no build step and no bundler. Everything here is a **classic script**
or a plain stylesheet, served straight from GitHub through jsDelivr.

## How it reaches the live site

EasyOrders renders a `header_code` field from its admin panel into the page
body, before `.app_container`. That field is the only place the store's
JavaScript is loaded from - Google Tag Manager on this store carries analytics
only (GA4 `G-2PR1Z69BE5` and the Meta pixel).

The current `header_code` block:

```html
<meta name="google-site-verification" content="fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME" />
<script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/header.css?v=8">
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad-v2.js?v=15"></script>
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad-dark-mode.js?v=7"></script>
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/checkout-restyle.js?v=23"></script>
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad-slider-drag.js?v=10"></script>
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/promo.js?v=2"></script>
<script src="https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/video-lazy.js?v=1"></script>
<style> /* .bundles_item purple glow - keep as is */ </style>
```

Two things follow from this, and they shape every file in `src/modules`:

1. **The scripts run before the app exists.** The block is injected inside
   `<div id="__next">`, ahead of `.app_container`. When the scripts execute,
   React has rendered nothing yet - on `/checkout` the server sends an empty
   container and every checkout node is built client-side. That is why the
   code is built around `MutationObserver` and retries: it is reacting to a
   framework that has not painted yet, not working around carelessness.
2. **`document.currentScript` is load-bearing.** `akkad-v2.js` reads its own
   `src` to work out which directory to load `akkad.js` and the stylesheets
   from, so they always come from the same commit as the script itself. Do
   not convert these files to ES modules - `document.currentScript` is `null`
   in a module and the whole chain breaks.

## Deploying a change

jsDelivr caches `@main`, so a push is not enough on its own - the `?v=` query
string is the cache-buster.

1. Commit and push to `main`.
2. Bump **one** number and use it for every file in the `header_code` block:

   ```
   https://cdn.jsdelivr.net/gh/gorgeousDev/jsDeilver@main/src/modules/akkad-v2.js?v=16
   ```

   `akkad.js` and the stylesheets pick the same token up automatically - they
   read it from the URL that loaded them - so one number covers all of them.

   Use one number for everything. When each file carried its own token, a
   deploy could leave `akkad-v2.js` on one version and `checkout-restyle.js` on
   another, and `akkad.js` had no token at all, so the CDN was free to serve it
   long after everything else had moved on.

3. Paste the updated block into **EasyOrders admin → header_code**.

## Checks

```bash
npm run check
```

Parses every shipped script with `vm.Script`, which is the classic-script
goal - the same one the browser uses. `node --check` is not enough: it reads a
`.js` file as CommonJS and accepts a top-level `return` that a browser
rejects, which is how `gallery-thumbnails.js` reached the repository
unparsable.

## Files

| File | What it does |
| --- | --- |
| `src/modules/akkad-v2.js` | The main tag: counters, home sections, gallery, sliders, payment order, funnel prices, office-supplies sections. |
| `src/modules/akkad.js` | Loaded by `akkad-v2.js`. Product gallery and thumbnails, header, categories nav, stylesheet loading. |
| `src/modules/akkad-dark-mode.js` | Dark theme, palette, and the contrast sweep that lifts low-contrast text on dark surfaces. |
| `src/modules/checkout-restyle.js` | Checkout and thanks page: palette, invoice table, coupon, input labels. |
| `src/modules/akkad-slider-drag.js` | Pointer drag and momentum on the home sliders. |
| `src/modules/promo.js` | Discount cap and coupon handling. |
| `src/modules/video-lazy.js` | Stops autoplay on videos that are off screen. |
| `src/modules/*.css` | Header, footer, gallery, slider and product-card styles. Loaded by `akkad.js`; `header.css` is also linked from `header_code`. |

## Rules for editing these files

- Never remove a node React owns. Hide it with `display:none !important`
  instead - removing it makes React re-render, remount, and re-hit its API.
- Anything that ends up in the DOM is built with `createElement` and
  `textContent`, never by interpolating into `innerHTML`. Category names,
  product titles and the `order_id` query parameter are all untrusted input.
- React can re-create the node you just built, so re-query it on every tick
  rather than caching a reference.
