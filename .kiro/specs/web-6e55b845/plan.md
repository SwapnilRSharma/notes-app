# Plan — web-6e55b845

<!-- factory:plan v=1 -->

## Design

Add a minimal HTTP API on top of the existing Node.js notes module to persist notes in `notes.json`, then build a small React SPA that consumes this API. Keep the data model as-is (`{ title, body }`) and use `title` as the identifier to minimize changes; when editing a note’s title, detect conflicts and reject if the new title already exists. Serve the React app in dev via Vite with a proxy to the API; for E2E, run both servers from Playwright’s `webServer` setup.

Risks/tradeoffs: using `title` as the identifier complicates “rename” (edit title) and forbids duplicates; we will surface clear validation errors. Concurrency on `notes.json` is out of scope for this UI and left as-is (single-process writes). The CLI continues to work; shared store logic lives in `notes.js` to avoid duplication.

## Tasks

- [x] `t1` Expose Notes HTTP API (Express)
  - intent: Create an Express server exposing CRUD endpoints over the existing notes store: `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, `DELETE /api/notes/:title`, reusing and extending `notes.js` to include list, update, and remove helpers.
  - files: `server/index.js`, `notes.js`, `package.json`
  - acceptance: Starting the server enables all endpoints to read/write `notes.json` with proper 4xx on conflicts/missing.
- [x] `t2` React app scaffold (Vite)
  - intent: Initialize a React SPA in `web/` using Vite (JS), configure dev proxy to `/api` and add npm scripts to start client and server concurrently during development.
  - files: `web/index.html`, `web/vite.config.js`, `web/package.json`, `package.json`, `.gitignore`
  - acceptance: `npm run dev` (or documented scripts) runs client with proxy to the API, and the root page loads.
- [x] `t3` Notes list UI
  - intent: Build a notes list view that fetches from `GET /api/notes` and renders titles with actions to edit and delete; show bodies collapsed/expanded or in-row.
  - files: `web/src/App.jsx`, `web/src/components/NotesList.jsx`
  - acceptance: Visiting the app shows existing notes from `notes.json` and reflects changes after CRUD operations without reload.
- [x] `t4` Create note UI
  - intent: Add a form to create a note (title, body) calling `POST /api/notes`, handle duplicate-title validation and optimistic refresh of the list.
  - files: `web/src/components/NoteForm.jsx`, `web/src/App.jsx`
  - acceptance: Submitting a valid note adds it to the list; duplicate titles show an inline error and do not create a note.
- [ ] `t5` Edit note UI
  - intent: Implement editing a note (title and body) via inline form or modal calling `PUT /api/notes/:title`, with conflict handling when renaming to an existing title.
  - files: `web/src/components/EditNote.jsx`, `web/src/App.jsx`
  - acceptance: Editing updates the note in `notes.json`; attempting to rename to an existing title shows an error and leaves data unchanged.
- [ ] `t6` Delete note UI
  - intent: Add delete action per note calling `DELETE /api/notes/:title` with a confirm step.
  - files: `web/src/components/NotesList.jsx`
  - acceptance: Confirming delete removes the note from `notes.json` and it disappears from the list.
- [ ] `t7` Playwright E2E tests
  - intent: Add Playwright config to start the API and web app, then write tests that cover create → list, edit (including rename and validation), and delete flows, asserting UI feedback and persisted state via subsequent list.
  - files: `playwright.config.js`, `e2e/notes.spec.js`, `package.json`
  - acceptance: Running the E2E suite boots the app and all user flows pass green on CI/local.
