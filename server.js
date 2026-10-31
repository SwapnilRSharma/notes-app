const path = require('path')
const express = require('express')
const notes = require('./notes')

const app = express()
app.use(express.json())

// API routes
app.get('/api/notes', (req, res) => {
  try {
    const all = (typeof notes.listNotes === 'function') ? notes.listNotes() : []
    res.json(all)
  } catch (e) {
    res.status(500).json({ error: 'Failed to load notes' })
  }
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {}
  if (!title || !body || typeof title !== 'string' || typeof body !== 'string') {
    return res.status(400).json({ error: 'title and body are required strings' })
  }
  try {
    const created = (typeof notes.createNote === 'function')
      ? notes.createNote(title.trim(), body)
      : notes.addNotes(title.trim(), body)
    // If legacy addNotes returns undefined, load list and send last item
    if (!created && typeof notes.listNotes === 'function') {
      const all = notes.listNotes()
      return res.status(201).json(all[all.length - 1])
    }
    res.status(201).json(created)
  } catch (e) {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const { title, body } = req.body || {}
  if ((title !== undefined && typeof title !== 'string') || (body !== undefined && typeof body !== 'string')) {
    return res.status(400).json({ error: 'title/body must be strings when provided' })
  }
  try {
    if (typeof notes.updateNote !== 'function') return res.status(501).json({ error: 'update not implemented' })
    const updated = notes.updateNote(id, { title, body })
    if (!updated) return res.status(404).json({ error: 'note not found' })
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Failed to update note' })
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  try {
    if (typeof notes.removeNote !== 'function') return res.status(501).json({ error: 'delete not implemented' })
    const removed = notes.removeNote(id)
    if (!removed) return res.status(404).json({ error: 'note not found' })
    res.status(204).end()
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

// Static UI
app.use(express.static(path.join(__dirname, 'public')))

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Notes web UI listening on http://localhost:${port}`)
})
