# notes-app

Simple CLI Notes application built with Node.js and yargs.

Notes are stored locally in `notes.json` in the project root. The file is created automatically on first add.

## Requirements

- Node.js 12+ (LTS recommended)

## Quick Start

```bash
# Install dependencies
npm install

# See available commands and options
node app.js --help

# Add your first note
node app.js add --title "Shopping" --body "Buy milk and bread"
```

## Commands

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

- List notes (scaffold placeholder):

```bash
node app.js list
# current output: "Listing notes"
```

- Read a note (scaffold placeholder):

```bash
node app.js read --title "Shopping"
# current output: "Reading notes..."
```

- Remove a note (scaffold placeholder):

```bash
node app.js remove --title "Shopping"
# current output: "Removing a note"
```

## Data Storage

Notes persist in `notes.json` at the project root. If it does not exist, it will be created automatically when you add a note.

## Development

- Run help to inspect the CLI shape: `node app.js --help`.
- Modify command behavior in `app.js`; note persistence logic lives in `notes.js`.

## License

ISC
