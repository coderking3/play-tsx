import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/play.ts', 'src/cli.ts'],
  shims: true,
  format: ['esm']
})
