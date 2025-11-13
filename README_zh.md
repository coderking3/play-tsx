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
pnpm play test.ts
pnpm play -f other

# 启用监听模式
pnpm play --watch test.ts
pnpm play -w -f other

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
play file.ts                  # 运行 playground/file.ts
play -f other                 # 运行 playground/other.ts

# 监听模式
play --watch file.ts          # 启用监听模式
play -w -f other              # 监听 + 指定文件

# 自定义 tsconfig
play --tsconfig ./tsconfig.dev.json file.ts
play -t ./tsconfig.dev.json -w file.ts

# 调试模式
play --debug file.ts          # 显示调试信息
play -d -w -f other           # 调试 + 监听 + 文件

# 列出文件
play --list                   # 列出所有可用的 .ts 文件
play -l                       # 简写形式
```

## ⚙️ 配置

### 编程方式使用

```typescript
import { play } from '@king-3/play-tsx'

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

## 💡 使用场景

### 快速原型开发

```bash
# 创建临时测试文件并立即运行
echo 'console.log("Hello World")' > playground/hello.ts
play hello
```

### API 测试

```typescript
// playground/api-test.ts
const response = await fetch('https://api.example.com/data')
const data = await response.json()
console.log(data)
```

```bash
play api-test
```

### 算法练习

```typescript
// playground/algorithm.ts
function quickSort(arr: number[]): number[] {
  // 你的实现
}

console.log(quickSort([3, 1, 4, 1, 5, 9, 2, 6]))
```

```bash
play --watch algorithm  # 保存时自动重新运行
```

### 学习新特性

```typescript
// playground/learn/decorators.ts
function log(target: any, key: string) {
  console.log(`${key} was called`)
}

class Example {
  @log
  method() {}
}
```

```bash
play learn/decorators
```

## 🎯 最佳实践

### 1. 组织你的 Playground

```
playground/
├── index.ts           # 主入口
├── experiments/       # 实验性代码
│   ├── new-api.ts
│   └── performance.ts
├── learn/            # 学习笔记
│   ├── async.ts
│   └── generics.ts
└── tests/            # 快速测试
    └── utils.ts
```

### 2. 使用环境变量配置

```bash
# .env.local
PLAY_TSX_ROOT_DIR=./src/playground
PLAY_TSX_TSCONFIG=./tsconfig.playground.json
```

### 3. 添加便捷脚本

```json
{
  "scripts": {
    "play": "play",
    "play:watch": "play --watch",
    "play:debug": "play --debug",
    "play:list": "play --list"
  }
}
```

### 4. 自定义 TypeScript 配置

```json
// tsconfig.playground.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": false, // 放宽检查以便快速实验
    "noUnusedLocals": false, // 允许未使用的变量
    "noUnusedParameters": false
  },
  "include": ["playground/**/*"]
}
```

## 🔍 常见问题

### Q: 如何运行子目录中的文件？

```bash
# 方式 1: 使用相对路径
play experiments/new-api

# 方式 2: 使用 -f 标志
play -f experiments/new-api
```

### Q: 如何更改默认目录？

```bash
# 方式 1: 环境变量
PLAY_TSX_ROOT_DIR=./src pnpm play

# 方式 2: 编程方式配置
play({ rootDir: './src' })
```

### Q: 监听模式不工作？

确保你使用了正确的标志：

```bash
play --watch test.ts  # ✅ 正确
play -w test.ts       # ✅ 正确
play test.ts --watch  # ✅ 也可以
```

### Q: 如何使用自定义 tsconfig？

```bash
# 命令行指定
play --tsconfig ./tsconfig.dev.json test.ts

# 或使用环境变量
PLAY_TSX_TSCONFIG=./tsconfig.dev.json play test.ts
```

## 🚀 高级用法

### 与其他工具结合

```bash
# 与 nodemon 结合（外部监听）
nodemon --exec "play test" --watch playground

# 与 concurrently 结合（并行运行）
concurrently "play api" "play worker"

# 管道输出
play test | grep "Error"
```

### 调试技巧

```bash
# 启用详细输出
play --debug test.ts

# 结合 Node.js 调试器
node --inspect $(which play) test.ts
```

### CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run play test
```

## 🤝 贡献

欢迎贡献、问题反馈和功能请求！

随时查看 [issues 页面](https://github.com/coderking3/play-tsx/issues)。

### 开发指南

```bash
# 克隆仓库
git clone https://github.com/coderking3/play-tsx.git
cd play-tsx

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 📄 许可证

MIT License © 2024 [king3](https://github.com/coderking3)

## 🤝 贡献

欢迎提交贡献、问题和功能请求！

- GitHub: [@coderking3](https://github.com/coderking3)
- 问题反馈：[GitHub Issues](https://github.com/coderking3/play-tsx/issues)

## 🙏 致谢

基于 [@privatenumber](https://github.com/privatenumber) 的优秀项目 [tsx](https://github.com/esbuild-kit/tsx) 构建
