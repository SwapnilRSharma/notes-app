# Plan — web-505b187e

<!-- factory:plan v=1 -->

## Design

Add a minimal web layer to the existing Node.js CLI notes app by introducing an Express server that exposes CRUD endpoints over the current `notes.json` file storage. Extend the existing `notes.js` module to provide list/read/update/remove helpers the API can call, keeping synchronous file I/O to avoid concurrency hazards in a single-process setup. Validate inputs and enforce unique titles, returning clear HTTP status codes.

Serve a lightweight single-page frontend (static HTML with Tailwind via CDN and a small vanilla JS file) from the same Express server. The homepage renders a searchable list of notes (client-side filter). A "Create a note" button opens a modal to submit a new note. Clicking a note opens a modal showing the note with an Edit toggle to switch to inline editing within the same modal; support Delete with confirmation. Keep dependencies minimal and avoid a bundler to reduce scope.

Risks are limited to file write contention and lack of authentication; both are acceptable for this scope. If future needs change (multi-user, auth, scale), the storage can migrate to a DB and the UI to a fuller SPA without changing the external UX.

## Tasks

- [x] `t1` Add Express REST API server
  - intent: Create an Express server exposing CRUD endpoints for notes and serving the static frontend.
  - files: `server.js`, `package.json`
  - acceptance: Starting the server and GET `/api/notes` returns a JSON array; POST/PUT/DELETE operate on `notes.json` with appropriate status codes.
- [x] `t2` Extend notes module with CRUD helpers
  - intent: Add `listNotes`, `readNote`, `updateNote`, `removeNote`, and `saveNotes`; keep `addNotes`; validate inputs and enforce unique titles.
  - files: `notes.js`
  - acceptance: API uses these functions; duplicate titles are rejected; updates and deletes persist in `notes.json`.
- [x] `t3` Frontend scaffold (HTML + Tailwind + JS)
  - intent: Build a static page with a search input, notes list, and a reusable modal component; wire fetch calls to the API.
  - files: `public/index.html`, `public/app.js`, `public/styles.css`
  - acceptance: Visiting `/` shows notes and a search bar; typing filters client-side; no JS errors in console.
- [x] `t4` Implement Create Note dialog
  - intent: Add "Create a note" button opening a modal with form; submit via POST to `/api/notes`; refresh list and handle errors.
  - files: `public/app.js`, `public/index.html`
  - acceptance: Creating a note via UI persists to `notes.json` and appears immediately in the list.
- [ ] `t5` View, Edit (inline), and Delete in modal
  - intent: Open a note in a modal view; toggle to edit within the same modal; submit via PUT; support Delete with confirmation.
  - files: `public/app.js`, `public/index.html`
  - acceptance: Editing updates the note and list without reload; deleting removes it after confirm.
- [ ] `t6` Basic validation and error surfacing
  - intent: Validate required fields on server; map errors to HTTP 400/409; surface messages in the modal UI.
  - files: `server.js`, `notes.js`, `public/app.js`
  - acceptance: Empty title/body is blocked with message; duplicate title shows a clear error.
- [ ] `t7` Verify API and UI flows
  - intent: Manually verify CRUD via curl and exercise UI flows end-to-end; add a short run section to README for the web server.
  - files: `README.md`
  - acceptance: README includes start instructions and curl examples; all UI flows (list/search/create/view/edit/delete) work locally.
