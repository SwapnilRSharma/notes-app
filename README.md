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

## Web Server (Frontend + API)

1. Install dependencies (adds Express if not already installed):

```bash
npm install
```

2. Start the web server:

```bash
npm start
# Server listens on http://localhost:3000
```

3. Open the frontend in your browser: http://localhost:3000

### API Endpoints

- List notes

```bash
curl http://localhost:3000/api/notes
```

- Create note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"Shopping","body":"Buy milk and bread"}'
```

- Read note

```bash
curl http://localhost:3000/api/notes/Shopping
```

- Update note (rename and/or edit body)

```bash
curl -X PUT http://localhost:3000/api/notes/Shopping \
  -H 'Content-Type: application/json' \
  -d '{"title":"Groceries","body":"Milk, bread, eggs"}'
```

- Delete note

```bash
curl -X DELETE http://localhost:3000/api/notes/Groceries -i
```

## License

ISC
