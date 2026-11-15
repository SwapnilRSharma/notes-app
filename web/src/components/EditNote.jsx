import { useEffect, useState } from 'react'

export default function EditNote({ note, onSaved, onCancel }) {
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
      setError('Title is required')
      return
    }
    const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body })
    })
    if (res.status === 404) {
      setError('Original note no longer exists')
      return
    }
    if (res.status === 409) {
      const j = await res.json().catch(() => ({}))
      setError(j.error || 'Title conflict')
      return
    }
    if (!res.ok) {
      setError('Failed to save note')
      return
    }
    onSaved?.()
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 640, padding: 12, border: '1px solid #ddd', borderRadius: 6, background: '#fafafa', marginTop: 12 }}>
      <h3>Edit Note</h3>
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={() => onCancel?.()}>Cancel</button>
      </div>
    </form>
  )
}
