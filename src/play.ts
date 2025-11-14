/* eslint-disable no-console */
import type { SpawnOptions } from 'node:child_process'
import type { PlayOptions, TsxRunnerOptions } from './types'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DEFAULT_PLAY_OPTIONS } from './constants'
import {
  ensurePackage,
  generateHelp,
  mergeFlags,
  parseArguments,
  printFileList,
  validateOptions
} from './util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __root = process.cwd()

// ==================== Path Resolution ====================

/**
 * Resolve file path
 */
function resolveFilePath(file: string, rootDir?: string): string {
  const filePath = file.endsWith('.ts') ? file : `${file}.ts`

  if (rootDir) {
    return path.resolve(__root, rootDir, filePath)
  }

  if (file.includes('/') || file.includes('\\') || path.isAbsolute(file)) {
    return path.resolve(__root, filePath)
  }

  // Default to project root directory
  return path.resolve(__root, filePath)
}

/**
 * Resolve tsconfig path
 */
function resolveTsconfigPath(
  tsconfigArg?: string,
  defaultPath?: string
): string | undefined {
  // 1. If tsconfig argument is provided via command line
  if (tsconfigArg) {
    const resolvedPath = path.isAbsolute(tsconfigArg)
      ? tsconfigArg
      : path.resolve(__root, tsconfigArg)

    if (fs.existsSync(resolvedPath)) {
      return resolvedPath
    } else {
      console.warn(`⚠️  Specified tsconfig does not exist: ${resolvedPath}`)
    }
  }

  // 2. If default path is provided in config (relative to project root)
  if (defaultPath) {
    const resolvedPath = path.isAbsolute(defaultPath)
      ? defaultPath
      : path.resolve(__root, defaultPath)

    if (fs.existsSync(resolvedPath)) {
      return resolvedPath
    }
  }

  // 3. Try tsconfig.json in project root
  const rootConfig = path.join(__root, 'tsconfig.json')
  if (fs.existsSync(rootConfig)) {
    return rootConfig
  }

  // 4. Not found, return undefined (tsx will use default config)
  return undefined
}

// ==================== TSX Runner ====================

/**
 * Run tsx
 */
function runTsx(filePath: string, options: TsxRunnerOptions = {}): void {
  const { watch, tsconfigPath, autoInstall, debug } = options

  // Build tsx command
  const tsxCommand: string[] = []

  if (watch) {
    tsxCommand.push('watch')
  }

  if (tsconfigPath && fs.existsSync(tsconfigPath)) {
    tsxCommand.push('--tsconfig', tsconfigPath)
  }

  tsxCommand.push(filePath)

  // Display execution info
  console.log(`✅ Running: ${path.relative(process.cwd(), filePath)}`)
  if (watch) {
    console.log(`👀 Watch mode enabled`)
  }
  if (tsconfigPath) {
    console.log(
      `📝 Using tsconfig: ${path.relative(process.cwd(), tsconfigPath)}`
    )
  }

  if (debug) {
    console.log('\n🔍 Debug Info:')
    console.log('  File:', filePath)
    console.log('  Tsconfig:', tsconfigPath || 'default')
    console.log('  Watch:', watch)
    console.log('  Command:', ['tsx', ...tsxCommand].join(' '))
  }

  console.log('')

  // Spawn options with proper typing
  const spawnOptions: SpawnOptions = {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    ...(process.platform === 'win32' && { shell: true })
  }

  if (autoInstall) {
    try {
      ensurePackage('tsx')
    } catch {
      console.error('❌ Failed to ensure tsx is installed')
      process.exit(1)
    }
  }

  // Execute tsx
  const child = spawn('tsx', tsxCommand, spawnOptions)

  child.on('error', (err: NodeJS.ErrnoException) => {
    console.error('\n❌ Execution failed:', err.message)
    if (err.code === 'ENOENT') {
      console.log('\n💡 Please install tsx first:')
      console.log('   npm install -D tsx')
      console.log('   pnpm add -D tsx')
      console.log('   yarn add -D tsx')
    }
    process.exit(1)
  })

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`\n⚠️  Process exited with code: ${code}`)
    }
    process.exit(code || 0)
  })

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n👋 Exiting...')
    child.kill('SIGINT')
    process.exit(0)
  })

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM, exiting...')
    child.kill('SIGTERM')
    process.exit(0)
  })
}

// ==================== Main CLI Entry ====================

/**
 * Play CLI main function
 */
export function play(options?: PlayOptions): void {
  // Get default flags
  const defaultOptions = DEFAULT_PLAY_OPTIONS

  // Merge options with defaults
  const {
    name = defaultOptions.name,
    version = defaultOptions.version,
    description = defaultOptions.description,
    flags: userFlags,
    rootDir = defaultOptions.rootDir,
    tsconfig = defaultOptions.tsconfig,
    autoInstall = defaultOptions.autoInstall
  } = options || {}

  // Merge flags: default flags + user custom flags
  const flags = mergeFlags(userFlags, defaultOptions.flags)

  // Validate options
  validateOptions({ rootDir, tsconfig } as PlayOptions)

  const args = parseArguments(process.argv.slice(2), flags)

  // Handle version flag
  if (args.version) {
    console.log(
      `  ● ${name} cli ─ v${version}${description ? `\n  ${description}` : ''}`
    )
    process.exit(0)
  }

  // Handle help flag
  if (args.help) {
    console.log(generateHelp({ name, version, flags }))
    process.exit(0)
  }

  // Handle list flag
  if (args.list) {
    if (rootDir) {
      printFileList(rootDir)
    } else {
      console.log('❌ No root directory configured')
    }
    process.exit(0)
  }

  // Resolve file and tsconfig paths
  const file = args.file || 'index'
  const filePath = resolveFilePath(file, rootDir)
  const tsconfigPath = resolveTsconfigPath(args.tsconfig, tsconfig)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File does not exist: ${filePath}`)

    if (rootDir) {
      console.log('')
      printFileList(rootDir)
      console.log('💡 Tip: Use --help to view all options')
    }

    process.exit(1)
  }

  // Run tsx
  runTsx(filePath, {
    watch: args.watch || false,
    tsconfigPath,
    autoInstall,
    debug: args.debug || false
  })
}
