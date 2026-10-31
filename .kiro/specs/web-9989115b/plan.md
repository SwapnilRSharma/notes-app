# Plan — web-9989115b

<!-- factory:plan v=1 -->

## Design

Add a minimal web UI on top of the existing CLI notes app by introducing a small Express server that exposes CRUD endpoints backed by the current `notes.json` file, and serves a static, framework-free frontend. Keep the CLI intact; the web mode runs via a separate entry (`npm start`).

Extend the `notes.js` module with the missing CRUD utilities so both the API and any future callers share one source of truth for reading/writing `notes.json`. Serve the frontend from a `public/` folder (single page, vanilla JS using `fetch`) on the same origin to avoid CORS and simplify deployment. Scope is single-user, no auth, functional styling.

## Tasks

- [x] `t1` Add Express server exposing CRUD and serving static UI
  - intent: Create `server.js` with REST endpoints for list/create/read/update/delete notes and static file hosting from `public/`.
  - files: `server.js`, `package.json`
  - acceptance: Running `npm start` serves UI at http://localhost:3000 and `GET /api/notes` returns JSON list.
- [ ] `t2` Extend notes module with CRUD helpers
  - intent: Add and export list/read/update/remove and save helpers in `notes.js` to back the API with `notes.json` persistence.
  - files: `notes.js`
  - acceptance: API operations mutate `notes.json` and reflect on subsequent reads/refreshes.
- [ ] `t3` Build minimal frontend (vanilla JS)
  - intent: Create `public/index.html`, `public/main.js`, and optional `public/styles.css` to list notes and support create, edit, delete, and view flows via `fetch` calls to the API.
  - files: `public/index.html`, `public/main.js`, `public/styles.css`
  - acceptance: From the browser, a user can create, edit, delete, and view notes; page refresh shows persisted changes.
- [ ] `t4` Update documentation
  - intent: Document how to run the web UI (install, `npm start`, endpoints overview) and note CLI remains available.
  - files: `README.md`
  - acceptance: README includes a Web UI section with start instructions and a brief API summary.
- [ ] `t5` Verify API and UI behavior
  - intent: Smoke-test endpoints with curl (list, create, update, delete) and verify the UI mirrors changes and persists.
  - acceptance: curl calls succeed with expected payloads and the UI reflects the same state after reload.
