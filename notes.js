const fs = require('fs')

// Persist notes to disk
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', notesJSON)
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

const listNotes = function () {
    const notes = loadNotes()
    if (notes.length === 0) {
        console.log('No notes found')
        return
    }
    console.log('Your notes:')
    notes.forEach(n => console.log(`- ${n.title}`))
}

const readNote = function (title) {
    const notes = loadNotes()
    const note = notes.find(n => n.title === title)
    if (!note) {
        console.log('Note not found')
        return
    }
    console.log(note.title)
    console.log(note.body)
}

const removeNote = function (title) {
    const notes = loadNotes()
    const filtered = notes.filter(n => n.title !== title)
    if (filtered.length === notes.length) {
        console.log('No note found')
        return
    }
    saveNotes(filtered)
    console.log('Note removed')
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

module.exports = {
    addNotes: addNotes,
    listNotes: listNotes,
    readNote: readNote,
    removeNote: removeNote
}
