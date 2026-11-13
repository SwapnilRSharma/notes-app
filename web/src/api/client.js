export async function listNotes() {
  const res = await fetch('/api/notes')
  if (!res.ok) throw new Error('Failed to fetch notes')
  return res.json()
}

export async function createNote({ title, body }) {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  })
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()
}

export async function updateNote(id, { title, body }) {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  })
  if (!res.ok) throw new Error('Failed to update note')
  return res.json()
}

export async function deleteNote(id) {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete note')
  return res.json()
}
