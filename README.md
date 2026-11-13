# notes-app

Notes application with:
- CLI (Node.js + yargs)
- HTTP API (Express at `/api`)
- Web UI (React + Vite under `web/`)

Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the CLI using Node:

```bash
node app.js --help
```

## CLI Usage

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

## Web UI & API

The web UI runs on Vite (default port 5173) and talks to the backend API (default port 3001). During development, the Vite dev server proxies `/api` to the backend.

### Install dependencies

```bash
npm install           # root deps (express, etc.)
cd web && npm install # web deps (react, vite)
```

### Start both (dev)

From the repo root:

```bash
npm run dev
```

This runs:
- API server on http://localhost:3001
- Web UI on http://localhost:5173 (proxying `/api` to the API server)

Alternatively, run them separately:

```bash
# Terminal 1
npm run server

# Terminal 2
npm --prefix web run dev
```

### API overview

Base URL: `http://localhost:3001/api`

Endpoints:
- `GET /notes` → `[ { title, body }, ... ]`
- `GET /notes/:title` → `{ title, body }` or 404
- `POST /notes` with JSON `{ title, body }` → 201 with created note, or 409 on duplicate title
- `PUT /notes/:title` with JSON `{ title?, body? }` → 200 with updated note; 404 if not found; 409 on duplicate title when renaming
- `DELETE /notes/:title` → 204; 404 if not found

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
