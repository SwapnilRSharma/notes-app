# Plan — web-a8859923

<!-- factory:plan v=1 -->

## Design

Migrate the React web app to Shadcn UI components on top of Tailwind CSS while preserving all existing features and user flows. Set up Tailwind in the Vite React app, initialize Shadcn, and scaffold only the components we need (Button, Input, Textarea, Card, Collapsible, Toast). Keep semantics, labels, and ARIA identical where tests depend on them (placeholders "Title"/"Body", headings "Notes"/"Create Note"/"Edit Note", button names "Add"/"Edit"/"Save"/"Delete", and the toggle button's aria-label "Toggle body").

Replace the hand-rolled styling and custom components with Shadcn equivalents: forms and actions use Shadcn inputs/buttons, cards wrap panels, and the expandable note body uses Collapsible while maintaining the existing toggle behavior and aria-label. Retain the existing `window.confirm` flow for deletes to avoid changing the E2E interaction model. Replace the bespoke Toasts with Shadcn's toast provider but keep the same messages and dismiss behavior. Remove legacy CSS once Tailwind utility classes cover the layout.

## Tasks

- [x] `t1` Add Tailwind CSS to the web app
  - intent: Configure Tailwind for the Vite React app and wire a global index.css so utility classes are available across the UI.
  - files: `web/package.json`, `web/tailwind.config.js`, `web/postcss.config.js`, `web/src/index.css`, `web/index.html`, `web/src/main.jsx`
  - acceptance: Dev server builds without errors and Tailwind classes render (smoke-check a utility like `p-4` on the app container).
- [x] `t2` Initialize Shadcn UI and utilities
  - intent: Initialize Shadcn in the `web` package, add the `cn` utility, and ensure components generate under `web/src/components/ui`; add TypeScript dev-dep if needed so Vite transpiles `.tsx` components.
  - files: `web/components.json`, `web/src/lib/utils.ts`, `web/package.json`, `web/tsconfig.json`
  - acceptance: `npx shadcn@latest add button` scaffolds into `web/src/components/ui` and builds.
- [x] `t3` Add required Shadcn components
  - intent: Scaffold Button, Input, Textarea, Card, Collapsible, and Toast (provider/hooks) using the Shadcn CLI.
  - files: `web/src/components/ui/button.tsx`, `web/src/components/ui/input.tsx`, `web/src/components/ui/textarea.tsx`, `web/src/components/ui/card.tsx`, `web/src/components/ui/collapsible.tsx`, `web/src/components/ui/toast.tsx`, `web/src/components/ui/toaster.tsx`, `web/src/components/ui/use-toast.ts`
  - acceptance: All added components compile, and `<Toaster />` can be rendered without runtime errors.
- [x] `t4` Wire app shell for Shadcn (Toaster and base layout)
  - intent: Render the Shadcn `<Toaster />` once (e.g., in `App.jsx` or `main.jsx`) and replace container/layout classes with Tailwind while keeping headings and structure identical.
  - files: `web/src/App.jsx`, `web/src/main.jsx`
  - acceptance: App loads with Toaster mounted; headings "Notes" remain unchanged.
- [x] `t5` Migrate NoteForm to Shadcn components
  - intent: Replace `<input>`, `<textarea>`, and submit button with Shadcn `<Input>`, `<Textarea>`, and `<Button>` inside a `<Card>`; preserve placeholders, validation messages, and the "Add" button text.
  - files: `web/src/components/NoteForm.jsx`
  - acceptance: Creating a note still works; duplicate and empty-title validations show inline errors; Playwright can still find controls by placeholder and button name.
- [x] `t6` Migrate NotesList to Shadcn components
  - intent: Replace action buttons with Shadcn `<Button>` variants and use Shadcn Collapsible for the note body while preserving the toggle button and its `aria-label="Toggle body"`; keep `window.confirm` for deletes.
  - files: `web/src/components/NotesList.jsx`
  - acceptance: Expand/collapse works; Edit/Delete buttons behave the same; delete confirmation still uses the native dialog.
- [x] `t7` Migrate EditNote to Shadcn components
  - intent: Replace inputs and buttons with Shadcn components within a Card; preserve heading "Edit Note", button texts, and validation/notification behavior.
  - files: `web/src/components/EditNote.jsx`
  - acceptance: Renaming with conflict shows the same error text; successful save closes the editor and refreshes the list.
- [x] `t8` Replace bespoke Toasts with Shadcn toast
  - intent: Swap `Toasts.jsx` usage for Shadcn `useToast` and `<Toaster />`, mapping kinds to Shadcn variants; keep messages and click-to-dismiss; remove the custom component and wiring.
  - files: `web/src/App.jsx`, `web/src/components/Toasts.jsx`
  - acceptance: Success and error notifications appear via Shadcn toasts; the legacy `Toasts.jsx` is no longer rendered.
- [x] `t9` Remove legacy CSS and finish Tailwind restyle
  - intent: Delete `styles.css`, remove its import, and express prior layout/states with Tailwind utilities in the migrated components.
  - files: `web/src/styles.css`, `web/src/App.jsx`, `web/src/components/*.jsx`
  - acceptance: No references to `styles.css`; UI spacing and readability are acceptable in both light/dark modes (per Shadcn defaults).
- [x] `t10` Playwright E2E tests for key flows
  - intent: Ensure E2E coverage for create, duplicate validation, edit with title conflict, successful rename, toggle body visibility, and cancel/confirm delete; adjust selectors or add ARIA where needed so tests remain stable.
  - files: `e2e/notes.spec.js`
  - acceptance: All Playwright tests pass locally against the updated UI without flakiness.
