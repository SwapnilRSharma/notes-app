// @ts-check
import { defineConfig, devices } from '@playwright/test'

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
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iphone12-mobile',
      use: { ...devices['iPhone 12'] },
    },
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
