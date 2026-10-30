const http = require('http')

// Factory to create an http server that serves a health endpoint.
function createServer() {
  const server = http.createServer((req, res) => {
    // Normalize method and url
    const method = (req.method || 'GET').toUpperCase()
    const url = req.url || '/'

    if (method === 'GET' && url === '/health') {
      const body = JSON.stringify({ status: 'ok' })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.end(body)
      return
    }

    // Not found for any other route
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Not Found')
  })

  return server
}

module.exports = { createServer }
