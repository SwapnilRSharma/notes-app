# Plan — web-b0e4219a

<!-- factory:plan v=1 -->

## Design

We will introduce a minimal Express HTTP API that wraps the existing file-backed notes module so we can build a React UI without rewriting storage. The `notes.js` module will be extended from its current "add only" behavior to full CRUD (list, read, update, remove) while keeping the current JSON file persistence and unique-title constraint to avoid a data migration. Titles will remain the identifier to keep changes small; updating a note may also update its title as long as it does not collide.

On the frontend, we will scaffold a small React app (Vite) under `web/` that talks to the backend at `/api`. The UI will provide a list of notes, the ability to create a new note, select and edit an existing note (including changing its title), and delete a note. Basic optimistic UX with loading/error states will be included. Development will run both servers concurrently with npm scripts; the Vite dev server will proxy `/api` to the Express backend for local development.

## Tasks

- [x] `t1` Extend notes module to full CRUD
  - intent: Add `listNotes`, `getNote(title)`, `updateNote(oldTitle, { title, body })`, and `removeNote(title)` on top of existing add; centralize load/save helpers and enforce unique title on create/update.
  - files: `notes.js`
  - acceptance: Module exposes CRUD used by API; duplicate titles are rejected with clear errors; updates persist to `notes.json`.
- [x] `t2` Add Express API server
  - intent: Implement a thin REST API using Express with JSON body parsing and CORS: `GET /api/notes`, `GET /api/notes/:title`, `POST /api/notes`, `PUT /api/notes/:title`, `DELETE /api/notes/:title`; map to `notes.js` and return proper 2xx/4xx.
  - files: `server.js`, `package.json`
  - acceptance: Server starts on `PORT` (default 3001) and endpoints perform CRUD against `notes.json`.
- [x] `t3` Scaffold React app and dev wiring
  - intent: Create a Vite React app under `web/`, configure dev proxy from `/api` to backend, and add npm scripts to run `server`, `client`, and combined `dev` concurrently.
  - files: `web/**`, `package.json`
  - acceptance: Running `npm run dev` starts both backend and frontend; the app loads and can hit `/api/notes`.
- [ ] `t4` Implement notes UI (list/create/edit/delete)
  - intent: Build components for listing notes, creating a note, editing an existing note (including title changes with collision handling), and deleting with confirmation; include loading/error states.
  - files: `web/src/App.jsx`, `web/src/components/NotesList.jsx`, `web/src/components/NoteForm.jsx`, `web/src/components/NoteEditor.jsx`
  - acceptance: From the browser, a user can list notes, add, edit, and delete; changes persist and reflect on reload.
- [ ] `t5` Update documentation
  - intent: Document how to run the web UI and API locally, ports used, and basic API overview.
  - files: `README.md`
  - acceptance: README includes a Web UI section with start commands and brief API notes.
- [ ] `t6` End-to-end verification
  - intent: Manually verify flows: list existing notes from `notes.json`, create, edit (including renaming), delete, and confirm file contents updated; check duplicate-title errors are surfaced in UI.
  - acceptance: All flows succeed and `notes.json` reflects the changes after a refresh.
