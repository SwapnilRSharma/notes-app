const fs = require('fs')

// Back-compat: keep existing function for CLI help
const getNotes = function () {
    return 'Your Notes...'
}

// Internal: persist notes array to disk
function saveNotes(notes) {
    const notesJSON = JSON.stringify(notes, null, 2)
    fs.writeFileSync('notes.json', notesJSON)
}

const addNote = function (title, body) {
    const notes = loadNotes()
    const exists = notes.find(n => n.title === title)

    if (exists) {
        const err = new Error('Note title already exists')
        err.code = 'E_CONFLICT'
        throw err
    }

    const note = { title, body }
    notes.push(note)
    saveNotes(notes)
    return note
}

// Back-compat wrapper for existing CLI usage: prints messages instead of throwing
const addNotes = function (title, body) {
    try {
        addNote(title, body)
        console.log('New Note Added!')
    } catch (err) {
        if (err && err.code === 'E_CONFLICT') {
            console.log('Note Title Taken.')
            return
        }
        // Unexpected error — surface a generic message
        console.log('Failed to add note.')
    }
}

const listNotes = function () {
    return loadNotes()
}

const getNote = function (title) {
    const notes = loadNotes()
    return notes.find(n => n.title === title) || null
}

const updateNote = function (title, updates) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === title)
    if (idx === -1) {
        const err = new Error('Note not found')
        err.code = 'E_NOT_FOUND'
        throw err
    }

    const current = notes[idx]
    const nextTitle = updates.title !== undefined ? updates.title : current.title
    const nextBody = updates.body !== undefined ? updates.body : current.body

    if (nextTitle !== current.title && notes.find(n => n.title === nextTitle)) {
        const err = new Error('New title conflicts with another note')
        err.code = 'E_CONFLICT'
        throw err
    }

    const updated = { title: nextTitle, body: nextBody }
    notes[idx] = updated
    saveNotes(notes)
    return updated
}

const removeNote = function (title) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === title)
    if (idx === -1) {
        const err = new Error('Note not found')
        err.code = 'E_NOT_FOUND'
        throw err
    }
    notes.splice(idx, 1)
    saveNotes(notes)
    return true
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

module.exports = {
    getNotes,
    addNotes, // alias for addNote
    addNote,
    listNotes,
    getNote,
    updateNote,
    removeNote
}
