import { useEffect, useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(setNotes)
      .catch(e => setError(e.message))
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 20 }}>
      <h1>Notes</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map(n => (
            <li key={n.title}><strong>{n.title}</strong>: {n.body}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
