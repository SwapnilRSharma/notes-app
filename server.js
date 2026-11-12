const express = require('express')
const path = require('path')
const notes = require('./notes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// API routes
app.get('/api/notes', (req, res) => {
  const all = notes.listNotes()
  res.json(all)
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title_required' })
  }
  if (notes.readNote(title)) {
    return res.status(409).json({ error: 'duplicate_title' })
  }
  notes.addNotes(title.trim(), body ?? '')
  const created = notes.readNote(title.trim())
  res.status(201).json(created)
})

app.put('/api/notes/:title', (req, res) => {
  const origTitle = req.params.title
  const { title, body } = req.body || {}
  const result = notes.updateNote(origTitle, { title, body })
  if (!result.ok) {
    const code =
      result.error === 'not_found' ? 404 :
      result.error === 'duplicate_title' ? 409 :
      400
    return res.status(code).json({ error: result.error })
  }
  res.json(result.note)
})

app.delete('/api/notes/:title', (req, res) => {
  const ok = notes.removeNote(req.params.title)
  if (!ok) return res.status(404).json({ error: 'not_found' })
  res.status(204).end()
})

// In production, serve built client if available
const distDir = path.join(__dirname, 'client', 'dist')
app.use(express.static(distDir))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distDir, 'index.html'), err => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
