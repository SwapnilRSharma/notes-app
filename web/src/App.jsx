import React, { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('Loading...')
  const [count, setCount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function ping() {
      try {
        const res = await fetch('/api/notes')
        if (!res.ok) throw new Error('API error ' + res.status)
        const data = await res.json()
        setCount(Array.isArray(data) ? data.length : 0)
        setStatus('OK')
      } catch (e) {
        setError(e.message)
        setStatus('Error')
      }
    }
    ping()
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>Notes</h1>
      <p>API: {status}</p>
      {error && <pre style={{ color: 'crimson' }}>{error}</pre>}
      {count !== null && <p>Notes available: {count}</p>}
    </div>
  )
}
