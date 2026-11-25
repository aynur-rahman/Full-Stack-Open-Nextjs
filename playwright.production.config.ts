import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true, quiet: true })
export default defineConfig({
  testDir: './verification', testMatch: 'production.spec.ts', fullyParallel: false,
  workers: 1, retries: 0, forbidOnly: true, timeout: 90000, reporter: 'list',
  outputDir: 'test-results/production',
  use: { baseURL: 'http://localhost:3002', trace: 'off', screenshot: 'off' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3002',
    url: 'http://localhost:3002', reuseExistingServer: false, timeout: 120000,
    env: { TESTING: 'true' }
  }
})
