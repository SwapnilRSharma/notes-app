# Plan — web-d4238cba

<!-- factory:plan v=1 -->

## Design

Refresh the README to precisely match the current CLI behavior in `app.js` and `notes.js`. Clarify what is implemented today (the `add` command), what is scaffolded (list/read/remove placeholders), where data is stored (`notes.json` in the project root), and how duplicates are handled. Improve examples and basic orientation for new users without changing any runtime code.

Add concise sections for Project Structure and Data Storage to make the repo self-explanatory. Keep Node/yargs usage straightforward and verify examples by running the CLI locally. This is a documentation-only update with no code changes or build impact.

## Tasks

- [x] `t1` Align README overview and usage
  - intent: Update title/intro, prerequisites, setup steps, and Usage to reflect the implemented `add` command and note the other commands are placeholders.
  - files: `README.md`
  - acceptance: README accurately describes current functionality and basic usage without implying unimplemented features.
- [ ] `t2` Document data location and duplicates behavior
  - intent: Explain that notes persist to `notes.json` in the repo root, include the note object shape, and call out duplicate-title rejection.
  - files: `README.md`
  - acceptance: A new user understands where data is stored and what happens on duplicate titles.
- [ ] `t3` Add Project Structure and examples
  - intent: Add a short Project Structure section listing `app.js`, `notes.js`, and `notes.json`; include copy-pasteable examples for `--help` and `add`.
  - files: `README.md`
  - acceptance: Examples work as written and the structure matches the repository.
- [ ] `t4` Verify instructions against the CLI
  - intent: Run `node app.js --help` and perform a sample `add` to ensure the README commands and descriptions are correct; adjust wording if discrepancies are found.
  - acceptance: Help output matches expectations and adding a note creates/updates `notes.json` as documented.
