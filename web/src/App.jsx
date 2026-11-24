import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import Toasts from './components/Toasts.jsx'
import './styles.css'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([]) // { id, message, kind }

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

  const notify = (message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, kind }])
    // auto dismiss after 2.5s
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto max-w-screen-lg px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Notes</h1>
        </div>
      </header>
      <main className="container mx-auto max-w-screen-lg px-4 md:px-6 py-6 space-y-6">
        {error && <p className="error-text">{error}</p>}
        <NoteForm onCreated={() => { load(); notify('Note created', 'success') }} onNotify={notify} />
        <NotesList
          notes={notes}
          onEdit={(note) => setEditing(note)}
          onDelete={async (note) => {
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
      </main>
      <Toasts toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
