import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../../lib/cn.js'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export function SheetContent({ className = '', side = 'left', children, ...props }) {
  const sideClasses = {
    left: 'inset-y-0 left-0 w-80 border-r',
    right: 'inset-y-0 right-0 w-80 border-l',
  }[side] || 'inset-y-0 right-0 w-80 border-l'

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 bg-background text-foreground p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-left',
          sideClasses,
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function SheetHeader({ className = '', ...props }) {
  return <div className={cn('mb-2', className)} {...props} />
}

export function SheetTitle({ className = '', ...props }) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />
}

export function SheetDescription({ className = '', ...props }) {
  return <p className={cn('text-sm text-slate-600', className)} {...props} />
}
