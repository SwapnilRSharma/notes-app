const fs = require('fs')

const getNotes = function () {
    return 'Your Notes...'
}

const addNotes = function (title, body) {
    const notes = loadNotes()
    const duplicateNotes = notes.filter( function (note) {
        return note.title === title
    })

    if(duplicateNotes.length === 0){
        notes.push({
            title : title,
            body : body
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

// persist notes array to disk
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', notesJSON)
}

// return all notes
const listNotes = function () {
    return loadNotes()
}

// find a single note by title
const readNote = function (title) {
    const notes = loadNotes()
    return notes.find(n => n.title === title) || null
}

// remove a note by title; returns true if removed
const removeNote = function (title) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === title)
    if (idx === -1) {
        return false
    }
    notes.splice(idx, 1)
    saveNotes(notes)
    return true
}

// update note identified by origTitle; may rename if new title provided
// returns { ok: true, note } on success; { ok: false, error } on failure
const updateNote = function (origTitle, update) {
    const notes = loadNotes()
    const note = notes.find(n => n.title === origTitle)
    if (!note) {
        return { ok: false, error: 'not_found' }
    }
    const newTitle = (update.title ?? note.title).trim()
    const newBody = update.body !== undefined ? update.body : note.body
    if (!newTitle) {
        return { ok: false, error: 'invalid_title' }
    }
    // if renaming, ensure no duplicate
    if (newTitle !== origTitle && notes.some(n => n.title === newTitle)) {
        return { ok: false, error: 'duplicate_title' }
    }
    note.title = newTitle
    note.body = newBody
    saveNotes(notes)
    return { ok: true, note }
}

module.exports = {
    getNotes : getNotes,
    addNotes : addNotes,
    listNotes: listNotes,
    readNote: readNote,
    removeNote: removeNote,
    updateNote: updateNote
}
