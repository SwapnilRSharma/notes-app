# notes-app

Simple CLI Notes application built with Node.js and yargs.

Overview:
- Notes are stored locally in `notes.json` in the project root.
- Note titles must be unique. Attempts to add a duplicate title are rejected with a message.
- Only the `add` command is fully implemented today; `list`, `read`, and `remove` are placeholders you can extend.

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

Commands:

- Add a note (implemented):

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

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

Show help and per-command options:

```bash
node app.js --help
node app.js add --help
```

Data:
- Notes are saved to `notes.json`. If the file does not exist, it is created on first `add`.
- Duplicate titles are prevented; you will see "Note Title Taken." when attempting to add a duplicate.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## Contributing

Contributions are welcome.

1. Fork the repo and create a branch from main.
2. Make your changes and add/update docs where applicable.
3. Run locally to verify: `node app.js --help` and try the examples above.
4. Open a pull request with a clear title and summary of changes.

## License

ISC
