import React from 'react'

export default function NotesList({ notes, selected, onSelect, loading, error, onRefresh }) {
  return (
    <div style={{ minWidth: 260, borderRight: '1px solid #ddd', paddingRight: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Notes</h2>
        <button onClick={onRefresh} disabled={loading}>
          {loading ? '…' : '↻'}
        </button>
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {notes.map((n) => (
          <li key={n.title}>
            <button
              onClick={() => onSelect(n.title)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: 4,
                marginBottom: 6,
                background: selected === n.title ? '#eef6ff' : 'white',
              }}
            >
              {n.title}
            </button>
          </li>
        ))}
        {notes.length === 0 && !loading && <li style={{ color: '#666' }}>No notes yet.</li>}
      </ul>
    </div>
  )
}
