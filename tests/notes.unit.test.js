const fs = require('fs')
const path = require('path')

const NOTES_PATH = path.join(__dirname, '..', 'notes.json')
const notes = require('..' + path.sep + 'notes.js')

function readJSONSafe(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

describe('notes module', () => {
  let originalContent = null

  beforeAll(() => {
    if (fs.existsSync(NOTES_PATH)) {
      originalContent = fs.readFileSync(NOTES_PATH)
    }
  })

  beforeEach(() => {
    // Reset store to empty array for isolation
    fs.writeFileSync(NOTES_PATH, '[]')
  })

  afterAll(() => {
    if (originalContent !== null) {
      fs.writeFileSync(NOTES_PATH, originalContent)
    } else if (fs.existsSync(NOTES_PATH)) {
      fs.unlinkSync(NOTES_PATH)
    }
  })

  test('listNotes returns [] initially', () => {
    expect(notes.listNotes()).toEqual([])
  })

  test('addNote creates and prevents duplicates', () => {
    let r = notes.addNote('a', 'alpha')
    expect(r).toEqual({ ok: true })
    expect(readJSONSafe(NOTES_PATH)).toEqual([{ title: 'a', body: 'alpha' }])

    r = notes.addNote('a', 'dup')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/exists/i)
  })

  test('updateNote handles not found and conflicts', () => {
    let r = notes.updateNote('missing', { title: 'x' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/not found/i)

    // seed
    expect(notes.addNote('a', 'aa').ok).toBe(true)
    expect(notes.addNote('b', 'bb').ok).toBe(true)

    // conflict rename
    r = notes.updateNote('a', { title: 'b' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/conflicts/i)

    // valid rename and body change
    r = notes.updateNote('a', { title: 'c', body: 'cc' })
    expect(r).toEqual({ ok: true })
    expect(notes.listNotes()).toEqual([
      { title: 'c', body: 'cc' },
      { title: 'b', body: 'bb' }
    ])
  })

  test('removeNote reports not found and success', () => {
    let r = notes.removeNote('none')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/not found/i)

    notes.addNote('t', 'body')
    r = notes.removeNote('t')
    expect(r).toEqual({ ok: true })
    expect(notes.listNotes()).toEqual([])
  })
})
