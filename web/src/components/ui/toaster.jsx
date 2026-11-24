import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

// Minimal toast system inspired by Shadcn's API surface.
// Exposes a `useToast` hook returning `toast({ description, variant })` and a <ToastProvider/> + <Toaster/>.

const ToastContext = createContext({ toast: (_opts) => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]) // { id, description, variant }
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const existing = timers.current.get(id)
    if (existing) {
      clearTimeout(existing)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(({ description, variant = 'default', duration = 2500 } = {}) => {
    if (!description) return
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, description, variant }])
    const t = setTimeout(() => dismiss(id), duration)
    timers.current.set(id, t)
  }, [dismiss])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts at the end so they overlay content */}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export function Toaster({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null
  // Inline minimal styling to avoid reliance on removed global CSS
  const containerStyle = {
    position: 'fixed',
    right: 16,
    top: 16,
    display: 'grid',
    gap: 8,
    zIndex: 9999
  }
  const baseStyle = {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#0b1020',
    color: '#e2e8f0',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    cursor: 'pointer',
    maxWidth: 360
  }
  const variants = {
    default: baseStyle,
    success: { ...baseStyle, background: '#0f2d1d', borderColor: '#14532d', color: '#dcfce7' },
    error: { ...baseStyle, background: '#2a1111', borderColor: '#7f1d1d', color: '#fee2e2' },
    info: baseStyle
  }

  return (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <div key={t.id} role="status" style={variants[t.variant] || baseStyle} onClick={() => onDismiss?.(t.id)}>
          {t.description}
        </div>
      ))}
    </div>
  )
}

export default Toaster
