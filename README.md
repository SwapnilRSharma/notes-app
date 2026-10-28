# notes-app

Simple CLI notes application built with Node.js and yargs.

## Overview

This tool lets you add simple text notes from the terminal. Notes are stored locally in a JSON file in the project root. At present, only the `add` command is implemented; the `list`, `read`, and `remove` commands are placeholders.

## Prerequisites

- Node.js 12+ (LTS recommended)

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

Add a new note (required options: `--title`, `--body`):

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
# If the title is new: prints "New Note Added!"
# If the title already exists: prints "Note Title Taken."
```

Other commands are scaffolded but not yet implemented beyond placeholder output:

```bash
node app.js list      # placeholder: prints "Listing notes"
node app.js read --title "Shopping"   # placeholder: prints "Reading notes..."
node app.js remove --title "Shopping" # placeholder: prints "Removing a note"
```

## Data Storage

Notes are saved to `notes.json` in the project root. The file is created automatically on first add. Duplicate note titles are prevented; adding a note with an existing title will not overwrite the original.

## License

ISC
