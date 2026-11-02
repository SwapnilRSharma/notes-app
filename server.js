// Minimal HTTP server for the notes app
// Endpoints:
//   GET  /       -> serve public/index.html
//   GET  /notes  -> return notes array as JSON
//   POST /notes  -> create a note with provided {title}; body is left empty

const http = require('http')
const fs = require('fs')
const path = require('path')
const { addNotes } = require('./notes.js')

const PORT = process.env.PORT || 3000

function readNotes() {
  // Read notes fresh each time; if missing, return empty list
  try {
    const p = path.join(__dirname, 'notes.json')
    const data = fs.readFileSync(p, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

const server = http.createServer((req, res) => {
  // Normalize URL for routing
  const url = new URL(req.url, `http://${req.headers.host}`)

  // GET /
  if (req.method === 'GET' && url.pathname === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html')
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Server error')
        return
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(data)
    })
    return
  }

  // GET /notes -> list notes
  if (req.method === 'GET' && url.pathname === '/notes') {
    const notes = readNotes()
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(notes))
    return
  }

  // POST /notes -> add note with {title}
  if (req.method === 'POST' && url.pathname === '/notes') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      // Basic protection against huge payloads
      if (body.length > 1e6) {
        req.destroy()
      }
    })
    req.on('end', () => {
      let payload = {}
      try {
        payload = JSON.parse(body || '{}')
      } catch (_) {}

      const title = typeof payload.title === 'string' ? payload.title.trim() : ''
      if (!title) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: 'title required' }))
        return
      }

      const before = readNotes()
      // Reuse existing CLI add logic; body left empty for minimal UI
      addNotes(title, '')
      const after = readNotes()
      const created = after.length > before.length

      res.writeHead(created ? 201 : 409, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(created ? { ok: true } : { error: 'duplicate' }))
    })
    return
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Notes server listening on http://localhost:${PORT}`)
})
