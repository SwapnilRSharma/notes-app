import React, { useEffect, useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

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
        <ul>
          {notes.map(n => (
            <li key={n.title}>
              <strong>{n.title}</strong>: {n.body?.slice(0, 60) || ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
