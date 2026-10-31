const api = {
  async list() {
    const r = await fetch('/api/notes')
    if (!r.ok) throw new Error('Failed to load notes')
    return r.json()
  },
  async create({ title, body }) {
    const r = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    })
    if (!r.ok) throw new Error((await r.json()).error || 'Create failed')
  },
  async update(originalTitle, { title, body }) {
    const r = await fetch(`/api/notes/${encodeURIComponent(originalTitle)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    })
    if (!r.ok) throw new Error((await r.json()).error || 'Update failed')
    return r.json()
  },
  async remove(title) {
    const r = await fetch(`/api/notes/${encodeURIComponent(title)}`, { method: 'DELETE' })
    if (!r.ok) throw new Error((await r.json()).error || 'Delete failed')
  }
}

const els = {
  form: document.getElementById('note-form'),
  title: document.getElementById('title'),
  body: document.getElementById('body'),
  formTitle: document.getElementById('form-title'),
  formMsg: document.getElementById('form-message'),
  saveBtn: document.getElementById('save-btn'),
  cancelBtn: document.getElementById('cancel-btn'),
  deleteBtn: document.getElementById('delete-btn'),
  list: document.getElementById('notes-list'),
  itemTpl: document.getElementById('note-item'),
  search: document.getElementById('search')
}

let state = {
  notes: [],
  filter: '',
  editing: null // originalTitle when editing
}

function renderList() {
  const q = state.filter.trim().toLowerCase()
  const items = state.notes
    .filter(n => (q ? n.title.toLowerCase().includes(q) : true))
    .sort((a, b) => a.title.localeCompare(b.title))

  els.list.innerHTML = ''
  for (const note of items) {
    const li = els.itemTpl.content.firstElementChild.cloneNode(true)
    li.querySelector('.select').addEventListener('click', () => startEdit(note))
    li.querySelector('.title').textContent = note.title
    const snip = (note.body || '').trim().replace(/\s+/g, ' ')
    li.querySelector('.snippet').textContent = snip.length > 120 ? snip.slice(0, 117) + '…' : snip
    els.list.appendChild(li)
  }
}

function startCreate() {
  state.editing = null
  els.formTitle.textContent = 'Create Note'
  els.title.value = ''
  els.body.value = ''
  els.deleteBtn.hidden = true
  els.cancelBtn.hidden = true
}

function startEdit(note) {
  state.editing = note.title
  els.formTitle.textContent = 'Edit Note'
  els.title.value = note.title
  els.body.value = note.body || ''
  els.deleteBtn.hidden = false
  els.cancelBtn.hidden = false
}

async function refresh() {
  try {
    state.notes = await api.list()
    renderList()
  } catch (e) {
    console.error(e)
    els.formMsg.textContent = 'Failed to load notes.'
  }
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = els.title.value.trim()
  const body = els.body.value
  if (!title) {
    els.formMsg.textContent = 'Title is required.'
    return
  }
  try {
    if (state.editing) {
      await api.update(state.editing, { title, body })
      els.formMsg.textContent = 'Note updated.'
    } else {
      await api.create({ title, body })
      els.formMsg.textContent = 'Note created.'
    }
    await refresh()
    startCreate()
  } catch (err) {
    els.formMsg.textContent = err.message || 'Operation failed.'
  }
})

els.deleteBtn.addEventListener('click', async () => {
  if (!state.editing) return
  if (!confirm('Delete this note?')) return
  try {
    await api.remove(state.editing)
    els.formMsg.textContent = 'Note deleted.'
    await refresh()
    startCreate()
  } catch (err) {
    els.formMsg.textContent = err.message || 'Delete failed.'
  }
})

els.cancelBtn.addEventListener('click', () => {
  startCreate()
  els.formMsg.textContent = ''
})

els.search.addEventListener('input', () => {
  state.filter = els.search.value
  renderList()
})

// initial load
startCreate()
refresh()
