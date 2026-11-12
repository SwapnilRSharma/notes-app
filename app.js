const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const notes = require('./notes.js')
const yargs = require('yargs')

// Creating Add Command
yargs.command({
  command: 'add',
  describe: 'Add a note',
  builder: {
    title: { describe: 'Note Title', demandOption: true, type: 'string' },
    body: { describe: 'Note Body', demandOption: true, type: 'string' },
  },
  handler: function (argv) {
    notes.addNotes(argv.title, argv.body)
  },
})

// Create Remove Command
yargs.command({
  command: 'remove',
  describe: 'Remove a note by title',
  builder: {
    title: { describe: 'Note Title', demandOption: true, type: 'string' },
  },
  handler: function (argv) {
    const ok = notes.removeNote(argv.title)
    console.log(ok ? 'Note removed' : 'Note not found')
  },
})

// Create Read command
yargs.command({
  command: 'read',
  describe: 'Read a note by title',
  builder: {
    title: { describe: 'Note Title', demandOption: true, type: 'string' },
  },
  handler: function (argv) {
    const n = notes.readNote(argv.title)
    if (!n) return console.log('Note not found')
    console.log(`# ${n.title}\n${n.body}`)
  },
})

// Create List command
yargs.command({
  command: 'list',
  describe: 'List notes',
  handler: function () {
    const list = notes.listNotes()
    if (!list.length) return console.log('(no notes)')
    list.forEach((n, i) => console.log(`${i + 1}. ${n.title}`))
  },
})

// Serve a simple web UI + JSON API
yargs.command({
  command: 'serve',
  describe: 'Start web UI server',
  builder: {
    port: { describe: 'Port to listen on', type: 'number', default: 3000 },
  },
  handler: function (argv) {
    const publicDir = path.join(__dirname, 'public')

    const send = (res, code, body, headers = {}) => {
      res.writeHead(code, { 'Content-Type': 'application/json', ...headers })
      res.end(typeof body === 'string' ? body : JSON.stringify(body))
    }

    const serveFile = (res, filePath, contentType) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      })
    }

    const parseBody = (req) =>
      new Promise((resolve) => {
        let data = ''
        req.on('data', (chunk) => (data += chunk))
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : {})
          } catch (e) {
            resolve({})
          }
        })
      })

    const server = http.createServer(async (req, res) => {
      const parsed = url.parse(req.url, true)
      const method = req.method || 'GET'
      const pathname = parsed.pathname || '/'

      // Static UI
      if (method === 'GET' && pathname === '/') {
        return serveFile(res, path.join(publicDir, 'index.html'), 'text/html')
      }
      if (method === 'GET' && pathname.startsWith('/public/')) {
        const filePath = path.join(__dirname, pathname)
        const ext = path.extname(filePath)
        const type =
          ext === '.js'
            ? 'application/javascript'
            : ext === '.css'
            ? 'text/css'
            : 'text/plain'
        return serveFile(res, filePath, type)
      }

      // API
      if (pathname === '/api/notes' && method === 'GET') {
        return send(res, 200, notes.listNotes())
      }
      if (pathname === '/api/notes' && method === 'POST') {
        const body = await parseBody(req)
        const ok = notes.addNotes(body.title, body.body)
        return send(res, ok ? 201 : 409, ok ? { ok: true } : { ok: false, error: 'duplicate' })
      }

      const noteMatch = pathname.match(/^\/api\/notes\/(.+)$/)
      if (noteMatch) {
        const title = decodeURIComponent(noteMatch[1])
        if (method === 'GET') {
          const n = notes.readNote(title)
          return n ? send(res, 200, n) : send(res, 404, { ok: false })
        }
        if (method === 'DELETE') {
          const ok = notes.removeNote(title)
          return send(res, ok ? 200 : 404, { ok })
        }
        if (method === 'PUT') {
          const body = await parseBody(req)
          const ok = notes.updateNote(title, { newTitle: body.title, body: body.body })
          return send(res, ok ? 200 : 409, { ok })
        }
      }

      res.writeHead(404)
      res.end('Not found')
    })

    server.listen(argv.port, () => {
      console.log(`Web UI running on http://localhost:${argv.port}`)
    })
  },
})

yargs.parse()
