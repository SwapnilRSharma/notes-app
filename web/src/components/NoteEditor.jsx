import React, { useEffect, useState } from 'react'

export default function NoteEditor({ note, onSave, onDelete, onCancel, busy }) {
  const [title, setTitle] = useState(note?.title || '')
  const [body, setBody] = useState(note?.body || '')
  const [error, setError] = useState(null)

  useEffect(() => {
    setTitle(note?.title || '')
    setBody(note?.body || '')
    setError(null)
  }, [note])

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    try {
      await onSave({ title: title.trim(), body })
    } catch (e) {
      setError(e.message || 'Failed to save')
    }
  }

  async function handleDelete() {
    if (!note) return
    if (!confirm(`Delete note \"${note.title}\"?`)) return
    try {
      await onDelete()
    } catch (e) {
      setError(e.message || 'Failed to delete')
    }
  }

  if (!note) return <div style={{ color: '#666' }}>Select a note to edit.</div>

  return (
    <form onSubmit={handleSave} style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Edit Note</h3>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleDelete} disabled={busy} style={{ marginLeft: 'auto', color: 'white', background: 'crimson' }}>
            Delete
          </button>
        </div>
      </div>
    </form>
  )
}
