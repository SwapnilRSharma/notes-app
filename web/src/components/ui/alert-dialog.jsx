import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

function cn(...classes) { return classes.filter(Boolean).join(' ') }

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogOverlay = React.forwardRef(function Overlay({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/60', className)}
      {...props}
    />
  )
})

export const AlertDialogContent = React.forwardRef(function Content({ className, ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 w-[95vw] max-w-md translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2 grid gap-4 border bg-popover p-6 text-popover-foreground shadow-lg rounded-lg',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})

export const AlertDialogHeader = function Header({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
}

export const AlertDialogFooter = function Footer({ className, ...props }) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2', className)} {...props} />
}

export const AlertDialogTitle = React.forwardRef(function Title({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
})

export const AlertDialogDescription = React.forwardRef(function Desc({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
})

export const AlertDialogAction = React.forwardRef(function Action({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Action ref={ref} className={cn(className)} {...props} />
})

export const AlertDialogCancel = React.forwardRef(function Cancel({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Cancel ref={ref} className={cn(className)} {...props} />
})
