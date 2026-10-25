# Akkad storefront v2

This directory is the new source project. Existing storefront scripts and
stylesheets remain untouched under `src/modules`.

## Design

- `entry.js` is the single application entry point.
- Source files use ES modules and are intended to be bundled into one browser
  script before deployment. The deployed script should be loaded from `<head>`
  with `defer`, so it does not block HTML parsing.
- `defer` runs the entry after HTML parsing, but Next.js can still render or
  replace page elements afterward. Feature modules must therefore support
  targets appearing later instead of assuming they exist at startup.
- `config.js` reads optional feature flags from `window.AkkadV2Config`, for
  example `{ features: { darkMode: false } }`. Each feature has a default;
  an explicit boolean setting overrides that default.
- The `videoLazy` feature is currently enabled by default. It removes autoplay
  from existing and newly inserted videos and disconnects its observer during
  cleanup.
- The `sliderDrag` feature is currently enabled by default. It adds delegated
  pointer dragging, click suppression after a drag, and momentum to Akkad
  slider viewports.
- The `darkMode` feature is enabled by default. It follows the operating-system
  preference until the visitor chooses a mode, remembers that choice, adds a
  hydration-safe header toggle, and applies the storefront palette from
  `styles/dark-mode.css`.
- The `checkoutRestyle` feature migrates checkout presentation and interactions
  into v2. It styles EasyOrders' native invoice, mobile cart controls, payment
  details, and the existing thank-you page. It does not generate a custom
  checkout invoice.
- The `promo` feature is enabled by default. It caps displayed checkout
  savings at EGP 200 across both standard invoice copies and the mobile
  collapsed summary, and adjusts each displayed total. This is a storefront
  display change; backend/payment calculations remain authoritative.
- The runtime injects `styles/header.css` from the entry bundle. The separate
  legacy `header.css` `<link>` is not needed when this entry is deployed.
- Add a feature module under `features/` and register it from
  `features/index.js`. Its `init(context)` can return a cleanup function.
- Use the shared `context.dom.subscribe(selector, callback)` service for
  existing and dynamically inserted elements. It owns one MutationObserver,
  switches from the document root to the body when the body becomes available,
  and disconnects when there are no active subscriptions.
- Use `context.dom.observe(node, callback, options)` for narrowly scoped
  mutations inside a feature-owned target. The core tracks these observers and
  disconnects them with the shared DOM service.
- Use `context.events.on(type, selector, callback, options)` for delegated
  document events. Matching subscriptions with the same event options share a
  single document listener and receive an unsubscribe function.
- Use `context.navigation.subscribe(callback)` to respond to SPA route changes
  without feature-specific history wrappers or polling.
- The entry logs its resource download duration when browser timing data is
  available, and its synchronous initialization duration. Remove this
  temporary diagnostic after feature testing is complete.
- Keep initialization page-aware and inexpensive. Avoid global polling and
  document-wide observers unless a feature demonstrably needs them. Do not
  use client-side changes as a substitute for server-rendered, SEO-critical
  content or store-side business rules.

All v2 stylesheets live in `styles/`. The footer, gallery, header,
product-card, and slider files are v2-maintained copies of the legacy module
stylesheets; the originals remain unchanged. `styles/index.js` registers the
header stylesheet as a base style, while `dark-mode.js` bundles `tokens.css`
and `dark-mode.css`. Other styles join the entry only when their owning feature
imports them.

The style refactor groups repeated dark-theme colors into design tokens,
removes an overly broad footer rule that painted every descendant the same
background, consolidates conflicting product-image rules, scopes mobile
product/gallery adjustments to stable project classes, and fixes the home
slider's one-line title clamp.

## Entry script contract

The source entry point uses ES module imports and is not itself the deployable
classic script. Bundle it into one self-contained browser file, then include
that file once in the storefront `<head>`:

```html
<script src="https://cdn.example.com/akkad-v2.min.js" defer></script>
```

From this directory, run `npm install` once and then `npm run build` to create
`dist/akkad-v2.min.js`. Keep this directory independent of the existing
`src/modules` files.

## Reading the startup flow

1. `entry.js` imports the feature registrations, reads optional configuration,
   and calls `start`.
2. `runtime.js` prevents a second boot, creates shared DOM/event services, and
   initializes only enabled features.
3. Each feature owns its behavior and returns cleanup when it registers
   listeners or other resources.
4. The core services own shared infrastructure: `dom-observer.js` watches for
   matching elements and newly added subtrees, while `delegated-events.js`
   shares document listeners.

For example, `video-lazy.js` subscribes to `video[autoplay]`; it does not know
how the observer is created or whether the video already existed. The slider
feature uses delegated pointer events because pointer interactions happen on
many changing elements, but one document listener can handle them all.

The dark-mode feature also contains a contrast repair pass for theme text that
does not become readable through CSS utility overrides alone. Its calculations
live in `core/accessibility/contrast.js`; it scans once after a mode change and
scans only newly added DOM subtrees afterward.

The promo cap changes displayed checkout amounts only; it does not enforce a
payment limit. Remove the legacy `promo.js` and `checkout-restyle.js` script
tags when deploying the v2 replacements. The legacy checkout restyle script
also injects a custom invoice; v2 deliberately keeps EasyOrders' native invoice
as the only invoice surface.
