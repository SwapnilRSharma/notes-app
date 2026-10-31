const fs = require('fs')

// Return a friendly string (legacy CLI helper)
const getNotes = function () {
  return 'Your Notes...'
}

// Id generator: timestamp + random chunk
function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase()
}

function saveNotes(notes) {
  fs.writeFileSync('notes.json', JSON.stringify(notes))
}

// CLI add: preserves legacy behavior of preventing duplicate titles
const addNotes = function (title, body) {
  const notes = loadNotes()
  const duplicateNotes = notes.filter(function (note) {
    return note.title === title
  })

  if (duplicateNotes.length === 0) {
    const note = {
      id: generateId(),
      title: title,
      body: body,
    }
    notes.push(note)
    saveNotes(notes)
    console.log('New Note Added!')
    return note
  } else {
    console.log('Note Title Taken.')
    return null
  }
}

// Web/API add: allows duplicate titles
const createNote = function (title, body) {
  const notes = loadNotes()
  const note = { id: generateId(), title, body }
  notes.push(note)
  saveNotes(notes)
  return note
}

const listNotes = function () {
  return loadNotes()
}

const updateNote = function (id, updates) {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  const current = notes[idx]
  const next = { ...current }
  if (typeof updates.title === 'string' && updates.title.length > 0) {
    next.title = updates.title
  }
  if (typeof updates.body === 'string' && updates.body.length > 0) {
    next.body = updates.body
  }
  notes[idx] = next
  saveNotes(notes)
  return next
}

const removeNote = function (id) {
  const notes = loadNotes()
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) return false
  notes.splice(idx, 1)
  saveNotes(notes)
  return true
}

const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    const loaded = JSON.parse(dataJSON)
    // Assign ids to notes missing them; persist immediately so ids are stable across requests
    let mutated = false
    for (const n of loaded) {
      if (!n.id) {
        n.id = generateId()
        mutated = true
      }
    }
    if (mutated) {
      // Persist generated ids right away to avoid transient ids breaking PUT/DELETE
      saveNotes(loaded)
    }
    return loaded
  } catch (e) {
    return []
  }
}

module.exports = {
  getNotes: getNotes,
  addNotes: addNotes,
  createNote: createNote,
  listNotes: listNotes,
  updateNote: updateNote,
  removeNote: removeNote,
}
