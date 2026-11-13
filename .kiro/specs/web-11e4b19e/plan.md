# Plan — web-11e4b19e

<!-- factory:plan v=1 -->

## Design

Add a tiny HTTP API alongside the existing CLI so a React SPA can perform CRUD against the same storage (the current `notes.json`). Keep the CLI (`app.js`) unchanged by introducing a separate `server.js` (Express) that wraps functions in `notes.js`. Expose REST endpoints for list, create, update, and delete. In dev, run the API on a port with CORS enabled; in production, serve the built SPA statically from Express.

Extend `notes.js` minimally to support the missing operations (list, read, remove, update) while continuing to use the title as the unique key to avoid a broader ID migration. Allow title changes by performing a guarded rename (fail when the new title collides). Add a small `saveNotes` helper to reduce duplication. Risks: concurrent writes to `notes.json` are non-atomic and could race; acceptable for this single-user local tool. Title-as-key means edits that rename must handle conflicts predictably.

Create a React app (Vite) under `web/` with a compact UI: a notes list with inline actions, a create form, and an edit flow (reusing the same form). Implement a tiny API client module for the HTTP endpoints. Verification covers CRUD via UI in dev mode and a production build served from Express.

## Tasks

- [x] `t1` Add HTTP API server (Express)
  - intent: Create `server.js` exposing REST endpoints to list, create, update (including optional title change), and delete notes using `notes.js` helpers; enable CORS for dev.
  - files: `server.js`, `package.json`
  - acceptance: Starting `node server.js` exposes GET/POST/PUT/DELETE under `/api/notes` and returns JSON per operation.
- [x] `t2` Extend notes module for full CRUD
  - intent: Add `listNotes`, `readNote`, `removeNote`, `updateNote(title, { title?, body? })`, and `saveNotes` to `notes.js`, preserving existing `addNotes` behavior and using title as the unique key with guarded rename.
  - files: `notes.js`, `notes.json`
  - acceptance: Calling the new functions manipulates `notes.json` correctly; duplicates by title are rejected and updates persist.
- [x] `t3` Initialize React app (Vite) under web/
  - intent: Scaffold a Vite React app under `web/` with npm scripts; add basic routes or views without heavy state management.
  - files: `web/package.json`, `web/index.html`, `web/vite.config.ts`, `web/src/main.tsx`, `web/src/App.tsx`
  - acceptance: `npm run dev` in `web/` starts the app and shows a placeholder page.
- [x] `t4` Implement API client and types
  - intent: Add a small API client for the notes endpoints and shared `Note` type; configure base URL via env (default to `http://localhost:3000`).
  - files: `web/src/api/client.ts`, `web/src/types.ts`, `web/.env.example`
  - acceptance: API client methods perform successful requests against the running API server in dev.
- [x] `t5` Build Notes UI (list, create, delete)
  - intent: Implement notes listing with loading/error states and a create form that posts to the API and refreshes the list; add delete actions per row.
  - files: `web/src/components/NotesList.tsx`, `web/src/components/NoteForm.tsx`, `web/src/App.tsx`
  - acceptance: From the UI, users can list existing notes, add a new note, and delete a note with the list updating accordingly.
- [x] `t6` Add Edit flow (title/body)
  - intent: Reuse the form for editing an existing note; allow changing title if non-conflicting and updating body; reflect errors from the API.
  - files: `web/src/components/EditNoteModal.tsx`, `web/src/components/NoteForm.tsx`, `web/src/App.tsx`
  - acceptance: Users can edit a note (title and body) and see changes persisted and reflected in the list.
- [x] `t7` Serve SPA in production and configure dev CORS
  - intent: Add CORS middleware in `server.js` for dev, and static file serving for `web/dist` in production; add a build script to produce assets and wire Express to serve them.
  - files: `server.js`, `web/package.json`
  - acceptance: `npm run build` in `web/` then starting `server.js` serves the SPA and API on the same origin.
- [ ] `t8` Verification
  - intent: Verify end-to-end flows: list existing notes, create, edit (title/body), delete; test both dev (separate ports with CORS) and production (built SPA served by Express).
  - acceptance: All CRUD operations function via the UI without page reloads; no duplicate titles allowed; production serve works.
