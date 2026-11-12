# Plan — web-7557d0c3

<!-- factory:plan v=1 -->

## Design

Add a minimal Express server to expose a REST API over the existing file-backed notes store (`notes.json`). Build a React single-page app using Vite under `client/` that consumes the API. In development, the Vite dev server (default 5173) will proxy `/api` to the Express backend (default 3000) to avoid CORS. In production, the Express server can serve the built static files from `client/dist`.

Extend `notes.js` with list/read/remove/update helpers built around the existing `loadNotes()` and write path, enforcing unique titles and basic validation. The frontend will be a React app with components for listing notes, creating, editing (including optional rename), and deleting, using `fetch` against the API.

Keep the current CLI intact. Titles remain the unique identifier to minimize changes; updates may rename a note if the new title is not taken. Endpoints: `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, `DELETE /api/notes/:title`. Risks are low for single-user local usage; concurrent writes to `notes.json` are out of scope.

## Tasks

- [x] `t1` Extend notes module with list/read/remove/update
  - intent: Add `listNotes()`, `readNote(title)`, `removeNote(title)`, and `updateNote(origTitle, { title, body })` using the existing JSON file storage, with duplicate-title checks and basic validation.
  - files: `notes.js`
  - acceptance: Helpers are exported and operate against `notes.json`, preventing duplicate titles and returning clear results for not-found cases.
- [x] `t2` Add Express server and REST API
  - intent: Create `server.js` exposing `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, and `DELETE /api/notes/:title`, wiring to `notes.js`, validating inputs, and returning proper HTTP codes.
  - files: `server.js`
  - acceptance: Hitting the endpoints with curl or a REST client lists, creates, updates (including optional rename), and deletes notes with correct status codes.
- [ ] `t3` Scaffold React + Vite SPA
  - intent: Initialize a Vite React app under `client/` to implement the notes UI as a SPA that consumes the backend API; include a proxy for `/api` during development.
  - files: `client/index.html`, `client/src/main.jsx`, `client/src/App.jsx`, `client/package.json`, `client/vite.config.js`
  - acceptance: Running the Vite dev server shows the app shell and loads the notes list via `/api` through the proxy without CORS issues.
- [ ] `t4` Wire package scripts and dependencies
  - intent: Add Express dependency and scripts to the root `package.json` for the backend (`start`: `node server.js`), and use the `client/package.json` Vite scripts (`dev`, `build`, `preview`); optionally serve `client/dist` in production from Express.
  - files: `package.json`, `client/package.json`, `server.js`
  - acceptance: `npm start` launches the backend on port 3000; in `client/`, `npm run dev` launches the Vite dev server with `/api` proxy; `npm run build` creates `client/dist` which the backend can serve.
- [ ] `t5` Update README with web usage
  - intent: Document how to run the web UI, available API endpoints, and note on title uniqueness and rename behavior.
  - files: `README.md`
  - acceptance: README includes clear instructions for starting the backend and the Vite dev server, building the SPA, and using the UI/API.
- [ ] `t6` Manual verification
  - intent: Verify end-to-end with the React app: start backend and Vite dev server, ensure list loads; create a note; edit its body; rename the title; attempt duplicate-title create/edit and observe error; delete the note; confirm persistence across reload and after a production build served by Express.
  - acceptance: All flows succeed or return expected errors, and `notes.json` reflects changes; production build also works when served by the backend.
