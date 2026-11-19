# Plan — gh-SwapnilRSharma-notes-app-56

<!-- factory:plan v=1 -->

## Design

Add a multi-theme capability to the React/Vite web app by defining theme-scoped CSS variable sets and wiring a small theme selector in the UI. Themes will be applied by setting a `data-theme` attribute on the root `<html>` element, with CSS providing palettes for at least: Blue (current look), Light, and Dark. The default experience must remain identical to today to avoid regressions.

To avoid a flash of incorrect theme on load, an early, minimal inline script in `index.html` will set the initial theme before the bundle runs, using a saved preference from `localStorage` or falling back to system `prefers-color-scheme` (mapping to Light/Dark) when the user chooses "System". The theme selector in the app header will update the attribute live and persist the choice. Any remaining hardcoded colors in CSS will be migrated to variables to ensure consistent theming.

## Tasks

- [ ] `t1` Define theme palettes with CSS variables
  - intent: Introduce `:root[data-theme="blue"|"light"|"dark"]` blocks that define the full color variable set; keep Blue as the default to preserve current visuals.
  - files: `web/src/styles.css`, `web/index.html`
  - acceptance: With no preference saved, the app looks unchanged; toggling the `<html data-theme>` value between blue/light/dark visibly updates colors.
- [ ] `t2` Add theme selector UI and apply changes
  - intent: Add a compact selector in the app header to choose System, Blue, Light, or Dark; on change, set `document.documentElement.dataset.theme` and store the preference (`theme` and when relevant `system` mapping) in `localStorage`.
  - files: `web/src/App.jsx`
  - acceptance: Selecting a theme updates the UI immediately and persists the selection.
- [ ] `t3` Initial theme detection and no-flash load
  - intent: Before React mounts, run a tiny inline script that reads `localStorage.theme`; if set to `system` or absent, resolve to light/dark using `matchMedia('(prefers-color-scheme: dark)')` and set `<html data-theme>` accordingly to avoid a flash.
  - files: `web/index.html`
  - acceptance: Reloading the page preserves the chosen theme and applies it before first paint (no visible flash to the wrong theme).
- [ ] `t4` Migrate remaining hardcoded colors to variables
  - intent: Replace any remaining literal color hexes in shared CSS (buttons, inputs, toasts) with the defined CSS variables so all themes render coherently.
  - files: `web/src/styles.css`
  - acceptance: Visuals remain coherent across themes; no components rely on hardcoded colors outside the variable sets.
- [ ] `t5` Playwright E2E: theme selection and persistence
  - intent: Add an E2E spec that switches themes via the selector, asserts the `<html data-theme>` value and a representative computed color change, then reloads to verify persistence; sanity-check creating a note still works under a non-default theme.
  - files: `e2e/theme.spec.js`
  - acceptance: New E2E spec passes in CI alongside existing tests, validating theme switch and persistence.
