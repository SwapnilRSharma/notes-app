# Notes App (CLI + Web UI)

Node.js notes application with:
- CLI built with yargs
- REST API (Express) that persists to `notes.json`
- React single-page web UI (Vite) consuming the API

## Requirements

- Node.js 18+ (LTS recommended)

## Setup

1. Install root dependencies (server + tests):

```bash
npm install
```

2. Install client dependencies (Vite React app):

```bash
npm --prefix client install
```

3. Run the CLI using Node (optional):

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

## REST API

Start the API-only server:

```bash
npm start
```

Default port is `3000` (configurable via `PORT`). Endpoints:

- `GET /api/notes` → list notes
- `POST /api/notes` → create note `{ title, body }` (409 on duplicate title)
- `PUT /api/notes/:title` → update note with optional `{ newTitle, body }` (404 if missing, 409 on duplicate `newTitle`)
- `DELETE /api/notes/:title` → delete note (204 on success, 404 if missing)

## Web UI

Build the client and serve the production build via Express:

```bash
# Builds client (Vite) and starts Express server
npm run serve:web
```

Open http://localhost:3000 to view the app. The UI lets you:
- Create notes (title + body)
- Edit a note’s title and body
- Delete a note with confirmation

Notes load from and save to the same `notes.json` used by the CLI.

## End-to-End Tests (Playwright)

This repo includes Playwright E2E tests exercising the web UI (create → list, edit, delete).

First-time only, ensure browsers are installed:

```bash
npx playwright install --with-deps
```

Run the tests:

```bash
npx playwright test
```

The test runner will build the client and start the web server automatically on an uncommon port (configured via `playwright.config.ts`), recording video and trace for each run.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
