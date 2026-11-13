export type Note = {
  id: string
  title: string
  body: string
  createdAt: string // ISO string
}

const STORAGE_KEY = 'web-e7ec4f50:notes'

function readRaw(): unknown {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeRaw(notes: Note[]) {
  // Tolerate storage being unavailable or throwing (e.g. Safari Private mode, quota, blockers)
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // Best-effort persistence only; ignore write failures so UI can still function
  }
}

export function getNotes(): Note[] {
  const data = readRaw()
  if (!Array.isArray(data)) return []
  // Best-effort coerce
  return data
    .map((n: any) => ({
      id: String(n.id ?? ''),
      title: String(n.title ?? ''),
      body: String(n.body ?? ''),
      createdAt: String(n.createdAt ?? new Date().toISOString()),
    }))
    .filter((n) => n.id && n.title)
}

export function addNote(input: { title: string; body: string }): Note {
  const now = new Date().toISOString()
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const note: Note = { id, title: input.title.trim(), body: input.body.trim(), createdAt: now }
  const next = [note, ...getNotes()]
  writeRaw(next)
  return note
}

export function setNotes(notes: Note[]) {
  writeRaw(notes)
}
