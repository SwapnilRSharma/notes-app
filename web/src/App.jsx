import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import './styles.css'
import Toaster from './components/ui/toaster.jsx'
import { toast } from './components/ui/use-toast.js'

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

  const notify = (message, kind = 'info') => {
    toast(message, kind)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <h1 className="text-2xl font-semibold">Notes</h1>
          
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-4">
        {error && <p className="error-text">{error}</p>}
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
      </main>
      <Toaster />
    </div>
  )
}
