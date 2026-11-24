# Plan — web-5adef2a5

<!-- factory:plan v=1 -->

## Design

Context (what exists today)

- App structure: a small React 18 SPA under `web/` (Vite) talking to a local Express API under `server/`. Notes are stored in `notes.json` through helpers in `notes.js`.
- Key UI files: `web/src/App.jsx`, `web/src/components/{NoteForm,EditNote,NotesList}.jsx`, and a bespoke toast system `Toasts.jsx`. Styling lives in a single `web/src/styles.css` using a custom blue/dark theme.
- Core flows already covered by Playwright in `e2e/notes.spec.js`: create → list, duplicate validation, edit (including rename conflict), delete with confirm dialog, toggle body visibility, and cancel delete.
- Accessibility: buttons and headings are role-discoverable and tests use semantic roles and visible labels (e.g., `getByRole('button', { name: 'Add' })`).

Goal

- Transition visual/UI layer to shadcn/ui components (Radix-based) and Tailwind CSS while preserving all existing behaviors, API calls, and user-visible strings to keep tests and user flows intact.
- Modernize the layout so it feels like an “app”: introduce an app shell with a header, consistent spacing/containers, and replace ad-hoc styles with Tailwind utilities. Ensure it’s responsive on mobile (≤375px width) without breaking desktop.

Approach

1) Introduce Tailwind and shadcn in `web/` only

- Add Tailwind to the Vite React app (dev deps: `tailwindcss`, `postcss`, `autoprefixer`; config files `tailwind.config.js`, `postcss.config.js`). Replace global stylesheet with Tailwind layers (`@tailwind base; @tailwind components; @tailwind utilities;`).
- Install shadcn/ui peer deps typically used here: `class-variance-authority`, `tailwind-merge`, `lucide-react`, and specific `@radix-ui/react-*` packages for components we’ll use (`dialog`, `alert-dialog`, `collapsible` or `accordion`, and `toast`). We’ll vendor shadcn UI components into `web/src/components/ui/*` (the usual pattern) so no runtime package is required.
- Keep Vite config as-is; Tailwind doesn’t need special Vite changes. Ensure `index.html` includes the compiled CSS entry.

2) Theming and token mapping

- Keep the existing “blue/dark” visual identity but move it to Tailwind/the CSS variables expected by shadcn. Configure Tailwind theme (extend `colors`, `borderRadius`) and set CSS variables under `:root` / `.dark` to approximate current palette:
  - Accent ≈ `--accent: #4f8cff` mapped to Tailwind `primary` using CSS vars (shadcn pattern) so `button` variants pick it up.
  - Background/panel colors mapped to `background`/`card` tokens.
- Use Tailwind utilities for spacing/typography; remove most of `styles.css` except for any necessary CSS variables and bespoke overrides that aren’t a fit for utilities.

3) App shell and layout

- Wrap the app in a simple shell: a sticky header with app title, optional subtitle, and a content container. Use Tailwind container widths (`max-w-screen-lg`), padding, and a vertical stack rhythm.
- Ensure responsive layout:
  - On mobile, action buttons stack or become icon+label with adequate touch targets (≥44px); list rows wrap.
  - Typography scales with Tailwind responsive modifiers (`text-lg` → `md:text-xl`).

4) Replace UI primitives with shadcn components

- Buttons: replace `.btn` and variants with `Button` (`variant="default"|"destructive"|"secondary"`, `size`), keeping visible labels the same: “Add”, “Edit”, “Delete”, “Save”, “Cancel”.
- Inputs/Textareas: swap to `Input` and `Textarea` with labels/aria preserved. Keep placeholders unchanged for test selectors (`Title`, `Body`). Show inline validation using small `p` text with `text-destructive` instead of raw `.error-text`.
- Card/Form surfaces: use `Card` for `NoteForm` and `EditNote` containers.
- Disclosure/toggle: replace the custom expand/collapse with `Collapsible` or `Accordion` item-per-note; preserve the toggle button `aria-label="Toggle body"` and the chevron indicator so tests and a11y remain stable.

5) Dialogs and toasts

- Confirm delete: remove `window.confirm` and use `AlertDialog` per note row. The dialog opens via local state when the user clicks “Delete”. The action and cancel buttons retain accessible names “Delete” and “Cancel”. Tests that previously relied on `page.once('dialog', ...)` will be updated to click through the alert dialog instead.
- Toasts: replace the bespoke `Toasts.jsx` with shadcn `toast` + `Toaster` provider mounted in `App`. Wrap the existing `notify(message, kind)` to call `toast`, `toast.success`, or `toast.destructive` so call sites stay the same.

6) Keep data flow and strings stable

- No API or data model change. Keep headings/subheadings and button labels stable to minimize E2E churn. The only flow change is the delete confirmation mechanism (browser dialog → in-app `AlertDialog`).

7) Testing strategy

- Update Playwright tests to interact with the in-app confirm dialog instead of browser dialogs.
- Preserve existing selectors when practical: placeholders (`Title`, `Body`), headings (`Notes`, `Edit Note`), and button labels.
- Add a mobile-viewport test pass (e.g., `viewport: { width: 375, height: 812 }`) to assert core flows remain usable and that the note row actions are reachable on small screens.
- Assert toast feedback appears using role/politeness or visible text depending on the shadcn toast markup (we can target by text content while keeping timing stable with small waits or expect-to-be-visible with default timeout).

Risks & mitigations

- CSS/token mismatch: shadcn components expect certain CSS variables; ensure our Tailwind theme exports those tokens to avoid washed-out or invisible UI. Mitigation: start from shadcn’s default CSS and incrementally apply our palette.
- Test fragility due to DOM changes: selectors based on role and visible labels should remain stable, but the delete flow needs explicit updates. Mitigation: keep visible text unchanged; add reliable locators for the confirm dialog.
- Z-index/overlay issues on mobile for dialogs and toasts. Mitigation: use shadcn defaults and verify stacking context; add `ToastProvider` and `AlertDialog` in predictable DOM positions.
- Bundle size increase. Mitigation: vendor only components we actually use: `button`, `input`, `textarea`, `card`, `toast`, `alert-dialog`, and `collapsible`.
- Accessibility regressions. Mitigation: Radix primitives carry a11y by default; preserve `aria-label` on toggle and keep heading levels.

How it fits together

We first bootstrap Tailwind/shadcn and verify the app still renders with minimal style. Then replace primitives in smallest-surface components (`Button`, `Input`, `Textarea`, `Card`) and wire the `Toaster` provider. Next, migrate `NoteForm` and `EditNote` to use these primitives, followed by `NotesList` where we also introduce `Collapsible` and `AlertDialog` for toggle and delete confirm. Finally, sweep for responsive tweaks and update/extend Playwright tests to reflect the confirm dialog and add a mobile viewport run.

## Tasks

- [ ] `t1` Add Tailwind and base shadcn setup in web/
  - intent: Initialize Tailwind (`tailwind.config.js`, `postcss.config.js`) and replace global CSS entry with Tailwind layers; vendor shadcn base styles and set up theme tokens to approximate the current dark blue palette.
  - files: `web/tailwind.config.js`, `web/postcss.config.js`, `web/src/styles.css`, `web/index.html`, `web/package.json`
  - acceptance: Vite dev server boots and the app renders with Tailwind applied (no shadcn components yet), with colors close to current defaults.
- [ ] `t2` Vendor minimal shadcn ui components
  - intent: Add only the needed shadcn components: `button`, `input`, `textarea`, `card`, `toast` (`Toaster` + hook), `alert-dialog`, and `collapsible`; place under `web/src/components/ui/` following shadcn’s file structure.
  - files: `web/src/components/ui/*`
  - acceptance: Components compile without errors and can be imported from `components/ui`.
- [ ] `t3` Introduce App shell and responsive container
  - intent: Wrap content in a header + container using Tailwind utilities; ensure spacing/typography scale and that layout works on 320–1440px.
  - files: `web/src/App.jsx`, `web/src/styles.css`
  - acceptance: App shows a sticky header with title, content is centered and readable on mobile and desktop.
- [ ] `t4` Swap primitives in NoteForm and EditNote
  - intent: Replace buttons/inputs/textareas with shadcn `Button`, `Input`, `Textarea`, and `Card`. Keep placeholders and labels unchanged; display validation using Tailwind/shadcn styles.
  - files: `web/src/components/NoteForm.jsx`, `web/src/components/EditNote.jsx`, `web/src/components/ui/*`
  - acceptance: Create and edit flows work as before, with inline errors styled via shadcn.
- [ ] `t5` Replace window.confirm with AlertDialog
  - intent: In `NotesList`, add an `AlertDialog` for delete confirmation instead of `window.confirm`. Keep action button labels “Delete” and “Cancel”.
  - files: `web/src/components/NotesList.jsx`, `web/src/components/ui/alert-dialog.*`
  - acceptance: Deleting a note requires confirming in the in-app dialog; cancel leaves data unchanged.
- [ ] `t6` Migrate expand/collapse to Collapsible/Accordion
  - intent: Replace the manual toggle with `Collapsible` (or a single-item `Accordion`) per row; preserve the toggle button’s `aria-label="Toggle body"` and visible chevron.
  - files: `web/src/components/NotesList.jsx`, `web/src/components/ui/collapsible.*`
  - acceptance: Clicking the toggle shows/hides body with accessible state and smooth behavior.
- [ ] `t7` Replace custom toast system with shadcn Toaster
  - intent: Mount `Toaster` in `App` and adapt the `notify(message, kind)` utility to call shadcn `toast` APIs; remove `Toasts.jsx`.
  - files: `web/src/App.jsx`, `web/src/components/Toasts.jsx`, `web/src/components/ui/toast.*`
  - acceptance: Success/error/info messages appear as toasts with appropriate styling; no references to the old toast component remain.
- [ ] `t8` Responsive polish and accessibility sweep
  - intent: Ensure controls meet touch target sizes on mobile, text wraps without overflow, and focus rings are visible; verify headings/roles remain discoverable.
  - files: `web/src/**/*.jsx`, `web/src/styles.css`
  - acceptance: App usable and visually sound at 375px width and large desktop; keyboard navigation and focus are clear.
- [ ] `t9` Update and expand Playwright E2E tests
  - intent: Update delete flow to click through `AlertDialog` instead of `page.once('dialog', …)`; add a mobile-viewport test variant; keep existing assertions for create/duplicate/edit/toggle; add toast visibility checks.
  - files: `e2e/notes.spec.js`, `playwright.config.js`
  - acceptance: Test suite passes locally and on CI; covers desktop and mobile viewport for the main flow.
