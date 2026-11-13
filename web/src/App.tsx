import { useEffect, useState } from 'react'
import type { Note } from './types'
import { api } from './api/client'
import { NoteForm } from './components/NoteForm'
import { NotesList } from './components/NotesList'
import { EditNoteModal } from './components/EditNoteModal'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Note | null>(null)

  async function load() {
    setError(null)
    try {
      setLoading(true)
      const { notes } = await api.listNotes()
      setNotes(notes)
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(note: Note) {
    await api.createNote(note)
    await load()
  }

  async function handleDelete(title: string) {
    await api.deleteNote(title)
    await load()
  }

  async function handleSaveEdit(updated: Note) {
    if (!editing) return
    // Attempt update; allow title change
    await api.updateNote(editing.title, updated)
    setEditing(null)
    await load()
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Notes</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>Create</h2>
        <NoteForm onSubmit={handleCreate} />
      </section>
      <section>
        <h2>List</h2>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: '#d33' }}>{error}</p>}
        {!loading && !error && <NotesList notes={notes} onDelete={handleDelete} onEdit={setEditing} />}
      </section>
      {editing && (
        <EditNoteModal note={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />
      )}
    </div>
  )
}
