# PTVD - Processeur Vidéo FFmpeg

> **Langues / Languages:** [简体中文](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [Deutsch](README.de.md) | [Français](README.fr.md)

Un outil de traitement vidéo dans le navigateur basé sur FFmpeg.wasm. Tout le traitement se fait localement — aucune infrastructure serveur requise.

## Fonctionnalités

- **Frontend pur** — Basé sur FFmpeg.wasm, tout le traitement vidéo s'exécute dans le navigateur. Pas de backend.
- **Concaténation multi-fichiers** — Téléchargez plusieurs vidéos, génération automatique des commandes concat filter.
- **101 préréglages** — 6 catégories : montage, filtres, audio, filigranes, sous-titres, effets.
- **Analyse de commande** — Chaque paramètre affiche sa description et les parties modifiables.
- **Multilingue** — Chinois, anglais, japonais, russe, allemand, français.
- **CDN intelligent** — FFmpeg téléchargé depuis le CDN au premier accès, puis depuis le cache IndexedDB.
- **Isolation Cross-Origin** — Configuration automatique de COOP/COEP pour SharedArrayBuffer.
- **Filtre de sécurité** — Blocage automatique des commandes dangereuses (suppression de fichiers, requêtes réseau).

## Démarrage rapide

### Prérequis

- Node.js >= 18
- npm >= 9

### Installation et exécution

```bash
# Installer les dépendances
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build

# Aperçu
npm run preview
```

Le serveur de développement démarre sur `http://localhost:5173/` par défaut.

## Configuration des en-têtes HTTP

`functions/middleware.js` injecte automatiquement les en-têtes de sécurité suivants pour le support de SharedArrayBuffer :

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Si vous utilisez d'autres hébergements statiques, assurez-vous que le serveur définit les en-têtes HTTP ci-dessus.

## Stack technique

- **Framework :** React 18 + TypeScript
- **Outil de build :** Vite 5
- **Moteur :** FFmpeg.wasm 0.12.6
- **Gestion d'état :** Zustand
- **Styles :** Tailwind CSS + shadcn/ui
- **Déploiement :** Cloudflare Pages

## Licence

GNU General Public License v3.0
