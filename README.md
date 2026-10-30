# notes-app

Simple CLI notes application built with Node.js and yargs. Notes persist locally to `notes.json` in the project root.

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

- Add a note (requires `--title` and `--body`):

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Other available commands are present as placeholders only: `list`, `read`, `remove`.

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

## Data Storage

- File: `notes.json` in the project root (created on first `add`).
- Schema: each note is an object with `{"title": string, "body": string}`.
- Duplicates: adding a note with an existing title is rejected with "Note Title Taken." and the file is not modified.

## License

ISC
- ## Project Structure

- `app.js` CLI entrypoint defining commands with yargs.
- `notes.js` library with note helpers (`addNotes`, file I/O).
- `notes.json` runtime data file created after the first `add`.
- `package.json` project metadata and dependencies.
