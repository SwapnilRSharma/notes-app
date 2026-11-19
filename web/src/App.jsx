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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'blue')

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  const [editing, setEditing] = useState(null) // currently editing note object

  useEffect(() => { load() }, [])

  // Apply theme selection and persist it
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      root.dataset.theme = prefersDark ? 'dark' : 'light'
    } else {
      root.dataset.theme = theme
    }
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const handleThemeChange = (e) => {
    setTheme(e.target.value)
  }

  const notify = (message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, kind }])
    // auto dismiss after 2.5s
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }

  return (
    <div className="app-container">
      <div className="row" style={{ alignItems: 'center' }}>
        <h1>Notes</h1>
        <div className="actions" style={{ alignItems: 'center' }}>
          <label htmlFor="theme-select" style={{ color: 'var(--muted)' }}>Theme:</label>
          <select id="theme-select" value={theme} onChange={handleThemeChange} style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px' }}>
            <option value="system">System</option>
            <option value="blue">Blue</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
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
