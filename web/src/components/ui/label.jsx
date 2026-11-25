import React from 'react'

export default function Label({ className = '', ...props }) {
  const cls = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`
  return <label className={cls} {...props} />
}
