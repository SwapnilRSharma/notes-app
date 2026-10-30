# Plan — web-f6523986

<!-- factory:plan v=1 -->

## Design

Refresh the README to accurately document the current CLI surface of this Node.js notes app. Focus on making onboarding fast (Quick Start) and usage clear by enumerating the existing yargs commands (`add`, `list`, `read`, `remove`) and fully documenting the implemented `add` command options (`--title`, `--body`). Call out behavior around duplicate titles and local storage in `notes.json` (auto-created on first add).

Scope is limited to `README.md` only — no code changes. Verification will run the CLI help and a sample `add` to ensure examples and described behavior match the implementation in `app.js` and `notes.js`.

## Tasks

- [x] `t1` Audit current CLI commands and options · queued
  - intent: Inspect `app.js`/`notes.js` and run `node app.js --help` to enumerate commands and flags to reflect in docs.
  - files: `app.js`, `notes.js`
  - acceptance: A concise list of commands and flags is captured to drive README edits.
- [x] `t2` Update README Quick Start and Usage · queued
  - intent: Revise `README.md` to add Quick Start, document all commands, detail `add` options, include runnable examples, and note storage/duplicate-title behavior.
  - files: `README.md`
  - acceptance: README contains Quick Start, Commands/Options, Examples, and Storage notes; content matches the audited CLI.
- [ ] `t3` Verify README examples against CLI · queued
  - intent: Execute `node app.js --help` and a sample `add` to confirm examples/flags work and `notes.json` behavior aligns with docs.
  - acceptance: Commands run without errors; a note is added to `notes.json`; README instructions remain accurate.
