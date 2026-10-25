# Akkad storefront v2

This directory is the new source project. Existing storefront scripts and
stylesheets remain untouched under `src/modules`.

## Design

- `entry.js` is the single application entry point.
- Source files use ES modules and are intended to be bundled into one browser
  script before deployment. The deployed script should be loaded from `<head>`
  with `defer`, so it does not block HTML parsing.
- The entry point waits for `DOMContentLoaded` when necessary. Feature modules
  must not assume that Next.js-rendered page elements exist at startup; they
  should initialize only when their own targets are available.
- `config.js` reads optional feature flags from `window.AkkadV2Config`, for
  example `{ features: { darkMode: true } }`. Features are opt-in unless their
  registration explicitly sets `enabledByDefault: true`.
- Add a feature module under `features/` and register it from
  `features/index.js`. Its `init(context)` can return a cleanup function.
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

The bundler and deployment URL will be wired up when the first feature is
migrated. Keep this directory independent of the existing `src/modules`
files.
