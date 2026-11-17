# Plan — gh-SwapnilRSharma-notes-app-54

<!-- factory:plan v=1 -->

## Design

Add multi-theme support by centralizing all colors into CSS custom properties and providing per-theme overrides via a `data-theme` attribute on `document.documentElement`. Keep the current blue palette as the default (no attribute) for backward compatibility, and introduce additional palettes (e.g., green and purple) by overriding the same variable names under `:root[data-theme="<name>"]`. To allow themes to affect the page background, refactor the hard-coded body gradient into variables as well.

Expose a small theme selector in the app header (a labeled `<select>`) to switch themes at runtime. Persist the user’s choice in `localStorage` and apply it on load by setting `document.documentElement.dataset.theme`. If the stored theme is missing or invalid, fall back to the default (blue). Keep the implementation minimal by handling the selector directly in `App.jsx` (no extra global state library).

Verification is via a Playwright E2E test that: (1) confirms the default theme, (2) changes the theme and asserts a visible style change (e.g., computed background color of a card), and (3) reloads to confirm persistence. No server changes are required.

## Tasks

- [ ] `t1` Add CSS variables and per-theme overrides
  - intent: Define background gradient variables and create `:root[data-theme]` overrides for additional palettes while keeping the existing blue palette as default.
  - files: `web/src/styles.css`
  - acceptance: Changing `document.documentElement.dataset.theme` updates visible colors without touching component markup.
- [ ] `t2` Add theme selector with persistence
  - intent: Add a `<select aria-label="Theme">` in the app header to switch themes; store the selection in `localStorage` and apply it on load with a safe fallback.
  - files: `web/src/App.jsx`
  - acceptance: Switching the selector visibly changes styles; a reload preserves the chosen theme.
- [ ] `t3` Playwright E2E: theme switch and persistence
  - intent: Add a test that verifies default theme colors, switches to another theme and observes a style change (e.g., `.card` background), then reloads to confirm persistence.
  - files: `e2e/theme.spec.js`
  - acceptance: The new E2E test passes locally alongside existing tests.
- [ ] `t4` Update README with theme usage
  - intent: Document available themes, how to switch them, and how to add a new palette by extending the CSS overrides.
  - files: `README.md`
  - acceptance: README has a short "Themes" section with usage and extension guidance.
