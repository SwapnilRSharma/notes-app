const api = {
  async list() {
    const res = await fetch('/api/notes');
    if (!res.ok) throw new Error('Failed to fetch notes');
    const data = await res.json();
    return data.notes || [];
  },
  async create(title, body) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    if (res.status === 409) throw new Error('A note with that title already exists');
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },
  async update(currentTitle, updates) {
    const res = await fetch(`/api/notes/${encodeURIComponent(currentTitle)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.status === 404) throw new Error('Note not found');
    if (res.status === 409) throw new Error('Another note already has that title');
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },
  async remove(title) {
    const res = await fetch(`/api/notes/${encodeURIComponent(title)}`, { method: 'DELETE' });
    if (res.status === 404) throw new Error('Note not found');
    if (!res.ok) throw new Error('Failed to delete note');
    return true;
  }
};

async function refreshList() {
  const listEl = document.getElementById('notes-list');
  const listError = document.getElementById('list-error');
  listError.textContent = '';
  listEl.innerHTML = '<li class="muted">Loading…</li>';
  try {
    const notes = await api.list();
    if (notes.length === 0) {
      listEl.innerHTML = '<li class="muted">No notes yet</li>';
      return;
    }
    listEl.innerHTML = '';
    for (const note of notes) {
      listEl.appendChild(renderNoteItem(note));
    }
  } catch (e) {
    listEl.innerHTML = '';
    listError.textContent = e.message || 'Failed to load notes';
  }
}

function renderNoteItem(note) {
  const li = document.createElement('li');
  li.className = 'note-item';

  const title = document.createElement('div');
  title.className = 'note-title';
  title.textContent = note.title;

  const body = document.createElement('div');
  body.className = 'note-body';
  body.textContent = note.body;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => enterEditMode(li, note));

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'danger';
  delBtn.addEventListener('click', async () => {
    if (!confirm(`Delete note \'${note.title}\'?`)) return;
    try {
      await api.remove(note.title);
      await refreshList();
    } catch (e) {
      alert(e.message || 'Failed to delete');
    }
  });

  actions.append(editBtn, delBtn);
  li.append(title, body, actions);
  return li;
}

function enterEditMode(li, note) {
  li.innerHTML = '';

  const titleField = document.createElement('input');
  titleField.type = 'text';
  titleField.value = note.title;

  const bodyField = document.createElement('textarea');
  bodyField.rows = 3;
  bodyField.value = note.body;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', async () => {
    const nextTitle = titleField.value.trim();
    const nextBody = bodyField.value;
    if (!nextTitle) {
      alert('Title is required');
      return;
    }
    try {
      await api.update(note.title, { title: nextTitle, body: nextBody });
      await refreshList();
    } catch (e) {
      alert(e.message || 'Failed to update');
    }
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'secondary';
  cancelBtn.addEventListener('click', async () => {
    await refreshList();
  });

  actions.append(saveBtn, cancelBtn);
  li.append(titleField, bodyField, actions);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-form');
  const errEl = document.getElementById('create-error');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.textContent = '';
    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body').value;
    if (!title) {
      errEl.textContent = 'Title is required';
      return;
    }
    try {
      await api.create(title, body);
      form.reset();
      await refreshList();
    } catch (e) {
      errEl.textContent = e.message || 'Failed to create note';
    }
  });

  refreshList();
});
