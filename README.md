# notes-app

Simple CLI Notes application built with Node.js and yargs. Notes are stored locally in `notes.json` in the project root.

## Requirements

- Node.js 12+ (LTS recommended)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the CLI using Node:

```bash
node app.js --help
```

## Themes (Web UI)

The web UI supports multiple color themes using CSS custom properties.

- Available themes: Default (Blue), Green, Purple
- Switching: Use the Theme selector in the top-right of the app header. Your choice is saved and applied on reload.
- Programmatic: Set `document.documentElement.dataset.theme = 'green' | 'purple'` to switch, or remove the attribute for the default theme.

To add a new theme, override the same CSS variables used by the app in `web/src/styles.css`:

```css
/* Example: teal theme */
:root[data-theme="teal"] {
  --bg: #062b2e;
  --bg-gradient-start: #041f22;
  --bg-gradient-end: #08343a;
  --panel: #0b373b;
  --text: #e6fbfd;
  --muted: #9ad3d7;
  --accent: #14b8a6;
  --accent-2: #2dd4bf;
  --danger: #ef4444; /* optional */
  --border: #155e63;
}
```

No component markup changes are required; themes work by overriding variables under `:root[data-theme="<name>"]`.

## Usage

Currently implemented commands:

- Add a note:

```bash
node app.js add --title "Shopping" --body "Buy milk and bread"
```

Other available commands (scaffolds): `list`, `read`, `remove`.

- List notes (placeholder):

```bash
node app.js list
```

- Read a note (placeholder):

```bash
node app.js read --title "Shopping"
```

- Remove a note (placeholder):

```bash
node app.js remove --title "Shopping"
```

Notes are saved to `notes.json`. If the file does not exist, it will be created on first add.

## Examples

```bash
# Show help for all commands
node app.js --help

# Add a note
node app.js add --title "Todo" --body "Refactor addNotes function"
```

## License

ISC
