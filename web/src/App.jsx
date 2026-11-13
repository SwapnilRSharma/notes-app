import React, { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import { getNotes, createNote, updateNote, deleteNote } from './api.js'

export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getNotes()
      setNotes(data)
    } catch (e) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(values) {
    setError('')
    try {
      await createNote(values)
      await load()
    } catch (e) {
      if (e.message === 'Conflict') setError('A note with that title already exists')
      else setError('Create failed')
    }
  }

  async function handleUpdate(oldTitle, values) {
    setError('')
    try {
      await updateNote(oldTitle, values)
      setEditing(null)
      await load()
    } catch (e) {
      if (e.message === 'Conflict') setError('A note with that title already exists')
      else if (e.message === 'NotFound') setError('Note not found')
      else setError('Update failed')
    }
  }

  async function handleDelete(n) {
    setError('')
    try {
      await deleteNote(n.title)
      await load()
    } catch (e) {
      if (e.message === 'NotFound') setError('Note not found')
      else setError('Delete failed')
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>Notes</h1>
      {error ? (
        <div role="alert" style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>
      ) : null}

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18 }}>Create Note</h2>
        <NoteForm key={`create-${notes.length}`} submitLabel="Add" onSubmit={handleCreate} />
      </section>

      <section>
        <h2 style={{ fontSize: 18 }}>All Notes</h2>
        {loading ? <p>Loading…</p> : (
          <NotesList
            notes={notes}
            onEdit={(n) => setEditing(n)}
            onDelete={handleDelete}
          />
        )}
      </section>

      {editing ? (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18 }}>Edit Note</h2>
          <NoteForm
            initial={editing}
            onSubmit={(vals) => handleUpdate(editing.title, vals)}
            onCancel={() => setEditing(null)}
          />
        </section>
      ) : null}
    </div>
  )
}
