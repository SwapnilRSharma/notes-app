const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, 'notes.json')

// Simple id generator without extra deps
function genId () {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
  )
}

function saveNotes (notes) {
  const notesJSON = JSON.stringify(notes)
  fs.writeFileSync(DATA_FILE, notesJSON)
}

function loadNotes () {
  try {
    const dataBuffer = fs.readFileSync(DATA_FILE)
    const dataJSON = dataBuffer.toString()
    const parsed = JSON.parse(dataJSON)

    // Migrate: ensure each note has a stable id
    let mutated = false
    for (const n of parsed) {
      if (!n.id) {
        n.id = genId()
        mutated = true
      }
    }
    if (mutated) saveNotes(parsed)
    return parsed
  } catch (e) {
    return []
  }
}

// Public API
function listNotes () {
  return loadNotes()
}

function getNoteById (id) {
  return loadNotes().find(n => n.id === id)
}

function addNote (title, body) {
  const notes = loadNotes()
  const note = { id: genId(), title, body }
  notes.push(note)
  saveNotes(notes)
  return note
}

function updateNote (id, updates) {
  const notes = loadNotes()
  const idx = notes.findIndex(n => n.id === id)
  if (idx === -1) return null
  const current = notes[idx]
  const next = { ...current }
  if (typeof updates.title === 'string') next.title = updates.title
  if (typeof updates.body === 'string') next.body = updates.body
  notes[idx] = next
  saveNotes(notes)
  return next
}

function removeNote (id) {
  const notes = loadNotes()
  const idx = notes.findIndex(n => n.id === id)
  if (idx === -1) return false
  notes.splice(idx, 1)
  saveNotes(notes)
  return true
}

// Back-compat exports for CLI app.js (if still used)
const getNotes = function () {
  return 'Your Notes...'
}
const addNotes = function (title, body) {
  addNote(title, body)
}

module.exports = {
  // new API
  listNotes,
  getNoteById,
  addNote,
  updateNote,
  removeNote,
  // legacy used by CLI
  getNotes,
  addNotes
}
