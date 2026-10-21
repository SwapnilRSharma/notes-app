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

## Quickstart

```bash
# Add a note
node app.js add --title "Shopping" --body "Buy milk and bread"

# Try adding the same title again (demonstrates duplicate protection)
node app.js add --title "Shopping" --body "Buy eggs"

# See available commands and options
node app.js --help
```

## Usage

Currently implemented commands:

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Expected output on success: `New Note Added!`

If a note with the same title already exists: `Note Title Taken.`

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

## Behavior

- Notes are uniquely identified by `title`. Adding a note with an existing title will be rejected.
- Data persists in the local `notes.json` file in the project root.

## License

ISC
