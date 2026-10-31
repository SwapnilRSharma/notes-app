# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

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

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## Web UI

This project also includes a minimal web UI served by an Express server.

### Run the web UI

```bash
npm start
# then open http://localhost:3000
```

The UI lets you create, edit, and delete notes. Notes are persisted in `notes.json` (same as the CLI).

### API overview

All endpoints are JSON over HTTP under `/api`.

```http
GET    /api/notes                 # list notes -> 200 [{ title, body }]
GET    /api/notes/:title          # read one   -> 200 { title, body } | 404
POST   /api/notes                 # create     -> 201 { ok: true } | 400 (duplicate/title missing)
PUT    /api/notes/:title          # update     -> 200 { title, body } | 404 | 400 (duplicate)
DELETE /api/notes/:title          # delete     -> 200 { ok: true } | 404
```

Notes are keyed by `title` and must be unique.

## License

ISC
