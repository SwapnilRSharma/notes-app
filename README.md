# notes-app

Simple notes application with:

- REST API (Express) exposing CRUD over `notes.json`
- React web UI (Vite) that calls the API
- Playwright E2E tests covering list/create/edit/delete flows

Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Setup

1. Install dependencies:

```bash
npm install
# also install web UI deps
npm install --prefix web
```

2. Run the CLI using Node (legacy CLI):

```bash
node app.js --help
```

## Run API and Web

- API server: Express with CORS enabled in dev
  - Port: 4317 (set `PORT` to override)
  - Start: `npm run api`

- Web app: Vite dev server with proxy to API
  - Port: 5180
  - Start: `npm run web`

- Dev (both API and Web concurrently):
  - `npm run dev`

Open the web UI at http://localhost:5180

## CLI Usage (optional)

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

## E2E Tests

Playwright tests boot both API and Web and exercise CRUD flows.

1. Ensure dependencies are installed (see Setup) and Playwright browsers are available:

```bash
npx playwright install chromium
```

2. Run tests:

```bash
npx playwright test
```

The config starts the API on :4317 and the web on :5180 and records video and traces.
```

## License

ISC
