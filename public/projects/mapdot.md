# mapdot

A work-in-progress 3D terrain visualization tool built with Vue 3 and Three.js.

**Future goal:** users will input any location and receive a real-time 3D point-cloud rendering of the chosen area.

## Demo

![Mapdot 01](pictures/mapdot/mapdot_01.gif)

## Overview

Mapdot is an experimental terrain renderer that parses GIS elevation data (`.asc` grid files) and visualizes them as interactive 3D point clouds. Currently it loads local datasets — a high-resolution elevation map of Belgium and a global sub-ice topography — and renders them with Three.js, supporting free camera navigation via OrbitControls and WASD keyboard controls.

The long-term vision is to make any location explorable in 3D: plug in coordinates, fetch terrain data, and instantly explore the landscape as a point cloud from any angle.

## Current Features

- **Elevation parsing** — Loads `.asc` grid files, handles NODATA values, filters below-water points
- **3D point cloud** — Renders terrain as a particle system with spherical point sprites
- **OrbitControls** — Click-drag to orbit, scroll to zoom
- **Keyboard navigation** — WASD to orbit the camera, arrow keys to zoom and pan

## Future Roadmap

- Geocoding input — type a city or coordinates
- On-demand elevation data fetching
- Dynamic LOD (level of detail) for seamless zoom
- Terrain coloring by elevation bands
- Performance optimizations for large datasets

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **3D Rendering:** Three.js (OrbitControls)
- **Build Tool:** Vite 8
- **Language:** TypeScript (strict)
- **Data format:** `.asc` (Arc/Info ASCII Grid)

### Links

- **Source:** [github.com/fabbbiodc/mapdot](https://github.com/fabbbiodc/mapdot)
