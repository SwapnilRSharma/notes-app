import { useState } from 'react'
import type { Note } from '../types'

export function NoteForm({ onSubmit, initial }: { onSubmit: (note: Note) => Promise<void> | void; initial?: Partial<Note> }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setSubmitting(true)
      await onSubmit({ title, body })
      setTitle('')
      setBody('')
    } catch (e: any) {
      setError(e?.data?.error || e?.message || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={4} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        {error && <span style={{ color: '#d33' }}>{error}</span>}
      </div>
    </form>
  )
}
