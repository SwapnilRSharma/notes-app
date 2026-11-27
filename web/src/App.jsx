import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import './styles.css'
import Toaster from './components/ui/toaster.jsx'
import { toast } from './components/ui/use-toast.js'
import Button from './components/ui/button.jsx'
import Separator from './components/ui/separator.jsx'
import Sheet from './components/ui/sheet.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  const [editing, setEditing] = useState(null) // currently editing note object
  const [theme, setTheme] = useState(() => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  ))
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => { load() }, [])

  const notify = (message, kind = 'info') => {
    toast(message, kind)
  }

  // Prefer mobile sheets for secondary flows
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
            loading={loading}
            onEdit={(note) => setEditing(note)}
            onDelete={async (note) => {
              if (isMobile) {
                setPendingDelete(note)
                return
              }
              // Desktop confirm dialog
              // eslint-disable-next-line no-alert
              const ok = window.confirm(`Delete note "${note.title}"?`)
              if (!ok) return
              const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, { method: 'DELETE' })
              if (!res.ok) {
                const msg = 'Failed to delete'
                setError(msg)
                notify(msg, 'error')
                return
              }
              load()
              notify('Note deleted', 'success')
            }}
          />
          {/* Edit flow: dialog on desktop (inline), sheet on mobile */}
          {editing && !isMobile && (
            <EditNote
              note={editing}
              onSaved={() => { setEditing(null); load(); notify('Note updated', 'success') }}
              onCancel={() => setEditing(null)}
              onNotify={notify}
            />
          )}
        </main>
      </div>
      {/* Mobile edit sheet */}
      <Sheet
        open={Boolean(editing) && isMobile}
        onOpenChange={(o) => { if (!o) setEditing(null) }}
        title={editing ? `Edit: ${editing.title}` : ''}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Close</Button>
          </div>
        }
      >
        {editing && (
          <EditNote
            note={editing}
            onSaved={() => { setEditing(null); load(); notify('Note updated', 'success') }}
            onCancel={() => setEditing(null)}
            onNotify={notify}
          />
        )}
      </Sheet>

      {/* Mobile delete confirm sheet */}
      <Sheet
        open={Boolean(pendingDelete)}
        onOpenChange={(o) => { if (!o) setPendingDelete(null) }}
        title={pendingDelete ? `Delete "${pendingDelete.title}"?` : ''}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button
              className="text-red-600"
              onClick={async () => {
                const note = pendingDelete
                if (!note) return
                const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, { method: 'DELETE' })
                if (!res.ok) {
                  const msg = 'Failed to delete'
                  setError(msg)
                  notify(msg, 'error')
                  return
                }
                setPendingDelete(null)
                load()
                notify('Note deleted', 'success')
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
      </Sheet>
      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 border-t bg-white/90 backdrop-blur dark:bg-neutral-900/80">
        <div className="max-w-screen-lg mx-auto px-4 py-2 flex items-center justify-around">
          <button className="px-3 py-2 rounded-md hover:bg-muted min-h-[40px]" aria-label="All notes">All</button>
          <Separator className="w-px h-6 bg-slate-200" />
          <button className="px-3 py-2 rounded-md hover:bg-muted min-h-[40px]" aria-label="Create note">Create</button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
