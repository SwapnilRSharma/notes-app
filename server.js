// Minimal Express server exposing CRUD over notes, backed by notes.js helpers.
const express = require('express')
const cors = require('cors')

// Import helpers from notes.js. Some of these are added in a later task (t2).
// The server is written against the intended interface and will work once t2 lands.
const notes = require('./notes.js')

const app = express()
const PORT = process.env.PORT || 3000

// JSON parser
app.use(express.json())

// CORS for development (refined in t7 for prod/static serve)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

// Helpers to standardize JSON responses
function ok(res, data = {}) {
  res.type('application/json').status(200).json(data)
}
function created(res, data = {}) {
  res.type('application/json').status(201).json(data)
}
function error(res, status, message, extra = {}) {
  res.type('application/json').status(status).json({ error: message, ...extra })
}

// GET /api/notes -> list all notes
app.get('/api/notes', (req, res) => {
  try {
    if (typeof notes.listNotes === 'function') {
      const all = notes.listNotes()
      return ok(res, { notes: all })
    }
    // Fallback to loading via internal load if t2 not yet applied
    const all = (typeof notes.loadNotes === 'function') ? notes.loadNotes() : []
    return ok(res, { notes: all })
  } catch (e) {
    return error(res, 500, 'failed_to_list')
  }
})

// GET /api/notes/:title -> read single note
app.get('/api/notes/:title', (req, res) => {
  try {
    const title = req.params.title
    if (typeof notes.readNote === 'function') {
      const note = notes.readNote(title)
      return note ? ok(res, { note }) : error(res, 404, 'not_found')
    }
    const all = (typeof notes.loadNotes === 'function') ? notes.loadNotes() : []
    const note = all.find(n => n.title === title)
    return note ? ok(res, { note }) : error(res, 404, 'not_found')
  } catch (e) {
    return error(res, 500, 'failed_to_read')
  }
})

// POST /api/notes -> create note { title, body }
app.post('/api/notes', (req, res) => {
  try {
    const { title, body } = req.body || {}
    if (!title || typeof title !== 'string') return error(res, 400, 'invalid_title')
    if (typeof notes.readNote === 'function') {
      const existing = notes.readNote(title)
      if (existing) return error(res, 409, 'duplicate_title')
    }
    if (typeof notes.addNotes === 'function') {
      notes.addNotes(title, body || '')
      const note = typeof notes.readNote === 'function' ? notes.readNote(title) : { title, body: body || '' }
      return created(res, { note })
    }
    return error(res, 500, 'not_implemented')
  } catch (e) {
    return error(res, 500, 'failed_to_create')
  }
})

// PUT /api/notes/:title -> update note (title and/or body)
app.put('/api/notes/:title', (req, res) => {
  try {
    const currentTitle = req.params.title
    const { title: newTitle, body } = req.body || {}
    if (typeof notes.updateNote === 'function') {
      const result = notes.updateNote(currentTitle, { title: newTitle, body })
      if (!result || result.ok === false) {
        const reason = result && result.reason
        if (reason === 'duplicate_title') return error(res, 409, 'duplicate_title')
        return error(res, 404, 'not_found')
      }
      const updated = result.note || result
      return ok(res, { note: updated })
    }
    return error(res, 500, 'not_implemented')
  } catch (e) {
    return error(res, 500, 'failed_to_update')
  }
})

// DELETE /api/notes/:title -> remove note
app.delete('/api/notes/:title', (req, res) => {
  try {
    const title = req.params.title
    if (typeof notes.removeNote === 'function') {
      const removed = notes.removeNote(title)
      if (!removed || removed.ok === false) return error(res, 404, 'not_found')
      return ok(res, { ok: true })
    }
    return error(res, 500, 'not_implemented')
  } catch (e) {
    return error(res, 500, 'failed_to_delete')
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
