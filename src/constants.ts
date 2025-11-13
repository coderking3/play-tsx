/* constants.ts */

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
