// part5/cypress.config.js

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
  },
  env: {
    BACKEND: 'http://localhost:3001/api'
  }
})
