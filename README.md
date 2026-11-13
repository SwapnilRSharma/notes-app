# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 18+ (LTS recommended)

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

## Web UI

This project also includes a simple web UI and REST API.

Build the frontend:

```bash
npm run build:web
```

Start the server (serves API and built UI) on http://localhost:5174:

```bash
npm start
```

Open your browser to http://localhost:5174 to use the Notes UI.

## E2E Tests

End-to-end tests are written with Playwright and drive the real app in a browser.

Install Playwright browsers (first run only):

```bash
npx playwright install --with-deps
```

Run the tests:

```bash
npm run test:e2e
```

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
