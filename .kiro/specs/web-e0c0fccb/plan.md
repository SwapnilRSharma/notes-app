# Plan — web-e0c0fccb

<!-- factory:plan v=1 -->

## Design

We will improve the root README to clearly document the CLI notes app: a concise overview, prerequisites, install steps, command usage with examples for `add`, `list`, `read`, and `remove`, data storage notes about `notes.json`, and current limitations (non-implemented placeholder commands). The README will remain focused on end-user usage; no code changes are planned.

Key decisions: keep the project name as currently defined in the repo (README/package.json use "notes-app") to avoid scope creep; do not rename packages or refactor code. Keep examples aligned with the actual yargs interface in `app.js` and current behavior in `notes.js` so that every documented example can be executed successfully.

Risks are minimal and limited to documentation accuracy. We will explicitly call out placeholders to avoid misleading users and verify examples locally before opening the PR.

## Tasks

- [ ] `t1` Audit current CLI and docs · queued
  - intent: Review README and source (`app.js`, `notes.js`, `package.json`) to confirm available commands, flags, and behavior so documentation is accurate.
  - files: `README.md`, `app.js`, `notes.js`, `package.json`
  - acceptance: Scope of README changes confirmed; no undocumented commands or flags.
- [ ] `t2` Update README content · queued
  - intent: Rewrite/expand README with overview, prerequisites, install, usage examples for all commands, data file location, and limitations (placeholders called out explicitly).
  - files: `README.md`
  - acceptance: README renders cleanly and all examples reflect actual CLI behavior.
- [ ] `t3` Sanity-check markdown · queued
  - intent: Quickly lint/preview the markdown and fix any formatting nits or broken code fences/links.
  - files: `README.md`
  - acceptance: No obvious markdown issues on preview; headings and code blocks render as expected.
- [ ] `t4` Open documentation PR · queued
  - intent: Create a branch, commit README edits, push, and open a pull request with a clear title and summary, including what was verified.
  - files: `README.md`
  - acceptance: PR is open and shareable; CI (if any) is green or not applicable.
