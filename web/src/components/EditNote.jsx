import { useEffect, useState } from 'react'
import Input from './ui/input.jsx'
import Textarea from './ui/textarea.jsx'
import Button from './ui/button.jsx'

export default function EditNote({ note, onSaved, onCancel, onNotify }) {
  const [title, setTitle] = useState(note?.title || '')
  const [body, setBody] = useState(note?.body || '')
  const [error, setError] = useState('')

  // Simple count logic: words counted by whitespace-separated tokens, characters by raw length
  const countWordChar = (text) => {
    const t = (text || '')
    const trimmed = t.trim()
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
    const characters = t.length
    return { words, characters }
  }

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

  return (
    <form onSubmit={submit} className="card form">
      <h3>Edit Note</h3>
      {error && <div className="error-text">{error}</div>}
      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Body"
        rows={4}
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      {/* Live counter under the editor */}
      {(() => {
        const { words, characters } = countWordChar(body)
        return (
          <div className="text-slate-500 text-sm mt-1" aria-label="note-counter">
            {words} words · {characters} characters
          </div>
        )
      })()}
      <div className="actions">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={() => onCancel?.()}>Cancel</Button>
      </div>
    </form>
  )
}
