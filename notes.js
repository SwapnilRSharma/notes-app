const fs = require('fs')

// Normalize titles to reduce near-duplicates (case/whitespace)
const normalizeTitle = (s) => (s || '').trim().toLowerCase()

const saveNotes = (notes) => {
  fs.writeFileSync('notes.json', JSON.stringify(notes))
}

const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

// Return all notes
const listNotes = function () {
  return loadNotes()
}

// Add a note if title not taken (case/trim insensitive)
const addNotes = function (title, body) {
  const notes = loadNotes()
  const target = normalizeTitle(title)
  const duplicate = notes.find((n) => normalizeTitle(n.title) === target)

  if (!duplicate) {
    notes.push({ title, body })
    saveNotes(notes)
    console.log('New Note Added!')
    return true
  } else {
    console.log('Note Title Taken.')
    return false
  }
}

// Read a note by title (case/trim insensitive)
const readNote = function (title) {
  const target = normalizeTitle(title)
  const notes = loadNotes()
  return notes.find((n) => normalizeTitle(n.title) === target) || null
}

// Remove a note by title
const removeNote = function (title) {
  const target = normalizeTitle(title)
  const notes = loadNotes()
  const filtered = notes.filter((n) => normalizeTitle(n.title) !== target)
  const changed = filtered.length !== notes.length
  if (changed) saveNotes(filtered)
  return changed
}

// Update note title/body. If newTitle collides (with a different note), fail.
const updateNote = function (title, { newTitle, body }) {
  const target = normalizeTitle(title)
  const notes = loadNotes()
  const idx = notes.findIndex((n) => normalizeTitle(n.title) === target)
  if (idx === -1) return false

  const current = notes[idx]
  const nextTitle = newTitle != null ? newTitle : current.title

  // prevent collision with another note
  const collision = notes.find(
    (n, i) => i !== idx && normalizeTitle(n.title) === normalizeTitle(nextTitle)
  )
  if (collision) return false

  notes[idx] = { title: nextTitle, body: body != null ? body : current.body }
  saveNotes(notes)
  return true
}

module.exports = {
  listNotes,
  addNotes,
  readNote,
  removeNote,
  updateNote,
}
