# AGENTS.md — Portfolio

**Stack:** Astro 6.x · Tailwind CSS v4 · Three.js · postprocessing

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server (hosted on network) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run astro -- --help` | Astro CLI (add, check, etc.) |

No test, lint, or typecheck scripts are configured.

## Architecture

Single-page portfolio at `src/pages/index.astro`. Layout (`src/layouts/Layout.astro`) imports `global.css` and wraps a `<slot />`. Only page is `/`.

- **3D scene** — `HeroAnimation` class in `src/scripts/heroAnimation.ts` drives canvas `#hero-animation`. Three.js + postprocessing effects: SelectiveBloom, Pixelation, Scanline, Glitch. Uses `/models/eye.glb`, `/models/monitor.glb`, `/models/bunker.hdr`.
- **Draggable windows** — `DragContainer.astro` + `Titlebar.astro` + `src/scripts/draggable.ts`. Position via `transform: translate()`. State persisted to `localStorage` (`window-{id}-position`, `window-{id}-closed`, `window-z-index-counter`). Exports `manager` singleton (`DraggableWindowManager`) with `openWindow(id)` method that shows the window and bumps its z-index above all others. Windows are opened from buttons with `data-action="open-window"` + `data-target="{id}"` — handled in `Hero.astro` via `manager.openWindow()`.
- **TextType** — `TextType.astro` drives animated typing via `data-text-type` attributes. Init in `src/scripts/textType.ts`.
- **Style constants** — `src/styles/styles.ts` exports Tailwind class strings. `src/scripts/colors.ts` exports Three.js color hex constants.
- **Font** — `"ZxSpectrum"` loaded from `/fonts/zxspectrum.ttf` in `global.css`.
- **Container.astro** — generic wrapper component, available but not actively used.

## Tailwind v4

Config is CSS-based via `@theme` in `src/styles/global.css`. Colors defined as `--color-{name}` in `@theme` and used as `bg-{name}` / `text-{name}`. Vite plugin `@tailwindcss/vite` in `astro.config.mjs`.

No `tailwind.config.*` file — all theme config lives in `global.css`.

## Important Notes

- `BUILD_DIARY.md` is **stale** — do not trust it for current architecture.
- Dev server listens on `0.0.0.0` (network accessible) — `astro.config.mjs` sets `server.host: true`.
- Astro dev toolbar disabled (`devToolbar.enabled: false`). VSCode extension: `astro-build.astro-vscode`.
- TypeScript: `astro/tsconfigs/strict`. Prettier: `prettier-plugin-astro` with overrides for `*.astro`.
- Node engine: `>=22.12.0`.
- No content collections, no `src/utils/`.
