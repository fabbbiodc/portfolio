# Fabio Di Cecca — Portfolio

> A retro‑futuristic single‑page portfolio built with Astro, Three.js & Tailwind CSS v4.

![Portfolio screenshot](./screenshot.png)

Live at [fabiodicec.ca](https://fabiodicec.ca)

---

## Overview

This portfolio presents work and identity through a retro OS‑inspired interface. A 3D scene powered by Three.js runs in the background while draggable windows (reminiscent of early desktop environments) contain project showcases, an about‑me section, CV, and more. The visual language draws from ZX Spectrum aesthetics — pixel‑art cursors, a monochrome palette with a single neon accent, and a custom bitmap typeface.

---

## Tech Stack

| Technology | Role |
|---|---|
| **Astro 6.x** | Static site generation — zero‑JS by default, islands architecture |
| **Tailwind CSS v4** | Utility‑first styling via CSS‑based `@theme` (no `tailwind.config.*`) |
| **Three.js** | 3D rendering — GLTF models, HDR environment, real‑time animation |
| **postprocessing** | SelectiveBloom, Pixelation, Scanline, Glitch effects |
| **TypeScript** | Strict mode throughout |
| **ZxSpectrum** | Custom retro bitmap typeface (Freeware license) |

### Key integrations

- **`@tailwindcss/vite`** — Tailwind v4 Vite plugin, configured in `astro.config.mjs`
- **`prettier-plugin-astro`** — Formatting for `.astro` files
- **`heroicons`** — SVG icons in window chrome
- **`marked`** — Markdown → HTML for content files (about‑me, CV, impressum, credits)

---

## Features

- **3D scene** — Mouse‑tracked anatomical eye + CRT monitor model in a HDR‑lit environment, rendered with a pixelation pass and postprocessing effects (bloom, scanlines, glitch).
- **Draggable windows** — Custom implementation with cascading layout (`positionStrategy="home"|"child"`), localStorage persistence, and z‑index stacking. Windows are opened via `[data-action="open-window"]` links.
- **Typewriter effect** — `TextType` component with configurable speed, pause, delete, loop, cursor blink, and variable speed — all wired through DOM data attributes.
- **Custom pixel‑art cursors** — 4 states (default, pointer, grab, grabbing) at 2x resolution, defined as CSS custom properties via `image-set()`.
- **Loading flow** — Assets load → progress bar fills → "start" button appears → `DeviceOrientationEvent.requestPermission()` on iOS → page content unhidden + animation starts.
- **Markdown‑driven content** — About‑me, CV, impressum, and credits loaded from `/public/*.md` files and rendered inline.
- **Project showcase** — Dynamic window content loaded per project, with thumbnails, tags, links, and detailed markdown descriptions.
- **Custom scrollbars** — Retro‑styled scrollbars matching the OS aesthetic (WebKit + Firefox).

---

## Architecture

```
public/
├── cursors/          # Pixel‑art cursor PNGs (2x resolution)
├── fonts/            # ZxSpectrum TTF (regular + bold)
├── models/           # eye.glb, monitor.glb, bunker.hdr
├── projects/         # Project markdown content + thumbnails
├── about-me.md       # About page content
├── cv.md             # CV content
├── credits.md        # Colophon & credits
└── impressum.md      # Legal notice

src/
├── components/       # Astro components (Window, Hero, TextType, Button, etc.)
├── data/             # Project metadata (projects.ts)
├── layouts/          # Layout.astro (HTML shell, imports global.css)
├── pages/            # Single page: index.astro
├── scripts/          # Client‑side TS (heroAnimation, draggable, textType, colors)
└── styles/           # global.css (Tailwind + custom styles), styles.ts (shared classes)
```

---

## Getting Started

```bash
npm install
npm run dev        # Dev server on 0.0.0.0
npm run build      # Static build → dist/
npm run preview    # Preview production build
```

**Node:** `>=22.12.0`

---

## Visuals

> Replace these placeholder images with your own screenshots.

![Hero 3D scene](./images/hero-3d.png)
*3D scene with eye model, CRT monitor, and postprocessing effects.*

![Draggable windows](./images/draggable-windows.png)
*Open windows showing projects and about‑me content.*

![Loading screen](./images/loading-screen.png)
*Asset loading overlay with progress bar and start button.*

![Custom cursor](./images/custom-cursor.png)
*Pixel‑art cursor states — default, pointer, grab, grabbing.*

![Typewriter effect](./images/text-type.gif)
*Animated typewriter text component.*

---

## Credits

- **3D models** — Eye by [assetfactory](https://sketchfab.com/assetfactory), Monitor by [Moomo0802](https://sketchfab.com/thing2x22) — licensed under CC BY 4.0.
- **Font** — ZX Spectrum by [James F. W. Roberts](https://www.dafont.com/zx-spectrum-7.font) — Freeware license.
- Built with [Astro](https://astro.build), [Three.js](https://threejs.org), [postprocessing](https://github.com/vanruesc/postprocessing), and [Tailwind CSS](https://tailwindcss.com).
