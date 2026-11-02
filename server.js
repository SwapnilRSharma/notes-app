const http = require('http')
const fs = require('fs')
const path = require('path')

// Utilities kept local to avoid changing the existing CLI module
const NOTES_PATH = path.join(__dirname, 'notes.json')

function loadNotes() {
  try {
    const buf = fs.readFileSync(NOTES_PATH)
    return JSON.parse(buf.toString())
  } catch (e) {
    return []
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_PATH, JSON.stringify(notes))
}

function serveIndex(res) {
  const filePath = path.join(__dirname, 'public', 'index.html')
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain')
      res.end('Error loading index.html')
      return
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(data)
  })
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => {
      data += chunk
      // simple guard against very large bodies for this tiny app
      if (data.length > 1e6) {
        req.destroy()
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch (e) {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  // Basic routing without any frameworks
  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    return serveIndex(res)
  }

  if (method === 'GET' && url === '/notes') {
    const notes = loadNotes()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(notes))
  }

  if (method === 'POST' && url === '/notes') {
    try {
      const body = await parseBody(req)
      const title = typeof body.title === 'string' ? body.title.trim() : ''
      const noteBody = typeof body.body === 'string' ? body.body : ''
      if (!title) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'title is required' }))
      }

      const notes = loadNotes()
      const exists = notes.some(n => n && n.title === title)
      if (exists) {
        res.statusCode = 409
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'Note Title Taken.' }))
      }

      const newNote = { title, body: noteBody }
      notes.push(newNote)
      saveNotes(notes)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(newNote))
    } catch (e) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: e.message || 'Bad Request' }))
    }
  }

  // Fallback 404
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not Found')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
