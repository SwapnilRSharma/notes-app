import { useState } from 'react'

export default function NoteForm({ onCreated, onNotify }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      onNotify?.('Title is required', 'error')
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
      onNotify?.(j.error || 'Duplicate title', 'error')
      return
    }
    if (!res.ok) {
      const msg = 'Failed to create note'
      setError(msg)
      onNotify?.(msg, 'error')
      return
    }
    setTitle('')
    setBody('')
    onCreated?.()
  }

  return (
    <form onSubmit={submit} className="card form">
      <h2>Create Note</h2>
      {error && <div className="error-text">{error}</div>}
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
      <div className="actions">
        <button type="submit" className="btn primary">Add</button>
      </div>
    </form>
  )
}
