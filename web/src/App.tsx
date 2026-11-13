import { useState } from 'react'

export default function App() {
  const [count] = useState(0)
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Notes</h1>
      <p>Vite + React scaffold is working.</p>
      <small>Placeholder count: {count}</small>
    </div>
  )
}
