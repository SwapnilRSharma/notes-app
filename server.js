const express = require('express')
const cors = require('cors')
const notes = require('./notes')

const app = express()
app.use(cors())
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// List notes
app.get('/api/notes', (_req, res) => {
  const all = notes.listNotes()
  res.json(all)
})

// Read a note by title
app.get('/api/notes/:title', (req, res) => {
  const n = notes.getNote(req.params.title)
  if (!n) return res.status(404).json({ error: 'Not found' })
  res.json(n)
})

// Create a note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title' })
  }
  try {
    const created = notes.addNotes(title, body || '')
    res.status(201).json(created)
  } catch (e) {
    if (/duplicate/i.test(e.message)) {
      return res.status(409).json({ error: 'Duplicate title' })
    }
    res.status(500).json({ error: 'Internal error' })
  }
})

// Update a note (including optional rename)
app.put('/api/notes/:title', (req, res) => {
  const oldTitle = req.params.title
  const { title, body } = req.body || {}
  try {
    const updated = notes.updateNote(oldTitle, { title, body })
    res.json(updated)
  } catch (e) {
    if (/not found/i.test(e.message)) {
      return res.status(404).json({ error: 'Not found' })
    }
    if (/duplicate/i.test(e.message)) {
      return res.status(409).json({ error: 'Duplicate title' })
    }
    res.status(500).json({ error: 'Internal error' })
  }
})

// Delete a note
app.delete('/api/notes/:title', (req, res) => {
  try {
    notes.removeNote(req.params.title)
    res.status(204).end()
  } catch (e) {
    if (/not found/i.test(e.message)) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.status(500).json({ error: 'Internal error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server listening on :${PORT}`)
})
