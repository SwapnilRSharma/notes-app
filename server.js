const express = require('express')
const path = require('path')
const notes = require('./notes.js')

const app = express()
app.use(express.json())

// Serve static frontend
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// List notes
app.get('/api/notes', (req, res) => {
  try {
    const list = notes.listNotes()
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: 'Failed to list notes' })
  }
})

// Read note by title
app.get('/api/notes/:title', (req, res) => {
  const title = req.params.title
  const note = notes.readNote(title)
  if (!note) return res.status(404).json({ error: 'Note not found' })
  res.json(note)
})

// Create note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' })
  const created = notes.addNotes(title, body)
  if (!created) return res.status(409).json({ error: 'Note title taken' })
  res.status(201).json({ ok: true })
})

// Update note
app.put('/api/notes/:title', (req, res) => {
  const currentTitle = req.params.title
  const { title: newTitle, body } = req.body || {}
  if (!newTitle && !body) return res.status(400).json({ error: 'Nothing to update' })
  const result = notes.updateNote(currentTitle, newTitle, body)
  if (result === 'not_found') return res.status(404).json({ error: 'Note not found' })
  if (result === 'duplicate') return res.status(409).json({ error: 'New title conflicts with existing note' })
  res.json({ ok: true })
})

// Delete note
app.delete('/api/notes/:title', (req, res) => {
  const title = req.params.title
  const ok = notes.removeNote(title)
  if (!ok) return res.status(404).json({ error: 'Note not found' })
  res.status(204).end()
})

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Web notes server listening on http://localhost:${port}`)
})
