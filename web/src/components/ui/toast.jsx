import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'

const ToastContext = createContext(null)

export function ToasterProvider({ children }) {
  const [items, setItems] = useState([])
  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    setItems(list => [...list, { id, message, variant: opts.variant || 'default' }])
  }, [])
  const api = useMemo(() => Object.assign(toast, {
    success: (m) => toast(m, { variant: 'success' }),
    destructive: (m) => toast(m, { variant: 'destructive' }),
    info: (m) => toast(m, { variant: 'default' }),
  }), [toast])

  return (
    <ToastContext.Provider value={api}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <div className="fixed right-4 top-4 z-[100] grid gap-2">
          {items.map(t => (
            <ToastPrimitive.Root
              key={t.id}
              className={`rounded-md border px-3 py-2 text-sm shadow bg-card text-card-foreground ${t.variant === 'success' ? 'border-green-600' : t.variant === 'destructive' ? 'border-red-600' : ''}`}
              onOpenChange={(open) => { if (!open) setItems(list => list.filter(i => i.id !== t.id)) }}
              open
            >
              <ToastPrimitive.Title>{t.message}</ToastPrimitive.Title>
            </ToastPrimitive.Root>
          ))}
          <ToastPrimitive.Viewport />
        </div>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToasterProvider')
  return ctx
}

// Convenience default export with named helpers, similar to shadcn's API
export const toast = Object.assign(function noop() {}, {
  _warn() { console.warn('toast() used before provider mounted') },
  success: (...args) => toast._warn(...args),
  destructive: (...args) => toast._warn(...args),
  info: (...args) => toast._warn(...args),
})

export function Toaster() {
  // Consumers should mount <ToasterProvider> in App and bridge notify() to useToast()
  return null
}
