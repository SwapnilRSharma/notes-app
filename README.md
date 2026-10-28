# notes-app

Overview: Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` at the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Installation

```bash
npm install
```

## Usage

Show help and available commands:

```bash
node app.js --help
```

## Commands

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

## Data Storage

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
