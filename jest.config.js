module.exports = {
  projects: [
    {
      preset: 'ts-jest',
      displayName: 'dom',
      testEnvironment: 'jsdom',
      testMatch: ['**/test/**/*.test.ts?(x)']
    },
    {
      preset: 'ts-jest',
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '**/test/**/*.test.node.ts',
      ]
    },
  ]
}
