# Notes CLI

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

Other available commands (placeholders): `list`, `read`, `remove`. These currently print a message only.

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

Notes are saved to `notes.json` (project root). If the file does not exist, it will be created on first add.

Global flags:

- `--help` Show help for all commands
- `--version` Show CLI version

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Windows PowerShell quoting
# Use single quotes around arguments that include spaces
node app.js add --title 'Groceries' --body 'Milk and bread'
```

## Data & Storage

- Data file: `notes.json`
- Format: JSON array of note objects `{ "title": string, "body": string }`
- Duplicate titles are rejected with the message "Note Title Taken."

Reset data:

```bash
rm -f notes.json
```

## License

ISC
