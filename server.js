const path = require('path')
const fs = require('fs')
const express = require('express')
const notes = require('./notes')

const app = express()
app.use(express.json())

// Simple health
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
    return res.status(400).json({ error: 'title_required' })
  }
  if (typeof body !== 'string') {
    return res.status(400).json({ error: 'body_required' })
  }
  const ok = notes.addNotes(title, body)
  if (!ok) return res.status(409).json({ error: 'duplicate_title' })
  res.status(201).json({ title, body })
})

// Update note
app.put('/api/notes/:title', (req, res) => {
  const currentTitle = req.params.title
  const { title, body } = req.body || {}
  const result = notes.updateNote(currentTitle, { title, body })
  if (!result.ok) {
    if (result.reason === 'not_found') return res.status(404).json({ error: 'not_found' })
    if (result.reason === 'duplicate_title') return res.status(409).json({ error: 'duplicate_title' })
    return res.status(400).json({ error: 'invalid' })
  }
  res.json(result.note)
})

// Delete note
app.delete('/api/notes/:title', (req, res) => {
  const ok = notes.removeNote(req.params.title)
  if (!ok) return res.status(404).json({ error: 'not_found' })
  res.status(204).end()
})

// Production static serving for built frontend (t8 wires build)
const distDir = path.join(__dirname, 'web', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'internal_error' })
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
