const path = require('path');
const express = require('express');

// Basic Express server scaffold
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies for API requests
app.use(express.json());

// Serve static assets from /public if present
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Simple homepage fallback until UI is added
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Notes App</title>
      <style>body{font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;margin:2rem;}</style>
    </head>
    <body>
      <h1>Notes App</h1>
      <p>The web UI will appear here. API will be under <code>/api/notes</code>.</p>
    </body>
  </html>`);
});

// Placeholder for future API routes
// Actual CRUD endpoints added in t3

app.listen(PORT, () => {
  console.log(`Notes web server running on http://localhost:${PORT}`);
});
