# Plan — web-c4633b8d

<!-- factory:plan v=1 -->

## Design

Add a minimal web layer to the existing Node.js notes CLI by introducing an Express server that exposes CRUD endpoints over the current file-backed storage (`notes.json`) and serves a small static frontend. To keep the change small and local, we will reuse the existing storage file and module (`notes.js`) while extending it to support stable `id` fields and the remaining CRUD operations (list, update, remove). On load, any legacy notes without an `id` will be assigned one and persisted, ensuring backward compatibility with existing data.

The API will be REST-ish: `GET /api/notes`, `POST /api/notes`, `PUT /api/notes/:id`, and `DELETE /api/notes/:id`. The frontend will be a single static page (`public/index.html` with `public/app.js`) that lists notes, provides a create form, supports inline edit, and delete with confirmation. Everything runs from one process (`node server.js`), no auth and no external DB. This keeps scope tight and risk low while delivering the requested UI features.

## Tasks

- [x] `t1` Add Express server scaffold and static hosting
  - intent: Create `server.js` with Express, JSON body parsing, and static file serving from `public/`.
  - files: `package.json`, `server.js`
  - acceptance: Running `node server.js` starts a server serving `public/index.html` at `/`.
- [x] `t2` Extend storage module with IDs and full CRUD
  - intent: Update `notes.js` to support list, get-by-id, add (with unique id), update, and remove; on load, assign ids to legacy notes and persist.
  - files: `notes.js`, `notes.json`
  - acceptance: Requiring the module exposes functions that operate on `notes.json` and preserve data with new `id` fields.
- [ ] `t3` Implement REST API endpoints
  - intent: Wire Express routes `GET/POST/PUT/DELETE` under `/api/notes` to the storage functions with minimal validation and proper status codes.
  - files: `server.js`
  - acceptance: cURLing endpoints performs CRUD and returns JSON payloads with 2xx/4xx codes as appropriate.
- [ ] `t4` Build static UI shell
  - intent: Add `public/index.html` and `public/styles.css` with a simple layout for list, create form, and edit panel/modal placeholders.
  - files: `public/index.html`, `public/styles.css`
  - acceptance: Visiting `/` renders the shell with empty list and form elements.
- [ ] `t5` Implement list and create in frontend
  - intent: Write `public/app.js` to fetch and render notes, and submit new notes via `POST /api/notes` with optimistic refresh.
  - files: `public/app.js`
  - acceptance: Creating a note updates the list without page reload.
- [ ] `t6` Implement edit and delete in frontend
  - intent: Add inline edit UI (toggle to edit fields, save via `PUT /api/notes/:id`) and delete buttons with confirmation calling `DELETE /api/notes/:id`.
  - files: `public/app.js`
  - acceptance: Editing updates a note and deleting removes it from the list after confirmation.
- [ ] `t7` Light styling and UX polish
  - intent: Apply minimal CSS for readability; ensure mobile-friendly layout with basic responsive styles.
  - files: `public/styles.css`
  - acceptance: UI is readable on desktop and mobile widths; buttons and inputs are spaced.
- [ ] `t8` Document web usage
  - intent: Update `README.md` with instructions to start the web server and describe available endpoints and UI features.
  - files: `README.md`
  - acceptance: README includes a Web UI section with start command and brief feature list.
- [ ] `t9` Verify API and UI behavior
  - intent: Manually verify endpoints with cURL and exercise the UI flow (list/create/edit/delete) end-to-end on localhost.
  - acceptance: All CRUD operations work via API and UI; `notes.json` reflects changes with stable ids.
