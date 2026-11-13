import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  retries: 0,
  use: {
    baseURL: 'http://localhost:5180',
    video: 'on',
    trace: 'on'
  },
  webServer: {
    command: "concurrently -k -p '[{name}]' -n API,WEB -c blue,magenta \"node api/server.js\" \"npm --prefix web run dev\"",
    url: 'http://localhost:5180',
    timeout: 120000,
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
