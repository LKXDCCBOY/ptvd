# PTVD - FFmpeg Videoprozessor

> **Sprachen / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

Ein browserbasiertes Videobearbeitungstool auf Basis von FFmpeg.wasm. Die gesamte Verarbeitung erfolgt lokal — keine Serverinfrastruktur erforderlich.

## ✨ Funktionen

- **Reines Frontend** — Basierend auf FFmpeg.wasm, gesamte Videobearbeitung im Browser. Kein Backend nötig.
- **Multi-Datei-Verkettung** — Mehrere Videos hochladen, concat filter Befehle automatisch generieren.
- **101 Presets** — 6 Kategorien: Schnitt, Filter, Audio, Wasserzeichen, Untertitel, Effekte.
- **Befehlsanalyse** — Jeder Parameter wird mit Beschreibung und Markierung bearbeitbarer Teile angezeigt.
- **Mehrsprachig** — Chinesisch, Englisch, Japanisch, Russisch, Deutsch, Französisch.
- **Smart CDN** — FFmpeg wird beim ersten Besuch vom CDN geladen, danach aus IndexedDB-Zwischenspeicher.

## 🚀 Schnellstart

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Produktions-Build
npm run preview  # Vorschau
```

## 🔧 Tech-Stack

React 18 + TypeScript | Vite 5 | FFmpeg.wasm 0.12.6 | Zustand | Tailwind CSS | Cloudflare Pages

## 📄 Lizenz

MIT License
