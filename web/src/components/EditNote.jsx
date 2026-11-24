import { useEffect, useState } from 'react'

export default function EditNote({ note, onSaved, onCancel, onNotify }) {
  const [title, setTitle] = useState(note?.title || '')
  const [body, setBody] = useState(note?.body || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(note?.title || '')
    setBody(note?.body || '')
    setError('')
  }, [note])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      const msg = 'Title is required'
      setError(msg)
      onNotify?.(msg, 'error')
      return
    }
    const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body })
    })
    if (res.status === 404) {
      const msg = 'Original note no longer exists'
      setError(msg)
      onNotify?.(msg, 'error')
      return
    }
    if (res.status === 409) {
      const j = await res.json().catch(() => ({}))
      const msg = j.error || 'Title conflict'
      setError(msg)
      onNotify?.(msg, 'error')
      return
    }
    if (!res.ok) {
      const msg = 'Failed to save note'
      setError(msg)
      onNotify?.(msg, 'error')
      return
    }
    onSaved?.()
  }

  const formStyle = { display: 'grid', gap: 10, maxWidth: 720, margin: '12px 0 20px' }
  const actionsStyle = { display: 'flex', gap: 8, marginLeft: 'auto' }
  const errorStyle = { color: '#b91c1c', margin: '6px 0' }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h3>Edit Note</h3>
      {error && <div style={errorStyle}>{error}</div>}
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
      <div style={actionsStyle}>
        <button type="submit">Save</button>
        <button type="button" onClick={() => onCancel?.()}>Cancel</button>
      </div>
    </form>
  )
}
