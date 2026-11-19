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
  // UI theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
    if (saved === 'light' || saved === 'dark') return saved
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load notes')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => {
        setError(e.message)
        notify(e.message || 'Failed to load notes', 'error')
      })
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

  // Apply theme to the root element so CSS can react via [data-theme]
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { window.localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const notify = (message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, kind }])
    // auto dismiss after 2.5s
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }

  return (
    <div className="app-container">
      <div className="row" style={{ marginBottom: 12 }}>
        <h1 style={{ marginBottom: 0 }}>Notes</h1>
        <div className="actions">
          <button
            className="btn"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
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
