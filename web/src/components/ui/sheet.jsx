import { useEffect } from 'react'

export default function Sheet({ open, onOpenChange, title, children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-stretch justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div className="relative bg-background text-foreground border-t rounded-t-lg shadow-xl p-4 space-y-3">
        {title && <div className="text-base font-semibold">{title}</div>}
        <div>{children}</div>
        {footer && <div className="pt-2">{footer}</div>}
      </div>
    </div>
  )
}
