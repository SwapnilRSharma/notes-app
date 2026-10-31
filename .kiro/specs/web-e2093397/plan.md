# Plan — web-e2093397

<!-- factory:plan v=1 -->

## Design

Add a small Express server that serves a minimal single-page web UI and a REST API backed by the existing `notes.json` file for persistence. Keep the current CLI intact by isolating the web server in a new `server.js` and reusing/extending `notes.js` for data operations. Use same-origin requests so no CORS is required.

Extend `notes.js` with proper CRUD helpers over the JSON store: list all notes, read by title, add with duplicate-title protection, update (including optional title change with conflict check), and remove by title. Titles remain the unique identifier to avoid introducing migrations or IDs.

The frontend will be a small static app in `public/` (vanilla HTML/CSS/JS) that calls the API to create, list, edit, and delete notes. It renders the list, supports inline edit/delete actions, and shows basic validation/error messages. npm scripts will include a `start` for running the web server.

## Tasks

- [x] `t1` Add Express server scaffold
  - intent: Introduce an Express app to serve static files and expose a JSON API under `/api/notes`.
  - files: `package.json`, `server.js`
  - acceptance: Running `npm start` serves a homepage at `http://localhost:3000/`.
- [x] `t2` Implement CRUD utilities in notes module
  - intent: Extend `notes.js` with list, read, add (exists), update, and remove using `notes.json` with title uniqueness and safe file writes.
  - files: `notes.js`
  - acceptance: Data helpers return/throw results enabling the API to detect 404 and 409 cases.
- [x] `t3` Implement REST API endpoints
  - intent: Add routes: GET `/api/notes`, POST `/api/notes`, PUT `/api/notes/:title`, DELETE `/api/notes/:title` with validation and appropriate status codes.
  - files: `server.js`
  - acceptance: API supports create/list/edit/delete with 200/201/404/409 responses and persists to `notes.json`.
- [ ] `t4` Build minimal web UI
  - intent: Create a simple SPA in `public/` with a form to add/edit and a list with edit/delete actions using Fetch to the API.
  - files: `public/index.html`, `public/app.js`, `public/styles.css`
  - acceptance: From a browser, a user can create, list, edit, and delete notes without reloading the page.
- [ ] `t5` Wire npm script and update README
  - intent: Add `start` script for the web server and document how to run and use the web UI.
  - files: `package.json`, `README.md`
  - acceptance: `npm start` launches the server; README explains starting and using the UI.
- [ ] `t6` Verify end-to-end behavior
  - intent: Manually verify CRUD flows via the UI and confirm `notes.json` contents reflect changes.
  - acceptance: All CRUD operations succeed and persist; invalid operations surface clear error messages.
