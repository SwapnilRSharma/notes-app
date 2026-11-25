import * as ToastPrimitive from '@radix-ui/react-toast'
import { useToast, dismiss } from './use-toast.js'
import { cn } from '../../lib/cn.js'

export default function Toaster() {
  const { toasts } = useToast()
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <div className="fixed right-5 top-5 z-[9999] grid gap-2">
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              'group grid w-72 cursor-pointer gap-1 rounded-md border p-3 shadow data-[state=open]:animate-in data-[state=closed]:animate-out',
              t.kind === 'success' && 'border-green-200 bg-green-50 text-green-900',
              t.kind === 'error' && 'border-red-200 bg-red-50 text-red-900',
              !t.kind && 'border-border bg-popover text-popover-foreground'
            )}
            onClick={() => dismiss(t.id)}
          >
            <ToastPrimitive.Title className="text-sm font-medium">
              {t.message}
            </ToastPrimitive.Title>
          </ToastPrimitive.Root>
        ))}
      </div>
      <ToastPrimitive.Viewport className="fixed right-5 top-5 z-[10000]" />
    </ToastPrimitive.Provider>
  )
}
