import React, { useState } from 'react'

export default function NoteForm({ onCreate, busy }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await onCreate({ title: title.trim(), body })
      setTitle('')
      setBody('')
    } catch (e) {
      setError(e.message || 'Failed to create')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Note</h3>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div>
          <button type="submit" disabled={busy}>
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  )
}
