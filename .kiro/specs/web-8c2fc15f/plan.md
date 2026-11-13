# Plan — web-8c2fc15f

<!-- factory:plan v=1 -->

## Design

Add a minimal Express REST API on top of the existing Node.js notes module and a small React (Vite) single-page app that consumes it. Persist to the existing `notes.json` file to avoid introducing a database. Keep the title as the primary identifier to minimize changes; when editing a note’s title, accept the old title in the URL and a `newTitle` in the payload.

Refactor `notes.js` to provide clear CRUD helpers that read/write `notes.json` safely. The Express server will expose `GET/POST/PUT/DELETE` under `/api/notes` and also serve the built React app (`client/dist`). The React UI will list notes, create new ones, edit existing notes (title and body), and delete notes. Add Playwright E2E tests to cover create → list, edit, and delete flows using the production build served by the Express server.

## Tasks

- [x] `t1` Refactor notes module for CRUD
  - intent: Provide list/add/update/remove functions on top of `notes.json`, keeping title as identifier and supporting optional title change via `newTitle`.
  - files: `notes.js`
  - acceptance: Module exports `listNotes`, `addNote`, `updateNote`, `removeNote` and they operate correctly on `notes.json`.
- [x] `t2` Add Express REST API
  - intent: Expose `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:title`, `DELETE /api/notes/:title` returning/accepting JSON.
  - files: `server.js`, `package.json`
  - acceptance: Hitting the endpoints with curl/Postman performs CRUD and returns appropriate status codes.
- [x] `t3` Scaffold React app (Vite)
  - intent: Create a Vite React app in `client/` with an `App.jsx` that fetches notes from `/api/notes` and renders an empty state.
  - files: `client/vite.config.js`, `client/index.html`, `client/src/main.jsx`, `client/src/App.jsx`, `package.json`
  - acceptance: The app builds successfully and initial render loads without errors against the API.
- [ ] `t4` Implement list and create flows
  - intent: Render a list of notes (title + body snippet) and a form to create notes (title, body) that posts to the API and refreshes the list; handle duplicate-title error messaging.
  - files: `client/src/App.jsx`
  - acceptance: Creating a note via the UI shows it immediately in the list; duplicates surface a visible error.
- [ ] `t5` Implement edit and delete flows
  - intent: Allow selecting a note to edit title/body (PUT to `/api/notes/:title` with optional `newTitle`) and delete a note with confirmation (DELETE), updating the list.
  - files: `client/src/App.jsx`
  - acceptance: Editing updates the rendered note; deleting removes it from the list without reload.
- [ ] `t6` Serve React build via Express and scripts
  - intent: Serve `client/dist` from Express and add npm scripts to build the client then start the server (`serve:web`); use relative API paths.
  - files: `server.js`, `package.json`
  - acceptance: `npm run serve:web` builds the client and serves the app with working API at `http://localhost:3000`.
- [ ] `t7` Playwright E2E tests
  - intent: Add Playwright config with `webServer` running `npm run serve:web` and tests that cover create → list, edit, and delete flows end-to-end.
  - files: `playwright.config.ts`, `tests/notes.e2e.spec.ts`, `package.json`
  - acceptance: `npx playwright test` runs against the served app and all tests pass.
- [ ] `t8` Update README for web UI
  - intent: Document how to build/serve the web UI and run the Playwright tests.
  - files: `README.md`
  - acceptance: README includes accurate run/build/test instructions that work as written.
