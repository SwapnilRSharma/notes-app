import React, { useEffect, useRef } from 'react'

export function AlertDialog({ open, onOpenChange, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000]" aria-hidden="true">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}

export function AlertDialogContent({ className = '', children, ariaLabelledBy, ...props }) {
  const firstActionRef = useRef(null)
  useEffect(() => {
    // focus first action button for keyboard users
    firstActionRef.current?.focus()
  }, [])
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      className={`w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg ${className}`}
      {...props}
    >
      {React.Children.map(children, (child, idx) => {
        // Attach ref to the first action button rendered inside footer
        if (child?.type?.displayName === 'AlertDialogFooter') {
          const mapped = React.Children.map(child.props.children, (c, i) => {
            if (c?.type?.displayName === 'AlertDialogAction' && i === 0) {
              return React.cloneElement(c, { ref: firstActionRef })
            }
            return c
          })
          return React.cloneElement(child, {}, mapped)
        }
        return child
      })}
    </div>
  )
}

export function AlertDialogHeader({ className = '', ...props }) {
  return <div className={`mb-3 ${className}`} {...props} />
}
AlertDialogHeader.displayName = 'AlertDialogHeader'

export function AlertDialogTitle({ className = '', ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />
}
AlertDialogTitle.displayName = 'AlertDialogTitle'

export function AlertDialogDescription({ className = '', ...props }) {
  return <p className={`text-sm text-slate-600 ${className}`} {...props} />
}
AlertDialogDescription.displayName = 'AlertDialogDescription'

export function AlertDialogFooter({ className = '', ...props }) {
  return <div className={`mt-4 flex items-center justify-end gap-2 ${className}`} {...props} />
}
AlertDialogFooter.displayName = 'AlertDialogFooter'

export const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(
  { className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'

export const AlertDialogAction = React.forwardRef(function AlertDialogAction(
  { className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${className}`}
      {...props}
    />
  )
})
AlertDialogAction.displayName = 'AlertDialogAction'

export default AlertDialog
