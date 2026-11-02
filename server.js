// Minimal HTTP server for the notes app
// Serves GET / (index.html) and GET /notes (notes.json content)
// Intentionally does NOT implement POST /add yet

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

function sendJSON(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

function serveIndex(res) {
  const filePath = path.join(__dirname, 'public', 'index.html')
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      const msg = 'index.html not found'
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'})
      res.end(msg)
      return
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.end(buf)
  })
}

function readNotes() {
  // Read notes.json from project root; on error, return empty array
  try {
    const p = path.join(__dirname, 'notes.json')
    const raw = fs.readFileSync(p, 'utf8')
    const data = JSON.parse(raw)
    // Expecting an array of {title, body}
    if (Array.isArray(data)) return data
    return []
  } catch (_) {
    return []
  }
}

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    return serveIndex(res)
  }

  if (method === 'GET' && url === '/notes') {
    const notes = readNotes()
    return sendJSON(res, 200, notes)
  }

  // Intentionally no POST /add handler here — will be implemented later

  // Fallback 404
  res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
  res.end('Not Found')
})

server.listen(PORT, () => {
  console.log(`Notes web server listening on http://localhost:${PORT}`)
})
