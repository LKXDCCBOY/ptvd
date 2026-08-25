# PTVD - FFmpeg 视频处理器

> **多语言 / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

一个基于 FFmpeg.wasm 的纯浏览器端视频处理工具，无需服务器算力，所有视频处理均在本地完成。

## ✨ 功能特性

- **纯前端运行** — 基于 FFmpeg.wasm，所有视频处理在浏览器中完成，无需后端服务器
- **多文件拼接** — 支持上传多个视频文件，自动生成 concat filter 命令，智能匹配输入数量
- **101 个预设指令** — 涵盖剪辑、滤镜、音频、水印、字幕、高级特效等 6 大类别
- **命令片段解析** — 选中指令后，逐段展示每个参数的含义，标注可修改部分
- **多语言支持** — 支持简体中文、英语、日本語、Русский、Deutsch、Français 6 种语言
- **智能 CDN 加载** — 首次访问通过 CDN 下载 FFmpeg 核心文件，后续从 IndexedDB 缓存加载
- **跨域隔离** — 自动配置 COOP/COEP 安全头，确保 SharedArrayBuffer 正常运行
- **安全命令过滤** — 内置安全检测，拦截危险命令（如删除文件、网络请求等）

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器默认运行在 `http://localhost:5173/`。

## 📦 部署

### Cloudflare Pages（推荐）

1. 构建生产版本：`npm run build`
2. 将 `dist/` 目录上传到 Cloudflare Pages
3. 或使用 Wrangler CLI：

```bash
npx wrangler pages deploy dist --project-name ptvd
```

> **注意：** `functions/middleware.js` 会自动注入 COOP/COEP 安全头，确保 FFmpeg.wasm 的 SharedArrayBuffer 正常运行。

### 其他静态托管

确保服务器配置以下 HTTP 响应头：

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### 自定义域名注意事项

如果在 Cloudflare 上使用自定义域名：
1. 关闭 **Rocket Loader**（Speed → Optimization）
2. 关闭 **Auto Minify**（Speed → Optimization）
3. 确保 **`functions/middleware.js`** 正常部署

## 🏗 项目结构

```
ptvd/
├── src/
│   ├── components/          # React 组件
│   │   ├── CommandEditor.tsx       # 命令编辑器（片段解析、简化切换）
│   │   ├── PresetTemplates.tsx     # 预设模板列表（徽章、提示）
│   │   ├── FileUploader.tsx        # 文件上传组件
│   │   └── ...
│   ├── data/
│   │   ├── presets.ts              # 101 个 FFmpeg 预设指令
│   │   └── presetTranslations.ts   # 预设多语言翻译
│   ├── services/
│   │   └── ffmpegService.ts        # FFmpeg 加载与执行核心服务
│   ├── store/
│   │   └── ffmpegStore.ts          # 状态管理（多输入、concat 逻辑）
│   ├── utils/
│   │   ├── helpers.ts              # 工具函数（占位符解析、concat 改写）
│   │   ├── commandSegments.ts       # 命令片段解析与多语言描述
│   │   └── security.ts             # 命令安全过滤
│   ├── i18n/
│   │   └── translations.ts         # 界面多语言翻译
│   └── types/
│       └── index.ts                # TypeScript 类型定义
├── functions/
│   └── middleware.js               # Cloudflare Pages Function（COOP/COEP）
├── public/
│   ├── _headers                     # HTTP 安全头配置
│   └── _redirects                   # SPA 路由重定向
├── scripts/
│   └── copy-worker-deps.cjs         # 构建后处理脚本
└── vite.config.ts                   # Vite 配置（CDN 代理、安全头）
```

## 🎯 多文件拼接使用指南

### 上传多个文件

1. 将多个视频文件拖拽到上传区域
2. 文件按上传顺序编号：`input_000.mp4`、`input_001.mp4`、`input_002.mp4`...

### 拼接模式

| 模式 | 适用场景 | 命令示例 |
|------|---------|---------|
| **concat filter（推荐）** | 不同分辨率/编码的视频 | `ffmpeg -i input -i input1 -filter_complex "concat=n=2:v=1:a=1[outv][outa]" ...` |
| **concat demuxer** | 相同编码参数的分段 | `ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4` |

系统会根据上传文件数量自动：
- 重写 `concat=n=X` 中的 `X` 为实际上传数
- 生成 `[0:v][0:a][1:v][1:a]...` 输入引用
- 追加缺失的 `-i inputN` 声明
- 补齐 `-map "[outv]" -map "[outa]"` 输出映射
- 生成 `filelist.txt`（demuxer 模式）

## 🌐 多语言支持

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | `zh` | ✅ 完整 |
| English | `en` | ✅ 完整 |
| 日本語 | `ja` | ✅ 完整 |
| Русский | `ru` | ✅ 完整 |
| Deutsch | `de` | ✅ 完整 |
| Français | `fr` | ✅ 完整 |

## 🔧 技术栈

- **前端框架：** React 18 + TypeScript
- **构建工具：** Vite 5
- **核心引擎：** FFmpeg.wasm 0.12.6
- **状态管理：** Zustand
- **样式：** Tailwind CSS + shadcn/ui
- **部署平台：** Cloudflare Pages

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 或 Pull Request。
