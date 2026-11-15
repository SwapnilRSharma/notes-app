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
        onDelete={() => { /* wired in t6 */ }}
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
