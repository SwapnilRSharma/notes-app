import { useToast, dismiss } from './use-toast.js'

export default function Toaster() {
  const { toasts } = useToast()
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="fixed right-5 top-5 z-[9999] grid gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          onClick={() => dismiss(t.id)}
          className={[
            'cursor-pointer rounded-md border px-3 py-2 shadow',
            t.kind === 'success' ? 'border-green-200 bg-green-50 text-green-900' :
            t.kind === 'error' ? 'border-red-200 bg-red-50 text-red-900' :
            'border-border bg-card text-card-foreground',
          ].join(' ')}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
