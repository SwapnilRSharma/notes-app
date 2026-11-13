import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4311',
    video: 'on',
    trace: 'on',
  },
  webServer: {
    command: 'npm run serve:web',
    url: 'http://localhost:4311',
    reuseExistingServer: false,
    timeout: 120_000,
    env: { PORT: '4311' },
  },
})
