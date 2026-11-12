const path = require('path')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON request bodies
app.use(express.json())

// Serve static frontend from /public
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// API routes will be added in later tasks

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`)
})
