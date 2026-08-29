# PTVD - FFmpeg Videoprozessor

> **Sprachen / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

Ein browserbasiertes Videobearbeitungstool auf Basis von FFmpeg.wasm. Die gesamte Verarbeitung erfolgt lokal — keine Serverinfrastruktur erforderlich.

## Funktionen

- **Reines Frontend** — Basierend auf FFmpeg.wasm, gesamte Videobearbeitung im Browser. Kein Backend nötig.
- **Multi-Datei-Verkettung** — Mehrere Videos hochladen, concat filter Befehle automatisch generieren.
- **101 Presets** — 6 Kategorien: Schnitt, Filter, Audio, Wasserzeichen, Untertitel, Effekte.
- **Befehlsanalyse** — Jeder Parameter wird mit Beschreibung und Markierung bearbeitbarer Teile angezeigt.
- **Mehrsprachig** — Chinesisch, Englisch, Japanisch, Russisch, Deutsch, Französisch.
- **Smart CDN** — FFmpeg wird beim ersten Besuch vom CDN geladen, danach aus IndexedDB-Zwischenspeicher.
- **Cross-Origin-Isolation** — Automatische Konfiguration von COOP/COEP für SharedArrayBuffer.
- **Sicherheitsfilter** — Automatische Blockierung gefährlicher Befehle (Dateilöschung, Netzwerkanfragen).

## Schnellstart

### Voraussetzungen

- Node.js >= 18
- npm >= 9

### Installation und Ausführung

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev

# Produktions-Build
npm run build

# Vorschau
npm run preview
```

Dev-Server läuft standardmäßig auf `http://localhost:5173/`.

## HTTP-Header-Konfiguration

`functions/middleware.js` injiziert automatisch folgende Sicherheits-Header für SharedArrayBuffer-Unterstützung:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Bei Verwendung anderer statischer Hosts stellen Sie sicher, dass der Server die obigen HTTP-Response-Header setzt.

## Tech-Stack

- **Framework:** React 18 + TypeScript
- **Build-Tool:** Vite 5
- **Engine:** FFmpeg.wasm 0.12.6
- **State-Management:** Zustand
- **Styling:** Tailwind CSS + shadcn/ui
- **Bereitstellung:** Cloudflare Pages

## Lizenz

GNU General Public License v3.0
