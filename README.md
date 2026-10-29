# Notes App CLI

Simple CLI notes application built with Node.js and `yargs`. Notes are stored locally in `notes.json` at the project root.

## Requirements

- Node.js 12+ (LTS recommended)
- npm (to install dependencies)

## Install

```bash
npm ci   # or: npm install
```

## Quick Start

```bash
# Show help for all commands
node app.js --help

# Add your first note (creates notes.json if missing)
node app.js add --title "Shopping" --body "Buy milk and bread"
```

## Commands

Help output (captured):

```
app.js [command]

Commands:
  app.js add     Add a note
  app.js remove  Removing a note
  app.js read    Read note
  app.js list    List notes

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

Status by command:

- add: persists a note to `notes.json`.
- list: placeholder (prints to stdout only).
- read: placeholder (prints to stdout only).
- remove: placeholder (prints to stdout only).

## Examples

```bash
# Add a todo note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Placeholder commands (do not modify notes.json yet)
node app.js list
node app.js read --title "Todo"
node app.js remove --title "Todo"
```

## Data Storage

- File: `notes.json` at the project root
- Format: JSON array of `{ title, body }`
- Created automatically on the first successful `add`

## Troubleshooting

- Error: `Cannot find module 'yargs'` → run `npm ci` (or `npm install`) to install dependencies.
- Using very old Node.js → upgrade to a recent LTS (12+ recommended).

## License

ISC
