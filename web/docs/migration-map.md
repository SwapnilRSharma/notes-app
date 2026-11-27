# Migration Map — Shadcn UI

This document maps existing UI/views to their Shadcn UI equivalents and identifies any new primitives needed during the migration.

## Views / Components

- App shell (web/src/App.jsx)
  - Current: Minimal header, content container
  - Target: Application shell with Top App Bar, Desktop Sidebar (collapsible), Mobile Bottom Nav + Drawer/Sheet menu
  - Shadcn: `separator` (for chrome dividers), `button` (actions), `sheet`/`drawer` (mobile menu), `tooltip` (icon actions), `dialog` (desktop confirms)

- NoteForm (web/src/components/NoteForm.jsx)
  - Current: Uses local `Input`, `Textarea`, `Button`
  - Target: Shadcn `input`, `textarea`, `button`; use `card` container
  - Extras: Inline validation + toast on errors (Shadcn `toast`)

- NotesList (web/src/components/NotesList.jsx)
  - Current: `Card` for each note, plain toggle for body, `Button` for Edit/Delete
  - Target: Shadcn `card`, `button` variants, optional `collapsible` for expand/collapse
  - Extras: Add `data-testid` hooks for E2E stability

- EditNote (web/src/components/EditNote.jsx)
  - Current: Uses local `Input`, `Textarea`, `Button`
  - Target: Shadcn `input`, `textarea`, `button`; present as `dialog` on desktop, `sheet/drawer` on mobile
  - Extras: Toasts on save/error

- Toaster (web/src/components/ui/toaster.jsx) and `use-toast.js`
  - Current: Implemented
  - Target: Keep Shadcn toast primitives; ensure base styles and tokens are configured

## Shadcn Primitives Status

- Implemented: `button`, `input`, `textarea`, `card`, `separator`, `toast`
- To add during migration: `dialog`, `sheet`/`drawer`, `dropdown-menu` (for row actions, optional), `tooltip` (icon buttons), `skeleton` (loading), `tabs` (future), `table` (future data views)

## Theming & Tokens

- Tailwind config will expose CSS variables for color, radius, shadow, etc. via Shadcn base tokens
- Dark mode: `class` strategy on `<html>` with a header toggle

## Navigation Patterns

- Desktop: Sidebar (collapsible), top bar actions
- Mobile: Bottom nav; secondary flows presented via `sheet/drawer`

## Accessibility & State

- Keyboard: Focus rings visible, ARIA roles/labels on toggles and action buttons
- States: Empty, error, loading skeletons standardized; reduced-motion respected
