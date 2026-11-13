import React from 'react'

export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes?.length) return <p>No notes yet.</p>
  return (
    <ul style={{ padding: 0, listStyle: 'none', display: 'grid', gap: '0.75rem' }}>
      {notes.map((n) => (
        <li key={n.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <strong>{n.title}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onEdit(n)}>Edit</button>
              <button onClick={() => onDelete(n.id)}>Delete</button>
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{n.body}</div>
        </li>
      ))}
    </ul>
  )
}
