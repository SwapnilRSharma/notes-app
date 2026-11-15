export default function Toasts({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind || 'info'}`} role="status" onClick={() => onDismiss?.(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
