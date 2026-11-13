# Plan — web-363c97ae

<!-- factory:plan v=1 -->

## Design

Introduce a minimal HTTP API and a React single-page app on top of the existing CLI notes tool. Keep the current storage (`notes.json`) and extend the in-repo `notes.js` module to provide CRUD helpers and assign a stable `id` to notes that don’t have one yet (generated on write). This avoids a separate migration pass while keeping backward compatibility for any existing data. Add an Express server exposing `GET/POST/PUT/DELETE` under `/api/notes` and serve the built SPA assets in production.

Create a React app (Vite + React) in a `web/` directory. The UI will render a list of notes with inline actions to create, edit, and delete. A single form component will handle both create and edit flows. The client will call the `/api` endpoints and maintain optimistic UI updates guarded by server responses to keep interactions snappy and simple. In dev, Vite will proxy `/api` to the Express server.

Key risks: normalizing legacy notes without `id` (handled by assigning ids on load/save), and keeping the CLI usable (preserved by adding a new `server.js` rather than replacing `app.js`). To simplify deployment, the Express server will also serve the SPA build so a single `npm start` runs both API and UI.

## Tasks

- [x] `t1` Add REST API server and storage helpers
  - intent: Introduce Express with `/api/notes` CRUD and extend `notes.js` with `list/add/update/remove` utilities that ensure each note has a unique `id` persisted in `notes.json`.
  - files: `server.js`, `notes.js`, `package.json`
  - acceptance: API responds with JSON for list/create/update/delete and changes persist to `notes.json`.
- [x] `t2` Scaffold React app with Vite and dev proxy
  - intent: Create `web/` Vite + React SPA with a dev proxy mapping `/api` to the Express port and add npm scripts for dev/build.
  - files: `web/index.html`, `web/src/main.jsx`, `web/src/App.jsx`, `web/vite.config.js`, `package.json`
  - acceptance: Running the dev script serves the SPA and API together via the proxy without CORS errors.
- [ ] `t3` Implement notes UI (list/create/edit/delete)
  - intent: Build components for listing notes, a reusable form for create/edit, and wire buttons to call the API with basic validation and error handling.
  - files: `web/src/components/NotesList.jsx`, `web/src/components/NoteForm.jsx`, `web/src/api/client.js`
  - acceptance: From the browser, users can list existing notes, add a new note, edit a note, and delete a note with visible updates.
- [ ] `t4` Serve SPA in production from Express
  - intent: Configure Express to serve `web/dist` and fall back to `index.html` for client routing; add scripts to build and start the combined app.
  - files: `server.js`, `web/vite.config.js`, `package.json`, `README.md`
  - acceptance: `npm run build` then `npm start` serves both the API and the SPA on one port.
- [ ] `t5` Playwright E2E tests for key flows
  - intent: Add Playwright with a `webServer` that builds and serves the app; write tests covering list, create, edit, and delete flows, resetting `notes.json` between tests.
  - files: `playwright.config.ts`, `tests/e2e/notes.spec.ts`, `package.json`
  - acceptance: `npx playwright test` runs to green locally, verifying all core user flows.
- [ ] `t6` Update documentation
  - intent: Document dev, build, start, and test commands plus API overview and data shape.
  - files: `README.md`
  - acceptance: README includes clear steps to run the app and the tests end-to-end.
