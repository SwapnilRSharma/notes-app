import { useEffect, useState } from 'react'
import NotesList from './components/NotesList.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    fetch('/api/notes')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to load')))
      .then(data => { setNotes(data); setError('') })
      .catch(e => setError(e.message))
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 20 }}>
      <h1>Notes</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <NotesList notes={notes} onEdit={() => { /* wired in t5 */ }} onDelete={() => { /* wired in t6 */ }} />
    </div>
  )
}
