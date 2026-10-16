# Notes App (CLI)

Simple command‑line notes application built with Node.js and yargs. It currently supports adding notes and persists them to a local `notes.json` file. Additional commands are scaffolded for future work.

## Features

- Add a note with a unique title and body
- Persistent storage in `notes.json`
- Scaffolding for `remove`, `read`, and `list` commands (not yet implemented)

## Requirements

- Node.js 12+ (any modern LTS should work)

## Installation

```bash
git clone https://github.com/SwapnilRSharma/notes-app.git
cd notes-app
npm install
```

## Usage

Run commands with Node:

```bash
node app.js add --title "My Title" --body "My note body"
```

Expected output when adding a new note:

```
New Note Added!
```

If you try to add a note with a duplicate title, you’ll see:

```
Note Title Taken.
```

Data is stored locally in `notes.json` at the project root. If the file doesn’t exist, it will be created automatically on first write.

### Available Commands

- `add` Add a new note
  - Options: `--title <string>` (required), `--body <string>` (required)
- `remove` Remove a note (stub)
- `read` Read a note (stub)
- `list` List all notes (stub)

Examples:

```bash
# Add a note
node app.js add --title "Shopping" --body "Eggs, milk, bread"
```

## Project Structure

- `app.js` CLI entrypoint and command definitions
- `notes.js` Note helpers for loading and saving notes
- `notes.json` Persistent storage file for notes

## Development Notes

- Dependencies declared in `package.json` include `yargs` for CLI parsing. `chalk` and `validator` are present but not yet used; they can be introduced when enhancing UX and validation.

## Roadmap / Ideas

- Implement `remove`, `read`, and `list` commands
- Use `chalk` for colored, friendly CLI output
- Validate inputs with `validator` (e.g., non-empty, length limits)
- Add tests and a CI workflow
- Replace synchronous filesystem calls with async if concurrency grows

## License

ISC
