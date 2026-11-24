import { useEffect, useState } from 'react'
import { Card } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
import { Textarea } from './ui/textarea.jsx'

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

  return (
    <Card asChild>
      <form onSubmit={submit} className="form">
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
        <div className="actions">
          <Button type="submit" variant="default">Save</Button>
          <Button type="button" variant="secondary" onClick={() => onCancel?.()}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
