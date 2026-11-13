const fs = require('fs')

// Load all notes from the local JSON file. Returns [] if the file doesn't exist or is invalid.
const loadNotes = function () {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

// Persist notes atomically for the current process.
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', notesJSON)
}

// Legacy helper kept for CLI compatibility. Returns the created note on success, or false on duplicate.
const addNotes = function (title, body) {
    const notes = loadNotes()
    const duplicate = notes.find((note) => note.title === title)

    if (!duplicate) {
        const newNote = { title, body }
        notes.push(newNote)
        saveNotes(notes)
        // Keep original logs for the CLI UX
        console.log('New Note Added!')
        return newNote
    } else {
        console.log('Note Title Taken.')
        return false
    }
}

// List all notes
const listNotes = function () {
    return loadNotes()
}

// Read a single note by exact title. Returns the note object or null if missing.
const readNote = function (title) {
    const notes = loadNotes()
    return notes.find((n) => n.title === title) || null
}

// Update a note found by currentTitle. Accepts newTitle/body; returns updated note or false if
// not found or if the newTitle would collide with another existing note.
const updateNote = function (currentTitle, { title: newTitle, body: newBody }) {
    const notes = loadNotes()
    const idx = notes.findIndex((n) => n.title === currentTitle)
    if (idx === -1) return false

    const existing = notes[idx]
    const finalTitle = newTitle !== undefined ? newTitle : existing.title
    const finalBody = newBody !== undefined ? newBody : existing.body

    // If title is changing, ensure no duplicate with a different note
    if (finalTitle !== existing.title && notes.some((n, i) => i !== idx && n.title === finalTitle)) {
        return false
    }

    notes[idx] = { title: finalTitle, body: finalBody }
    saveNotes(notes)
    return notes[idx]
}

// Remove a note by title. Returns true if removed, false if not found.
const removeNote = function (title) {
    const notes = loadNotes()
    const remaining = notes.filter((n) => n.title !== title)
    if (remaining.length === notes.length) return false
    saveNotes(remaining)
    return true
}

module.exports = {
    // Kept for compatibility though unused by the web; minimal message producer.
    getNotes: function () { return 'Your Notes...' },
    addNotes,
    listNotes,
    readNote,
    updateNote,
    removeNote,
}
