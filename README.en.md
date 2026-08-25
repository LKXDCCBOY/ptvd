# PTVD - FFmpeg Video Processor

> **Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

A browser-based video processing tool powered by FFmpeg.wasm. All video processing happens locally — no server compute required.

## Features

- **Pure Frontend** — Powered by FFmpeg.wasm, all video processing runs in the browser. No backend server needed.
- **Multi-File Concatenation** — Upload multiple videos, auto-generate concat filter commands with intelligent input count matching.
- **101 Preset Commands** — 6 categories: Editing, Filters, Audio, Watermarks, Subtitles, Advanced Effects.
- **Command Segment Parsing** — Click any command to see per-segment descriptions and editable parts highlighted.
- **Multilingual** — Supports Chinese, English, Japanese, Russian, German, French.
- **Smart CDN Loading** — FFmpeg core files downloaded from CDN on first visit, then loaded from IndexedDB cache.
- **Cross-Origin Isolation** — Auto-configures COOP/COEP headers for SharedArrayBuffer support.
- **Command Safety Filter** — Built-in detection blocks dangerous commands (file deletion, network requests, etc.).

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at `http://localhost:5173/` by default.

## Deployment

### Cloudflare Pages (Recommended)

1. Build: `npm run build`
2. Upload the `dist/` directory to Cloudflare Pages
3. Or use Wrangler CLI:

```bash
npx wrangler pages deploy dist --project-name ptvd
```

> **Note:** `functions/middleware.js` automatically injects COOP/COEP security headers for SharedArrayBuffer support.

### Other Static Hosts

Ensure your server sets these HTTP response headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### Custom Domain on Cloudflare

If using a custom domain:
1. Disable **Rocket Loader** (Speed -> Optimization)
2. Disable **Auto Minify** (Speed -> Optimization)
3. Ensure `functions/middleware.js` is deployed

## Project Structure

```
ptvd/
├── src/
│   ├── components/           # React components
│   ├── data/
│   │   ├── presets.ts           # 101 FFmpeg preset commands
│   │   └── presetTranslations.ts # Preset translations
│   ├── services/
│   │   └── ffmpegService.ts      # FFmpeg load & execute service
│   ├── store/
│   │   └── ffmpegStore.ts        # State management
│   ├── utils/
│   │   ├── helpers.ts            # Utility (placeholder parsing, concat rewrite)
│   │   ├── commandSegments.ts     # Command segment parsing & i18n
│   │   └── security.ts           # Command safety filter
│   ├── i18n/
│   │   └── translations.ts       # UI translations
│   └── types/
│       └── index.ts              # TypeScript types
├── functions/
│   └── middleware.js             # Cloudflare Pages Function (COOP/COEP)
├── public/
│   ├── _headers                 # HTTP security headers
│   └── _redirects               # SPA route redirects
├── scripts/
│   └── copy-worker-deps.cjs     # Build post-processing
└── vite.config.ts               # Vite config (CDN proxy, headers)
```

## Multi-File Concatenation

### Upload Multiple Files

1. Drag multiple video files into the upload area
2. Files are numbered sequentially: `input_000.mp4`, `input_001.mp4`, `input_002.mp4`...

### Concatenation Modes

| Mode | Use Case | Command Example |
|------|----------|-----------------|
| **concat filter (Recommended)** | Different resolution/codec videos | `ffmpeg -i input -i input1 -filter_complex "concat=n=2:v=1:a=1[outv][outa]" ...` |
| **concat demuxer** | Same codec segments | `ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4` |

The system automatically:
- Rewrites `concat=n=X` to match uploaded file count
- Generates `[0:v][0:a][1:v][1:a]...` input references
- Appends missing `-i inputN` declarations
- Adds `-map "[outv]" -map "[outa]"` output mapping
- Generates `filelist.txt` (demuxer mode)

## Multilingual Support

| Language | Code | Status |
|----------|------|--------|
| 简体中文 | `zh` | Complete |
| English | `en` | Complete |
| 日本語 | `ja` | Complete |
| Русский | `ru` | Complete |
| Deutsch | `de` | Complete |
| Français | `fr` | Complete |

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Core Engine:** FFmpeg.wasm 0.12.6
- **State Management:** Zustand
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Cloudflare Pages

## License

GNU General Public License v3.0

## Contributing

Issues and Pull Requests welcome.
