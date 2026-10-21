# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended; Node 18+ tested)

## Setup

1. Install dependencies:

```bash
npm install
```

2. See available commands and options:

```bash
node app.js --help
```

## Usage

Implemented commands:

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Behavior:

- Notes are persisted to `notes.json` in the project root. The file is created automatically on first write.
- Titles must be unique. Attempting to add a note with an existing title prints "Note Title Taken." and does not overwrite the original.

Scaffolded (placeholder) commands:

- List notes:

```bash
node app.js list
```

- Read a note:

```bash
node app.js read --title "Shopping"
```

- Remove a note:

```bash
node app.js remove --title "Shopping"
```

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Attempt to add a duplicate title (will be rejected)
node app.js add --title "Todo" --body "Another body"
```

## Troubleshooting

- Ensure you are running the CLI from the project root so `notes.json` is read/written in the expected location.
- If `notes.json` becomes invalid JSON (e.g., manual edit), delete it and re-add a note to regenerate the file.

## License

ISC
