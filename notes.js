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
        return { title, body }
    } else {
        console.log('Note Title Taken.')
        return null
    }
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

// Persist notes to notes.json
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', notesJSON)
}

// New API: list, read, update, remove
const listNotes = function () {
    return loadNotes()
}

const readNote = function (title) {
    const notes = loadNotes()
    return notes.find(n => n.title === title) || null
}

const updateNote = function (oldTitle, changes) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === oldTitle)
    if (idx === -1) {
        throw new Error('NotFound')
    }

    const current = notes[idx]
    const nextTitle = changes.title !== undefined ? changes.title : current.title
    const nextBody = changes.body !== undefined ? changes.body : current.body

    if (nextTitle !== oldTitle) {
        // Ensure no duplicate title with another note
        const dup = notes.find(n => n.title === nextTitle)
        if (dup) {
            throw new Error('Conflict')
        }
    }

    const updated = { title: nextTitle, body: nextBody }
    notes[idx] = updated
    saveNotes(notes)
    return updated
}

const removeNote = function (title) {
    const notes = loadNotes()
    const remaining = notes.filter(n => n.title !== title)
    if (remaining.length === notes.length) {
        throw new Error('NotFound')
    }
    saveNotes(remaining)
    return true
}

module.exports = {
    getNotes: getNotes,
    addNotes: addNotes,
    // Extended CRUD API used by the REST layer and tests
    listNotes: listNotes,
    readNote: readNote,
    updateNote: updateNote,
    removeNote: removeNote
}
