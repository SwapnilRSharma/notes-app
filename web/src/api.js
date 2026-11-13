const base = '' // use Vite proxy in dev

export async function getNotes() {
  const res = await fetch(`${base}/api/notes`)
  if (!res.ok) throw new Error('Failed to load notes')
  return res.json()
}

export async function createNote({ title, body }) {
  const res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  })
  if (res.status === 409) throw new Error('Conflict')
  if (!res.ok) throw new Error('CreateFailed')
  return res.json()
}

export async function updateNote(oldTitle, { title, body }) {
  const res = await fetch(`${base}/api/notes/${encodeURIComponent(oldTitle)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  })
  if (res.status === 404) throw new Error('NotFound')
  if (res.status === 409) throw new Error('Conflict')
  if (!res.ok) throw new Error('UpdateFailed')
  return res.json()
}

export async function deleteNote(title) {
  const res = await fetch(`${base}/api/notes/${encodeURIComponent(title)}`, {
    method: 'DELETE'
  })
  if (res.status === 404) throw new Error('NotFound')
  if (!res.ok) throw new Error('DeleteFailed')
  return true
}
