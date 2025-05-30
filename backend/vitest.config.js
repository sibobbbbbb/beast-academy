import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov','cobertura'],
      reportsDirectory: './coverage',
      include: ['controllers/**/*.js', 'middlewares/**/*.js'],
      exclude: ['tests/**', 'node_modules/**']
    },
    setupFiles: ['./tests/setup.js'],
    clearMocks: true,
    restoreMocks: true
  }
})