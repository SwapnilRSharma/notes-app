import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'

type DialogContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | null>(null)

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (v: boolean) => {
    if (!isControlled) setUncontrolledOpen(v)
    onOpenChange?.(v)
  }
  return (
    <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
  )
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext)
  if (!ctx) return <>{children}</>

  const handleOpen = () => {
    ctx.setOpen(true)
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    const userOnClick = (child.props as any)?.onClick as ((e: React.MouseEvent) => void) | undefined
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        userOnClick?.(e)
        // Honor consumer intent: if they stopped propagation, don't open.
        // This lets callers cancel the open by calling e.stopPropagation().
        // We intentionally ignore defaultPrevented here.
        const stopped = (e as any)?.isPropagationStopped?.() === true
        if (!stopped) handleOpen()
      },
    })
  }

  return (
    <button
      onClick={handleOpen}
      className={cn('inline-flex items-center rounded-md border px-3 py-2 text-sm')}
    >
      {children}
    </button>
  )
}

export function DialogContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ctx?.setOpen(false)
    }
    if (ctx?.open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ctx?.open])

  if (!ctx?.open || !mounted) return null
  const portal = document.getElementById('dialog-root') || document.body
  const node = (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn('w-full max-w-lg rounded-lg bg-white p-6 shadow-lg outline-none', className)}
        >
          {children}
        </div>
      </div>
    </div>
  )
  return createPortal(node, portal)
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 space-y-1', className)} {...props} />
}
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />
}
export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}
export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-600', className)} {...props} />
}
export function DialogClose({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext)
  if (!ctx) return <>{children}</>

  const handleClose = () => {
    ctx.setOpen(false)
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    const userOnClick = (child.props as any)?.onClick as ((e: React.MouseEvent) => void) | undefined
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        userOnClick?.(e)
        // Respect consumer cancellation: if they called stopPropagation(), don't close.
        const stopped = (e as any)?.isPropagationStopped?.() === true
        if (!stopped) handleClose()
      },
    })
  }

  return (
    <button
      onClick={handleClose}
      className={cn('inline-flex items-center rounded-md border px-3 py-2 text-sm')}
    >
      {children}
    </button>
  )
}

export default Dialog
