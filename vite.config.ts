import { fileURLToPath, URL } from 'node:url'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { version } from './package.json'

const sentryUploadEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN)

export default defineConfig({
  plugins: [
    react(),
    ...(sentryUploadEnabled
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: { name: `hasta-takip-sistemi@${version}` },
            sourcemaps: { filesToDeleteAfterUpload: './dist/**/*.map' },
          }),
        ]
      : []),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    sourcemap: sentryUploadEnabled,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
