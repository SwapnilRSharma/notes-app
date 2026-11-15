import { useState } from 'react'

export default function NoteForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body })
    })
    if (res.status === 409) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || 'Duplicate title')
      return
    }
    if (!res.ok) {
      setError('Failed to create note')
      return
    }
    setTitle('')
    setBody('')
    onCreated?.()
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 640, marginBottom: 16 }}>
      <h2>Create Note</h2>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
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
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}
