// Simple Express server to expose notes API and serve static frontend
const express = require('express')
const fs = require('fs')
const path = require('path')
const notes = require('./notes')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'notes.json')

app.use(express.json())

// Serve static assets for the web UI (added in a later task)
app.use(express.static(path.join(__dirname, 'public')))

// List notes
app.get('/api/notes', (req, res) => {
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
  if (!result.ok && result.reason === 'duplicate') {
    return res.status(400).json({ error: 'duplicate title' })
  }
  return res.status(201).json({ ok: true })
})

// Read note
app.get('/api/notes/:title', (req, res) => {
  const note = notes.getNote(req.params.title)
  if (!note) return res.status(404).json({ error: 'not found' })
  res.json(note)
})

// Update note
app.put('/api/notes/:title', (req, res) => {
  const { title, body } = req.body || {}
  const result = notes.updateNote(req.params.title, { title, body })
  if (!result.ok) {
    if (result.reason === 'not_found') return res.status(404).json({ error: 'not found' })
    if (result.reason === 'duplicate') return res.status(400).json({ error: 'duplicate title' })
    return res.status(400).json({ error: 'bad request' })
  }
  res.json(result.note)
})

// Delete note
app.delete('/api/notes/:title', (req, res) => {
  const result = notes.removeNote(req.params.title)
  if (!result.ok && result.reason === 'not_found') {
    return res.status(404).json({ error: 'not found' })
  }
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Notes web server listening on http://localhost:${PORT}`)
})
