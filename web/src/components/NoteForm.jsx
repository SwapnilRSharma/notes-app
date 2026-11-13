import React, { useState, useEffect } from 'react'

export default function NoteForm({ initialNote, onSave, onCancel }) {
  const [title, setTitle] = useState(initialNote?.title || '')
  const [body, setBody] = useState(initialNote?.body || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(initialNote?.title || '')
    setBody(initialNote?.body || '')
  }, [initialNote])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required')
      return
    }
    onSave({ title: title.trim(), body: body.trim() })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 600 }}>
      {error ? (
        <div style={{ color: 'crimson' }} role="alert">
          {error}
        </div>
      ) : null}
      <label>
        <div>Title</div>
        <input
          aria-label="Title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        <div>Body</div>
        <textarea
          aria-label="Body"
          placeholder="Body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
