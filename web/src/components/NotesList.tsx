import type { Note } from '../types'

export function NotesList({ notes, onDelete, onEdit }: { notes: Note[]; onDelete: (title: string) => void; onEdit?: (note: Note) => void }) {
  if (!notes.length) return <p>No notes yet.</p>
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {notes.map((n) => (
        <li key={n.title} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ flex: 1 }}>
            <strong>{n.title}</strong>
            <div style={{ color: '#555' }}>{n.body}</div>
          </div>
          {onEdit && (
            <button onClick={() => onEdit(n)} aria-label={`Edit ${n.title}`}>Edit</button>
          )}
          <button onClick={() => onDelete(n.title)} aria-label={`Delete ${n.title}`} style={{ color: 'white', background: '#d33' }}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
