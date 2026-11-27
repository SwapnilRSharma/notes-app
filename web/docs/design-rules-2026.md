# UI Design Rules (2026)

These rules define the product’s core UI system for 2026. They are intentionally concise and actionable.

## Layout Shell
- Header: sticky at top, 64–72px height, backdrop blur, border-b token.
- Content container: centered, `max-w-screen-lg`, 16px side padding on mobile, 24px+ on desktop.
- Sidebar: desktop only (≥lg), 240px, `border` + `rounded-lg`, sticky below header.
- Footer/bottom bar: mobile-only bottom nav, `border-t`, translucent background.

## Breakpoints
- Mobile: <768px (matches Tailwind `md`).
- Tablet/Desktop: ≥768px.
- Components must not hardcode 1024px thresholds; use 768px for mobile behavior.

## Spacing & Typography
- Spacing scale: 4px base step. Common paddings: 8, 12, 16, 24.
- Heading hierarchy: `text-2xl` page titles, `text-lg` section titles, `text-base` body.
- Font weight: 600 for titles, 500 for actionable labels, 400 for body.

## Color, Elevation, Radius
- Use Shadcn tokens only: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `ring-ring`.
- Surfaces: radius `md` by default; cards/dialogs can use `lg` or `xl` if dense.
- Elevation: `shadow` for base cards, `shadow-lg` for modal/sheet, avoid colored shadows.

## Motion
- Reduce motion by default; transitions ≤150ms, `transition-colors` and `opacity` preferred.
- Do not block interaction during lightweight transitions.

## Focus
- Always visible focus styles: `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background`.
- Never remove outline without providing an equivalent.

## Mobile Sheet vs Desktop Dialog
- Mobile (<768): secondary flows open in a bottom sheet with `role="dialog"`, `aria-modal="true"`, focus trap, and Escape to close.
- Desktop (≥768): secondary flows use inline or centered dialog; keyboard-only workflows must be supported.

## States
- Hover, focus, active, disabled must be explicit. Disabled blocks pointer events and reduces opacity.
- Loading: prefer subtle opacity or skeletons over spinners for short tasks.

## Toasts
- Use product toaster with semantic kinds (info/success/error). Non-blocking, auto-dismiss ~3–4s.
- Content should be concise and actionable; avoid duplicates.

## Keyboard
- All interactive elements reachable via Tab. Escape closes dialogs/sheets.
- Enter submits primary forms; Ctrl/Cmd+Enter may act as an enhanced submit when applicable.
