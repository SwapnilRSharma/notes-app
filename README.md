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
