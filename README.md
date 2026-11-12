# notes-app

Simple Notes application with a CLI and a web UI. Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Setup (CLI)

1. Install dependencies:

```bash
npm install
```

2. Run the CLI using Node:

```bash
node app.js --help
```

## Web UI

The web UI consists of an Express backend (port 3000 by default) and a React + Vite frontend (port 5173 in dev).

### Install

At the repo root (backend):

```bash
npm install
```

In the client (frontend):

```bash
cd client
npm install
```

### Run (development)

Terminal 1 — start the backend (Express API on http://localhost:3000):

```bash
npm start
```

Terminal 2 — start the frontend (Vite dev server on http://localhost:5173 with `/api` proxy):

```bash
cd client
npm run dev
```

Open the UI at http://localhost:5173.

### Build (production)

```bash
cd client
npm run build
```

Then start the backend; it will serve the built UI from `client/dist`:

```bash
npm start
```

Open http://localhost:3000.

### API Endpoints

- `GET /api/notes` — list notes
- `POST /api/notes` — create note `{ title, body }`
- `PUT /api/notes/:title` — update or rename note; body may include `{ title, body }`
- `DELETE /api/notes/:title` — remove a note

Constraints: titles are unique identifiers. Attempts to create or rename to an existing title will return HTTP 409.

## Usage (CLI)

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

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
