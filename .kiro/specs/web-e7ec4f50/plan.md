# Plan — web-e7ec4f50

<!-- factory:plan v=1 -->

## Design

Create a new Vite + React (TypeScript) frontend in a `web/` subdirectory, styled with Tailwind CSS and using shadcn/ui components for consistent, accessible UI primitives. Keep this frontend self-contained and decoupled from the existing Node CLI app; persist notes in `localStorage` via a small storage utility so there is no backend dependency. Notes will have an `id`, `title`, `body`, and `createdAt`.

The UI will include a top bar with app title, a search input to filter notes client-side, a "Create Note" button that opens a modal (Dialog) to enter title and body, and a list of notes (Card components). The create action validates required fields, writes to `localStorage`, and updates in-memory state; search filters from the in-memory list. We will install Tailwind and shadcn properly (content globs, base styles, `tailwindcss-animate`) and add only the minimal shadcn components needed: `button`, `input`, `label`, `textarea`, `dialog`, and `card`.

Risks are minimal: shadcn/ui requires correct Tailwind setup and content paths; we will follow their defaults under `src/`. We avoid coupling to the existing CLI `notes.json` to prevent filesystem access in the browser and keep scope tight.

## Tasks

- [ ] `t1` Scaffold Vite React (TypeScript) app under `web/`
  - intent: Initialize a fresh Vite + React + TS project in `web/` with default entry points.
  - files: `web/package.json`, `web/index.html`, `web/tsconfig.json`, `web/vite.config.ts`, `web/src/main.tsx`, `web/src/App.tsx`
  - acceptance: `npm run dev` inside `web/` serves the default Vite React page without errors.
- [ ] `t2` Add and configure Tailwind CSS
  - intent: Install Tailwind, PostCSS, and Autoprefixer; create Tailwind config and base stylesheet; wire content globs to `index.html` and `src/**/*.{ts,tsx}`.
  - files: `web/tailwind.config.js`, `web/postcss.config.js`, `web/src/index.css`, `web/index.html`
  - acceptance: Tailwind utility classes apply (e.g., replace default styles with Tailwind-styled container in `App.tsx`).
- [ ] `t3` Initialize shadcn/ui and add required components
  - intent: Initialize shadcn in the project and generate minimal components: `button`, `input`, `label`, `textarea`, `dialog`, `card`; include `tailwindcss-animate` if required by components.
  - files: `web/components.json`, `web/src/components/ui/button.tsx`, `web/src/components/ui/input.tsx`, `web/src/components/ui/label.tsx`, `web/src/components/ui/textarea.tsx`, `web/src/components/ui/dialog.tsx`, `web/src/components/ui/card.tsx`
  - acceptance: Importing `Button` and `Dialog` in `App.tsx` renders without build errors.
- [ ] `t4` Implement localStorage-backed notes storage utility
  - intent: Add a small storage module to read/write notes to `localStorage` with basic schema and uniqueness by generated id.
  - files: `web/src/lib/storage.ts`
  - acceptance: Calling `getNotes()` and `addNote({title, body})` persists and returns notes across page reloads.
- [ ] `t5` Build app layout with header, search, and list shell
  - intent: Create app header with title, a search `Input`, and a `Button` to open the create dialog; add `NoteList` component that renders from props with empty-state message.
  - files: `web/src/App.tsx`, `web/src/components/note-list.tsx`
  - acceptance: App renders header, search box, and an empty-state list area with no runtime errors.
- [ ] `t6` Implement Create Note dialog and form
  - intent: Add a `CreateNoteDialog` using shadcn `Dialog`, `Label`, `Input`, and `Textarea`; validate non-empty title/body; on save, persist via storage and refresh state.
  - files: `web/src/components/create-note-dialog.tsx`, `web/src/App.tsx`
  - acceptance: Clicking "Create Note" opens a modal; saving a valid note adds it to the list and it remains after reload.
- [ ] `t7` Implement client-side search filtering
  - intent: Wire the search `Input` to filter notes in-memory by title/body (case-insensitive) and update the rendered list as the user types.
  - files: `web/src/App.tsx`, `web/src/components/note-list.tsx`
  - acceptance: Typing in search narrows visible notes to matches in title or body.
- [ ] `t8` UX polish and empty states
  - intent: Add created date display, basic spacing, and an empty-state card; ensure focus management for the dialog.
  - files: `web/src/components/note-list.tsx`, `web/src/components/create-note-dialog.tsx`, `web/src/App.tsx`
  - acceptance: Empty state is clear, newly created notes show created date, and dialog focuses first input when opened.
- [ ] `t9` Manual verification checklist
  - intent: Run the dev server and verify core flows: create note, persistence across reload, and search filtering.
  - files: `web/README.md`
  - acceptance: Documented steps reproduce expected behavior with no console errors.
