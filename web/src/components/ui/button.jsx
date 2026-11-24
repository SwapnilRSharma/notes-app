import React from 'react'

// Minimal shadcn-style button using Tailwind classes
const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
  outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-900',
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
