# notes-app

Lightweight Notes command-line tool built with Node.js and yargs. Notes are stored locally in a JSON file; no external services required.

## Overview

This CLI lets you add notes via `node app.js add ...`. Additional commands are scaffolded but not yet implemented (they currently print placeholder output). Data is persisted in a project-local `notes.json` file.

## Requirements

- Node.js LTS (v12+ works; LTS recommended)
- npm (to install dependencies)

## Installation

Install dependencies in the project directory:

```bash
npm install
```

## Usage

Show help and available commands:

```bash
node app.js --help
```

Supported command:

- Add a note (requires `--title` and `--body`):

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Scaffolded commands (placeholders — print messages only, no note storage/retrieval yet):

```bash
node app.js list            # prints: "Listing notes"
node app.js read --title X  # prints: "Reading notes..."
node app.js remove --title X # prints: "Removing a note"
```

## Data Storage

- Notes are saved to `notes.json` at the project root.
- The file is created automatically on the first successful `add`.
- Each note has a `title` and `body`. Adding a note with a duplicate title is prevented.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Duplicate title (will be prevented and print a message)
node app.js add --title "Todo" --body "Something else"
```

## Troubleshooting

- Node version errors: ensure you're on a recent LTS (v12+). Check with `node -v`.
- Permission denied writing `notes.json`: run from a writable directory or adjust permissions on the repo folder.
- Corrupted `notes.json`: if the file was manually edited and became invalid JSON, delete it (or fix the JSON) and re-run the add command; the app will recreate the file when needed.

## License

ISC
