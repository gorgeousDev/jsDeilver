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
  example `{ features: { darkMode: true } }`. Features are opt-in unless their
  registration explicitly sets `enabledByDefault: true`.
- The `videoLazy` feature is currently enabled by default. It removes autoplay
  from existing and newly inserted videos and disconnects its observer during
  cleanup.
- The `sliderDrag` feature is currently enabled by default. It adds delegated
  pointer dragging, click suppression after a drag, and momentum to Akkad
  slider viewports.
- Add a feature module under `features/` and register it from
  `features/index.js`. Its `init(context)` can return a cleanup function.
- Use the shared `context.dom.subscribe(selector, callback)` service for
  existing and dynamically inserted elements. It owns one MutationObserver,
  switches from the document root to the body when the body becomes available,
  and disconnects when there are no active subscriptions.
- Use `context.events.on(type, selector, callback, options)` for delegated
  document events. Matching subscriptions with the same event options share a
  single document listener and receive an unsubscribe function.
- The entry logs its resource download duration when browser timing data is
  available, and its synchronous initialization duration. Remove this
  temporary diagnostic after feature testing is complete.
- Keep initialization page-aware and inexpensive. Avoid global polling and
  document-wide observers unless a feature demonstrably needs them. Do not
  use client-side changes as a substitute for server-rendered, SEO-critical
  content or store-side business rules.

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
   matching elements, while `delegated-events.js` shares document listeners.

For example, `video-lazy.js` subscribes to `video[autoplay]`; it does not know
how the observer is created or whether the video already existed. The slider
feature uses delegated pointer events because pointer interactions happen on
many changing elements, but one document listener can handle them all.
