# play-tsx

> Enhanced TypeScript playground powered by [tsx](https://github.com/esbuild-kit/tsx) - Run .ts files with smart defaults, watch mode, and zero configuration

[![npm version](https://img.shields.io/npm/v/@king-3/play-tsx.svg)](https://www.npmjs.com/package/@king-3/play-tsx)
[![npm downloads](https://img.shields.io/npm/dm/@king-3/play-tsx.svg)](https://www.npmjs.com/package/@king-3/play-tsx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@king-3/play-tsx.svg)](https://bundlephobia.com/package/@king-3/play-tsx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## ✨ Features

- 🚀 **Zero Config** - Works out of the box with sensible defaults
- 👀 **Watch Mode** - Automatically reload on file changes
- 📁 **Smart File Management** - Organize files in a playground directory
- 🔧 **TypeScript Config** - Custom tsconfig.json support
- 📋 **File Listing** - View all available playground files
- 🐛 **Debug Mode** - Detailed execution information
- 🌍 **Environment Variables** - Configure via ENV vars
- 🔄 **Auto Install** - Automatically install tsx if missing

## 📦 Installation

```bash
# npm
npm install -D @king-3/play-tsx

# pnpm
pnpm add -D @king-3/play-tsx

# yarn
yarn add -D @king-3/play-tsx
```

## 🚀 Quick Start

```bash
# Run default file (playground/index.ts)
pnpm play

# Run specific file
pnpm play test.ts
pnpm play -f other

# Enable watch mode
pnpm play --watch test.ts
pnpm play -w -f other

# List available files
pnpm play --list
pnpm play -l
```

## 📖 Usage

### Basic Commands

```bash
# Run file
play [options] [file]

# Show help
play --help
play -h

# Show version
play --version
play -v
```

### Options

| Option              | Alias | Description           | Default     |
| ------------------- | ----- | --------------------- | ----------- |
| `--file <path>`     | `-f`  | File to run           | `index`     |
| `--watch`           | `-w`  | Enable watch mode     | `false`     |
| `--list`            | `-l`  | List available files  | `false`     |
| `--tsconfig <path>` | `-t`  | Path to tsconfig.json | Auto-detect |
| `--debug`           | `-d`  | Enable debug output   | `false`     |
| `--version`         | `-v`  | Show version number   | -           |
| `--help`            | `-h`  | Show help information | -           |

### Examples

```bash
# Basic usage
play                          # Run playground/index.ts
play file.ts                  # Run playground/file.ts
play -f other                 # Run playground/other.ts

# Watch mode
play --watch file.ts          # Enable watch mode
play -w -f other              # Watch + specify file

# Custom tsconfig
play --tsconfig ./tsconfig.dev.json file.ts
play -t ./tsconfig.dev.json -w file.ts

# Debug mode
play --debug file.ts          # Show debug information
play -d -w -f other           # Debug + watch + file

# List files
play --list                   # List all available .ts files
play -l                       # Short form
```

## ⚙️ Configuration

### Programmatic Usage

```typescript
import { play } from 'play-tsx'

play({
  name: 'play-tsx',
  version: '1.0.0',
  description: 'Enhanced TypeScript playground',
  rootDir: './playground', // Root directory for files
  tsconfig: './tsconfig.json', // Default tsconfig path
  autoInstall: true, // Auto-install tsx if missing
  flags: {
    // Custom flags
    myFlag: {
      type: Boolean,
      alias: 'm',
      default: false,
      description: 'My custom flag'
    }
  }
})
```

### Environment Variables

```bash
# Set root directory
PLAY_TSX_ROOT_DIR=./src pnpm play

# Set tsconfig path
PLAY_TSX_TSCONFIG=./tsconfig.dev.json pnpm play

# Enable auto-install
PLAY_TSX_AUTO_INSTALL=true pnpm play
```

### Package.json Scripts

```json
{
  "scripts": {
    "play": "play",
    "play:watch": "play --watch",
    "play:debug": "play --debug"
  }
}
```

## 📁 Project Structure

```
your-project/
├── playground/           # Default playground directory
│   ├── index.ts         # Default entry file
│   ├── test.ts
│   └── examples/
│       └── demo.ts
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## 🔧 Priority Order

The tool resolves configuration in the following priority:

1. Command line arguments (highest)
2. Environment variables
3. PlayOptions configuration
4. Auto-detection (lowest)

### Tsconfig Resolution

1. `--tsconfig` command line argument
2. `PLAY_TSX_TSCONFIG` environment variable
3. `PlayOptions.tsconfig` configuration
4. `tsconfig.json` in project root
5. tsx default configuration

## 📄 License

MIT License © 2024 [king3](https://github.com/coderking3)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

- GitHub: [@coderking3](https://github.com/coderking3)
- Issue Feedback: [GitHub Issues](https://github.com/coderking3/play-tsx/issues)

## 🙏 Credits

Built on top of the amazing [tsx](https://github.com/esbuild-kit/tsx) by [@privatenumber](https://github.com/privatenumber)
