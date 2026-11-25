# Plan — web-83ca4e32

<!-- factory:plan v=1 -->

## Design

Transition the existing Vite + React + Tailwind UI under `web/` to Shadcn UI components while preserving all current behaviors and API interactions. We already have Tailwind and a minimal Shadcn config (`components.json`) plus a few hand-rolled shadcn-style primitives; the plan formalizes the foundation (Tailwind tokens, CSS variables) and replaces bespoke widgets with first-class Shadcn components where it improves accessibility, consistency, and responsiveness.

Key decisions: keep the current app structure and feature flow (list, create, edit/rename with conflict handling, delete with confirm, toasts). Introduce an application shell (header + container) and responsive patterns (mobile-first stacks, Sheet-based mobile menu, consistent focus states). Prefer role/text-based selectors so Playwright remains resilient post-UI change. Risks are limited to selector churn and ARIA differences (dialogs/toasts); we mitigate with updated E2E tests including a mobile viewport run.

## Tasks

- [ ] `t1` Audit current UI and flows
  - intent: Inventory existing components, Tailwind setup, and user flows (create, duplicate validation, edit/rename with conflict, delete confirm, toggle body) to ensure behavior parity during migration.
  - files: `web/src/App.jsx`, `web/src/components/NoteForm.jsx`, `web/src/components/EditNote.jsx`, `web/src/components/NotesList.jsx`, `web/src/components/ui/*`, `web/tailwind.config.cjs`, `web/components.json`, `e2e/notes.spec.js`
  - acceptance: A concise checklist of behaviors and component mappings captured in task notes for reference during migration.
  - notes:
    - Components present:
      - UI primitives: `button`, `input`, `textarea`, `card`, `separator`, `toaster` (`use-toast`) under `web/src/components/ui/*`.
      - Missing primitives to add: `label`, `alert-dialog`/`dialog`, `sheet` (mobile menu), optionally `dropdown-menu`.
    - Tailwind/Shadcn foundation:
      - Tailwind configured with content globs; no `darkMode: 'class'`, no shadcn CSS variable tokens or extended `borderRadius/colors` yet.
      - `components.json` configured with aliases and `baseColor: neutral`.
    - App shell/layout:
      - Header + responsive container implemented in `App.jsx` using Tailwind utilities.
      - No mobile menu/sheet yet.
    - Flows and behaviors (current):
      - Create: requires title; duplicate titles return 409 with error surfaced; success toast on create.
      - List: Card-styled rows with triangle toggle; toggle button has `aria-label="Toggle body"` but no `aria-expanded`.
      - Edit/Rename: Uses shadcn inputs/buttons; conflict (409) surfaces error; success toast on save; Cancel button exits editor.
      - Delete: Uses `window.confirm` in `App.jsx` then DELETE fetch; on success, reload + toast.
      - Toasts: Centralized via `toast()` in `App.jsx` events; `Toaster` renders status variants.
    - E2E tests:
      - Cover create, duplicate validation, edit rename conflict, delete via native confirm, toggle body, basic validations.
      - Require update once AlertDialog replaces `window.confirm`; add mobile viewport project.
- [ ] `t2` Establish Shadcn/Tailwind foundation
  - intent: Ensure Tailwind config matches Shadcn guidance (colors, radii, container, dark mode class strategy), wire CSS variables/base layers, and verify component aliases in `components.json`.
  - files: `web/tailwind.config.cjs`, `web/src/styles.css`, `web/components.json`, `web/package.json`
  - acceptance: Tailwind builds with Shadcn tokens enabled; lint/build completes with no CSS token errors.
- [ ] `t3` Scaffold required Shadcn components
  - intent: Add missing primitives and patterns used by the app: `button`, `input`, `textarea`, `label`, `card`, `separator`, `dialog`/`alert-dialog` (for delete confirm), `dropdown-menu` (if needed for header), `sheet` (mobile menu), and `toast` (or align existing toaster).
  - files: `web/src/components/ui/*`
  - acceptance: Components exist under `src/components/ui` with consistent APIs and import paths; storybook not required.
- [ ] `t4` App shell and responsive layout
  - intent: Implement an application header using Shadcn patterns, wrap content in a responsive container, add a mobile menu via `Sheet`, and apply mobile-first spacing/typography.
  - files: `web/src/App.jsx`, `web/src/styles.css`
  - acceptance: App renders with a sticky header and responsive container; layout adapts cleanly at small viewports without horizontal scroll.
- [ ] `t5` Migrate forms to Shadcn form primitives
  - intent: Update `NoteForm` and `EditNote` to use Shadcn `Label`, `Input`, `Textarea`, and `Button`; preserve validation messages and submission logic unchanged.
  - files: `web/src/components/NoteForm.jsx`, `web/src/components/EditNote.jsx`, `web/src/components/ui/*`
  - acceptance: Creating and editing notes works as before, including error messaging for required title and conflict cases.
- [ ] `t6` Migrate list and interactions
  - intent: Update `NotesList` to use Shadcn `Card` (or keep but align styles), replace the triangle toggle with accessible disclosure (button with proper aria-expanded), and replace `window.confirm` with Shadcn `AlertDialog` for delete confirmation.
  - files: `web/src/components/NotesList.jsx`, `web/src/components/ui/*`
  - acceptance: Toggling bodies, edit, and delete flows function with accessible controls; no regressions.
- [ ] `t7` Toasts and feedback alignment
  - intent: Replace or align the custom toast implementation with Shadcn’s toast pattern for consistent styling and semantics; ensure all notifications still fire at the same events.
  - files: `web/src/components/ui/toaster.jsx`, `web/src/components/ui/use-toast.js`, `web/src/App.jsx`
  - acceptance: Success and error toasts appear with correct variants; no duplicate or missing notifications.
- [ ] `t8` Theming and polish
  - intent: Finalize color palette (neutral base), radii, focus rings, and iconography (lucide-react) for buttons/actions; ensure dark-mode class strategy is ready even if not exposed.
  - files: `web/tailwind.config.cjs`, `web/src/styles.css`, `web/src/components/ui/button.jsx`
  - acceptance: Visuals are cohesive and “app-like”; focus states are visible; optional dark-mode styles do not break light mode.
- [ ] `t9` Update and expand Playwright E2E tests (incl. mobile)
  - intent: Update selectors to rely on roles/labels resilient to UI changes, add a mobile viewport run (e.g. iPhone 12), and add coverage for the AlertDialog confirm and mobile menu toggle.
  - files: `e2e/notes.spec.js`, `playwright.config.js`
  - acceptance: All E2E tests pass locally; tests cover create, duplicate validation, edit rename with conflict, delete via dialog, toggle body, and mobile layout/menu.
- [ ] `t10` Accessibility and responsive QA pass
  - intent: Keyboard-test dialogs and interactive elements, verify aria attributes (e.g., `aria-expanded`), and manually verify at narrow widths (≤360px) for content fit.
  - acceptance: No accessibility blockers found; UI usable via keyboard and on small screens without overflow.
