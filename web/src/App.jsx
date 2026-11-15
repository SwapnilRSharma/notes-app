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
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') return document.documentElement.dataset.theme || 'dark'
    return 'dark'
  })

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

   // keep root attribute in sync when theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch (_) {}
  }

  const notify = (message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, kind }])
    // auto dismiss after 2.5s
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }

  return (
    <div className="app-container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>Notes</h1>
        <button className="btn" aria-label="Toggle theme" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} theme
        </button>
      </div>
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
      <Toasts toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  )
}
