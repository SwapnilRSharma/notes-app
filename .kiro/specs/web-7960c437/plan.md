# Plan — web-7960c437

<!-- factory:plan v=1 -->

## Design

Update the existing README.md to accurately reflect the current CLI capabilities. Emphasize that only the `add` command is implemented and that `list`, `read`, and `remove` are placeholders. Clarify how notes are stored (`notes.json` at the project root), how duplicate titles are handled (rejected), and provide concrete, copy-pastable examples including the help command.

Keep the change minimal and documentation-only: restructure the Usage section, add a concise Data Storage/Format subsection with a minimal JSON example, and preserve existing project metadata (name, license). No code changes are required.

## Tasks

- [ ] `t1` Refresh README usage and features · queued
  - intent: Rewrite the Usage section to document the implemented `add` command with required flags, show help invocation, and explicitly label `list`, `read`, and `remove` as placeholders; note duplicate-title behavior and that `notes.json` is created on first add.
  - files: `README.md`
  - acceptance: README shows accurate commands, includes a working example for `add`, and clearly labels unimplemented commands as placeholders.
- [ ] `t2` Add data format and storage notes · queued
  - intent: Add a brief Data Storage/Format subsection describing `notes.json` location and a minimal JSON schema/example for a note object.
  - files: `README.md`
  - acceptance: Section exists with file path and a minimal example object (`{ "title": "...", "body": "..." }`).
- [ ] `t3` Sanity-check examples against the CLI · queued
  - intent: Run `node app.js --help` and an `add` example to ensure the documented commands and examples match actual behavior without modifying code.
  - acceptance: Help output lists the four commands; an `add` example creates/updates `notes.json` with a new note and rejects a duplicate title.
