# Plan — web-ca12bf8f

<!-- factory:plan v=1 -->

## Design

Transition the existing Vite + React + Tailwind app to use Shadcn UI (Radix primitives + Tailwind tokens) across all interactive elements while preserving behavior and routes. Establish an application shell (top app bar + collapsible left nav on desktop, bottom tab bar/drawer patterns on mobile), unify spacing/typography/color via tokens, and make every screen responsive-first. Keep server/API contracts intact; component migration is a view-layer refactor guarded by E2E tests.

We will add a concise UI Design Rules (2026) document that encodes the visual system and interaction patterns inspired by top 2026 product UIs: mobile-first responsive breakpoints; clear app chrome; density controls; accessible focus/keyboard flows; motion with reduced-motion support; empty/error/loading states; consistent form controls; drawer/sheet on mobile, dialog/popover on desktop; dark/light themes with a neutral base; and data display rules for lists/tables. The Shadcn component set (button, card, input, textarea, tooltip, dropdown, dialog, drawer/sheet, tabs, toast, table) will be the baseline. Biggest risks are subtle CSS regressions during tokenization and interaction behavior changes (e.g., replacing confirm dialogs with drawers on mobile); we mitigate with incremental migration and Playwright tests in both desktop and mobile viewports.

## Tasks

- [ ] `t1` Audit current UI and map to Shadcn equivalents
  - intent: Inventory components in `web/src/components/**` and decide target Shadcn primitives (button, input, textarea, card, dialog, drawer/sheet, dropdown, tabs, tooltip, table, toast) and layout shell needs.
  - files: `web/src/components/**/*.jsx`, `web/src/App.jsx`
  - acceptance: A short mapping list checked into the repo (e.g., `web/docs/migration-map.md`) outlining each component/view and its Shadcn target.
- [ ] `t2` Configure design tokens and Tailwind for Shadcn
  - intent: Ensure Tailwind config exposes CSS variables for color/typography/radius/shadow per Shadcn; wire `components.json` and base styles; enable dark mode and neutral base color.
  - files: `web/tailwind.config.cjs`, `web/src/styles.css`, `web/components.json`
  - acceptance: Running dev server shows base styles applied; light/dark theme toggles via `class` work and no visual regressions on existing screens.
- [ ] `t3` Author UI Design Rules (2026)
  - intent: Write a concise rules doc capturing 2026 best-practice patterns: layout shell, responsive breakpoints (sm/md/lg/xl), spacing scale, typography scale, color tokens (neutral/success/warn/danger), elevation/shadow scale, corner radius, motion guidelines, focus rings, hit target sizing, mobile drawer/sheet rules, dialog usage, empty/error/loading states, toasts, keyboard shortcuts/command palette, and data list/table rules.
  - files: `web/docs/design-rules-2026.md`
  - acceptance: Doc exists and covers the listed categories with concrete do/don’t guidance tied to Shadcn components.
- [ ] `t4` Implement responsive app shell
  - intent: Add a cohesive app frame with a sticky top bar, desktop sidebar (collapsible), and mobile bottom nav + sheet/drawer menu; apply container widths and gutters.
  - files: `web/src/App.jsx`, `web/src/components/ui/*`
  - acceptance: App renders with the new shell; nav adapts between desktop and mobile breakpoints without layout shifts.
- [ ] `t5` Migrate core forms and lists to Shadcn
  - intent: Replace legacy form/list markup with Shadcn components while preserving behavior: Note create/edit forms (inputs, textarea, buttons) and list rows (card, buttons, expand/collapse control, menu for actions).
  - files: `web/src/components/NoteForm.jsx`, `web/src/components/EditNote.jsx`, `web/src/components/NotesList.jsx`, `web/src/components/ui/*`
  - acceptance: Visual parity or improvement with no functional regressions; create/edit/delete flows still pass E2E tests.
- [ ] `t6` Mobile interaction refinements
  - intent: Introduce `Drawer/Sheet` for secondary flows on small screens (e.g., edit view), ensure touch target sizes, and adjust confirm flows to non-blocking patterns on mobile while keeping desktop dialog behavior.
  - files: `web/src/components/EditNote.jsx`, `web/src/App.jsx`, `web/src/components/ui/*`
  - acceptance: On a mobile viewport, edit/confirm interactions use drawers/sheets and remain fully usable one-handed; desktop keeps dialogs/popovers as appropriate.
- [ ] `t7` Accessibility and state UX pass
  - intent: Add ARIA labels/roles, keyboard navigation, visible focus rings; standardize empty, loading (skeletons), and error states; ensure reduced motion support.
  - files: `web/src/**/*.jsx`, `web/src/styles.css`
  - acceptance: Basic WCAG 2.2 AA checks pass; keyboard-only flow works; skeletons/toasts show appropriately.
- [ ] `t8` Stabilize selectors and update Playwright E2E tests (desktop + mobile)
  - intent: Add `data-testid` hooks where needed and extend tests to run on a mobile viewport to exercise drawers/sheets while keeping existing flows; minimize flakiness with reliable waits.
  - files: `e2e/notes.spec.js`, `playwright.config.js`, `web/src/**/*.jsx`
  - acceptance: `npm run test:e2e` passes locally and in CI for both desktop and a mobile device profile.
- [ ] `t9` Cleanup and removal of dead styles
  - intent: Remove obsolete CSS/utilities and any unused legacy components after migration.
  - files: `web/src/styles.css`, `web/src/components/**/*`
  - acceptance: No references to removed classes/components remain; build is clean with no unused exports or stylesheet warnings.
