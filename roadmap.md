# Project Roadmap — Notes CLI

This document outlines the product vision and a structured set of potential feature directions for the Node.js CLI notes application in this repository.

## Vision

Fast, reliable, and ergonomic note-taking from the terminal — offline-first, simple by default, and extensible for power users.

## Current State

Single-command add flow using `yargs`, with scaffolds for `list`, `read`, and `remove`; notes persisted to a local `notes.json` file.

## Principles

- Offline-first and local-first by default
- Predictable, scriptable CLI UX
- Backward compatibility with stable flags
- Secure-by-default handling of user data

## Themes

- Core CLI Capabilities
- UX & Ergonomics
- Data & Storage
- Search & Organization
- Import/Export & Interop
- Integrations & Sync
- Security & Privacy
- Quality, Testing & Tooling

## Feature Ideas (Grouped)

### Core CLI Capabilities

- Implement `list` command to display all note titles [P0][Near]
- Implement `read` command to display a note by title [P0][Near]
- Implement `remove` command to delete a note by title [P0][Near]
- Add `update/edit` command to modify an existing note [P1][Near]
- Assign stable IDs and generate slugs for notes [P1][Mid]
- Track `createdAt`/`updatedAt` timestamps per note [P1][Near]
- Support bulk operations (e.g., remove multiple by query) [P2][Mid]
- Allow note body from stdin or file (`--file -`) [P1][Near]

### UX & Ergonomics

- Rich `--help` with examples and common recipes [P0][Near]
- Shell completion scripts (bash/zsh/fish) [P1][Mid]
- Colored/pretty output with optional plain mode [P1][Near]
- Interactive prompts when required flags are missing [P1][Near]
- Global config file for defaults and profiles [P1][Mid]
- Command/flag aliases for common operations [P2][Mid]
- `--dry-run` mode to preview changes [P2][Mid]
- `--json` output for scripting pipelines [P1][Near]

### Data & Storage

- Configurable storage path via flag/env/rc [P0][Near]
- Named stores/profiles (work, personal) [P2][Mid]
- Data migrations with schema/versioning [P1][Mid]
- Optional SQLite backend in addition to JSON [P2][Long]
- Per-note markdown files in a notes directory [P2][Mid]
- Automatic backups and restore utilities [P1][Mid]

### Search & Organization

- Tagging support on notes [P1][Mid]
- Full-text search across titles/bodies [P2][Mid]
- Filter/sort by date, tag, and text [P1][Mid]
- Pinned/favorite notes surfaced first [P2][Mid]
- Archive/unarchive workflow [P2][Mid]
- Backlinks or link references between notes [P2][Long]
- Note templates and snippet insertion [P2][Mid]

### Import/Export & Interop

- Import notes from a Markdown directory [P2][Mid]
- Export notes to Markdown files [P1][Mid]
- CSV/JSON import/export for interoperability [P1][Mid]
- Clipboard integration (copy note to clipboard) [P2][Mid]
- Print-friendly rendering to stdout [P1][Near]

### Integrations & Sync

- Git-backed notes directory with commit hooks [P1][Mid]
- Cloud sync adapters (Dropbox/Google Drive) [P2][Long]
- GitHub Gist or repo sync option [P2][Long]
- WebDAV adapter for generic servers [P2][Long]
- Email-to-note capture via stdin processing [P2][Long]

### Security & Privacy

- Optional encryption at rest for notes store [P2][Long]
- Per-note protection (hidden/locked) [P2][Long]
- Redaction of secrets in logs/error output [P1][Near]
- Secure delete/shred for removed notes (best-effort) [P2][Long]

### Quality, Testing & Tooling

- Unit tests for notes CRUD and CLI handlers [P0][Near]
- End-to-end tests for CLI flows [P1][Near]
- Linting/formatting (ESLint/Prettier) [P0][Near]
- Optional TypeScript migration for safety [P2][Long]
- CI workflows for tests and releases [P1][Near]

## Timeline

### Near Term (0–1 quarter)

### Mid Term (1–2 quarters)

### Long Term (2+ quarters)

## Success Metrics

- Unit test coverage for core commands (`add`, `list`, `read`, `remove`, `edit`) at ≥ 80%
- Cold start time to first command execution ≤ 200ms on typical developer laptops
- P50 time to add/read a note ≤ 100ms with local JSON store (1000 notes)
- Zero data-loss incidents across releases; verified backup/restore E2E test
- CI green rate ≥ 95% on default branch; release cadence at least monthly

## Risks & Constraints

### Constraints

- Offline-first by default; no network dependency for core flows
- Support maintained Node.js LTS versions; no OS-specific assumptions
- Cross-platform behavior (Linux/macOS/Windows) with consistent flags and paths
- Backward-compatible CLI where possible; breaking changes gated behind flags and documented
- Minimal trusted dependencies with regular audits; avoid native modules unless necessary

### Risks (with mitigations)

- Data corruption or loss during writes — Mitigation: write-temp-then-rename, backups, E2E restore test
- Breaking changes to CLI flags — Mitigation: deprecation warnings, aliases, semver discipline
- Cross-platform path/encoding quirks — Mitigation: use Node path APIs, add Windows CI, test matrix


## Open Questions

- Who are the primary users we optimize for (solo developers, teams, automation use)?
- Do we target pure CLI only, or plan for a simple TUI/web viewer later?
