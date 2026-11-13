# Notes Web App

Full‑stack notes application consisting of:
- Express HTTP API exposing CRUD endpoints under `/api/notes`.
- React single‑page app (Vite) that consumes the API.

Notes are stored locally in `notes.json` at the project root. Each note has a stable `id` assigned on write.

## Requirements

- Node.js 18+ (LTS recommended)

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the API and Vite dev server together (Vite proxies `/api` to the API):

```bash
npm run dev
```

Open the app at the URL Vite prints (default http://localhost:5180).

## Build

Build the SPA assets into `web/dist`:

```bash
npm run build
```

## Start (Production)

Serve the API and the built SPA on a single port:

```bash
npm start
```

By default the server listens on port `5174` (override with `PORT`).

## End‑to‑End Tests

This project uses Playwright for browser E2E tests. To run them locally:

```bash
# First time only, install browsers
npx playwright install --with-deps

# Run the suite (builds the app and serves it automatically)
npm run test:e2e
```

The tests will reset `notes.json` between runs to ensure isolation.

## API Overview

Base URL: `/api`

Data shape for a note:

```json
{
  "id": "string",         
  "title": "string",
  "body": "string"
}
```

Endpoints:

- `GET /api/notes` → `200` JSON array of notes
- `POST /api/notes` body `{ title, body }` → `201` created note
- `PUT /api/notes/:id` body `{ title?, body? }` → `200` updated note or `404`
- `DELETE /api/notes/:id` → `200 { success: true }` or `404`

Errors are returned as `{ error: string }` with appropriate HTTP status codes.

## CLI (Legacy)

The original CLI remains available for basic usage during transition:

```bash
node app.js --help
node app.js add --title "Shopping" --body "Buy milk and bread"
```

## License

ISC
