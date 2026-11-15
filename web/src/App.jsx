import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 20 }}>
      <h1>Notes</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <NoteForm onCreated={load} />
      <NotesList
        notes={notes}
        onEdit={(note) => setEditing(note)}
        onDelete={async (note) => {
          // Simple confirm step before deletion
          // eslint-disable-next-line no-alert
          const ok = window.confirm(`Delete note "${note.title}"?`)
          if (!ok) return
          const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, { method: 'DELETE' })
          if (!res.ok && res.status !== 204) {
            setError('Failed to delete')
            return
          }
          load()
        }}
      />
      {editing && (
        <EditNote
          note={editing}
          onSaved={() => { setEditing(null); load() }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
