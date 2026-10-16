# Notes App (CLI)

Simple command‑line notes manager built with Node.js and yargs. Notes are stored locally in a JSON file.

## Features
- Add notes with a title and body (persisted to `notes.json`)
- Scaffolding for `list`, `read`, and `remove` commands

Note: As of this version, only the `add` command writes to storage. The other commands currently print placeholders.

## Requirements
- Node.js (LTS recommended)
- npm

## Setup
1. Install dependencies:
   
   ```bash
   npm install
   ```

## Usage
Run commands with Node directly from the project root:

```bash
node app.js <command> [options]
```

### Commands

1. Add a note
   
   ```bash
   node app.js add --title "Shopping" --body "Buy milk and eggs"
   ```
   
   Aliases supported by yargs (e.g., `-t` for `--title`, `-b` for `--body`) depend on local yargs config. In this app, use long flags as shown above.

2. List notes
   
   ```bash
   node app.js list
   ```
   
   Current behavior: prints a placeholder.

3. Read a note
   
   ```bash
   node app.js read --title "Shopping"
   ```
   
   Current behavior: prints a placeholder.

4. Remove a note
   
   ```bash
   node app.js remove --title "Shopping"
   ```
   
   Current behavior: prints a placeholder.

## Data Storage
- Notes are saved to `notes.json` in the project root.
- Each note object has the shape: `{ "title": string, "body": string }`.
- Duplicate titles are rejected.

## Project Structure
- `app.js` — CLI command definitions using yargs
- `notes.js` — note loading/saving helpers
- `notes.json` — local data store (auto-created)

## Scripts
No test suite is configured yet. Running `npm test` will exit with an error placeholder.

## License
ISC
