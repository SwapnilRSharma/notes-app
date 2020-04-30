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
        const notesJSON = JSON.stringify(notes)
        fs.writeFileSync('notes.json', notesJSON)
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

module.exports = {
    getNotes : getNotes,
    addNotes : addNotes
}