import { useEffect, useRef, useId } from 'react'

// Accessible Sheet: dialog semantics, modal behavior, initial focus, Esc to close, and a minimal focus trap
export default function Sheet({ open, onOpenChange, title, children, footer }) {
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const titleId = useId() // ensure unique id per instance

  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Manage focus: save prior focus, focus panel, restore on close
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement
    const panel = panelRef.current
    if (panel) panel.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onOpenChange?.(false)
        return
      }
      if (e.key === 'Tab') {
        // Simple focus trap within panel
        const root = panelRef.current
        if (!root) return
        const focusables = root.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'))
        if (list.length === 0) {
          e.preventDefault()
          root.focus()
          return
        }
        const first = list[0]
        const last = list[list.length - 1]
        const active = document.activeElement
        if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      const prev = previouslyFocusedRef.current
      if (prev && prev.focus) prev.focus()
    }
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-stretch justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="relative bg-background text-foreground border-t rounded-t-lg shadow-xl p-4 space-y-3 outline-none"
      >
        {title && (
          <div id={titleId} className="text-base font-semibold">
            {title}
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="pt-2">{footer}</div>}
      </div>
    </div>
  )
}
