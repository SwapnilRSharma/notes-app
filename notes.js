const fs = require('fs')

// Internal: read notes from disk; returns an array
function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    const parsed = JSON.parse(dataJSON)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

// Internal: persist notes to disk. Assign ids to any note missing one.
function saveNotes(notes) {
  const withIds = notes.map((n) => ({ ...n, id: n.id || genId() }))
  fs.writeFileSync('notes.json', JSON.stringify(withIds, null, 2))
  return withIds
}

function genId() {
  // Simple unique id generator without extra deps
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
  )
}

// Legacy CLI helper retained for backward compatibility
function getNotes() {
  return 'Your Notes...'
}

// Legacy CLI helper retained: prevents duplicate titles
function addNotes(title, body) {
  const notes = loadNotes()
  const duplicateNotes = notes.filter((note) => note.title === title)

  if (duplicateNotes.length === 0) {
    notes.push({ title, body })
    saveNotes(notes)
    console.log('New Note Added!')
  } else {
    console.log('Note Title Taken.')
  }
}

// New helpers used by the web server
function list() {
  // Return current notes, but ensure ids are present
  const ensured = saveNotes(loadNotes())
  return ensured
}

function add({ title, body }) {
  const notes = loadNotes()
  const note = { id: genId(), title, body }
  notes.push(note)
  saveNotes(notes)
  return note
}

function update(id, { title, body }) {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  const current = notes[idx]
  const updated = { ...current, title: title ?? current.title, body: body ?? current.body }
  notes[idx] = updated
  saveNotes(notes)
  return updated
}

function remove(id) {
  const notes = loadNotes()
  const next = notes.filter((n) => n.id !== id)
  const removed = next.length !== notes.length
  if (removed) saveNotes(next)
  return removed
}

module.exports = {
  // legacy
  getNotes,
  addNotes,
  // new api
  list,
  add,
  update,
  remove,
}
