import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', fullyParallel:false, workers:1,
  timeout:30000, expect:{timeout:7000},
  use:{baseURL:process.env.PLAYBOOK_BASE_URL || 'http://127.0.0.1:5173',headless:true,trace:'retain-on-failure'},
  reporter:[['list']],
});
