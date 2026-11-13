import React, { useEffect, useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editing, setEditing] = useState(null) // current title being edited
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setNotes(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body }),
    })
    if (res.status === 201) {
      setTitle('')
      setBody('')
      await load()
    } else if (res.status === 409) {
      setError('A note with that title already exists')
    } else {
      setError('Failed to create note')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h1>Notes</h1>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          rows={4}
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <button type="submit">Create Note</button>
      </form>
      {error && <div style={{ color: 'crimson', marginBottom: '0.5rem' }}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
          {notes.map(n => (
            <li key={n.title} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem' }}>
              {editing === n.title ? (
                <form
                  onSubmit={async e => {
                    e.preventDefault()
                    setError('')
                    const payload = { body: editBody }
                    if (editTitle.trim() && editTitle.trim() !== n.title) payload.newTitle = editTitle.trim()
                    const res = await fetch(`/api/notes/${encodeURIComponent(n.title)}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    })
                    if (res.ok) {
                      setEditing(null)
                      await load()
                    } else if (res.status === 409) {
                      setError('A note with that title already exists')
                    } else if (res.status === 404) {
                      setError('Note not found')
                    } else {
                      setError('Failed to update note')
                    }
                  }}
                  style={{ display: 'grid', gap: '0.5rem' }}
                >
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  <textarea rows={3} value={editBody} onChange={e => setEditBody(e.target.value)} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gap: '0.25rem' }}>
                  <div>
                    <strong>{n.title}</strong>: {n.body?.slice(0, 100) || ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(n.title)
                        setEditTitle(n.title)
                        setEditBody(n.body || '')
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm(`Delete note "${n.title}"?`)) return
                        setError('')
                        const res = await fetch(`/api/notes/${encodeURIComponent(n.title)}`, { method: 'DELETE' })
                        if (res.status === 204) {
                          await load()
                        } else if (res.status === 404) {
                          setError('Note not found')
                        } else {
                          setError('Failed to delete note')
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
