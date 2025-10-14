import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '33c4ds',
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
