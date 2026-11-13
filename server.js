const path = require('path')
const express = require('express')
const notes = require('./notes')

const app = express()
app.use(express.json())

// API routes
app.get('/api/notes', (req, res) => {
  const list = notes.listNotes()
  res.json(list)
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' })
  }
  try {
    const created = notes.addNote(title, typeof body === 'string' ? body : '')
    return res.status(201).json(created)
  } catch (e) {
    if (e && e.code === 'DUPLICATE') {
      return res.status(409).json({ error: 'duplicate title' })
    }
    return res.status(500).json({ error: 'internal error' })
  }
})

app.put('/api/notes/:title', (req, res) => {
  const currentTitle = req.params.title
  const { newTitle, body } = req.body || {}
  try {
    const updated = notes.updateNote(currentTitle, { newTitle, body })
    return res.json(updated)
  } catch (e) {
    if (e && e.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'not found' })
    }
    if (e && e.code === 'DUPLICATE') {
      return res.status(409).json({ error: 'duplicate title' })
    }
    return res.status(500).json({ error: 'internal error' })
  }
})

app.delete('/api/notes/:title', (req, res) => {
  const currentTitle = req.params.title
  try {
    notes.removeNote(currentTitle)
    return res.status(204).end()
  } catch (e) {
    if (e && e.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'not found' })
    }
    return res.status(500).json({ error: 'internal error' })
  }
})

// Serve built client (added per task t6). This must come after API routes otherwise
// API stays reachable when client is present.
const clientDist = path.join(__dirname, 'client', 'dist')
app.use(express.static(clientDist))

// Single Page App fallback: let the client handle routing for non-API GETs
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(clientDist, 'index.html'))
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

module.exports = app
