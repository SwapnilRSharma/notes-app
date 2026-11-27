import React from 'react'

// Tokenized textarea styles to support theming and dark mode
const base = [
  'flex min-h-[80px] w-full rounded-md border',
  'border-input bg-background text-foreground shadow-sm',
  'px-3 py-2 text-sm',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')

const Textarea = React.forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`${base} ${className}`} {...props} />
})

export default Textarea
