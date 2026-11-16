export type Note = { title: string; body: string }

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error((data && (data.error || data.message)) || res.statusText)
    // @ts-expect-error attach
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function listNotes(): Promise<Note[]> {
  const res = await fetch('/api/notes')
  return json<Note[]>(res)
}

export async function getNote(title: string): Promise<Note> {
  const res = await fetch(`/api/notes/${encodeURIComponent(title)}`)
  return json<Note>(res)
}

export async function createNote(note: Note): Promise<Note> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  return json<Note>(res)
}

export async function updateNote(currentTitle: string, update: Partial<Note>): Promise<Note> {
  const res = await fetch(`/api/notes/${encodeURIComponent(currentTitle)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  })
  return json<Note>(res)
}

export async function deleteNote(title: string): Promise<void> {
  const res = await fetch(`/api/notes/${encodeURIComponent(title)}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) await json(res)
}
