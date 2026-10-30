# Plan — web-ec511a01

<!-- factory:plan v=1 -->

## Design

Update the existing README to be clearer, accurate, and self-contained for a small Node.js CLI app. Keep the current scope: the only functional command is `add`; `list`, `read`, and `remove` are placeholders and will be labeled as such. Do not add implementation promises for features that don't exist.

Restructure the document into standard sections (Overview, Requirements, Installation, Usage/Commands, Examples, Data storage, Limitations, License) and ensure instructions are aligned with the current code (`app.js`, `notes.js`) and `package.json`. Keep Node.js version guidance conservative (Node 12+ as currently stated) and ensure examples match actual yargs commands.

Risks are minimal and limited to documentation drifting from behavior. We mitigate by verifying the documented commands (`--help`, a sample `add`) succeed and that `notes.json` reflects the added note.

## Tasks

- [x] `t1` Rewrite README for clarity and accuracy
  - intent: Restructure and refresh content with accurate sections (Overview, Requirements, Installation, Usage/Commands, Examples, Data storage, Limitations, License) and clearly mark non-implemented commands as placeholders.
  - files: `README.md`
  - acceptance: README contains the listed sections, shows `node app.js --help` and an `add` example, notes that notes are stored in `notes.json`, and labels `list/read/remove` as placeholders.
- [x] `t2` Verify README instructions against the app
  - intent: Run `npm install`, `node app.js --help`, and a sample `add` to ensure instructions work and create/update `notes.json` as documented.
  - acceptance: Commands run without error and `notes.json` includes the sample note added during verification.
