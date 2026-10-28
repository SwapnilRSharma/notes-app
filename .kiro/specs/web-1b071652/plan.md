# Plan — web-1b071652

<!-- factory:plan v=1 -->

## Design

We will refresh the repository README for the Notes CLI so it accurately reflects the current code and offers a clear Quickstart. The update will keep scope strictly to documentation: clarify supported commands (yargs), note that `list/read/remove` are placeholders, and document where data is stored (`notes.json`). The structure will follow common OSS conventions: Overview, Requirements, Installation, Usage, Examples, Troubleshooting, and License.

Key decisions: do not introduce code changes, new scripts, or CI; only update `README.md`. Commands will be documented exactly as implemented (`node app.js ...`) to avoid drift. We will verify each documented example locally to ensure copy‑paste correctness and to call out placeholder outputs explicitly.

Risks are low: the codebase is small and the change is docs‑only. The main risk is overstating functionality; we mitigate by aligning text to current `app.js`/`notes.js` behavior and marking non‑implemented commands as placeholders.

Checklist for README update:
- Overview stating it's a Node.js CLI using yargs; scope is local JSON notes.
- Requirements: Node.js LTS (tested locally), npm; OS-agnostic.
- Installation: `npm install` in repo; no global install or bin.
- Usage: `node app.js --help`; document `add` with required `--title` and `--body`.
- Placeholders: `list`, `read`, `remove` noted as placeholders with current console output.
- Data storage: `notes.json` at repo root; auto-created; JSON format; duplicates prevented by exact title match.
- Examples: help and add; show resulting file behavior; idempotency of duplicate title.
- Troubleshooting: Node version mismatch; permissions on `notes.json`; corrupted JSON recovery (delete/restore file).
- License: ISC.

## Tasks

 - [x] `t1` Audit current docs and code · done
  - intent: Review `README.md`, `package.json`, `app.js`, and `notes.js` to enumerate actual capabilities and gaps to cover in the README.
  - files: `README.md`, `package.json`, `app.js`, `notes.js`
  - acceptance: A concrete checklist of sections and facts to include is drafted for the README update.
 - [x] `t2` Rewrite README with clear structure · done
  - intent: Update `README.md` with Overview, Requirements (Node LTS), Installation, Usage (yargs commands), Data storage (`notes.json`), and License; mark placeholder commands explicitly.
  - files: `README.md`
  - acceptance: README renders cleanly and contains the defined sections with accurate, concise content.
 - [x] `t3` Add examples and troubleshooting · done
  - intent: Add copy‑pasteable examples for `--help` and `add`; include tips for common issues (Node version, missing/locked `notes.json`).
  - files: `README.md`
  - acceptance: Examples are minimal and executable; troubleshooting covers at least missing file and permissions cases.
- [ ] `t4` Verify documented commands locally · queued
  - intent: Run documented commands (`node app.js --help`, `add`, `list`, `read`, `remove`) to confirm outputs match documentation and placeholders are noted.
  - acceptance: All commands run on Node LTS without runtime errors; output aligns with README descriptions.
- [ ] `t5` Raise documentation PR · queued
  - intent: Create a branch and open a PR titled "docs: refresh README for notes-app (web-1b071652)" describing scope (docs‑only) and verification performed.
  - acceptance: PR link is available and contains only README changes.
