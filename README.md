# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

This repo now also includes:

- An HTTP API server (`server.js`) that exposes CRUD endpoints under `/api/notes` (Express)
- A React single-page app under `web/` (Vite) that consumes the API

## Requirements

- Node.js 12+ (LTS recommended)

## Setup

1. Install dependencies:

```bash
npm install
cd web && npm install && cd -
```

2. Run the CLI using Node:

```bash
node app.js --help
```

## Usage

Currently implemented commands:

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Other available commands (scaffolds): `list`, `read`, `remove`.

- List notes (placeholder):

```bash
node app.js list
```

- Read a note (placeholder):

```bash
node app.js read --title "Shopping"
```

- Remove a note (placeholder):

```bash
node app.js remove --title "Shopping"
```

Notes are saved to `notes.json`. If the file does not exist, it will be created on first add.

## API Server

Start the API server (CORS enabled in dev):

```bash
npm run start:api
```

Endpoints:

- `GET /api/notes` -> `{ notes: Note[] }`
- `GET /api/notes/:title` -> `{ note: Note }`
- `POST /api/notes` body: `{ title, body }` -> `{ note }` (409 when duplicate title)
- `PUT /api/notes/:title` body: `{ title?, body? }` -> `{ note }` (409 when duplicate title)
- `DELETE /api/notes/:title` -> `{ ok: true }`

`Note` shape:

```ts
type Note = { title: string; body: string }
```

## Web App (Vite + React)

Development (separate ports with CORS):

```bash
cd web
cp .env.example .env # optional; defaults to http://localhost:3000
npm run dev
# Visit the shown URL (e.g., http://localhost:5173)
# Start the API separately: npm run start:api (from repo root)
```

Production build served by Express:

```bash
cd web && npm run build && cd -
NODE_ENV=production npm run start:api
# Visit http://localhost:3000 — the SPA and API share the same origin
```

## Verification

End-to-end (dev):

1. Start API: `npm run start:api`
2. Start web: `cd web && npm run dev`
3. In the browser:
   - Create a note (title/body). Duplicate titles should be rejected.
   - See the list refresh with the new note.
   - Delete a note; it disappears from the list.
   - Edit a note; update title and/or body; conflicts show an error.

End-to-end (production):

1. Build SPA: `cd web && npm run build`
2. Serve via Express: `NODE_ENV=production npm run start:api`
3. Visit http://localhost:3000 and repeat the CRUD checks above.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
