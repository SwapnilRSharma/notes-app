import React from 'react'

// Minimal shadcn-style button using Tailwind classes
const base = [
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')
const variants = {
  // Tokenized colors for theme support
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
}

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', asChild = false, ...props },
  ref
) {
  const Comp = asChild ? 'span' : 'button'
  const cls = `${base} ${variants[variant] || variants.default} px-3 py-2 ${className}`
  return <Comp ref={ref} className={cls} {...props} />
})

export default Button
