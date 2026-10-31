// Simple Express server to expose notes API and serve static frontend
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'notes.json')

app.use(express.json())

// Serve static assets for the web UI (added in a later task)
app.use(express.static(path.join(__dirname, 'public')))

// Utility to load notes (duplicated here for now; will be unified in a later task)
function loadNotes() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

// List notes
app.get('/api/notes', (req, res) => {
  const notes = loadNotes()
  res.json(notes)
})

// Placeholder routes for future CRUD (implemented fully in next tasks)
// app.post('/api/notes', ...)
// app.put('/api/notes/:title', ...)
// app.delete('/api/notes/:title', ...)

app.listen(PORT, () => {
  console.log(`Notes web server listening on http://localhost:${PORT}`)
})
