import type { PlayOptions } from './types'

import process from 'node:process'

// Reserved parameter names that Node.js will consume
export const NODE_RESERVED_NAMES = ['watch', 'version'] as const

export type NodeReservedName = (typeof NODE_RESERVED_NAMES)[number]

// Cache configuration
export const FILE_CACHE_TTL = 5000 // 5 seconds

// Directories to skip during file scanning
export const SKIP_DIRECTORIES = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '.next',
  '.nuxt',
  '.output'
] as const

const { PLAY_TSX_ROOT_DIR, PLAY_TSX_TSCONFIG, PLAY_TSX_AUTO_INSTALL } =
  process.env

// Default configuration (used when running as CLI)
export const DEFAULT_PLAY_OPTIONS: PlayOptions = {
  name: 'play-tsx',
  version: '1.3.0',
  description: 'Enhanced TypeScript playground powered by tsx',
  flags: {
    version: {
      type: Boolean,
      alias: 'v',
      description: 'Show version number'
    },
    help: {
      type: Boolean,
      alias: 'h',
      description: 'Show help information'
    },
    file: {
      type: String,
      alias: 'f',
      default: 'index',
      description: 'File to run',
      parameter: '<path>'
    },
    list: {
      type: Boolean,
      alias: 'l',
      default: false,
      description: 'List available files'
    },
    watch: {
      type: Boolean,
      alias: 'w',
      default: false,
      description: 'Enable watch mode'
    },
    tsconfig: {
      type: String,
      alias: 't',
      description: 'Path to tsconfig.json',
      parameter: '<path>'
    },
    debug: {
      type: Boolean,
      alias: 'd',
      default: false,
      description: 'Enable debug output'
    }
  },
  rootDir: PLAY_TSX_ROOT_DIR || './playground',
  tsconfig: PLAY_TSX_TSCONFIG || './tsconfig.json',
  autoInstall: PLAY_TSX_AUTO_INSTALL ? PLAY_TSX_AUTO_INSTALL === 'true' : true
}
