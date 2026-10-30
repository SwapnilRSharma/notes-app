# Plan — web-3f9a8626

<!-- factory:plan v=1 -->

## Design

Introduce a minimal HTTP server using Node's built-in `http` module to avoid adding a web framework. Expose a `createServer()` factory that returns an `http.Server` handling `GET /health` by responding with JSON `{"status":"ok"}` and `Content-Type: application/json`; all other paths return 404. This keeps the existing CLI (`app.js`) unchanged while enabling a simple health check endpoint.

Add tests with Jest and Supertest. Jest provides the test runner; Supertest drives requests against the server without needing to bind a real port. The test will instantiate the server via `createServer()`, issue `GET /health`, and assert a 200 status and body `{status: 'ok'}`.

## Tasks

- [x] `t1` Add minimal HTTP server with /health
  - intent: Create a small server module that serves GET /health with JSON {status:"ok"} and 404 for others.
  - files: `server.js`
  - acceptance: Importing createServer and hitting /health returns 200 and JSON {status:"ok"}.
- [ ] `t2` Configure test tooling (Jest + Supertest)
  - intent: Enable a test runner and HTTP assertion helper by adding Jest and Supertest and updating the npm test script.
  - files: `package.json`
  - acceptance: Running npm test executes Jest instead of the placeholder script.
- [ ] `t3` Add test for /health endpoint
  - intent: Verify GET /health returns 200 and body {status:"ok"} using Supertest against the server factory.
  - files: `__tests__/health.test.js`
  - acceptance: Test passes locally and fails if the endpoint changes behavior.
- [ ] `t4` Run test suite to verify
  - intent: Execute the tests to confirm the endpoint and configuration work end-to-end.
  - acceptance: All tests pass with no failures.
