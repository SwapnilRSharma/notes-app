import { useEffect, useState } from 'react'
import { createNote, deleteNote, listNotes, updateNote, type Note } from './api'
import NotesList from './components/NotesList'
import NoteForm from './components/NoteForm'
import NoteEditor from './components/NoteEditor'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Note | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setNotes(await listNotes())
    } catch (err: any) {
      setError(err?.message || 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  async function handleCreate(title: string, body: string) {
    await createNote({ title, body })
    await refresh()
  }

  async function handleUpdate(currentTitle: string, update: Partial<Note>) {
    await updateNote(currentTitle, update)
    await refresh()
  }

  async function handleDelete(title: string) {
    await deleteNote(title)
    await refresh()
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16, display: 'grid', gap: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1>Notes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h2>All Notes</h2>
          <NotesList
            notes={notes}
            onSelect={(title) => setEditing(notes.find(n => n.title === title) || null)}
            onDelete={handleDelete}
            loading={loading}
            error={error}
          />
        </div>
        <div>
          <NoteForm onCreate={handleCreate} />
          <NoteEditor note={editing} onUpdate={handleUpdate} onClose={() => setEditing(null)} />
        </div>
      </div>
    </div>
  )
}

export default App
