# Plan — web-e312803d

<!-- factory:plan v=1 -->

## Design

Refresh the README to accurately document the current CLI notes app without changing code. Keep scope limited to documentation in `README.md` and opening a PR. The README will present a concise overview, prerequisites, installation, and verified usage examples for the implemented `add` command, while clearly marking `list`, `read`, and `remove` as placeholders. It will also note where data is stored (`notes.json`).

Align examples with actual behavior by sanity-checking commands locally (`node app.js --help`, `add`). Avoid adding badges or extra files to keep the change minimal. The PR will target the default branch and contain a clear summary of the doc updates.

## Tasks

- [ ] `t1` Review current behavior and doc gaps · queued
  - intent: Inspect `app.js` and run the CLI to confirm implemented commands and defaults; list specific README adjustments.
  - files: `README.md`, `app.js`
  - acceptance: A concrete list of README edits is identified based on actual behavior.
- [ ] `t2` Update README sections · queued
  - intent: Revise `README.md` with Overview, Prerequisites, Install, Usage/Commands (examples for `add`; note placeholders for `list`, `read`, `remove`), Data storage, and License.
  - files: `README.md`
  - acceptance: README includes the sections above and examples match the CLI.
- [ ] `t3` Sanity-check examples · queued
  - intent: Execute the documented commands locally to verify options and output; adjust wording if needed.
  - files: `README.md`
  - acceptance: All shown commands run successfully or are explicitly marked as placeholders.
- [ ] `t4` Raise PR · queued
  - intent: Create a branch, commit the README changes, push, and open a PR with a summary of updates and verification notes.
  - files: `README.md`
  - acceptance: PR is opened against the default branch and link is available.
