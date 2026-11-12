import React, { useEffect, useState } from 'react'

function useNotesApi() {
  const list = async () => {
    const res = await fetch('/api/notes')
    if (!res.ok) throw new Error('Failed to load notes')
    return res.json()
  }
  const create = async (note) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    })
    if (!res.ok) throw new Error((await res.json()).error || 'create_failed')
    return res.json()
  }
  const update = async (origTitle, note) => {
    const res = await fetch(`/api/notes/${encodeURIComponent(origTitle)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    })
    if (!res.ok) throw new Error((await res.json()).error || 'update_failed')
    return res.json()
  }
  const remove = async (title) => {
    const res = await fetch(`/api/notes/${encodeURIComponent(title)}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error((await res.json()).error || 'delete_failed')
  }
  return { list, create, update, remove }
}

export default function App() {
  const api = useNotesApi()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', body: '' })
  const [editing, setEditing] = useState(null) // { origTitle, title, body }

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.list()
      setNotes(data)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.create({ title: form.title.trim(), body: form.body })
      setForm({ title: '', body: '' })
      await refresh()
    } catch (e) {
      setError('Create failed: ' + String(e.message || e))
    }
  }

  const onDelete = async (title) => {
    if (!confirm(`Delete note "${title}"?`)) return
    setError('')
    try {
      await api.remove(title)
      await refresh()
    } catch (e) {
      setError('Delete failed: ' + String(e.message || e))
    }
  }

  const startEdit = (n) => {
    setEditing({ origTitle: n.title, title: n.title, body: n.body })
  }

  const onEditSave = async (e) => {
    e.preventDefault()
    if (!editing) return
    setError('')
    try {
      await api.update(editing.origTitle, { title: editing.title, body: editing.body })
      setEditing(null)
      await refresh()
    } catch (e) {
      setError('Update failed: ' + String(e.message || e))
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Notes</h1>
      {error && <div style={{ color: 'white', background: '#c0392b', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}

      <section style={{ marginBottom: 24 }}>
        <h2>Create Note</h2>
        <form onSubmit={onCreate} style={{ display: 'grid', gap: 8 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Body"
            value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            rows={4}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section>
        <h2>All Notes</h2>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
            {notes.map(n => (
              <li key={n.title} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
                {editing && editing.origTitle === n.title ? (
                  <form onSubmit={onEditSave} style={{ display: 'grid', gap: 8 }}>
                    <input
                      value={editing.title}
                      onChange={e => setEditing({ ...editing, title: e.target.value })}
                      required
                    />
                    <textarea
                      value={editing.body}
                      onChange={e => setEditing({ ...editing, body: e.target.value })}
                      rows={3}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ margin: 0 }}>{n.title}</h3>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => startEdit(n)}>Edit</button>
                        <button onClick={() => onDelete(n.title)}>Delete</button>
                      </div>
                    </div>
                    {n.body && <p style={{ whiteSpace: 'pre-wrap' }}>{n.body}</p>}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
