# notes-app

Simple CLI notes application built with Node.js and yargs. Notes are stored locally in `notes.json` at the project root.

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

Implemented commands:

- Add a note

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Behavior:
- Notes are de-duplicated by `title`. Adding a note with an existing title prints "Note Title Taken." and does not modify `notes.json`.
- On first successful add, `notes.json` is created automatically.

Scaffolded (placeholder) commands:

- List notes

```bash
node app.js list
```

- Read a note

```bash
node app.js read --title "Shopping"
```

- Remove a note

```bash
node app.js remove --title "Shopping"
```

## Data File

- Location: `./notes.json`
- Format: JSON array of `{ title, body }`
- Reset the store by deleting the file:

```bash
rm -f notes.json
```

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Attempt to add a duplicate title
node app.js add --title "Todo" --body "This will be rejected"
```

## Contributing

Issues and PRs are welcome. If you add functionality for `list`, `read`, or `remove`, please include brief usage notes in this README.

## License

ISC
