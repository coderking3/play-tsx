/* util.ts */

/* eslint-disable no-console */
import type {
  EnsureOptions,
  FileCache,
  FileInfo,
  Flags,
  FlagSchema,
  ParsedArgs,
  PlayOptions
} from './types'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { parseArgs as nodeParseArgs } from 'node:util'
import {
  FILE_CACHE_TTL,
  NODE_RESERVED_NAMES,
  SKIP_DIRECTORIES
} from './constants'

// ==================== Argument Parsing Helpers ====================

/**
 * Convert alias to full flag name
 */
function aliasToFullName(key: string, flags: Flags): string {
  if (!flags) return key

  for (const [name, schema] of Object.entries(flags)) {
    if (schema.alias === key) {
      return name
    }
  }

  return key
}

/**
 * Parse a single flag value based on its schema
 */
function parseFlagValue(schema: FlagSchema, rawValue: any): any {
  const { type, default: defaultValue } = schema

  if (rawValue === undefined) {
    return defaultValue
  }

  if (type === Boolean) {
    return rawValue === true || rawValue === 'true'
  }

  if (type === String) {
    return String(rawValue)
  }

  if (type === Number) {
    const num = Number(rawValue)
    return Number.isNaN(num) ? defaultValue : num
  }

  if (typeof type === 'function') {
    try {
      return type(rawValue)
    } catch (error) {
      console.warn(`⚠️ Failed to parse value "${rawValue}":`, error)
      return defaultValue
    }
  }

  return rawValue
}

/**
 * Build a set of arguments that need special handling
 * Only flags defined in the config with Node reserved names need special handling
 */
function buildSpecialArgs(flags?: Flags): Set<string> {
  const specialArgs = new Set<string>()

  if (!flags) return specialArgs

  Object.entries(flags).forEach(([name, schema]) => {
    if (NODE_RESERVED_NAMES.includes(name as any)) {
      specialArgs.add(`--${name}`)
      if (schema.alias) {
        specialArgs.add(`-${schema.alias}`)
      }
    }
  })

  return specialArgs
}

/**
 * Separate special arguments and regular arguments from argv
 */
function separateArgs(
  argv: string[],
  specialArgs: Set<string>,
  flags: Flags
): {
  special: Record<string, boolean | string>
  remaining: string[]
} {
  const special: Record<string, boolean | string> = {}
  const remaining: string[] = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (specialArgs.has(arg)) {
      const rawKey = arg.replace(/^-+/, '')
      const isAlias = !NODE_RESERVED_NAMES.includes(rawKey as any)
      const fullName = isAlias ? aliasToFullName(rawKey, flags) : rawKey

      const nextArg = argv[i + 1]
      if (nextArg && !nextArg.startsWith('-')) {
        special[fullName] = nextArg
        i++
      } else {
        special[fullName] = true
      }
    } else {
      remaining.push(arg)
    }
  }

  return { special, remaining }
}

/**
 * Build parseArgs configuration
 * Exclude arguments that have been specially handled
 */
function buildParseArgsOptions(flags?: Flags, specialArgs?: Set<string>) {
  if (!flags) return { options: {}, strict: false }

  const options: Record<string, any> = {}

  Object.entries(flags).forEach(([name, schema]) => {
    const isSpecial =
      specialArgs?.has(`--${name}`) ||
      (schema.alias && specialArgs?.has(`-${schema.alias}`))

    if (isSpecial) {
      return
    }

    const option: any = {
      type: schema.type === Boolean ? 'boolean' : 'string'
    }

    if (schema.alias) {
      option.short = schema.alias
    }

    options[name] = option
  })

  return { options, strict: false }
}

// ==================== Main Parser ====================

/**
 * Parse command line arguments
 * @param rawArgv - Raw argument array (default: process.argv.slice(2))
 * @param flags - Flag definitions
 * @returns Parsed arguments object (only contains long names)
 */
export function parseArguments(
  rawArgv: string[] = process.argv.slice(2),
  flags: Flags = {}
): ParsedArgs {
  const specialArgs = buildSpecialArgs(flags)
  const { special, remaining } = separateArgs(rawArgv, specialArgs, flags)

  let parsed: any = { values: {}, positionals: [] }
  if (remaining.length > 0) {
    try {
      const parseArgsOptions = buildParseArgsOptions(flags, specialArgs)
      parsed = nodeParseArgs({
        args: remaining,
        ...parseArgsOptions,
        allowPositionals: true
      })
    } catch (error) {
      console.error('❌ Error parsing arguments:', error)
    }
  }

  const args: ParsedArgs = {
    ...special,
    ...parsed.values,
    _: parsed.positionals
  }

  if (flags) {
    Object.entries(flags).forEach(([name, schema]) => {
      const rawValue = args[name]

      if (rawValue === undefined && schema.default !== undefined) {
        args[name] = schema.default
        return
      }

      args[name] = parseFlagValue(schema, rawValue)
    })
  }

  return args
}

// ==================== File System Utilities ====================

// File cache
let fileCache: FileCache | null = null

/**
 * Recursively get all .ts files in a directory
 * @param rootDir - Path relative to project root, e.g. './playground'
 * @param useCache - Whether to use cached results (default: true)
 * @returns List of files
 */
export function getAvailableFiles(
  rootDir: string,
  useCache = true
): FileInfo[] {
  const projectRoot = process.cwd()
  const targetDir = path.resolve(projectRoot, rootDir)

  // Check cache
  if (
    useCache &&
    fileCache &&
    fileCache.rootDir === rootDir &&
    Date.now() - fileCache.timestamp < FILE_CACHE_TTL
  ) {
    return fileCache.files
  }

  // Check if directory exists
  if (!fs.existsSync(targetDir)) {
    console.warn(`⚠️ Directory does not exist: ${targetDir}`)
    return []
  }

  const files: FileInfo[] = []

  /**
   * Recursively walk through directory
   */
  function walk(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          // Skip common directories that don't need traversal
          if (SKIP_DIRECTORIES.includes(entry.name as any)) {
            continue
          }
          walk(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          const relativePath = path.relative(targetDir, fullPath)

          files.push({
            name: entry.name.replace('.ts', ''),
            path: fullPath,
            relativePath: relativePath.replace(/\\/g, '/')
          })
        }
      }
    } catch {
      console.warn(`⚠️ Cannot read directory: ${dir}`)
    }
  }

  walk(targetDir)

  // Sort by relative path
  const sortedFiles = files.sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  )

  // Update cache
  fileCache = {
    files: sortedFiles,
    timestamp: Date.now(),
    rootDir
  }

  return sortedFiles
}

/**
 * Clear file cache
 */
export function clearFileCache(): void {
  fileCache = null
}

// ==================== Output Helpers ====================

/**
 * Print file list (for --list command)
 */
export function printFileList(rootDir: string): void {
  const files = getAvailableFiles(rootDir, false) // Don't use cache for list command

  if (files.length === 0) {
    console.log(`\n❌ No .ts files found in ${rootDir} directory\n`)
    return
  }

  console.log(`\n📁 Available files in ${rootDir} (${files.length} total):\n`)

  // Group by directory
  const grouped: Record<string, FileInfo[]> = {}

  files.forEach((file) => {
    const dir = path.dirname(file.relativePath)
    const dirKey = dir === '.' ? '📄 Root directory' : `📁 ${dir}`

    if (!grouped[dirKey]) {
      grouped[dirKey] = []
    }
    grouped[dirKey].push(file)
  })

  // Output
  let index = 1
  for (const [dir, fileList] of Object.entries(grouped)) {
    console.log(`${dir}:`)
    fileList.forEach((file) => {
      console.log(`  ${index.toString().padStart(2)}. ${file.name}`)
      index++
    })
    console.log('')
  }
}

/**
 * Generate help information
 */
export function generateHelp(options: PlayOptions): string {
  const { name, version, description, flags } = options

  let help = `  ● ${name} cli ─ v${version}${description ? `\n  ${description}` : ''}`
  help += '\n\nUsage:\n'
  help += `  ${name} [options] [value]\n\n`

  if (flags && Object.keys(flags).length > 0) {
    help += 'Options:\n'

    Object.entries(flags).forEach(([name, schema]) => {
      const flag = `--${name}`
      const alias = schema.alias ? `, -${schema.alias}` : ''
      const param = schema.parameter ? ` ${schema.parameter}` : ''
      const desc = schema.description || ''
      const def =
        schema.default !== undefined ? ` (default: ${schema.default})` : ''

      help += `  ${(flag + alias + param).padEnd(30)} ${desc}${def}\n`
    })
  }

  help += '\nExamples:\n'
  help += `  ${name}                      → Run default file (index.ts)\n`
  help += `  ${name} --file test          → Run test.ts\n`
  help += `  ${name} --watch -f test      → Run test.ts in watch mode\n`
  help += `  ${name} --list               → List all available files\n`
  help += `  ${name} --version            → Show version\n`
  help += `  ${name} --help               → Show this help\n`

  return help
}

// ==================== Package Management ====================

/**
 * Ensure a package is installed (automatically install if it does not exist)
 */
export function ensurePackage(pkg: string, options: EnsureOptions = {}): void {
  const { dev = true, manager = detectManager(), silent = false } = options
  const require = createRequire(import.meta.url)

  try {
    require.resolve(pkg)
  } catch {
    console.log(
      `⚠️  Dependency "${pkg}" not found, using ${manager} to install...`
    )
    try {
      const cmd = getInstallCommand(manager, pkg, dev)
      execSync(cmd, { stdio: silent ? 'ignore' : 'inherit' })
      console.log(`✅ Successfully installed ${pkg}`)
    } catch (error) {
      console.error(`❌ Failed to install ${pkg}:`, error)
      throw error
    }
  }
}

/**
 * Auto-detect current package manager
 */
function detectManager(): 'npm' | 'pnpm' | 'yarn' {
  const ua = process.env.npm_config_user_agent ?? ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  return 'npm'
}

/**
 * Construct installation command
 */
function getInstallCommand(manager: string, pkg: string, dev: boolean): string {
  switch (manager) {
    case 'pnpm':
      return `pnpm add ${pkg} ${dev ? '-D' : ''}`
    case 'yarn':
      return `yarn add ${pkg} ${dev ? '-D' : ''}`
    default:
      return `npm install ${pkg} ${dev ? '--save-dev' : ''}`
  }
}

// ==================== Validation ====================

/**
 * Validate PlayOptions configuration
 */
export function validateOptions(options: PlayOptions): void {
  const { rootDir, tsconfig } = options

  if (rootDir) {
    const resolvedDir = path.resolve(process.cwd(), rootDir)
    if (!fs.existsSync(resolvedDir)) {
      console.warn(`⚠️  Root directory does not exist: ${resolvedDir}`)
    }
  }

  if (tsconfig) {
    const resolvedConfig = path.resolve(process.cwd(), tsconfig)
    if (!fs.existsSync(resolvedConfig)) {
      console.warn(`⚠️  Tsconfig file does not exist: ${resolvedConfig}`)
    }
  }
}
