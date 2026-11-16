import { FormEvent, useState } from 'react'

type Props = {
  onCreate: (title: string, body: string) => Promise<void>
}

export default function NoteForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    try {
      await onCreate(title.trim(), body)
      setTitle(''); setBody('')
    } catch (err: any) {
      if (err?.status === 409) setError('A note with this title already exists')
      else setError(err?.message || 'Failed to create note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <h2>Create Note</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button disabled={loading}>{loading ? 'Creating…' : 'Create'}</button>
    </form>
  )
}
