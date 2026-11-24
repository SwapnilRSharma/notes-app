import React, { useEffect, useState, useCallback } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'

let globalToast = null

export function ToasterProvider({ children }) {
  const [items, setItems] = useState([])

  const push = useCallback((message, variant = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setItems(list => [...list, { id, message, variant }])
  }, [])

  useEffect(() => {
    // Wire the global toast helpers when provider mounts
    globalToast = {
      success: (m) => push(m, 'success'),
      destructive: (m) => push(m, 'destructive'),
      info: (m) => push(m, 'default'),
      show: (m, opts = {}) => push(m, opts.variant || 'default'),
    }
    return () => { globalToast = null }
  }, [push])

  return (
    // Add a finite auto-dismiss duration to prevent accumulation in long sessions
    <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
      {children}
      <div className="fixed right-4 top-4 z-[100] grid gap-2">
        {items.map(t => (
          <ToastPrimitive.Root
            key={t.id}
            className={`rounded-md border px-3 py-2 text-sm shadow bg-card text-card-foreground ${t.variant === 'success' ? 'border-green-600' : t.variant === 'destructive' ? 'border-red-600' : ''}`}
            onOpenChange={(open) => { if (!open) setItems(list => list.filter(i => i.id !== t.id)) }}
            open
          >
            <div className="flex items-start justify-between gap-3">
              <ToastPrimitive.Title className="leading-snug">{t.message}</ToastPrimitive.Title>
              {/* Explicit close control to let users dismiss toasts immediately */}
              <ToastPrimitive.Close
                aria-label="Close"
                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                ×
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport />
      </div>
    </ToastPrimitive.Provider>
  )
}

export const toast = {
  success: (m) => (globalToast ? globalToast.success(m) : console.warn('toast not ready')),
  destructive: (m) => (globalToast ? globalToast.destructive(m) : console.warn('toast not ready')),
  info: (m) => (globalToast ? globalToast.info(m) : console.warn('toast not ready')),
  show: (m, opts) => (globalToast ? globalToast.show(m, opts) : console.warn('toast not ready')),
}

export function Toaster() { return null }
