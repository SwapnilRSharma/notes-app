async function api (path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const data = await res.json(); msg = data.error || msg } catch {}
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return res.json()
}

const els = {
  list: document.getElementById('notes-list'),
  form: document.getElementById('create-form'),
  title: document.getElementById('new-title'),
  body: document.getElementById('new-body')
}

function h (html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild }

function renderNoteView (note) {
  const node = h(`<div class="note" data-id="${note.id}">
    <header>
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-actions">
        <button class="secondary" data-action="edit">Edit</button>
        <button class="danger" data-action="delete">Delete</button>
      </div>
    </header>
    <div class="note-body">${escapeHtml(note.body)}</div>
  </div>`) 
  return node
}

function renderNoteEdit (note) {
  const node = h(`<div class="note edit" data-id="${note.id}">
    <div class="field">
      <input type="text" class="edit-title" value="${escapeAttr(note.title)}" />
    </div>
    <div class="field">
      <textarea class="edit-body" rows="3">${escapeHtml(note.body)}</textarea>
    </div>
    <div class="note-actions">
      <button class="secondary" data-action="cancel">Cancel</button>
      <button data-action="save">Save</button>
    </div>
  </div>`) 
  return node
}

function escapeHtml (s) { return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) }
function escapeAttr (s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }

async function loadNotes () {
  const notes = await api('/api/notes')
  els.list.innerHTML = ''
  if (!notes.length) {
    els.list.appendChild(h('<div class="muted">No notes yet.</div>'))
    return
  }
  for (const n of notes) {
    els.list.appendChild(renderNoteView(n))
  }
}

async function onCreateSubmit (e) {
  e.preventDefault()
  const title = els.title.value.trim()
  const body = els.body.value
  if (!title) return
  try {
    await api('/api/notes', { method: 'POST', body: JSON.stringify({ title, body }) })
    els.title.value = ''
    els.body.value = ''
    await loadNotes()
  } catch (err) {
    alert('Failed to create note: ' + err.message)
  }
}

// Delegated actions for edit/delete/save/cancel
els.list.addEventListener('click', async (e) => {
  const btn = e.target.closest('button')
  if (!btn) return
  const card = e.target.closest('.note')
  if (!card) return
  const id = card.getAttribute('data-id')
  const action = btn.getAttribute('data-action')
  if (action === 'edit') {
    const current = {
      id,
      title: card.querySelector('.note-title').textContent,
      body: card.querySelector('.note-body').textContent
    }
    card.replaceWith(renderNoteEdit(current))
  } else if (action === 'cancel') {
    // reload to restore view
    await loadNotes()
  } else if (action === 'save') {
    const title = card.querySelector('.edit-title').value
    const body = card.querySelector('.edit-body').value
    try {
      await api(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify({ title, body }) })
      await loadNotes()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  } else if (action === 'delete') {
    if (!confirm('Delete this note?')) return
    try {
      await api(`/api/notes/${id}`, { method: 'DELETE' })
      await loadNotes()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }
})

window.addEventListener('DOMContentLoaded', () => {
  els.form.addEventListener('submit', onCreateSubmit)
  loadNotes()
})
