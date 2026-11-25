import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import './styles.css'
import Toaster from './components/ui/toaster.jsx'
import { toast } from './components/ui/use-toast.js'
import Sheet, { SheetHeader, SheetTitle, SheetContent } from './components/ui/sheet.jsx'

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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { load() }, [])

  const notify = (message, kind = 'info') => {
    toast(message, kind)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-2 py-1 text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-2xl font-semibold">Notes</h1>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <div className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <SheetContent className="flex-1">
              <nav className="grid gap-2">
                <button className="text-left hover:underline" onClick={() => setMenuOpen(false)}>Home</button>
                <a className="hover:underline" href="#new" onClick={() => setMenuOpen(false)}>New Note</a>
              </nav>
            </SheetContent>
          </div>
        </Sheet>
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
