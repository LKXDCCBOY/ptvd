# PTVD - FFmpeg 動画プロセッサー

> **言語 / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

FFmpeg.wasm をベースにしたブラウザ完結型の動画処理ツールです。サーバーの計算リソースは不要で、すべての動画処理はローカルで完結します。

## 主な機能

- **完全フロントエンド** — FFmpeg.wasm により、すべての動画処理はブラウザ内で完結。バックエンドサーバー不要。
- **複数ファイル結合** — 複数の動画ファイルをアップロードし、concat filter コマンドを自動生成。入力数に応じてインテリジェントに調整。
- **101 個のプリセット** — 編集、フィルター、音声、ウォーターマーク、字幕、高度なエフェクトの 6 カテゴリ。
- **コマンドセグメント解析** — コマンドを選択すると、各パラメーターの意味と編集可能な部分が表示されます。
- **多言語サポート** — 中国語、英語、日本語、ロシア語、ドイツ語、フランス語に対応。
- **スマート CDN 読み込み** — 初回アクセス時に CDN から FFmpeg コアファイルをダウンロード、以降は IndexedDB キャッシュから読み込み。
- **クロスオリジン分離** — COOP/COEP ヘッダーを自動設定し、SharedArrayBuffer をサポート。
- **コマンドセーフティフィルター** — 危険なコマンド（ファイル削除、ネットワークリクエスト等）を自動検出・ブロック。

## クイックスタート

### 前提条件

- Node.js >= 18
- npm >= 9

### インストールと実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# 本番ビルドのプレビュー
npm run preview
```

開発サーバーはデフォルトで `http://localhost:5173/` で起動します。

## デプロイ

### Cloudflare Pages（推奨）

1. ビルド: `npm run build`
2. `dist/` ディレクトリを Cloudflare Pages にアップロード
3. または Wrangler CLI を使用:

```bash
npx wrangler pages deploy dist --project-name ptvd
```

> **注意:** `functions/middleware.js` が COOP/COEP ヘッダーを自動挿入し、SharedArrayBuffer をサポートします。

### その他の静的ホスティング

サーバーに以下の HTTP レスポンスヘッダーを設定してください:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## 技術スタック

- **フレームワーク:** React 18 + TypeScript
- **ビルドツール:** Vite 5
- **コアエンジン:** FFmpeg.wasm 0.12.6
- **状態管理:** Zustand
- **スタイル:** Tailwind CSS + shadcn/ui
- **デプロイ:** Cloudflare Pages

## ライセンス

MIT License
