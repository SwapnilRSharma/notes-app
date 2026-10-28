## Summary
Refresh the README for the Notes CLI to clearly document current capabilities, usage, data storage, examples, and troubleshooting. Docs-only change aligned to the existing yargs-based implementation.

## Changes
- Rewrite `README.md`:
  - Overview and Requirements
  - Installation and Usage with `node app.js`
  - Document `add` command and mark other commands as placeholders
  - Data storage details for `notes.json`
  - Examples and Troubleshooting

## Testing
Verified locally:
- `node app.js --help` renders commands
- `add` adds a note and prevents duplicates
- Placeholder commands print the expected messages
