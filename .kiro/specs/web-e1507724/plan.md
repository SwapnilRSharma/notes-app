# Plan — web-e1507724

<!-- factory:plan v=1 -->

## Design

Introduce a minimal Express-based REST API over the existing file-backed notes store (`notes.json`) and build a small React (Vite) frontend that consumes this API. Persist notes to the same JSON file to keep the CLI and the new UI using a single source of truth. Titles will remain unique identifiers; updates may change the title, guarded by a duplicate check.

Serve the built React app from the same Express server for a single start/host process, simplifying Playwright E2E setup. Add CRUD endpoints: GET list/read, POST create, PUT update, DELETE remove. Extend `notes.js` with list/read/update/remove helpers (keeping the existing `addNotes`) and consistent error handling.

Risks are limited to concurrent file writes to `notes.json` and path/working-directory assumptions; we mitigate by reading/writing synchronously within each request and handling not-found/duplicate cases with clear HTTP codes. E2E tests will exercise the full flow against the real server.

## Tasks

- [x] `t1` Extend notes module with full CRUD helpers
  - intent: Provide `listNotes`, `readNote`, `updateNote`, and `removeNote` alongside existing `addNotes`, with duplicate-title checks and graceful not-found handling so the API/UI can rely on consistent behavior.
  - files: `notes.js`
  - acceptance: The module exports the five helpers; duplicate titles are rejected, and missing notes return a falsy value without throwing.
- [x] `t2` Add Express REST API server
  - intent: Expose HTTP endpoints for notes CRUD and serve JSON responses with appropriate status codes.
  - files: `web/server.js`, `package.json`
  - acceptance: Starting the server exposes `GET /api/notes`, `GET /api/notes/:title`, `POST /api/notes`, `PUT /api/notes/:title`, and `DELETE /api/notes/:title` returning 2xx/4xx codes as appropriate.
- [x] `t3` Scaffold React app with Vite
  - intent: Create the frontend skeleton and build pipeline to render the UI and consume the API.
  - files: `web/client/index.html`, `web/client/vite.config.ts`, `web/client/src/main.tsx`, `web/client/src/App.tsx`
  - acceptance: `npm run build:web` completes successfully and outputs a `dist` directory.
- [x] `t4` Implement Notes UI (list/create/edit/delete)
  - intent: Build components and API client to list notes, create new notes, edit existing notes (including changing title), and delete with confirmation.
  - files: `web/client/src/components/NotesList.tsx`, `web/client/src/components/NoteForm.tsx`, `web/client/src/components/NoteEditor.tsx`, `web/client/src/api.ts`, `web/client/src/App.tsx`
  - acceptance: From the browser, users can perform all CRUD actions and see the list update without a manual reload.
- [ ] `t5` Add validation and UX states
  - intent: Enforce required fields, detect duplicate titles from API responses, and display loading/empty/error states.
  - files: `web/client/src/components/NotesList.tsx`, `web/client/src/components/NoteForm.tsx`, `web/client/src/components/NoteEditor.tsx`, `web/client/src/App.tsx`
  - acceptance: Duplicate-title attempts show a visible error; empty state is informative; network/API errors surface a clear message.
- [ ] `t6` Wire build and serve scripts
  - intent: Add npm scripts to build the frontend and start the Express server that also serves the built assets.
  - files: `package.json`, `web/server.js`
  - acceptance: `npm run build:web` builds the UI and `npm start` serves both the API and static UI at a known port.
- [ ] `t7` Playwright E2E tests for key flows
  - intent: Configure Playwright with a `webServer` that builds the UI and starts the Express server; write tests covering list, create, edit, delete, duplicate-title error, and persistence across reloads.
  - files: `playwright.config.ts`, `tests/e2e/notes.spec.ts`, `package.json`
  - acceptance: `npm run test:e2e` runs all tests to green locally, driving the real browser against the running app.
- [ ] `t8` Update README with Web UI instructions
  - intent: Document how to build, start, and test the web UI.
  - files: `README.md`
  - acceptance: README has a "Web UI" and "E2E tests" section with working commands.
