# Plan — web-de186589

<!-- factory:plan v=1 -->

## Design

Introduce a minimal REST API on top of the existing Node.js notes module so a browser UI can read and mutate `notes.json`. Reuse `notes.js` and extend it to support list, read, update, and remove operations keyed by unique note titles (duplicates are already prevented). Expose endpoints `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, and `DELETE /api/notes/:title`, with CORS enabled for the dev server.

Build a small React single-page app (Vite) that lists notes, creates notes, edits a note (allow updating title and/or body with duplicate-title validation), and removes notes. Keep the UI simple: a list view with inline actions and a form/modal for create/edit. The app will call the REST API via `fetch`. For local dev and E2E, run API and web concurrently via npm scripts.

End-to-end tests with Playwright will cover the key flows: listing initial state, creating a note, editing it, and deleting it, asserting DOM updates and server persistence. Playwright’s `webServer` will boot both API and web with `concurrently` and wait for the web port to be ready.

## Tasks

- [x] `t1` Extend notes module with list/read/update/remove
  - intent: Add `listNotes`, `readNote(title)`, `updateNote(oldTitle, { title?, body? })`, and `removeNote(title)` to operate on `notes.json` with duplicate-title checks.
  - files: `notes.js`
  - acceptance: Module exports support all CRUD operations and pass basic manual calls from a Node REPL.
- [ ] `t2` Add Express REST API with CORS
  - intent: Create a lightweight API exposing CRUD over notes with JSON bodies, 4xx on conflicts/not-found, and enable CORS for the web app in dev.
  - files: `api/server.js`, `package.json`
  - acceptance: Running `npm run api` serves `GET/POST/PUT/DELETE /api/notes` endpoints backed by `notes.json`.
- [ ] `t3` Project scripts and dependencies
  - intent: Add dependencies (`express`, `cors`, `concurrently`, `nodemon`) and npm scripts for `api`, `web`, and `dev` (concurrent) to streamline local run and tests.
  - files: `package.json`
  - acceptance: `npm run dev` starts both API and web; `npm run api` starts API alone.
- [ ] `t4` Scaffold React app with Vite
  - intent: Create a Vite React app under `web/` with a simple layout and routing-less SPA structure.
  - files: `web/package.json`, `web/index.html`, `web/src/main.jsx`, `web/src/App.jsx`, `web/vite.config.ts`
  - acceptance: `npm run web` serves the React app at a dev port and renders a placeholder.
- [ ] `t5` Implement notes UI (list/create/edit/delete)
  - intent: Build components to fetch and render notes, create new notes, edit existing (title/body with validation), and delete, all via the API with optimistic UI or simple refetch.
  - files: `web/src/App.jsx`, `web/src/components/NotesList.jsx`, `web/src/components/NoteForm.jsx`, `web/src/api.js`
  - acceptance: From the browser, user can list, add, edit, and remove notes with visible updates and error toasts/messages on conflicts.
- [ ] `t6` Playwright E2E tests for key flows
  - intent: Add Playwright config to boot API and web concurrently, and tests that cover list, create, edit, and delete flows against a clean `notes.json` state.
  - files: `playwright.config.ts`, `tests/notes.e2e.spec.ts`, `package.json`
  - acceptance: `npx playwright test` runs green locally with deterministic assertions of DOM changes across CRUD flows.
- [ ] `t7` Developer docs
  - intent: Update README with how to run API, web, and E2E tests, including ports and environment notes.
  - files: `README.md`
  - acceptance: README includes concise setup/run/test instructions that work on a fresh clone.
