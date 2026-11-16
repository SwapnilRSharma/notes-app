const express = require('express')
const notes = require('../notes')

const app = express()
const PORT = process.env.PORT || 5178 // avoid common dev ports to reduce conflicts

app.use(express.json())

// Basic health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// List notes
app.get('/api/notes', (_req, res) => {
  const list = notes.listNotes()
  res.json(list)
})

// Create note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' })
  }
  const result = notes.addNote(title, body || '')
  if (!result.ok) {
    return res.status(409).json({ error: result.error })
  }
  res.status(201).json({ ok: true })
})

// Update note (by current title)
app.put('/api/notes/:title', (req, res) => {
  const currentTitle = req.params.title
  const { title: newTitle, body } = req.body || {}
  const result = notes.updateNote(currentTitle, { title: newTitle, body })
  if (!result.ok) {
    if (result.error === 'Note not found') return res.status(404).json({ error: result.error })
    return res.status(409).json({ error: result.error })
  }
  res.json({ ok: true })
})

// Delete note
app.delete('/api/notes/:title', (req, res) => {
  const title = req.params.title
  const result = notes.removeNote(title)
  if (!result.ok) {
    return res.status(404).json({ error: result.error })
  }
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Notes API listening on http://localhost:${PORT}`)
})
