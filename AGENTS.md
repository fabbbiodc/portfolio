# AGENTS.md — Portfolio

**Stack:** Astro 6.x · Tailwind CSS v4 · Three.js · postprocessing

Tailwind v4 config is CSS-based via `@theme` in `src/styles/global.css` (no `tailwind.config.*`). Vite plugin `@tailwindcss/vite` in `astro.config.mjs`.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server (hosted on network, `0.0.0.0`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run astro -- --help` | Astro CLI |

No test, lint, or typecheck scripts are configured.

## Architecture

Single-page portfolio at `src/pages/index.astro`. Layout (`src/layouts/Layout.astro`) imports `global.css` and wraps a `<slot />`. Only page is `/`. No content collections, no `src/utils/`.

- **3D scene** — `HeroAnimation` class in `src/scripts/heroAnimation.ts` drives `canvas#hero-animation`. Three.js + postprocessing effects: SelectiveBloom, Pixelation, Scanline, Glitch. Uses `/models/eye.glb`, `/models/monitor.glb`, `/models/bunker.hdr`.
  - **Loading flow:** Assets load → loading bar fills → "start" button appears → user clicks → `DeviceOrientationEvent.requestPermission()` on iOS → page content unhidden + animation starts.
- **Draggable windows** — `DragContainer.astro` + `Titlebar.astro` + `src/scripts/draggable.ts`. Position via `transform: translate()`. State persisted to `localStorage`. Singleton `DraggableWindowManager` with `openWindow(id)`. Windows opened via `[data-action="open-window"][data-target="{id}"]`. Supports `positionStrategy="home"|"child"` with `parentId` for cascading layouts.
- **TextType** — `TextType.astro` serializes config to `data-*` attributes; `src/scripts/textType.ts` reads them. All wiring through the DOM.
- **Button** — `Button.astro` auto-prepends `>` via `::before` pseudo-element.
- **Custom cursors** — `public/cursors/` has 2x pixel-art PNGs. Defined as CSS custom properties (`--cursor-default`, `--cursor-pointer`, `--cursor-grab`, `--cursor-grabbing`) in `src/styles/global.css` using `image-set(...)`.
- **Font** — `"ZxSpectrum"` loaded from `/fonts/zx_spectrum-7.ttf` (regular) and `/fonts/zx_spectrum-7_bold.ttf` (bold) in `global.css`.

## Important Notes

- `BUILD_DIARY.md`, `NOTES.md`, `DRAGWINDOW.md`, `PROJECTION.md` are **stale** — do not trust for current architecture.
- Dev toolbar disabled (`devToolbar.enabled: false`). VSCode extension: `astro-build.astro-vscode`.
- TypeScript: `astro/tsconfigs/strict`. Prettier: `prettier-plugin-astro` with overrides for `*.astro`.
- Node engine: `>=22.12.0`.
- Generated dirs (gitignored): `.astro/` (Astro types), `dist/` (build output).
- **Unused artifacts** (not referenced by source): `public/models/lowpoly_eye_01.glb`, `lowpoly_eye_02.glb`, `monitor2.glb`, `public/assets/clouds.gif`.
