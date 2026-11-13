import { useEffect, useState } from 'react'

function App() {
  const [ping, setPing] = useState<string>('')
  useEffect(() => {
    // Try pinging the API root; ignore errors during scaffold
    fetch('/api/notes')
      .then((r) => r.ok ? r.json() : [])
      .then(() => setPing('ready'))
      .catch(() => setPing(''))
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>Notes</h1>
      <p>Web UI scaffold {ping && `(API ${ping})`}</p>
    </div>
  )
}

export default App
