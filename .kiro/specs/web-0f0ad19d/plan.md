# Plan — web-0f0ad19d

<!-- factory:plan v=1 -->

## Design

Introduce a small Express server alongside the existing CLI to expose a REST API for notes (list, create, update, delete) backed by the current `notes.json` file. Keep the CLI behavior intact by adding a new `server.js` entrypoint and a `start` npm script. Serve a static single-page UI (vanilla HTML/CSS/JS) from `public/` that calls the API with `fetch` and renders a list with inline create/edit/delete.

To support reliable editing/deleting, add stable `id` fields to notes on creation. Maintain backward compatibility for existing data in `notes.json` by generating ephemeral ids for notes missing `id` on load, and persisting them on the next write. Keep storage simple (still a flat JSON array) and avoid adding a database. Avoid enforcing title uniqueness in the web UI; the API will allow duplicates to reduce friction.

Main risks are light: coordinating data migration for legacy notes without ids and ensuring basic error handling (validation, 404 when id not found). The approach is minimal, uses dependencies already common to Node apps, and keeps concerns separated (module handles persistence; server exposes API; frontend is static).

## Tasks

- [x] `t1` Add Express server and REST API
  - intent: Create `server.js` with Express and JSON body parsing; implement `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:id`, `DELETE /api/notes/:id` delegating to the notes module; serve static files from `public/`.
  - files: `server.js`, `package.json`
  - acceptance: Starting the app with `npm start` serves the UI at `/` and responds to `/api/notes*` routes.
- [x] `t2` Extend notes module for full CRUD with ids
  - intent: In `notes.js`, add functions to list, update, and remove notes; generate `id` (e.g., timestamp + random) on create; on load, assign ids to notes missing them and persist on next write; factor a `saveNotes` helper.
  - files: `notes.js`, `notes.json`
  - acceptance: Programmatic calls can add, list, update, and delete notes by id; data file retains ids.
- [x] `t3` Build static web UI
  - intent: Implement `public/index.html`, `public/app.js`, and `public/styles.css` to render the notes list, provide a create form, and support inline edit/delete with optimistic UI and basic validation.
  - files: `public/index.html`, `public/app.js`, `public/styles.css`
  - acceptance: In a browser, users can create, edit, and delete notes and see changes reflected immediately.
- [x] `t4` Wire npm scripts and minimal docs
  - intent: Add `start` script to `package.json` (e.g., `node server.js`) and update `README.md` with web UI instructions.
  - files: `package.json`, `README.md`
  - acceptance: `npm start` is documented and launches the server with usage notes.
- [x] `t5` Verification: API and UI flows
  - intent: Manually verify endpoints with curl (create, list, update, delete) and confirm `notes.json` updates; then run the UI to perform the same flows and confirm persistence.
  - files: `notes.json`
  - acceptance: All CRUD operations work via API and UI with correct persistence and error handling for missing ids.
