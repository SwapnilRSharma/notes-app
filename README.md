# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Quickstart

1. Install dependencies:

```bash
npm install
```

2. See available commands and options:

```bash
node app.js --help
```

## Commands

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

- List notes:

```bash
node app.js list
```

- Read a note:

```bash
node app.js read --title "Shopping"
```

- Remove a note:

```bash
node app.js remove --title "Shopping"
```

Notes: At the moment, only `add` persists data. The other commands are scaffolded and print placeholders.

## Data Storage

- Notes are saved to `notes.json` in the project root.
- If `notes.json` does not exist, it is created when you add the first note.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"

# Attempting to add a duplicate title prints a warning
node app.js add --title "Todo" --body "Another body"
```

## Development

- Entry point: `app.js`
- Notes helpers: `notes.js`
- Local data file: `notes.json`

Run any command with `node app.js <command> [options]`.

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes and add tests if applicable.
3. Run the CLI locally to verify behavior.
4. Open a pull request with a clear description of changes.

## License

ISC
