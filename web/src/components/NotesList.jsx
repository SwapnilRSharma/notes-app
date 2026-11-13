import React from 'react'

export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes?.length) {
    return <p data-testid="empty">No notes yet</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
      {notes.map((n) => (
        <li key={n.title} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <strong>{n.title}</strong>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => onEdit(n)} aria-label={`edit-${n.title}`}>Edit</button>
              <button onClick={() => onDelete(n)} aria-label={`delete-${n.title}`}>Delete</button>
            </div>
          </div>
          {n.body ? <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{n.body}</p> : null}
        </li>
      ))}
    </ul>
  )
}
