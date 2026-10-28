# Plan — web-d0d95f10

<!-- factory:plan v=1 -->

## Design

Refresh the README for the Node.js CLI notes app to be accurate, concise, and copy-paste friendly. Align documentation with the current yargs-based commands in `app.js`/`notes.js`, clarify that notes persist to `notes.json`, and state supported Node versions and setup steps.

Replace placeholder language with concrete, verified examples for `add`, `list`, `read`, and `remove`, include a quick-start, and standard sections (Overview, Installation, Usage, Examples, Development). No code changes are expected; risk is low and limited to documentation clarity.

## Tasks

 - [x] `t1` Draft updated README content · done
  - intent: Rewrite README to align with current CLI behavior, replace placeholders, and add quick-start, commands, and examples.
  - files: `README.md`
  - acceptance: README includes accurate overview, install, usage with working examples for add/list/read/remove, and notes on data file and Node version.
- [ ] `t2` Verify commands against CLI help · queued
  - intent: Run `node app.js --help` and each example to ensure flags and output match; adjust docs accordingly.
  - acceptance: All documented commands execute successfully locally and mirror help output.
- [ ] `t3` Open PR with summary · queued
  - intent: Create a branch, commit README changes, push, and open a PR describing the documentation improvements.
  - acceptance: PR link available with a clear summary of changes.
