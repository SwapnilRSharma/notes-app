(() => {
  const listEl = document.getElementById('notes-list')
  const form = document.getElementById('create-form')
  const titleInput = document.getElementById('title')
  const bodyInput = document.getElementById('body')
  const createError = document.getElementById('create-error')

  async function fetchJSON(url, options) {
    const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options))
    const isJSON = res.headers.get('content-type')?.includes('application/json')
    const data = isJSON ? await res.json() : null
    if (!res.ok) {
      const message = data?.error || `${res.status} ${res.statusText}`
      throw new Error(message)
    }
    return data
  }

  async function loadNotes() {
    const notes = await fetchJSON('/api/notes')
    renderNotes(notes)
  }

  function renderNotes(notes) {
    listEl.innerHTML = ''
    if (!notes || notes.length === 0) {
      const li = document.createElement('li')
      li.className = 'empty'
      li.textContent = 'No notes yet.'
      listEl.appendChild(li)
      return
    }
    for (const n of notes) {
      listEl.appendChild(renderItem(n))
    }
  }

  function renderItem(note) {
    const li = document.createElement('li')
    li.className = 'note'

    const view = document.createElement('div')
    view.className = 'view'
    const title = document.createElement('h3')
    title.textContent = note.title
    const body = document.createElement('p')
    body.textContent = note.body
    const actions = document.createElement('div')
    actions.className = 'actions'
    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    const delBtn = document.createElement('button')
    delBtn.textContent = 'Delete'
    actions.append(editBtn, delBtn)
    view.append(title, body, actions)

    const edit = document.createElement('form')
    edit.className = 'edit hidden'
    edit.innerHTML = `
      <label>Title <input name="title" value="${escapeHtml(note.title)}" required /></label>
      <label>Body <textarea name="body" required>${escapeHtml(note.body)}</textarea></label>
      <div class="actions">
        <button type="submit">Save</button>
        <button type="button" data-action="cancel">Cancel</button>
      </div>
      <span class="error" aria-live="polite"></span>
    `

    edit.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(edit)
      const title = fd.get('title').toString().trim()
      const body = fd.get('body').toString()
      const err = edit.querySelector('.error')
      err.textContent = ''
      if (!title || !body) {
        err.textContent = 'Both fields are required.'
        return
      }
      try {
        await fetchJSON(`/api/notes/${encodeURIComponent(note.id)}`, {
          method: 'PUT',
          body: JSON.stringify({ title, body }),
        })
        await loadNotes()
      } catch (ex) {
        err.textContent = ex.message
      }
    })

    edit.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      edit.classList.add('hidden')
      view.classList.remove('hidden')
    })

    editBtn.addEventListener('click', () => {
      view.classList.add('hidden')
      edit.classList.remove('hidden')
    })
    delBtn.addEventListener('click', async () => {
      if (!confirm('Delete this note?')) return
      try {
        await fetchJSON(`/api/notes/${encodeURIComponent(note.id)}`, { method: 'DELETE' })
        await loadNotes()
      } catch (ex) {
        alert(ex.message)
      }
    })

    li.append(view, edit)
    return li
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    createError.textContent = ''
    const title = titleInput.value.trim()
    const body = bodyInput.value
    if (!title || !body) {
      createError.textContent = 'Both fields are required.'
      return
    }
    try {
      await fetchJSON('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ title, body }),
      })
      titleInput.value = ''
      bodyInput.value = ''
      await loadNotes()
    } catch (ex) {
      createError.textContent = ex.message
    }
  })

  loadNotes().catch((e) => {
    listEl.innerHTML = `<li class="error">${e.message}</li>`
  })
})()
