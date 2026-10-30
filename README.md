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

Implemented command:

- Add a note

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Notes:
- Duplicate titles are rejected; the CLI prints `Note Title Taken.` and does not overwrite an existing note.
- Notes are saved to `notes.json` at the project root and the file is created on first add.

Placeholders (not implemented yet): `list`, `read`, `remove`

- List notes (placeholder)

```bash
node app.js list
```

- Read a note (placeholder)

```bash
node app.js read --title "Shopping"
```

- Remove a note (placeholder)

```bash
node app.js remove --title "Shopping"
```

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## Data Storage and Format

- File: `notes.json` at the project root
- Format: JSON array of note objects with `title` and `body` fields

Example:

```json
[
  { "title": "Shopping", "body": "Buy milk and bread" }
]
```

## License

ISC
