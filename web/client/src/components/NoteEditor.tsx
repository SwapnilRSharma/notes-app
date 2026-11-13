import { FormEvent, useEffect, useState } from 'react'
import type { Note } from '../api'

type Props = {
  note: Note | null
  onUpdate: (currentTitle: string, update: Partial<Note>) => Promise<void>
  onClose: () => void
}

export default function NoteEditor({ note, onUpdate, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(note?.title || '')
    setBody(note?.body || '')
  }, [note])

  if (!note) return null

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    try {
      await onUpdate(note.title, { title: title.trim(), body })
      onClose()
    } catch (err: any) {
      if (err?.status === 409) setError('A note with this title already exists')
      else setError(err?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, borderTop: '1px solid #ddd', paddingTop: 12 }}>
      <h2>Edit Note</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}
