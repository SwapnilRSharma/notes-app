const fs = require('fs')

// Internal helpers kept small and synchronous for simplicity.
function readNotesFile() {
  try {
    const buf = fs.readFileSync('notes.json')
    const json = buf.toString()
    const data = JSON.parse(json)
    return Array.isArray(data) ? data : []
  } catch (e) {
    // On first run the file may not exist.
    return []
  }
}

function writeNotesFile(notes) {
  // Write compact JSON; no need for pretty here
  fs.writeFileSync('notes.json', JSON.stringify(notes))
}

function listNotes() {
  return readNotesFile()
}

function addNote(title, body) {
  const notes = readNotesFile()
  if (notes.some(n => n.title === title)) {
    const err = new Error('Duplicate title')
    err.code = 'DUPLICATE'
    throw err
  }
  const note = { title, body }
  notes.push(note)
  writeNotesFile(notes)
  return note
}

function updateNote(title, { newTitle, body }) {
  const notes = readNotesFile()
  const idx = notes.findIndex(n => n.title === title)
  if (idx === -1) {
    const err = new Error('Note not found')
    err.code = 'NOT_FOUND'
    throw err
  }
  const nextTitle = newTitle && newTitle !== title ? newTitle : title
  if (nextTitle !== title && notes.some(n => n.title === nextTitle)) {
    const err = new Error('Duplicate title')
    err.code = 'DUPLICATE'
    throw err
  }
  const updated = {
    title: nextTitle,
    body: typeof body === 'string' ? body : notes[idx].body,
  }
  notes[idx] = updated
  writeNotesFile(notes)
  return updated
}

function removeNote(title) {
  const notes = readNotesFile()
  const idx = notes.findIndex(n => n.title === title)
  if (idx === -1) {
    const err = new Error('Note not found')
    err.code = 'NOT_FOUND'
    throw err
  }
  const [removed] = notes.splice(idx, 1)
  writeNotesFile(notes)
  return removed
}

module.exports = {
  listNotes,
  addNote,
  updateNote,
  removeNote,
}
