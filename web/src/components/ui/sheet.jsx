import React, { useEffect } from 'react'

export function Sheet({ open, onOpenChange, side = 'left', children }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onOpenChange?.(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'absolute h-full w-72 bg-white shadow-lg transition-transform',
          side === 'left' ? 'left-0 translate-x-0' : 'right-0 translate-x-0',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ className = '', ...props }) {
  return <div className={`border-b p-3 ${className}`} {...props} />
}

export function SheetTitle({ className = '', ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />
}

export function SheetContent({ className = '', ...props }) {
  return <div className={`p-3 ${className}`} {...props} />
}

export default Sheet
