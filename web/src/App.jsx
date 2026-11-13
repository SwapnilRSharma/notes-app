import React, { useEffect, useState } from 'react'

// Minimal Notes CRUD UI backed by /api endpoints provided by Express server
export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create form state
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [createError, setCreateError] = useState('')

  // Edit state
  const [editing, setEditing] = useState(null) // { originalTitle, title, body }
  const [editError, setEditError] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setNotes(data)
    } catch (e) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  async function onCreate(e) {
    e.preventDefault()
    setCreateError('')
    if (!newTitle.trim() || !newBody.trim()) {
      setCreateError('Title and body are required')
      return
    }
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), body: newBody }),
      })
      if (res.status === 409) {
        setCreateError('A note with that title already exists')
        return
      }
      if (!res.ok) throw new Error('Create failed')
      setNewTitle('')
      setNewBody('')
      await refresh()
    } catch (e) {
      setCreateError('Failed to create note')
    }
  }

  function startEdit(note) {
    setEditError('')
    setEditing({ originalTitle: note.title, title: note.title, body: note.body })
  }

  function cancelEdit() {
    setEditing(null)
    setEditError('')
  }

  async function submitEdit(e) {
    e.preventDefault()
    setEditError('')
    if (!editing) return
    const { originalTitle, title, body } = editing
    if (!title.trim() || !body.trim()) {
      setEditError('Title and body are required')
      return
    }
    try {
      const res = await fetch(`/api/notes/${encodeURIComponent(originalTitle)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body }),
      })
      if (res.status === 404) {
        setEditError('Note not found (it may have been deleted)')
        return
      }
      if (res.status === 409) {
        setEditError('A note with that title already exists')
        return
      }
      if (!res.ok) throw new Error('Update failed')
      setEditing(null)
      await refresh()
    } catch (e) {
      setEditError('Failed to update note')
    }
  }

  async function onDelete(title) {
    if (!confirm(`Delete note "${title}"?`)) return
    try {
      const res = await fetch(`/api/notes/${encodeURIComponent(title)}`, { method: 'DELETE' })
      if (res.status === 404) {
        // Already gone; just refresh
        await refresh()
        return
      }
      if (!res.ok) throw new Error('Delete failed')
      await refresh()
    } catch (e) {
      alert('Failed to delete note')
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>Notes</h1>

      {/* Create */}
      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Create Note</h2>
        <form onSubmit={onCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
          />
          <textarea
            placeholder="Body"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, resize: 'vertical' }}
          />
          {createError ? <div style={{ color: '#b00020' }}>{createError}</div> : null}
          <div>
            <button type="submit" style={{ padding: '8px 12px' }}>Add</button>
          </div>
        </form>
      </section>

      {/* List */}
      <section>
        <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>All Notes</h2>
        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div style={{ color: '#b00020' }}>{error}</div>
        ) : notes.length === 0 ? (
          <div>No notes yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {notes.map((n) => (
              <li key={n.title} style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12 }}>
                {editing && editing.originalTitle === n.title ? (
                  <form onSubmit={submitEdit} style={{ display: 'grid', gap: 8 }}>
                    <input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
                    />
                    <textarea
                      value={editing.body}
                      onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                      rows={4}
                      style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6, resize: 'vertical' }}
                    />
                    {editError ? <div style={{ color: '#b00020' }}>{editError}</div> : null}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" style={{ padding: '6px 10px' }}>Save</button>
                      <button type="button" onClick={cancelEdit} style={{ padding: '6px 10px' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{n.body}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(n)} style={{ padding: '6px 10px' }}>Edit</button>
                      <button onClick={() => onDelete(n.title)} style={{ padding: '6px 10px' }}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
