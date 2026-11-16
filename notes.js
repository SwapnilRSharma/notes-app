const fs = require('fs')
const path = require('path')

// Path to the JSON store kept at repo root
const STORE_PATH = path.join(__dirname, 'notes.json')

// Read the persisted notes list; return [] if missing or invalid
const loadNotes = function () {
    try {
        const dataBuffer = fs.readFileSync(STORE_PATH)
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

// Persist provided notes array
const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes, null, 2)
    fs.writeFileSync(STORE_PATH, notesJSON)
}

// Create a note if unique by title. Returns { ok: true } on success,
// or { ok: false, error } on validation conflict.
const addNote = function (title, body) {
    const notes = loadNotes()
    const exists = notes.some(note => note.title === title)
    if (exists) {
        return { ok: false, error: 'Note title already exists' }
    }
    notes.push({ title, body })
    saveNotes(notes)
    return { ok: true }
}

// Update a note identified by currentTitle; can change title/body.
// Fails if the current note does not exist or if renaming to a duplicate.
const updateNote = function (currentTitle, { title: newTitle, body }) {
    const notes = loadNotes()
    const idx = notes.findIndex(n => n.title === currentTitle)
    if (idx === -1) {
        return { ok: false, error: 'Note not found' }
    }
    const finalTitle = newTitle !== undefined ? newTitle : notes[idx].title
    if (finalTitle !== currentTitle && notes.some(n => n.title === finalTitle)) {
        return { ok: false, error: 'New title conflicts with existing note' }
    }
    const finalBody = body !== undefined ? body : notes[idx].body
    notes[idx] = { title: finalTitle, body: finalBody }
    saveNotes(notes)
    return { ok: true }
}

// Remove a note by title; returns boolean for existence
const removeNote = function (title) {
    const notes = loadNotes()
    const next = notes.filter(n => n.title !== title)
    if (next.length === notes.length) {
        return { ok: false, error: 'Note not found' }
    }
    saveNotes(next)
    return { ok: true }
}

// Return all notes
const listNotes = function () {
    return loadNotes()
}

// Read a single note by exact title. Returns the note object or null if missing.
const readNote = function (title) {
    const notes = loadNotes()
    return notes.find((n) => n.title === title) || null
}

// Legacy function kept for CLI compatibility
const getNotes = function () {
    return 'Your Notes...'
}

// Backwards-compatible export for the CLI that used addNotes(title, body)
// Returns created note object on success, or false on duplicate (to match existing web/server.js usage)
const addNotes = function (title, body) {
    const res = addNote(title, body)
    if (res.ok) {
        console.log('New Note Added!')
        return readNote(title)
    } else {
        console.log('Note Title Taken.')
        return false
    }
}

module.exports = {
    // legacy CLI API
    getNotes,
    addNotes,
    // programmatic API used by servers
    addNote,
    updateNote,
    removeNote,
    listNotes,
    loadNotes,
    readNote
}
}
