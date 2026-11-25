# Plan — web-eae9530b

<!-- factory:plan v=1 -->

## Design

We will introduce Tailwind CSS and shadcn/ui to the existing Vite + React app under `web/`, then refactor the current JSX to use shadcn components while preserving behavior, semantics, and accessible names. The backend API, state management, and routes remain unchanged. The UI will get an app-like shell (header + constrained content container) and responsive layout using Tailwind utilities so it looks cohesive on desktop and mobile.

Key decisions: use shadcn/ui with the React/Vite setup via Tailwind; generate core primitives (Button, Input, Textarea, Card, Separator, Toaster) and replace current ad-hoc markup with those. Keep the native `window.confirm` for deletes to avoid altering flows and selectors; preserve all text labels and placeholders (`Notes`, `Title`, `Body`, `Add`, `Edit`, `Save`, `Delete`, and the `Toggle body` aria-label) so existing tests and assistive tech continue to work. Replace the custom `Toasts` component with shadcn’s toast provider for a consistent design, keeping identical messages and auto-dismiss timing.

Risks: Tailwind content globs must include Vite paths or styles may be purged; shadcn’s toaster uses a portal which can affect DOM structure if selectors are brittle; refactors could inadvertently change accessible names. We mitigate by keeping names/roles stable, using role- and name-based E2E selectors, and validating all key flows with Playwright.

## Tasks

- [ ] `t1` Set up Tailwind and shadcn/ui for Vite + React
  - intent: Install and configure Tailwind (postcss + tailwind config) and shadcn/ui so components can be generated and used.
  - files: `web/package.json`, `web/postcss.config.cjs`, `web/tailwind.config.cjs`, `web/src/styles.css`, `web/index.html`, `web/src/main.jsx`, `web/components.json`
  - acceptance: Dev server runs and a sample shadcn Button renders with Tailwind styles applied.
- [ ] `t2` Generate shadcn primitives
  - intent: Add Button, Input, Textarea, Card, Separator, and Toaster via shadcn so we can compose the new UI.
  - files: `web/src/components/ui/button.jsx`, `web/src/components/ui/input.jsx`, `web/src/components/ui/textarea.jsx`, `web/src/components/ui/card.jsx`, `web/src/components/ui/separator.jsx`, `web/src/components/ui/toaster.jsx`
  - acceptance: Components import without build errors; a minimal render in App proves availability.
- [ ] `t3` App shell and responsive layout
  - intent: Introduce a header bar and a responsive container using Tailwind utilities; remove reliance on bespoke layout classes.
  - files: `web/src/App.jsx`, `web/src/styles.css`
  - acceptance: On mobile widths, content stacks and is readable; on desktop, content is centered with an app-like header.
- [ ] `t4` Migrate NoteForm to shadcn components
  - intent: Replace inputs and submit button with shadcn `Input`, `Textarea`, and `Button`; keep placeholders/text and validation messages unchanged.
  - files: `web/src/components/NoteForm.jsx`
  - acceptance: Creating a note works; accessible names remain (`Title`, `Body`, `Add`); validation message still matches.
- [ ] `t5` Migrate EditNote to shadcn components
  - intent: Replace inputs and action buttons with shadcn primitives; preserve conflict and error handling.
  - files: `web/src/components/EditNote.jsx`
  - acceptance: Editing (including conflict and success) works; accessible names remain (`Edit Note`, `Save`, `Cancel`).
- [ ] `t6` Migrate NotesList to shadcn components
  - intent: Use `Card` and shadcn `Button`s for list items; retain the `Toggle body` control (same aria-label) and title layout.
  - files: `web/src/components/NotesList.jsx`
  - acceptance: Toggling bodies, editing, and deleting are available with the same labels; list is readable on mobile.
- [ ] `t7` Replace custom Toasts with shadcn toast
  - intent: Wire up shadcn Toaster and replace `Toasts` usage with shadcn’s toast API, keeping identical messages and auto-dismiss behavior.
  - files: `web/src/App.jsx`, `web/src/components/Toasts.jsx`
  - acceptance: Success/error toasts appear and auto-dismiss; clicking a toast dismisses; no duplicate notifications.
- [ ] `t8` Clean up legacy CSS
  - intent: Remove or trim bespoke selectors in `styles.css` that are superseded by Tailwind; keep only minimal overrides.
  - files: `web/src/styles.css`
  - acceptance: No functional regressions; Lighthouse or manual check shows consistent spacing/contrast.
- [ ] `t9` Playwright E2E tests: update (if needed) and run
  - intent: Ensure selectors still target role/name or stable text; adjust only if DOM changes require it; run the full suite to green.
  - files: `e2e/notes.spec.js`, `playwright.config.js`
  - acceptance: All E2E tests pass locally with video and traces; key flows (create, duplicate validation, edit conflict, rename success, toggle body, cancel/confirm delete) are covered.
