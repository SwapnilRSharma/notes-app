const fs = require('fs')

const getNotes = function () {
    return 'Your Notes...'
}

const addNotes = function (title, body) {
    const notes = loadNotes()
    const duplicateNotes = notes.filter(function (note) {
        return note.title === title
    })

    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log('New Note Added!')
    } else {
        console.log('Note Title Taken.')
    }
}

const loadNotes = function () {
    try{
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

// Small helper to persist notes array
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', notesJSON)
}

// List all notes
const listNotes = function () {
    return loadNotes()
}

// Read a single note by title
const readNote = function (title) {
    const notes = loadNotes()
    return notes.find(n => n.title === title)
}

// Remove a note by title. Returns true when removed, false if not found.
const removeNote = function (title) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === title)
    if (idx === -1) return false
    notes.splice(idx, 1)
    saveNotes(notes)
    return true
}

// Update note with optional title/body changes. Returns updated note on success,
// { ok: false, reason: 'duplicate_title' } on conflict, and null if not found.
const updateNote = function (title, changes = {}) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === title)
    if (idx === -1) return null

    const current = notes[idx]
    const nextTitle = (changes.title && typeof changes.title === 'string') ? changes.title : current.title

    if (nextTitle !== current.title) {
        const collision = notes.some((n, i) => i !== idx && n.title === nextTitle)
        if (collision) {
            return { ok: false, reason: 'duplicate_title' }
        }
    }

    const nextBody = (changes.body && typeof changes.body === 'string') ? changes.body : current.body
    const updated = { title: nextTitle, body: nextBody }
    notes[idx] = updated
    saveNotes(notes)
    return updated
}

module.exports = {
    getNotes : getNotes,
    addNotes : addNotes,
    // new helpers for HTTP API and extended CLI support
    saveNotes: saveNotes,
    listNotes: listNotes,
    readNote: readNote,
    removeNote: removeNote,
    updateNote: updateNote
}
