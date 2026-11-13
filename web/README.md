# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## Manual Verification

Follow these steps to validate the notes app UI and behavior:

1. Install dependencies
   - Run in this folder: `npm install`
2. Start the dev server
   - `npm run dev` and open the printed local URL in a browser
3. Create a note
   - Click `Create Note`
   - Enter a non-empty Title and Body
   - Click `Save`
   - Expected: the new note appears in the list
4. Persistence across reload
   - Reload the page
   - Expected: the note is still present (persisted to localStorage)
5. Search filtering
   - Type part of the title or body into the `Search notes...` input
   - Expected: the list filters to matching notes (case-insensitive)
6. Console
   - Expected: no errors in the browser console
