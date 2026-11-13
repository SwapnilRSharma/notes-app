const fs = require('fs')

// File path for persistence; kept in project root as per design
const NOTES_FILE = 'notes.json'

// Internal helpers to load/save notes
function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync(NOTES_FILE)
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

function saveNotes(notes) {
  // Persist atomically enough for this toy app
  const notesJSON = JSON.stringify(notes, null, 2)
  fs.writeFileSync(NOTES_FILE, notesJSON)
}

// Existing placeholder kept for CLI help compatibility
function getNotes() {
  return 'Your Notes...'
}

// Create
function addNotes(title, body) {
  const notes = loadNotes()
  const duplicate = notes.find((n) => n.title === title)
  if (duplicate) {
    console.log('Note Title Taken.')
    return false
  }
  notes.push({ title, body })
  saveNotes(notes)
  console.log('New Note Added!')
  return true
}

// List
function listNotes() {
  return loadNotes()
}

// Read by title
function readNote(title) {
  const notes = loadNotes()
  return notes.find((n) => n.title === title)
}

// Update by title (can change title and/or body)
function updateNote(title, updates) {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.title === title)
  if (idx === -1) return { ok: false, reason: 'not_found' }

  const next = { ...notes[idx] }
  if (typeof updates.title === 'string' && updates.title !== title) {
    // Enforce unique title
    const exists = notes.some((n) => n.title === updates.title)
    if (exists) return { ok: false, reason: 'duplicate_title' }
    next.title = updates.title
  }
  if (typeof updates.body === 'string') {
    next.body = updates.body
  }
  notes[idx] = next
  saveNotes(notes)
  return { ok: true, note: next }
}

// Remove by title
function removeNote(title) {
  const notes = loadNotes()
  const before = notes.length
  const kept = notes.filter((n) => n.title !== title)
  if (kept.length === before) return false
  saveNotes(kept)
  return true
}

module.exports = {
  // legacy/CLI
  getNotes,
  addNotes,
  // new CRUD helpers
  listNotes,
  readNote,
  updateNote,
  removeNote,
}
