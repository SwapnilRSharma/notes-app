# Plan — web-949356ac

<!-- factory:plan v=1 -->

## Design

Refresh the README to make the CLI immediately usable: clarify setup, show the actual `--help` output, and document which commands are implemented versus placeholders. Keep scope to documentation only; no code or behavior changes.

Structure the README with clear sections (Overview, Requirements, Install, Quick Start, Commands, Examples, Data Storage, Troubleshooting, License). Include a copy-pasteable quick start and a short example that creates `notes.json` on first run. Ensure wording matches the current code (only `add` persists data; `list/read/remove` are placeholders that print to stdout).

Open a small, focused PR containing just the README changes with a concise description. No migrations or breaking changes are involved; risk is low.

## Tasks

- [x] `t1` Capture current CLI usage and behavior · done
  - intent: Run `node app.js --help` and note implemented vs placeholder commands to ensure README reflects reality.
  - acceptance: A help snippet and bullet list of commands to include in README are captured.
- [x] `t2` Rewrite README.md with clear structure · done
  - intent: Update sections for Overview, Requirements, Install, Quick Start, Commands (with help snippet), Examples, Data Storage, Troubleshooting, and License; call out placeholders explicitly.
  - files: `README.md`
  - acceptance: README is accurate, actionable, and mentions that only `add` persists notes while others are placeholders.
- [x] `t3` Smoke-test instructions end-to-end · done
  - intent: Follow README steps to add a note and verify `notes.json` is created/updated as documented.
  - acceptance: Commands run without error on a fresh clone; `notes.json` contains the new note.
- [ ] `t4` Prepare and raise PR · queued
  - intent: Create a docs branch, commit README changes, push, and open a PR with summary and rationale.
  - acceptance: PR is open with just the README changes and a clear title/description, ready for review.
