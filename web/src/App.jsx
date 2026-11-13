import React, { useEffect, useState } from 'react'
import { listNotes, createNote, updateNote, deleteNote } from './api/client.js'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState(null)

  async function refresh() {
    try {
      setError('')
      const data = await listNotes()
      setNotes(data)
    } catch (e) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(values) {
    try {
      setError('')
      const created = await createNote(values)
      setNotes((prev) => [created, ...prev])
      setShowCreate(false)
    } catch (e) {
      setError('Failed to create note')
    }
  }

  async function handleUpdate(values) {
    try {
      setError('')
      const saved = await updateNote(editing.id, values)
      setNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)))
      setEditing(null)
    } catch (e) {
      setError('Failed to update note')
    }
  }

  async function handleDelete(id) {
    try {
      setError('')
      await deleteNote(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch (e) {
      setError('Failed to delete note')
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem', maxWidth: 800 }}>
      <h1>Notes</h1>
      {error ? (
        <div style={{ color: 'crimson' }} role="alert">
          {error}
        </div>
      ) : null}

      {loading ? <p>Loading…</p> : null}

      {!loading && !editing && !showCreate ? (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setShowCreate(true)}>Add Note</button>
        </div>
      ) : null}

      {showCreate ? (
        <div style={{ marginBottom: '1rem' }}>
          <h2>New Note</h2>
          <NoteForm
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      ) : null}

      {editing ? (
        <div style={{ marginBottom: '1rem' }}>
          <h2>Edit Note</h2>
          <NoteForm
            initialNote={editing}
            onSave={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : null}

      <NotesList
        notes={notes}
        onEdit={(n) => setEditing(n)}
        onDelete={handleDelete}
      />
    </div>
  )
}
