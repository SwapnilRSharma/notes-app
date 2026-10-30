const request = require('supertest')
const { createServer } = require('../server')

describe('GET /health', () => {
  let server

  beforeAll(() => {
    server = createServer()
  })

  afterAll((done) => {
    server.close(done)
  })

  test('responds with 200 and {status:"ok"}', async () => {
    await request(server)
      .get('/health')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(({ body }) => {
        if (!body || body.status !== 'ok') {
          throw new Error('Expected body.status to be "ok"')
        }
      })
  })
})
