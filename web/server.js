const express = require('express')
const path = require('path')
const notes = require('../notes')

const app = express()
app.use(express.json())

// API routes
app.get('/api/notes', (req, res) => {
  res.json(notes.listNotes())
})

app.get('/api/notes/:title', (req, res) => {
  const note = notes.readNote(req.params.title)
  if (!note) return res.status(404).json({ error: 'Not found' })
  res.json(note)
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title required' })
  const created = notes.addNotes(title, body || '')
  if (!created) return res.status(409).json({ error: 'duplicate title' })
  res.status(201).json(created)
})

app.put('/api/notes/:title', (req, res) => {
  const current = notes.readNote(req.params.title)
  if (!current) return res.status(404).json({ error: 'Not found' })
  const { title: newTitle, body: newBody } = req.body || {}
  const updated = notes.updateNote(req.params.title, { title: newTitle, body: newBody })
  if (!updated) return res.status(409).json({ error: 'duplicate title' })
  res.json(updated)
})

app.delete('/api/notes/:title', (req, res) => {
  const removed = notes.removeNote(req.params.title)
  if (!removed) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

// In t6 we will serve the built client; keeping placeholder mount point here
const clientDist = path.resolve(__dirname, 'client', 'dist')
app.use(express.static(clientDist))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next()
  })
})

const PORT = process.env.PORT || 5174
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

module.exports = { app }
