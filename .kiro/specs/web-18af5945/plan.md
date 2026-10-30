# Plan: web-18af5945

## Context
This plan documents the remaining tasks for the notes CLI hardening.

## Tasks

- [ ] t1: Implement functional CLI commands list/read/remove
  intent: Replace placeholder handlers with real implementations wired to the notes module.
  files: [app.js, notes.js]
  acceptance:
  - `node app.js list` prints all note titles or a friendly message when empty.
  - `node app.js read --title "X"` prints the note title and body when found, otherwise a friendly not-found message.
  - `node app.js remove --title "X"` removes the note when it exists and confirms via output; if not found, prints a friendly message.

- [ ] t2: Repository hygiene for runtime data and artifacts
  intent: Ensure runtime data is not tracked and document artifacts directory purpose.
  files: [.gitignore, notes.json, artifacts/README.md]
  acceptance:
  - `notes.json` is ignored by Git and no longer tracked; the application still creates/updates it at runtime.
  - `artifacts/` contains a README explaining its purpose (or the directory is removed if unused).
