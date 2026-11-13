const express = require('express')
const path = require('path')
const notes = require('./notes')

const app = express()
app.use(express.json())

// Simple healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// List notes
app.get('/api/notes', (_req, res) => {
  const list = notes.list()
  res.json(list)
})

// Create note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' })
  }
  const created = notes.add({ title, body })
  res.status(201).json(created)
})

// Update note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const { title, body } = req.body || {}
  const updated = notes.update(id, { title, body })
  if (!updated) return res.status(404).json({ error: 'not found' })
  res.json(updated)
})

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const removed = notes.remove(id)
  if (!removed) return res.status(404).json({ error: 'not found' })
  res.json({ success: true })
})

// Serve SPA in production
if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(__dirname, 'web', 'dist')
  // Serve built static assets
  app.use(express.static(distDir))
  // Fallback to index.html for client-side routing, but let /api/* 404 properly
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).end()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const PORT = process.env.PORT || 5174
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

module.exports = app
