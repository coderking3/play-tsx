/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// Define paths
const distDir = join(process.cwd(), 'dist')
const cliDtsPath = join(distDir, 'cli.d.ts')
const cliJsPath = join(distDir, 'cli.js')

try {
  console.log('🚀 Starting build...')

  // Run tsdown build command
  execSync('tsdown', {
    stdio: 'inherit'
  })

  // Check and remove cli.d.ts file
  if (existsSync(cliDtsPath)) {
    rmSync(cliDtsPath, { force: true })
    console.log('🗑️  Removed dist/cli.d.ts')
  } else {
    console.log('ℹ️  dist/cli.d.ts not found')
  }

  // Process cli.js - remove empty export
  if (existsSync(cliJsPath)) {
    let content = readFileSync(cliJsPath, 'utf-8')

    // Remove trailing "export { }"
    content = content
      .replace(/\nexport\s*\{\s*\}\s*(?:;\s*)?$/, '')
      .replace(/export\s*\{\s*\}\s*;?\n?$/m, '')
      .trimEnd()

    writeFileSync(cliJsPath, `${content}\n`, 'utf-8')
    console.log('🧹 Cleaned empty export from cli.js')
  }

  console.log('🎉 Build process completed')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
