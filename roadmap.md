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

- Implement `list` command to display all note titles
- Implement `read` command to display a note by title
- Implement `remove` command to delete a note by title
- Add `update/edit` command to modify an existing note
- Assign stable IDs and generate slugs for notes
- Track `createdAt`/`updatedAt` timestamps per note
- Support bulk operations (e.g., remove multiple by query)
- Allow note body from stdin or file (`--file -`)

### UX & Ergonomics

- Rich `--help` with examples and common recipes
- Shell completion scripts (bash/zsh/fish)
- Colored/pretty output with optional plain mode
- Interactive prompts when required flags are missing
- Global config file for defaults and profiles
- Command/flag aliases for common operations
- `--dry-run` mode to preview changes
- `--json` output for scripting pipelines

### Data & Storage

- Configurable storage path via flag/env/rc
- Named stores/profiles (work, personal)
- Data migrations with schema/versioning
- Optional SQLite backend in addition to JSON
- Per-note markdown files in a notes directory
- Automatic backups and restore utilities

### Search & Organization

- Tagging support on notes
- Full-text search across titles/bodies
- Filter/sort by date, tag, and text
- Pinned/favorite notes surfaced first
- Archive/unarchive workflow
- Backlinks or link references between notes
- Note templates and snippet insertion

### Import/Export & Interop

- Import notes from a Markdown directory
- Export notes to Markdown files
- CSV/JSON import/export for interoperability
- Clipboard integration (copy note to clipboard)
- Print-friendly rendering to stdout

### Integrations & Sync

- Git-backed notes directory with commit hooks
- Cloud sync adapters (Dropbox/Google Drive)
- GitHub Gist or repo sync option
- WebDAV adapter for generic servers
- Email-to-note capture via stdin processing

### Security & Privacy

- Optional encryption at rest for notes store
- Per-note protection (hidden/locked)
- Redaction of secrets in logs/error output
- Secure delete/shred for removed notes (best-effort)

### Quality, Testing & Tooling

- Unit tests for notes CRUD and CLI handlers
- End-to-end tests for CLI flows
- Linting/formatting (ESLint/Prettier)
- Optional TypeScript migration for safety
- CI workflows for tests and releases

## Timeline

### Near Term (0–1 quarter)

### Mid Term (1–2 quarters)

### Long Term (2+ quarters)

## Success Metrics

<!-- Populated in subsequent tasks -->

## Risks & Constraints

<!-- Populated in subsequent tasks -->

## Open Questions

- Who are the primary users we optimize for (solo developers, teams, automation use)?
- Do we target pure CLI only, or plan for a simple TUI/web viewer later?
