# Plan — web-4cb5912a

<!-- factory:plan v=1 -->

## Design

Add a minimal Express REST API around the existing filesystem-backed notes module so the browser can perform CRUD. Keep storage in `notes.json` and use the existing structure (unique `title` plus `body`) to avoid a migration; treat `title` as the note identifier. Extend the notes module to expose list/read/update/remove operations and to centralize persistence.

Create a small React app (Vite + React, JavaScript) that calls the API to list notes, create new notes, edit existing ones, and delete notes. Keep the UI simple: a list with inline actions, a form to add, and an editor for updates. In development, run the web dev server and API separately with a proxy to avoid CORS; in production, have Express serve the built static assets.

Risks are low: concurrency on `notes.json` is out of scope for this toy app; we accept single-process writes. Using `title` as the identifier means renaming a note is equivalent to delete+create; the UI will enforce unique titles and allow editing body and, optionally, title via an update endpoint.

## Tasks

 - [x] `t1` Extend notes module with full CRUD
  - intent: Add list/read/update/remove helpers around the in-file array and centralize save/load so API and CLI share logic.
  - files: `notes.js`
  - acceptance: Functions exist for list, read by title, update by title, and remove by title with persistence to `notes.json`.
- [x] `t2` Add Express API server
  - intent: Expose REST endpoints for notes CRUD and JSON error handling; mount static serving for built frontend in production.
  - files: `server.js`, `package.json`, `notes.js`
  - acceptance: Server starts on a port env `PORT` or 3000 and serves GET `/api/notes`, POST `/api/notes`, PUT `/api/notes/:title`, DELETE `/api/notes/:title`.
- [x] `t3` Dev ergonomics (proxy/CORS and scripts)
  - intent: Configure dev-time proxy from Vite to Express to avoid CORS and add npm scripts to run API and web together.
  - files: `package.json`, `web/vite.config.js`
  - acceptance: Running a single dev script starts both servers and the web app can call `/api/*` without CORS errors.
- [x] `t4` Scaffold React app
  - intent: Initialize a Vite React app in `web/` with a basic layout and routing-less single page.
  - files: `web/`, `web/index.html`, `web/src/main.jsx`, `web/src/App.jsx`
  - acceptance: `npm run dev` (or documented equivalent) opens the app shell in the browser.
- [ ] `t5` Implement notes listing UI
  - intent: Fetch from GET `/api/notes` and render a list with title/body preview and actions.
  - files: `web/src/components/NotesList.jsx`, `web/src/App.jsx`
  - acceptance: Visiting the app shows persisted notes from `notes.json` via the API.
- [ ] `t6` Implement create and delete
  - intent: Add a form to create a note (title/body) and buttons to delete; handle duplicate-title errors inline.
  - files: `web/src/components/NoteForm.jsx`, `web/src/components/NotesList.jsx`
  - acceptance: Creating and deleting notes updates the list and persists to `notes.json`.
- [ ] `t7` Implement edit/update
  - intent: Add an editor to update a note’s body and optionally its title by calling PUT; ensure list refresh on save.
  - files: `web/src/components/NoteEditor.jsx`, `web/src/App.jsx`
  - acceptance: Editing a note updates data via the API and reflects immediately in the UI.
- [ ] `t8` Build and serve in production
  - intent: Wire `npm run build` to build the web app and have Express serve `web/dist` in production.
  - files: `package.json`, `server.js`, `web/`
  - acceptance: After build, starting the server serves the SPA and API under the same origin.
- [ ] `t9` Update README with web instructions
  - intent: Document dev and production commands and UI capabilities.
  - files: `README.md`
  - acceptance: README includes clear steps to run dev servers, build, and start production server.
- [ ] `t10` Manual verification
  - intent: Verify end-to-end that list/create/edit/delete work through the UI and persist to `notes.json`.
  - files: `notes.json`
  - acceptance: Performing CRUD via the UI results in corresponding changes in `notes.json` and correct UI state without errors.
