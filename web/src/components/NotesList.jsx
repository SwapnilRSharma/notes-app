import { useState } from 'react'

export default function NotesList({ notes, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set())

  const toggle = (title) => {
    const next = new Set(expanded)
    if (next.has(title)) next.delete(title)
    else next.add(title)
    setExpanded(next)
  }

  if (!notes || notes.length === 0) return <p>No notes yet.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {notes.map(n => (
        <li key={n.title} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => toggle(n.title)} aria-label="Toggle body">{expanded.has(n.title) ? '▾' : '▸'}</button>
            <strong style={{ minWidth: 160 }}>{n.title}</strong>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => onEdit?.(n)}>Edit</button>
              <button onClick={() => onDelete?.(n)} style={{ color: 'crimson' }}>Delete</button>
            </div>
          </div>
          {expanded.has(n.title) && (
            <div style={{ marginLeft: 28, whiteSpace: 'pre-wrap', color: '#333' }}>{n.body}</div>
          )}
        </li>
      ))}
    </ul>
  )
}
