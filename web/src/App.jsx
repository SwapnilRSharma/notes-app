import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import EditNote from './components/EditNote.jsx'
import './styles.css'
import Toaster from './components/ui/toaster.jsx'
import { toast } from './components/ui/use-toast.js'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet.jsx'
import Separator from './components/ui/separator.jsx'
import Button from './components/ui/button.jsx'
import { Menu } from 'lucide-react'

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                <div className="flex flex-col h-full">
                  <div className="pb-2">
                    <h2 className="text-xl font-semibold">Navigation</h2>
                  </div>
                  <Separator />
                  <nav className="py-3 space-y-2">
                    <a className="block text-slate-700 hover:underline" href="#">All Notes</a>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
