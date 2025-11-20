/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import { bold, cyan, green, red, yellow } from 'ansis'

// Files to remove after build
const REMOVE_FILES = ['cli.d.mts'] as const

// File rename configuration
const RENAME_MAP = [
  { from: 'play.d.mts', to: 'play.d.ts' },
  { from: 'play.mjs', to: 'play.js' },
  { from: 'cli.mjs', to: 'cli.js' }
] as const

const distDir = join(process.cwd(), 'dist')

/**
 * Remove a file from the dist directory
 */
function removeFile(fileName: string): boolean {
  const filePath = join(distDir, fileName)

  if (!existsSync(filePath)) {
    console.log(yellow(`ℹ️  ${fileName} not found, skipping...`))
    return false
  }

  try {
    rmSync(filePath)
    console.log(green('🗑️  Removed ') + bold(fileName))
    return true
  } catch (error) {
    console.error(red(`❌ Failed to remove ${fileName}: ${formatError(error)}`))
    return false
  }
}

/**
 * Rename a file in the dist directory
 */
function renameFile(from: string, to: string): boolean {
  const sourcePath = join(distDir, from)
  const targetPath = join(distDir, to)

  if (!existsSync(sourcePath)) {
    console.log(yellow(`ℹ️  ${from} not found, skipping...`))
    return false
  }

  renameSync(sourcePath, targetPath)
  console.log(green('🔁 Renamed ') + bold(from) + green(' → ') + bold(to))
  return true
}

/**
 * Clean empty exports from a JavaScript file
 */
function cleanEmptyExports(fileName: string): boolean {
  const filePath = join(distDir, fileName)

  if (!existsSync(filePath)) {
    console.log(yellow(`ℹ️  ${fileName} not found, skipping cleanup...`))
    return false
  }

  try {
    let content = readFileSync(filePath, 'utf-8')

    // Remove trailing "export { }"
    const originalContent = content
    content = content
      .replace(/\nexport\s*\{\s*\}\s*(?:;\s*)?$/, '')
      .replace(/export\s*\{\s*\}\s*;?\n?$/m, '')
      .trimEnd()

    // Only write if content changed
    if (content !== originalContent) {
      writeFileSync(filePath, `${content}\n`, 'utf-8')
      console.log(green('🧹 Cleaned empty export from ') + bold(fileName))
      return true
    }

    return false
  } catch (error) {
    console.error(red(`❌ Failed to clean ${fileName}: ${formatError(error)}`))
    return false
  }
}

/**
 * Format error message for display
 */
function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return JSON.stringify(error)
}

/**
 * Main build process
 */
function build() {
  try {
    console.log(bold(cyan('\n🚀 Starting build script...\n')))
    console.log(yellow('📦 Running tsdown build...'))

    execSync('tsdown', { stdio: 'inherit' })

    console.log(bold(cyan('\n🧹 Post-build cleanup...\n')))

    // Remove unwanted files
    let removedCount = 0
    for (const fileName of REMOVE_FILES) {
      if (removeFile(fileName)) {
        removedCount++
      }
    }

    // Clean empty exports from cli.mjs
    cleanEmptyExports('cli.mjs')

    if (removedCount > 0) {
      console.log(green(`\n✅ Removed ${removedCount} file(s)`))
    }

    // Batch rename files
    console.log()
    RENAME_MAP.forEach(({ from, to }) => renameFile(from, to))

    console.log(bold(green('\n🎉 Build completed successfully!\n')))
  } catch (error) {
    console.error(
      `${bold(red('\n❌ Build failed: '))}${red(formatError(error))}\n`
    )
    process.exit(1)
  }
}

build()
