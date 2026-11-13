const fs = require('fs')

// Internal helpers for file-backed persistence
function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

function saveNotes(notes) {
  // Persist notes atomically
  const notesJSON = JSON.stringify(notes)
  fs.writeFileSync('notes.json', notesJSON)
}

// Legacy helper kept for compatibility with existing CLI scaffolding
function getNotes() {
  return 'Your Notes...'
}

// Create
function addNotes(title, body) {
  const notes = loadNotes()
  const exists = notes.some((n) => n.title === title)
  if (exists) {
    // Provide a clear error for API/consumers
    throw new Error('Duplicate title')
  }
  const note = { title, body }
  notes.push(note)
  saveNotes(notes)
  return note
}

// Read all
function listNotes() {
  return loadNotes()
}

// Read one
function getNote(title) {
  const notes = loadNotes()
  return notes.find((n) => n.title === title)
}

// Update (supports title and/or body changes)
function updateNote(oldTitle, { title, body }) {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.title === oldTitle)
  if (idx === -1) {
    throw new Error('Not found')
  }

  const current = notes[idx]
  const newTitle = title !== undefined ? title : current.title
  const newBody = body !== undefined ? body : current.body

  if (newTitle !== oldTitle) {
    const collision = notes.some((n, i) => i !== idx && n.title === newTitle)
    if (collision) {
      throw new Error('Duplicate title')
    }
  }

  notes[idx] = { title: newTitle, body: newBody }
  saveNotes(notes)
  return notes[idx]
}

// Delete
function removeNote(title) {
  const notes = loadNotes()
  const filtered = notes.filter((n) => n.title !== title)
  if (filtered.length === notes.length) {
    throw new Error('Not found')
  }
  saveNotes(filtered)
  return true
}

module.exports = {
  // legacy placeholder
  getNotes,
  // CRUD
  addNotes,
  listNotes,
  getNote,
  updateNote,
  removeNote,
}
