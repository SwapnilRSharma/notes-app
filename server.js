const path = require('path')
const express = require('express')
const store = require('./notes')

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON request bodies
app.use(express.json())

// Serve static frontend from /public
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// API routes
app.get('/api/notes', (_req, res) => {
  res.json(store.listNotes())
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (typeof title !== 'string' || typeof body !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title and body are required' })
  }
  const note = store.addNote(title.trim(), body)
  return res.status(201).json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const updates = {}
  if ('title' in req.body) updates.title = req.body.title
  if ('body' in req.body) updates.body = req.body.body
  const updated = store.updateNote(id, updates)
  if (!updated) return res.status(404).json({ error: 'not found' })
  return res.json(updated)
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const ok = store.removeNote(id)
  if (!ok) return res.status(404).json({ error: 'not found' })
  return res.status(204).send()
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`)
})
