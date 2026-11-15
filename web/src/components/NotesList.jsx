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
    <ul className="list">
      {notes.map(n => (
        <li key={n.title} className="list-item">
          <div className="row">
            <button onClick={() => toggle(n.title)} aria-label="Toggle body">{expanded.has(n.title) ? '▾' : '▸'}</button>
            <strong className="title">{n.title}</strong>
            <div className="actions">
              <button className="btn" onClick={() => onEdit?.(n)}>Edit</button>
              <button className="btn danger" onClick={() => onDelete?.(n)}>Delete</button>
            </div>
          </div>
          {expanded.has(n.title) && (
            <div className="body">{n.body}</div>
          )}
        </li>
      ))}
    </ul>
  )
}
