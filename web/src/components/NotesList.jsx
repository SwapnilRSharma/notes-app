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

  const listStyle = { listStyle: 'none', padding: 0, margin: 0 }
  const itemStyle = { padding: '10px 0', borderBottom: '1px solid #e2e8f0' }
  const rowStyle = { display: 'flex', gap: 10, alignItems: 'center' }
  const titleStyle = { minWidth: 160, fontWeight: 600 }
  const bodyStyle = { marginLeft: 28, whiteSpace: 'pre-wrap' }
  const actionsStyle = { display: 'flex', gap: 8, marginLeft: 'auto' }

  return (
    <ul style={listStyle}>
      {notes.map(n => (
        <li key={n.title} style={itemStyle}>
          <div style={rowStyle}>
            <button onClick={() => toggle(n.title)} aria-label="Toggle body">{expanded.has(n.title) ? '▾' : '▸'}</button>
            <strong style={titleStyle}>{n.title}</strong>
            <div style={actionsStyle}>
              <button onClick={() => onEdit?.(n)}>Edit</button>
              <button onClick={() => onDelete?.(n)}>Delete</button>
            </div>
          </div>
          {expanded.has(n.title) && (
            <div style={bodyStyle}>{n.body}</div>
          )}
        </li>
      ))}
    </ul>
  )
}
