import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import { useToast } from './components/ui/use-toast.js'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const { toast } = useToast()

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

  const notify = (message, kind = 'info') => {
    // map kind -> variant per Shadcn conventions
    const variant = kind === 'success' ? 'success' : kind === 'error' ? 'error' : 'default'
    toast({ description: message, variant })
  }

  const containerStyle = { maxWidth: 900, margin: '0 auto', padding: 24 }
  const errorStyle = { color: '#b91c1c', margin: '6px 0' }

  return (
    <div style={containerStyle}>
      <h1>Notes</h1>
      {error && <p style={errorStyle}>{error}</p>}
      <NoteForm onCreated={() => { load(); notify('Note created', 'success') }} onNotify={notify} />
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
            const msg = 'Failed to delete'
            setError(msg)
            notify(msg, 'error')
            return
          }
          load()
          notify('Note deleted', 'success')
        }}
      />
      {editing && (
        <EditNote
          note={editing}
          onSaved={() => { setEditing(null); load(); notify('Note updated', 'success') }}
          onCancel={() => setEditing(null)}
          onNotify={notify}
        />
      )}
    </div>
  )
}
