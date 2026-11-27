// @ts-check
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:5179',
    video: 'on',
    trace: 'on'
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Mobile Chrome',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } }
    }
  ],
  webServer: [
    {
      command: 'npm run server',
      url: 'http://localhost:5178/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'npm --prefix web run dev',
      url: 'http://localhost:5179',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ]
})
