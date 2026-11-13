import type { Note } from '../types'

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init && init.headers) },
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error((data && data.error) || 'request_failed') as Error & { status?: number; data?: any }
    err.status = res.status
    err.data = data
    throw err
  }
  return data as T
}

export const api = {
  listNotes: () => request<{ notes: Note[] }>(`/api/notes`),
  createNote: (note: Note) => request<{ note: Note }>(`/api/notes`, { method: 'POST', body: JSON.stringify(note) }),
  deleteNote: (title: string) => request<{ ok: boolean }>(`/api/notes/${encodeURIComponent(title)}`, { method: 'DELETE' }),
  updateNote: (title: string, changes: Partial<Note>) =>
    request<{ note: Note }>(`/api/notes/${encodeURIComponent(title)}`, { method: 'PUT', body: JSON.stringify(changes) }),
}
