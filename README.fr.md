# PTVD - Processeur Vidéo FFmpeg

> **Langues / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

Un outil de traitement vidéo dans le navigateur basé sur FFmpeg.wasm. Tout le traitement se fait localement — aucune infrastructure serveur requise.

## ✨ Fonctionnalités

- **Frontend pur** — Basé sur FFmpeg.wasm, tout le traitement vidéo s'exécute dans le navigateur. Pas de backend.
- **Concaténation multi-fichiers** — Téléchargez plusieurs vidéos, génération automatique des commandes concat filter.
- **101 préréglages** — 6 catégories : montage, filtres, audio, filigranes, sous-titres, effets.
- **Analyse de commande** — Chaque paramètre affiche sa description et les parties modifiables.
- **Multilingue** — Chinois, anglais, japonais, russe, allemand, français.
- **CDN intelligent** — FFmpeg téléchargé depuis le CDN au premier accès, puis depuis le cache IndexedDB.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu
```

## 🔧 Stack technique

React 18 + TypeScript | Vite 5 | FFmpeg.wasm 0.12.6 | Zustand | Tailwind CSS | Cloudflare Pages

## 📄 Licence

MIT License
