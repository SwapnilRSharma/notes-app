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

// API routes
const notes = require('./notes.js');

// List notes
app.get('/api/notes', (req, res) => {
  const list = notes.listNotes();
  res.status(200).json({ notes: list });
});

// Create note
app.post('/api/notes', (req, res) => {
  let { title, body } = req.body || {};
  if (typeof title === 'string') title = title.trim();
  if (typeof body !== 'string') body = undefined;
  if (!title || typeof title !== 'string' || !body || typeof body !== 'string') {
    return res.status(400).json({ error: 'title and body are required strings' });
  }
  try {
    const created = notes.addNote(title, body);
    return res.status(201).json(created);
  } catch (err) {
    if (err && err.code === 'E_CONFLICT') {
      return res.status(409).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update note (by current title)
app.put('/api/notes/:title', (req, res) => {
  const currentTitle = String(req.params.title || '').trim();
  let { title: nextTitle, body } = req.body || {};
  if (typeof nextTitle === 'string') nextTitle = nextTitle.trim();
  if (nextTitle === '') nextTitle = undefined; // treat empty as not provided
  if (body !== undefined && typeof body !== 'string') body = undefined;
  if (nextTitle === undefined && body === undefined) {
    return res.status(400).json({ error: 'Provide at least one of title or body to update' });
  }
  try {
    const updated = notes.updateNote(currentTitle, { title: nextTitle, body });
    return res.status(200).json(updated);
  } catch (err) {
    if (err && err.code === 'E_NOT_FOUND') {
      return res.status(404).json({ error: 'Note not found' });
    }
    if (err && err.code === 'E_CONFLICT') {
      return res.status(409).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete note
app.delete('/api/notes/:title', (req, res) => {
  try {
    notes.removeNote(req.params.title);
    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err && err.code === 'E_NOT_FOUND') {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Notes web server running on http://localhost:${PORT}`);
});
