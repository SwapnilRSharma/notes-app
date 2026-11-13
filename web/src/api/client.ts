import type { Note } from '../types'

// Prefer same-origin by default when serving the SPA from the API server in production.
// Fall back to localhost for dev when API is on a separate port.
const base = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Only set JSON Content-Type when sending a body. Adding it to GET/DELETE needlessly
  // triggers a CORS preflight which can fail in some environments.
  const hasBody = !!(init && (init as any).body)
  const headers = hasBody ? { 'Content-Type': 'application/json', ...(init && init.headers) } : { ...(init && init.headers) }
  const res = await fetch(`${base}${path}`, { ...init, headers })
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
