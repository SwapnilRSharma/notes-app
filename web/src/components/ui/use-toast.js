import { useEffect, useState } from 'react'

// Simple global toast store (no external deps)
const listeners = new Set()
let toasts = [] // { id, message, kind }

function notifyAll() {
  listeners.forEach(l => l(toasts))
}

export function toast(message, kind = 'info') {
  const id = Math.random().toString(36).slice(2)
  toasts = [...toasts, { id, message, kind }]
  notifyAll()
  // auto dismiss after 2.5s (same timing as previous implementation)
  setTimeout(() => {
    dismiss(id)
  }, 2500)
  return id
}

export function dismiss(id) {
  toasts = toasts.filter(t => t.id !== id)
  notifyAll()
}

export function useToast() {
  const [state, setState] = useState(toasts)
  useEffect(() => {
    listeners.add(setState)
    return () => listeners.delete(setState)
  }, [])
  return {
    toasts: state,
    dismiss,
  }
}
