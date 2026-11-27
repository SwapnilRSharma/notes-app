import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import './styles.css'
import Toaster from './components/ui/toaster.jsx'
import { toast } from './components/ui/use-toast.js'
import Button from './components/ui/button.jsx'
import Separator from './components/ui/separator.jsx'

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
  const [theme, setTheme] = useState(() => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  ))

  useEffect(() => { load() }, [])

  const notify = (message, kind = 'info') => {
    toast(message, kind)
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setTheme(next)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur dark:bg-neutral-900/70">
        <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              data-testid="theme-toggle"
              variant="outline"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-screen-lg grid lg:grid-cols-[240px_1fr] gap-4 px-4 py-4 pb-20">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block border rounded-lg h-fit sticky top-[68px] self-start">
          <nav className="p-3">
            <div className="text-sm font-medium text-muted-foreground mb-2">Navigation</div>
            <ul className="space-y-1">
              <li><button className="w-full text-left px-2 py-2 rounded-md hover:bg-muted">All Notes</button></li>
              <li><button className="w-full text-left px-2 py-2 rounded-md hover:bg-muted">Create</button></li>
            </ul>
          </nav>
        </aside>
        {/* Main content */}
        <main className="min-w-0">
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
      </div>
      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 border-t bg-white/90 backdrop-blur dark:bg-neutral-900/80">
        <div className="max-w-screen-lg mx-auto px-4 py-2 flex items-center justify-around">
          <button className="px-3 py-2 rounded-md hover:bg-muted" aria-label="All notes">All</button>
          <Separator className="w-px h-6 bg-slate-200" />
          <button className="px-3 py-2 rounded-md hover:bg-muted" aria-label="Create note">Create</button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
