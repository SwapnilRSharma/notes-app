# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

## Quick Start

- Requirements: Node.js 12+ (LTS recommended)
- Install dependencies:

```bash
npm install
```

- See available commands:

```bash
node app.js --help
```

## Commands

- `add` — Add a note to the local store.
  - Options:
    - `--title` string (required) — Note title. Must be unique; exact-title duplicates are rejected.
    - `--body` string (required) — Note body content.
- `list` — List notes (placeholder; currently prints a message).
- `read` — Read a note (placeholder; currently prints a message).
- `remove` — Remove a note (placeholder; currently prints a message).

## Usage Examples

```bash
# Show help for all commands
node app.js --help

# Add a note (creates notes.json on first run)
node app.js add --title "Shopping" --body "Buy milk and bread"

# Attempt to add a duplicate title (will be rejected)
node app.js add --title "Shopping" --body "Another body"

# Placeholder commands
node app.js list
node app.js read --title "Shopping"
node app.js remove --title "Shopping"
```

## Storage & Behavior

- Notes are saved to `notes.json` in the project root.
- The file is created automatically on first successful `add`.
- Duplicate detection compares titles exactly (case- and space-sensitive).

## License

ISC
