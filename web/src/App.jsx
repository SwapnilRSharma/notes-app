import React, { useEffect, useMemo, useState } from 'react'
import NotesList from './components/NotesList.jsx'
import NoteForm from './components/NoteForm.jsx'
import NoteEditor from './components/NoteEditor.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null)

  const selectedNote = useMemo(() => notes.find((n) => n.title === selected), [notes, selected])

  async function refresh() {
    setLoading(true)
    setListError(null)
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      setNotes(Array.isArray(data) ? data : [])
    } catch (e) {
      setListError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function createNote({ title, body }) {
    if (!title) throw new Error('Title required')
    setBusy(true)
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    })
    setBusy(false)
    if (!res.ok) {
      if (res.status === 409) throw new Error('A note with that title already exists')
      const msg = (await res.json().catch(() => ({}))).error || 'Failed to create'
      throw new Error(msg)
    }
    await refresh()
    setSelected(title)
  }

  async function saveNote(changes) {
    if (!selectedNote) return
    setBusy(true)
    const res = await fetch(`/api/notes/${encodeURIComponent(selectedNote.title)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    })
    setBusy(false)
    if (!res.ok) {
      if (res.status === 409) throw new Error('A note with that title already exists')
      if (res.status === 404) throw new Error('Note not found')
      const msg = (await res.json().catch(() => ({}))).error || 'Failed to save'
      throw new Error(msg)
    }
    const updated = await res.json()
    await refresh()
    setSelected(updated.title)
  }

  async function deleteNote() {
    if (!selectedNote) return
    setBusy(true)
    const res = await fetch(`/api/notes/${encodeURIComponent(selectedNote.title)}`, {
      method: 'DELETE',
    })
    setBusy(false)
    if (!res.ok) {
      if (res.status === 404) throw new Error('Note not found')
      const msg = (await res.json().catch(() => ({}))).error || 'Failed to delete'
      throw new Error(msg)
    }
    await refresh()
    setSelected(null)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>Notes</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        <NotesList
          notes={notes}
          selected={selected}
          onSelect={setSelected}
          loading={loading}
          error={listError}
          onRefresh={refresh}
        />
        <div style={{ flex: 1 }}>
          <NoteForm onCreate={createNote} busy={busy} />
          <NoteEditor
            note={selectedNote}
            onSave={saveNote}
            onDelete={deleteNote}
            onCancel={() => setSelected(null)}
            busy={busy}
          />
        </div>
      </div>
    </div>
  )
}
