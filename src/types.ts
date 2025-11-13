/* types.ts */

// ==================== Flag Types ====================

export type FlagType<T = any> =
  | typeof String
  | typeof Number
  | typeof Boolean
  | ((value: any) => T)

export type FlagParameter = `<${string}>` | `[${string}]`

export interface FlagSchema<T = any> {
  type: FlagType<T>
  alias?: string
  default?: T
  description?: string
  parameter?: FlagParameter
}

export interface Flags {
  [flagName: string]: FlagSchema
}

// ==================== CLI Options ====================

export interface PlayOptions {
  name?: string
  version?: string
  description?: string
  flags?: Flags
  rootDir?: string
  tsconfig?: string
  autoInstall?: boolean
}

// ==================== Parser Types ====================

export interface ParsedArgs {
  [key: string]: any
  _: string[] // Positional arguments
}

// ==================== Utility Types ====================

export type Recordable<T> = Record<string, T>

export interface FileInfo {
  name: string // File name (without .ts extension)
  path: string // Full path
  relativePath: string // Relative path from rootDir (for display)
}

export interface EnsureOptions {
  dev?: boolean
  manager?: 'npm' | 'pnpm' | 'yarn'
  silent?: boolean
}

// ==================== Runner Types ====================

export interface TsxRunnerOptions {
  watch?: boolean
  tsconfigPath?: string
  autoInstall?: boolean
  debug?: boolean
}

// ==================== Cache Types ====================

export interface FileCache {
  files: FileInfo[]
  timestamp: number
  rootDir: string
}
