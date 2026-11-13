import React, { useEffect, useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/notes')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setNotes(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Failed to load notes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h1>Notes</h1>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        <ul>
          {notes.map(n => (
            <li key={n.title}>
              <strong>{n.title}</strong>: {n.body?.slice(0, 60) || ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
