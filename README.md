# Notes App (Node.js CLI)

A minimal command‑line notes manager built with Node.js and yargs. It lets you add notes stored locally in a JSON file. Additional commands are scaffolded for list, read, and remove.

## Features

- Add notes from the terminal with a title and body
- Notes are persisted to `notes.json` in the project root
- Friendly CLI built with `yargs`

Planned/placeholder commands (scaffolded in the CLI, basic logging only for now):

- `list` list all notes
- `read` read a single note
- `remove` remove a note

## Requirements

- Node.js 12+ (14+ recommended)

## Installation

1. Clone the repo
2. Install dependencies

```bash
git clone https://github.com/SwapnilRSharma/notes-app.git
cd notes-app
npm install
```

## Usage

Run commands with Node directly:

```bash
node app.js add --title "Shopping" --body "Buy milk and eggs"
```

Short flags also work (`- -title` and `- -body` are strings and required for `add`):

```bash
node app.js add - -title "Ideas" - -body "Build a tiny CLI"
```

Other scaffolded commands currently print messages (extend in `app.js` and `notes.js`):

```bash
node app.js list
node app.js read
node app.js remove
```

Notes are stored in `notes.json` at the project root. The file is created automatically on first write.

## Project Structure

```
app.js       # CLI entrypoint (yargs commands)
notes.js     # Note persistence and helpers
notes.json   # Data file (auto‑generated)
```

## Development

- Edit or extend CLI commands in `app.js`
- Implement logic in `notes.js` (e.g., list, read, remove)
- Consider using `chalk` for colored output and `validator` for basic validation

Local run examples during development:

```bash
node app.js add --title "t" --body "b"
```

## Tests

No tests yet. Add your preferred test runner and assertions, then update `npm test`.

## Roadmap Ideas

- Implement `list`, `read`, and `remove` commands end‑to‑end
- Prevent duplicate titles with clearer feedback (already handled, improve UX)
- Improve output formatting with `chalk`
- Input validation with `validator`
- Optional: switch to a per‑user data directory (`~/.notes-app/notes.json`)

## License

ISC. See `package.json`.
