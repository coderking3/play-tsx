# play-tsx

> 基于 [tsx](https://github.com/esbuild-kit/tsx) 增强的 TypeScript 游乐场 - 使用智能默认配置、监听模式和零配置运行 .ts 文件

[![npm version](https://img.shields.io/npm/v/@king-3/play-tsx.svg)](https://www.npmjs.com/package/@king-3/play-tsx)
[![npm downloads](https://img.shields.io/npm/dm/@king-3/play-tsx.svg)](https://www.npmjs.com/package/@king-3/play-tsx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@king-3/play-tsx.svg)](https://bundlephobia.com/package/@king-3/play-tsx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## ✨ 特性

- 🚀 **零配置** - 开箱即用，具有合理的默认配置
- 👀 **监听模式** - 文件更改时自动重新加载
- 📁 **智能文件管理** - 在 playground 目录中组织文件
- 🔧 **TypeScript 配置** - 支持自定义 tsconfig.json
- 📋 **文件列表** - 查看所有可用的 playground 文件
- 🐛 **调试模式** - 详细的执行信息
- 🌍 **环境变量** - 通过环境变量配置
- 🔄 **自动安装** - 缺少 tsx 时自动安装

## 📦 安装

```bash
# npm
npm install -D @king-3/play-tsx

# pnpm
pnpm add -D @king-3/play-tsx

# yarn
yarn add -D @king-3/play-tsx
```

## 🚀 快速开始

```bash
# 运行默认文件 (playground/index.ts)
pnpm play

# 运行指定文件
play -f other            # 运行 playground/other.ts

# 启用监听模式
pnpm play --watch test   # 运行 playground/test.ts 并监听
pnpm play -w -f other    # 运行 playground/other.ts 并监听

# 列出可用文件
pnpm play --list
pnpm play -l
```

## 📖 使用方法

### 基本命令

```bash
# 运行文件
play [选项] [文件]

# 显示帮助
play --help
play -h

# 显示版本
play --version
play -v
```

### 选项

| 选项                | 别名 | 描述                 | 默认值   |
| ------------------- | ---- | -------------------- | -------- |
| `--file <path>`     | `-f` | 要运行的文件         | `index`  |
| `--watch`           | `-w` | 启用监听模式         | `false`  |
| `--list`            | `-l` | 列出可用文件         | `false`  |
| `--tsconfig <path>` | `-t` | tsconfig.json 的路径 | 自动检测 |
| `--debug`           | `-d` | 启用调试输出         | `false`  |
| `--version`         | `-v` | 显示版本号           | -        |
| `--help`            | `-h` | 显示帮助信息         | -        |

### 示例

```bash
# 基本用法
play                          # 运行 playground/index.ts
play -f other                 # 运行 playground/other.ts

# 监听模式
play --watch -f file          # 启用监听模式
play -w -f other              # 监听 + 指定文件

# 自定义 tsconfig
play --tsconfig ./tsconfig.dev.json -f file
play -t ./tsconfig.dev.json -w -f file

# 调试模式
play --debug -f file          # 显示调试信息
play -d -w -f other           # 调试 + 监听 + 文件

# 列出文件
play --list                   # 列出所有可用的 .ts 文件
play -l                       # 简写形式
```

## ⚙️ 配置

### 编程方式使用

```typescript
import { play } from 'play-tsx'

play({
  name: 'play-tsx',
  version: '1.0.0',
  description: '增强的 TypeScript 游乐场',
  rootDir: './playground', // 文件根目录
  tsconfig: './tsconfig.json', // 默认 tsconfig 路径
  autoInstall: true, // 缺少 tsx 时自动安装
  flags: {
    // 自定义标志
    myFlag: {
      type: Boolean,
      alias: 'm',
      default: false,
      description: '我的自定义标志'
    }
  }
})
```

### 环境变量

```bash
# 设置根目录
PLAY_TSX_ROOT_DIR=./src pnpm play

# 设置 tsconfig 路径
PLAY_TSX_TSCONFIG=./tsconfig.dev.json pnpm play

# 启用自动安装
PLAY_TSX_AUTO_INSTALL=true pnpm play
```

### Package.json 脚本

```json
{
  "scripts": {
    "play": "play",
    "play:watch": "play --watch",
    "play:debug": "play --debug"
  }
}
```

## 📁 项目结构

```
your-project/
├── playground/           # 默认 playground 目录
│   ├── index.ts         # 默认入口文件
│   ├── test.ts
│   └── examples/
│       └── demo.ts
├── tsconfig.json        # TypeScript 配置
└── package.json
```

## 🔧 优先级顺序

工具按以下优先级解析配置：

1. 命令行参数（最高优先级）
2. 环境变量
3. PlayOptions 配置
4. 自动检测（最低优先级）

### Tsconfig 解析顺序

1. `--tsconfig` 命令行参数
2. `PLAY_TSX_TSCONFIG` 环境变量
3. `PlayOptions.tsconfig` 配置
4. 项目根目录中的 `tsconfig.json`
5. tsx 默认配置

## 📄 许可证

MIT License © 2025 [king3](https://github.com/coderking3)

## 🤝 贡献

欢迎贡献、问题反馈和功能请求！

- GitHub: [@coderking3](https://github.com/coderking3)
- 问题反馈：[GitHub Issues](https://github.com/coderking3/play-tsx/issues)

## 🙏 致谢

基于 [@privatenumber](https://github.com/privatenumber) 的优秀项目 [tsx](https://github.com/esbuild-kit/tsx) 构建
