# notes-app

Overview

CLI notes application built with Node.js and yargs. You can add notes from the terminal; notes are stored locally in a `notes.json` file in the project root. The only functional command today is `add`. The `list`, `read`, and `remove` commands are placeholders and do not perform real operations yet.

Requirements

- Node.js 12+ (LTS recommended)

Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. See available commands and options:

   ```bash
   node app.js --help
   ```

Usage / Commands

- add: Add a note
  - Options: `--title <string>` (required), `--body <string>` (required)
  - Example:
    ```bash
    node app.js add --title "Shopping" --body "Buy milk and bread"
    ```

- list: List notes (placeholder)
  - Present in the CLI but only prints a placeholder message.

- read: Read a note (placeholder)
  - Present in the CLI but only prints a placeholder message.

- remove: Remove a note (placeholder)
  - Present in the CLI but only prints a placeholder message.

Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

Data Storage

- Notes are saved to `notes.json` in the project root. If the file does not exist, it will be created when you add your first note.
- Notes are stored as an array of objects with `title` and `body` fields.

Limitations

- Only `add` is implemented; `list`, `read`, and `remove` are placeholders.
- Duplicate note titles are rejected.
- There is no encryption or sync; data is local-only.

License

ISC
