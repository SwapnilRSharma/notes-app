import React from 'react'

// Tokenized input styles to support theming and dark mode
const base = [
  'flex h-9 w-full rounded-md border',
  'border-input bg-background text-foreground shadow-sm',
  'px-3 py-2 text-sm',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')

const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`${base} ${className}`} {...props} />
})

export default Input
