const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, 'notes.json')

// Legacy function retained for CLI scaffolding
const getNotes = function () {
  return 'Your Notes...'
}

// Core persistence helpers
function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync(DATA_FILE)
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

function saveNotes(notes) {
  const notesJSON = JSON.stringify(notes)
  fs.writeFileSync(DATA_FILE, notesJSON)
}

// CRUD helpers
function listNotes() {
  return loadNotes()
}

function getNote(title) {
  const notes = loadNotes()
  return notes.find(n => n.title === title) || null
}

function addNote(title, body) {
  const notes = loadNotes()
  const exists = notes.some(n => n.title === title)
  if (exists) {
    return { ok: false, reason: 'duplicate' }
  }
  notes.push({ title, body })
  saveNotes(notes)
  return { ok: true }
}

function updateNote(title, changes) {
  const notes = loadNotes()
  const idx = notes.findIndex(n => n.title === title)
  if (idx === -1) return { ok: false, reason: 'not_found' }

  const current = notes[idx]
  const nextTitle = changes.title !== undefined ? changes.title : current.title
  if (nextTitle !== current.title && notes.some((n, i) => i !== idx && n.title === nextTitle)) {
    return { ok: false, reason: 'duplicate' }
  }
  notes[idx] = {
    title: nextTitle,
    body: changes.body !== undefined ? changes.body : current.body
  }
  saveNotes(notes)
  return { ok: true, note: notes[idx] }
}

function removeNote(title) {
  const notes = loadNotes()
  const filtered = notes.filter(n => n.title !== title)
  if (filtered.length === notes.length) return { ok: false, reason: 'not_found' }
  saveNotes(filtered)
  return { ok: true }
}

// Backward-compatible export for the CLI
const addNotes = function (title, body) {
  const result = addNote(title, body)
  if (result.ok) {
    console.log('New Note Added!')
  } else if (result.reason === 'duplicate') {
    console.log('Note Title Taken.')
  }
}

module.exports = {
  // legacy
  getNotes: getNotes,
  addNotes: addNotes,
  // new
  loadNotes,
  saveNotes,
  listNotes,
  getNote,
  addNote,
  updateNote,
  removeNote
}
