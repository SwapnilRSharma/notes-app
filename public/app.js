(() => {
  const el = {
    list: document.getElementById('notesList'),
    search: document.getElementById('searchInput'),
    createBtn: document.getElementById('createBtn'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalActions: document.getElementById('modalActions')
  }

  let notes = []
  let query = ''

  async function fetchNotes() {
    const res = await fetch('/api/notes')
    if (!res.ok) throw new Error('Failed to load notes')
    notes = await res.json()
    renderList()
  }

  function renderList() {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? notes.filter(n =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.body && n.body.toLowerCase().includes(q))
        )
      : notes

    el.list.innerHTML = ''
    if (filtered.length === 0) {
      const li = document.createElement('li')
      li.className = 'p-4 text-gray-500'
      li.textContent = q ? 'No matching notes' : 'No notes yet'
      el.list.appendChild(li)
      return
    }

    for (const n of filtered) {
      const li = document.createElement('li')
      li.className = 'p-4 hover:bg-gray-50 cursor-pointer'
      li.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-medium">${escapeHtml(n.title)}</div>
            <div class="text-sm text-gray-600 line-clamp-2">${escapeHtml(n.body)}</div>
          </div>
          <div class="text-sm text-gray-400">›</div>
        </div>`
      li.addEventListener('click', () => openViewModal(n))
      el.list.appendChild(li)
    }
  }

  function openModal() {
    el.modal.classList.remove('hidden')
    el.modal.classList.add('flex')
  }
  function closeModal() {
    el.modal.classList.add('hidden')
    el.modal.classList.remove('flex')
  }
  el.modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'modal') closeModal()
  })

  function setActions(...buttons) {
    el.modalActions.innerHTML = ''
    buttons.forEach(b => el.modalActions.appendChild(b))
  }

  function openCreateModal() {
    el.modalTitle.textContent = 'Create Note'
    el.modalBody.innerHTML = `
      <div>
        <label class="block text-sm mb-1">Title</label>
        <input id="fTitle" class="w-full px-3 py-2 rounded-md border border-gray-300" />
      </div>
      <div>
        <label class="block text-sm mb-1">Body</label>
        <textarea id="fBody" rows="6" class="w-full px-3 py-2 rounded-md border border-gray-300"></textarea>
      </div>
      <div id="formError" class="text-sm text-red-600"></div>
    `
    const cancel = button('Cancel', 'bg-gray-200 hover:bg-gray-300 text-gray-800', closeModal)
    const create = button('Create', 'bg-blue-600 hover:bg-blue-700 text-white', async () => {
      const title = document.getElementById('fTitle').value.trim()
      const body = document.getElementById('fBody').value.trim()
      const err = document.getElementById('formError')
      err.textContent = ''
      if (!title || !body) {
        err.textContent = 'Title and body are required'
        return
      }
      const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, body }) })
      if (res.status === 409) {
        err.textContent = 'A note with that title already exists'
        return
      }
      if (!res.ok) {
        err.textContent = 'Failed to create note'
        return
      }
      await fetchNotes()
      closeModal()
    })
    setActions(cancel, create)
    openModal()
  }

  function openViewModal(note) {
    el.modalTitle.textContent = note.title
    el.modalBody.innerHTML = `
      <div class="prose max-w-none">
        <pre class="whitespace-pre-wrap">${escapeHtml(note.body)}</pre>
      </div>
      <div id="formError" class="text-sm text-red-600"></div>
    `
    const close = button('Close', 'bg-gray-200 hover:bg-gray-300 text-gray-800', closeModal)
    const edit = button('Edit', 'bg-blue-600 hover:bg-blue-700 text-white', () => openEditModal(note))
    const del = button('Delete', 'bg-red-600 hover:bg-red-700 text-white', () => openDeleteConfirm(note))
    setActions(close, edit, del)
    openModal()
  }

  function openEditModal(note) {
    el.modalTitle.textContent = `Edit: ${note.title}`
    el.modalBody.innerHTML = `
      <div>
        <label class="block text-sm mb-1">Title</label>
        <input id="fTitle" class="w-full px-3 py-2 rounded-md border border-gray-300" value="${escapeAttr(note.title)}" />
      </div>
      <div>
        <label class="block text-sm mb-1">Body</label>
        <textarea id="fBody" rows="6" class="w-full px-3 py-2 rounded-md border border-gray-300">${escapeHtml(note.body)}</textarea>
      </div>
      <div id="formError" class="text-sm text-red-600"></div>
    `
    const cancel = button('Cancel', 'bg-gray-200 hover:bg-gray-300 text-gray-800', () => openViewModal(note))
    const save = button('Save', 'bg-blue-600 hover:bg-blue-700 text-white', async () => {
      const newTitle = document.getElementById('fTitle').value.trim()
      const body = document.getElementById('fBody').value.trim()
      const err = document.getElementById('formError')
      err.textContent = ''
      if (!newTitle || !body) {
        err.textContent = 'Title and body are required'
        return
      }
      const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle, body }) })
      if (res.status === 409) {
        err.textContent = 'Another note already has that title'
        return
      }
      if (res.status === 404) {
        err.textContent = 'Note no longer exists'
        return
      }
      if (!res.ok) {
        err.textContent = 'Failed to save changes'
        return
      }
      await fetchNotes()
      const updated = notes.find(n => n.title === newTitle) || { title: newTitle, body }
      openViewModal(updated)
    })
    setActions(cancel, save)
    openModal()
  }

  function openDeleteConfirm(note) {
    el.modalTitle.textContent = `Delete: ${note.title}`
    el.modalBody.innerHTML = `
      <p>Are you sure you want to delete this note? This action cannot be undone.</p>
      <div id="formError" class="text-sm text-red-600"></div>
    `
    const cancel = button('Cancel', 'bg-gray-200 hover:bg-gray-300 text-gray-800', () => openViewModal(note))
    const confirm = button('Delete', 'bg-red-600 hover:bg-red-700 text-white', async () => {
      const res = await fetch(`/api/notes/${encodeURIComponent(note.title)}`, { method: 'DELETE' })
      if (res.status === 404) {
        document.getElementById('formError').textContent = 'Note not found'
        return
      }
      if (!res.ok && res.status !== 204) {
        document.getElementById('formError').textContent = 'Failed to delete'
        return
      }
      await fetchNotes()
      closeModal()
    })
    setActions(cancel, confirm)
    openModal()
  }

  function button(text, classes, onClick) {
    const b = document.createElement('button')
    b.className = `px-4 py-2 rounded-md ${classes}`
    b.textContent = text
    b.addEventListener('click', onClick)
    return b
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;') }

  // Events
  el.search.addEventListener('input', (e) => {
    query = e.target.value
    renderList()
  })
  el.createBtn.addEventListener('click', openCreateModal)

  // Init
  fetchNotes().catch(() => {
    el.list.innerHTML = '<li class="p-4 text-red-600">Failed to load notes</li>'
  })
})()
