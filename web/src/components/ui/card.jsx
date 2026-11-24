import React from 'react'

function cn(...classes) { return classes.filter(Boolean).join(' ') }

export function Card({ className, asChild = false, children, ...props }) {
  const base = 'rounded-lg border bg-card text-card-foreground shadow-sm'
  if (asChild && React.isValidElement(children)) {
    // Slot-style behavior: pass styles/props to child instead of rendering a wrapper
    const onlyChild = React.Children.only(children)
    return React.cloneElement(onlyChild, {
      ...props,
      className: cn(base, className, onlyChild.props.className)
    })
  }
  return <div className={cn(base, className)} {...props}>{children}</div>
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export default Card
