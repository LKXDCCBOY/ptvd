## 1. 架构设计

```mermaid
flowchart TD
    subgraph 前端应用
        direction TB
        A[用户界面层] --> B[状态管理层 - Zustand]
        B --> C[FFmpeg 服务层]
        C --> D[文件系统层 - 浏览器 FS]
    end
    
    subgraph FFmpeg.wasm 引擎
        C --> E[@ffmpeg/ffmpeg]
        E --> F[WebAssembly 运行时]
    end
    
    subgraph 浏览器 API
        D --> G[File API]
        C --> H[SharedArrayBuffer / WASM]
    end
```

## 2. 技术说明

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS 3
- **状态管理**: Zustand
- **核心引擎**: @ffmpeg/ffmpeg (FFmpeg.wasm 0.12+)
- **图标库**: lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 主执行页面，包含所有功能模块 |

## 4. 核心模块设计

### 4.1 FFmpeg 服务层

```typescript
// ffmpegService.ts 核心功能
- initFFmpeg(): 初始化 FFmpeg.wasm 实例
- writeFile(file): 将文件写入虚拟文件系统
- executeCommand(cmd): 执行 FFmpeg 命令
- readFile(filename): 从虚拟文件系统读取输出文件
- cleanup(): 清理虚拟文件系统
```

### 4.2 状态管理

```typescript
// useFFmpegStore.ts 状态
- ffmpegInstance: FFmpeg 实例
- files: 已上传的文件列表
- command: 当前命令
- logs: 执行日志
- isExecuting: 是否正在执行
- progress: 执行进度
- outputs: 输出文件列表
- history: 历史命令记录
```

## 5. 项目结构

```
src/
├── components/
│   ├── FileUploader.tsx      # 文件上传组件
│   ├── CommandEditor.tsx     # 命令编辑器
│   ├── LogPanel.tsx          # 日志面板
│   ├── OutputPanel.tsx       # 输出文件面板
│   ├── PresetTemplates.tsx  # 预设模板
│   ├── HistoryPanel.tsx      # 历史记录
│   └── ProgressBar.tsx       # 进度条
├── hooks/
│   └── useFFmpeg.ts          # FFmpeg 操作 hook
├── store/
│   └── ffmpegStore.ts        # 全局状态管理
├── services/
│   └── ffmpegService.ts      # FFmpeg.wasm 封装
├── data/
│   └── presets.ts            # 预设命令模板
├── types/
│   └── index.ts              # 类型定义
├── utils/
│   └── commandBuilder.ts     # 命令构建工具
├── App.tsx
└── main.tsx
```

## 6. 预设命令模板

```typescript
// 常用 FFmpeg 命令预设
1. 视频转 MP4: ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4
2. 提取音频: ffmpeg -i input.mp4 -vn -acodec libmp3lame output.mp3
3. 视频压缩: ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium output.mp4
4. 分辨率缩放: ffmpeg -i input.mp4 -s 1920x1080 output.mp4
5. 裁剪片段: ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 output.mp4
6. 添加水印: ffmpeg -i input.mp4 -i logo.png -filter_complex overlay=10:10 output.mp4
7. 格式转换: ffmpeg -i input.mp4 output.webm
8. 提取帧: ffmpeg -i input.mp4 -vf "fps=1" frame_%03d.png
```

## 7. 注意事项

- FFmpeg.wasm 需要在支持 SharedArrayBuffer 的浏览器中运行
- 需要配置 CSP 头: `Cross-Origin-Opener-Policy` 和 `Cross-Origin-Embedder-Policy`
- 大文件处理受浏览器内存限制
- 首次加载 FFmpeg.wasm 约 30-50MB
