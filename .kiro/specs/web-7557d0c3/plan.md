# Plan — web-7557d0c3

<!-- factory:plan v=1 -->

## Design

Add a minimal Express server to expose a REST API over the existing file-backed notes store (`notes.json`) and serve a static frontend. Keep the current CLI intact. Titles remain the unique identifier to minimize changes; updates may rename a note if the new title is not taken. Endpoints: `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, `DELETE /api/notes/:title`.

Extend `notes.js` with list/read/remove/update helpers built around the existing `loadNotes()` and write path, enforcing unique titles and basic validation. The frontend will be a single static page (`public/index.html`) with vanilla JS (`public/app.js`) that fetches from the API to list notes and perform create/edit/delete inline.

Risks are low for single-user local usage; concurrent writes to `notes.json` are out of scope. Input validation and duplicate-title handling will return appropriate HTTP status codes so the UI can surface errors.

## Tasks

- [ ] `t1` Extend notes module with list/read/remove/update
  - intent: Add `listNotes()`, `readNote(title)`, `removeNote(title)`, and `updateNote(origTitle, { title, body })` using the existing JSON file storage, with duplicate-title checks and basic validation.
  - files: `notes.js`
  - acceptance: Helpers are exported and operate against `notes.json`, preventing duplicate titles and returning clear results for not-found cases.
- [ ] `t2` Add Express server and REST API
  - intent: Create `server.js` exposing `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, and `DELETE /api/notes/:title`, wiring to `notes.js`, validating inputs, and returning proper HTTP codes.
  - files: `server.js`
  - acceptance: Hitting the endpoints with curl or a REST client lists, creates, updates (including optional rename), and deletes notes with correct status codes.
- [ ] `t3` Serve static UI for CRUD
  - intent: Add `public/index.html`, `public/app.js`, and `public/styles.css` to render the notes list, create new notes, edit existing ones (title/body), and delete notes, using fetch calls to the API.
  - files: `public/index.html`, `public/app.js`, `public/styles.css`
  - acceptance: Loading the root URL renders existing notes and supports create/edit/delete with immediate UI updates and basic error display.
- [ ] `t4` Wire package scripts and dependencies
  - intent: Add Express dependency and scripts to `package.json` (e.g., `start`: `node server.js`), preserving the existing CLI entry.
  - files: `package.json`
  - acceptance: `npm install` completes and `npm start` launches the web server on a default port (e.g., 3000).
- [ ] `t5` Update README with web usage
  - intent: Document how to run the web UI, available API endpoints, and note on title uniqueness and rename behavior.
  - files: `README.md`
  - acceptance: README includes clear instructions for starting the server and using the UI/API.
- [ ] `t6` Manual verification
  - intent: Verify end-to-end: start server, ensure list loads; create a note; edit its body; rename the title; attempt duplicate-title create/edit and observe error; delete the note; confirm persistence across reload.
  - acceptance: All flows succeed or return expected errors, and `notes.json` reflects changes.
