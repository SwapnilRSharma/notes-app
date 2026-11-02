const http = require('http')
const fs = require('fs')
const path = require('path')
const notes = require('./notes.js')

// Small helper to read notes.json without changing the CLI module
function readNotesFile() {
  try {
    const buf = fs.readFileSync(path.join(__dirname, 'notes.json'))
    return JSON.parse(buf.toString())
  } catch (_) {
    return []
  }
}

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/') {
    // Serve the tiny UI
    const file = path.join(__dirname, 'public', 'index.html')
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Server error')
        return
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(data)
    })
    return
  }

  if (method === 'GET' && url === '/notes') {
    const list = readNotesFile()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(list))
    return
  }

  if (method === 'POST' && url === '/notes') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        const title = typeof payload.title === 'string' ? payload.title.trim() : ''
        if (title) {
          // Reuse existing addNotes; store body as empty string for web adds
          notes.addNotes(title, '')
          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'title required' }))
        }
      } catch (_) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'invalid json' }))
      }
    })
    return
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`notes web server listening on http://localhost:${PORT}`)
})
