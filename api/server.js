const express = require('express')
const cors = require('cors')
const notes = require('../notes')

const app = express()
app.use(cors()) // enable CORS in dev
app.use(express.json())

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// List notes
app.get('/api/notes', (_req, res) => {
  const all = notes.listNotes()
  res.json(all)
})

// Create note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' })
  }
  const created = notes.addNotes(title, body || '')
  if (!created) {
    return res.status(409).json({ error: 'Note title already exists' })
  }
  res.status(201).json(created)
})

// Update note by current title
app.put('/api/notes/:title', (req, res) => {
  const oldTitle = req.params.title
  const { title, body } = req.body || {}
  try {
    const updated = notes.updateNote(oldTitle, { title, body })
    res.json(updated)
  } catch (e) {
    if (e && e.message === 'Conflict') {
      return res.status(409).json({ error: 'Note title already exists' })
    }
    if (e && e.message === 'NotFound') {
      return res.status(404).json({ error: 'Note not found' })
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Delete note by title
app.delete('/api/notes/:title', (req, res) => {
  const title = req.params.title
  try {
    notes.removeNote(title)
    res.status(204).send()
  } catch (e) {
    if (e && e.message === 'NotFound') {
      return res.status(404).json({ error: 'Note not found' })
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 4317
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
