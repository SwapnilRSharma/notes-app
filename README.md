# notes-app

<!-- Update plan (to be removed after docs refresh):
- Add a concise Overview and keep Node.js requirement.
- Add a Data Storage section noting `notes.json` is created in project root and duplicates are prevented by title.
- Replace the "Currently implemented commands" block with a Commands section matching `node app.js --help` output; keep `list`, `read`, `remove` marked as placeholders.
- In Usage, show `--help` and a working `add` example with required `--title` and `--body` and note example outputs: "New Note Added!" or "Note Title Taken.".
- Clarify running via `node app.js` (no npm run scripts provided).
-->

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

Currently implemented commands:

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

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

## License

ISC
