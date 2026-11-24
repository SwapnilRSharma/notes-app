import React from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Button = React.forwardRef(function Button(
  { className, variant = 'default', size = 'default', ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  }
  const variants = {
    default: 'bg-primary text-primary-foreground shadow hover:opacity-95',
    secondary: 'bg-secondary text-secondary-foreground shadow hover:opacity-95',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground shadow hover:opacity-95',
    ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }
  return (
    <button
      ref={ref}
      className={cn(base, sizes[size] || sizes.default, variants[variant] || variants.default, className)}
      {...props}
    />
  )
})

export default Button
