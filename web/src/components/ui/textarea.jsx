import React from 'react'

function cn(...classes) { return classes.filter(Boolean).join(' ') }

export const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  const base = 'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
  return <textarea ref={ref} className={cn(base, className)} {...props} />
})

export default Textarea
