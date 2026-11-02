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
        return true
    } else {
        console.log('Note Title Taken.')
        return false
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

// Persist notes to disk
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes, null, 2)
    fs.writeFileSync('notes.json', notesJSON)
}

// Return all notes
const listNotes = function () {
    return loadNotes()
}

// Return a single note by title (exact match)
const readNote = function (title) {
    const notes = loadNotes()
    return notes.find(n => n.title === title)
}

// Update note by current title; optionally change title and/or body
// Returns 'ok' | 'not_found' | 'duplicate'
const updateNote = function (currentTitle, newTitle, body) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === currentTitle)
    if (idx === -1) return 'not_found'

    const nextTitle = newTitle != null ? newTitle : notes[idx].title
    if (nextTitle !== currentTitle && notes.some(n => n.title === nextTitle)) {
        return 'duplicate'
    }

    const nextBody = body != null ? body : notes[idx].body
    notes[idx] = { title: nextTitle, body: nextBody }
    saveNotes(notes)
    return 'ok'
}

// Remove note by title; returns boolean
const removeNote = function (title) {
    const notes = loadNotes()
    const filtered = notes.filter(n => n.title !== title)
    if (filtered.length === notes.length) return false
    saveNotes(filtered)
    return true
}

module.exports = {
    getNotes: getNotes,
    addNotes: addNotes,
    saveNotes: saveNotes,
    listNotes: listNotes,
    readNote: readNote,
    updateNote: updateNote,
    removeNote: removeNote
}
