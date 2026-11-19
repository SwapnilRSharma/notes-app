const fs = require('fs')
const path = require('path')
const request = require('supertest')

const NOTES_PATH = path.join(__dirname, '..', 'notes.json')
const app = require('..' + path.sep + 'server' + path.sep + 'index.js')

describe('API routes', () => {
  let originalContent = null

  beforeAll(() => {
    if (fs.existsSync(NOTES_PATH)) {
      originalContent = fs.readFileSync(NOTES_PATH)
    }
  })

  beforeEach(() => {
    fs.writeFileSync(NOTES_PATH, '[]')
  })

  afterAll(() => {
    if (originalContent !== null) {
      fs.writeFileSync(NOTES_PATH, originalContent)
    } else if (fs.existsSync(NOTES_PATH)) {
      fs.unlinkSync(NOTES_PATH)
    }
  })

  test('health', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  test('list initially empty', async () => {
    const res = await request(app).get('/api/notes')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([])
  })

  test('create validations and duplicate handling', async () => {
    let res = await request(app).post('/api/notes').send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toMatch(/title is required/i)

    res = await request(app).post('/api/notes').send({ title: 'a', body: 'x' })
    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)

    res = await request(app).post('/api/notes').send({ title: 'a', body: 'y' })
    expect(res.statusCode).toBe(409)
    expect(res.body.error).toMatch(/exists/i)
  })

  test('update flow: not found, conflict, success', async () => {
    // not found
    let res = await request(app).put('/api/notes/missing').send({ title: 'z' })
    expect(res.statusCode).toBe(404)

    // seed two notes
    await request(app).post('/api/notes').send({ title: 'a', body: 'aa' })
    await request(app).post('/api/notes').send({ title: 'b', body: 'bb' })

    // conflict
    res = await request(app).put('/api/notes/a').send({ title: 'b' })
    expect(res.statusCode).toBe(409)

    // success rename and body update
    res = await request(app).put('/api/notes/a').send({ title: 'c', body: 'cc' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  test('delete: 204 and 404', async () => {
    let res = await request(app).delete('/api/notes/missing')
    expect(res.statusCode).toBe(404)

    await request(app).post('/api/notes').send({ title: 'a', body: '' })
    res = await request(app).delete('/api/notes/a')
    expect(res.statusCode).toBe(204)
  })
})
