# Plan — gh-SwapnilRSharma-notes-app-50

<!-- factory:plan v=1 -->

## Design

Introduce first-class dark/light theming using CSS custom properties and a theme attribute on the root element. Keep the current visual design as the dark theme and define an equivalent light palette. Consolidate hard-coded colors in the stylesheet into semantic variables (e.g., background, panel, text, muted, input, button, borders, toast variants) so both themes are expressed purely by variable values.

Select the active theme via a `data-theme` attribute on `document.documentElement` (`data-theme="dark" | "light"`). Default to dark to avoid regressions, but on page load run a minimal no-flash script that sets the attribute from a persisted user preference (in `localStorage`) or falls back to the system `prefers-color-scheme`. Provide a small toggle in the app header to switch themes at runtime; persist the choice and update the root attribute immediately.

Verify visually-critical elements (backgrounds, panels, inputs, buttons, list dividers, toasts) derive colors from variables so both themes render correctly. Add Playwright E2E that exercises the toggle, asserts theme state changes via the root attribute and a key computed style, and verifies persistence across reload.

## Tasks

- [ ] `t1` Externalize hard-coded colors to CSS variables
  - intent: Replace remaining literal color values in `styles.css` (inputs, buttons, body gradient, toast variants, etc.) with semantic variables to make themes switchable without touching component code.
  - files: `web/src/styles.css`
  - acceptance: All UI colors are defined via CSS variables; app appearance unchanged in default dark theme.
- [ ] `t2` Define dark and light theme tokens
  - intent: Keep current palette as the dark theme and add a light theme by defining variable sets under `:root` (light) and `[data-theme="dark"]` (dark) or vice versa such that toggling the attribute swaps themes.
  - files: `web/src/styles.css`
  - acceptance: Toggling `data-theme` on `<html>` between `light` and `dark` clearly switches the app’s appearance.
- [ ] `t3` No-flash theme bootstrapping on load
  - intent: Insert a small inline script before the main bundle to set `document.documentElement.dataset.theme` from `localStorage.theme` or `matchMedia('(prefers-color-scheme: dark)')` prior to first paint.
  - files: `web/index.html`
  - acceptance: Initial paint uses the correct theme without a visible flash when reloading or first visiting with a system preference.
- [ ] `t4` Add in-app theme toggle and persistence
  - intent: Add a compact toggle control in the app header to switch between light/dark, update the root `data-theme` attribute immediately, and persist selection to `localStorage`.
  - files: `web/src/App.jsx`, `web/src/styles.css`
  - acceptance: Clicking the toggle switches themes instantly and the choice persists across reloads.
- [ ] `t5` Ensure components and toasts inherit themed styles
  - intent: Verify inputs, buttons, list borders, and toast variants read their styles from variables; adjust class rules if any element remains hard-coded.
  - files: `web/src/styles.css`, `web/src/components/Toasts.jsx`, `web/src/components/NotesList.jsx`, `web/src/components/NoteForm.jsx`, `web/src/components/EditNote.jsx`
  - acceptance: All visible UI elements reflect the active theme; no unreadable text or insufficient contrast.
- [ ] `t6` Playwright E2E: theme toggle and persistence
  - intent: Add an E2E test that loads the app, asserts the default-resolved theme on `<html>`, clicks the toggle to change theme, verifies the attribute and a representative computed style change, reloads, and asserts persistence.
  - files: `e2e/theme.spec.js`, `playwright.config.js`
  - acceptance: The new test passes locally and alongside existing E2E tests.
