import React, { useState, useEffect } from 'react'

export default function NoteForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [body, setBody] = useState(initial?.body || '')

  useEffect(() => {
    setTitle(initial?.title || '')
    setBody(initial?.body || '')
  }, [initial])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title: title.trim(), body })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">{submitLabel}</button>
        {onCancel ? (
          <button type="button" onClick={onCancel}>Cancel</button>
        ) : null}
      </div>
    </form>
  )
}
