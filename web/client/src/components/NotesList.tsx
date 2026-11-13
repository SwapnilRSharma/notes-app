import { Note } from '../api'

type Props = {
  notes: Note[]
  onSelect: (title: string) => void
  onDelete: (title: string) => void
  loading?: boolean
  error?: string | null
}

export default function NotesList({ notes, onSelect, onDelete, loading, error }: Props) {
  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>
  if (!notes.length) return <p>No notes yet. Create your first note.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {notes.map((n) => (
        <li key={n.title} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
          <button onClick={() => onSelect(n.title)} aria-label={`Edit ${n.title}`}>{n.title}</button>
          <span style={{ flex: 1, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</span>
          <button onClick={() => { if (confirm(`Delete “${n.title}”?`)) onDelete(n.title) }} aria-label={`Delete ${n.title}`}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
