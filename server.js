// Minimal HTTP server for Notes app: serves index.html, lists notes, and adds notes.
const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const DATA_FILE = path.join(__dirname, 'notes.json')
const PUBLIC_INDEX = path.join(__dirname, 'public', 'index.html')
const PORT = process.env.PORT || 3000

function readNotes() {
  try {
    const buf = fs.readFileSync(DATA_FILE)
    return JSON.parse(buf.toString())
  } catch (e) {
    return []
  }
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes))
}

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
  res.end(body)
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(text)
}

function serveIndex(res) {
  fs.readFile(PUBLIC_INDEX, (err, data) => {
    if (err) {
      sendText(res, 500, 'Missing public/index.html')
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': data.length })
    res.end(data)
  })
}

function collectJSON(req, cb) {
  let body = ''
  req.on('data', chunk => {
    body += chunk
    if (body.length > 1e6) req.destroy() // basic limit
  })
  req.on('end', () => {
    try {
      const json = JSON.parse(body || '{}')
      cb(null, json)
    } catch (e) {
      cb(e)
    }
  })
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (req.method === 'GET' && url.pathname === '/') {
    return serveIndex(res)
  }

  if (req.method === 'GET' && url.pathname === '/notes') {
    const notes = readNotes()
    return sendJSON(res, 200, notes)
  }

  if (req.method === 'POST' && url.pathname === '/notes') {
    return collectJSON(req, (err, data) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON' })
      const title = (data && typeof data.title === 'string') ? data.title.trim() : ''
      const body = (data && typeof data.body === 'string') ? data.body : ''
      if (!title) return sendJSON(res, 400, { error: 'title is required' })
      const notes = readNotes()
      if (notes.some(n => n.title === title)) return sendJSON(res, 409, { error: 'Duplicate title' })
      notes.push({ title, body })
      try {
        writeNotes(notes)
      } catch (e) {
        return sendJSON(res, 500, { error: 'Failed to save note' })
      }
      return sendJSON(res, 201, { ok: true })
    })
  }

  // 404
  sendText(res, 404, 'Not found')
})

server.listen(PORT, () => {
  console.log(`Notes web server listening on http://localhost:${PORT}`)
})
