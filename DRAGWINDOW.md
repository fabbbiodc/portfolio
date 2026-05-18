# Draggable Window System

## Overview

A lightweight, OS-like draggable window system built for an Astro-based portfolio. Windows can be dragged, stacked, closed, and reopened via buttons. All state is persisted to `localStorage`.

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Astro 6.x** | Static site framework, component architecture |
| **TypeScript** | Type safety for props and drag logic |
| **Vanilla JavaScript** | Drag logic, no external libraries |
| **Tailwind CSS** | Utility-first styling |
| **localStorage** | Window position, z-index, and closed state persistence |

---

## Architecture

```
DragContainer.astro
├── Titlebar.astro (drag handle + close button)
└── Content div (slot for custom content)

draggable.ts (global manager)
├── Finds all [data-window-id] elements
├── Attaches drag, z-index, close handlers
└── Manages localStorage persistence
```

---

## File Structure

| File | Purpose |
|------|---------|
| `src/components/DragContainer.astro` | Main draggable window component |
| `src/components/Titlebar.astro` | Titlebar with drag handle and close button |
| `src/scripts/draggable.ts` | Global drag manager (auto-loaded per DragContainer) |
| `src/styles/styles.ts` | Centralized Tailwind class constants |

---

## How to Use

### Adding a New Window

```astro
<DragContainer
  id="unique-id"
  title="Window Title"
  initialX={100}
  initialY={100}
  closable={true}
  initiallyHidden={false}
>
  <!-- Your content here -->
  <h1>Hello World</h1>
</DragContainer>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for localStorage persistence |
| `title` | `string` | **required** | Window title displayed in titlebar |
| `initialX` | `number` | `100` | Initial horizontal position (px) |
| `initialY` | `number` | `100` | Initial vertical position (px) |
| `closable` | `boolean` | `true` | Show/hide close button |
| `initiallyHidden` | `boolean` | `false` | Start window hidden (open via button) |

### Opening a Hidden Window

Add a button in any window's content:

```astro
<button data-action="open-window" data-target="target-window-id">
  Open Window
</button>
```

The global click handler in `Hero.astro` (or your layout) will show the target window.

---

## Features

### Dragging
- **Drag handle**: Titlebar only (not the whole window)
- **Cursor feedback**: `cursor-grab` → `cursor-grabbing` on drag
- **Offset tracking**: Window moves naturally from click point
- **No constraints**: Windows can be dragged partially off-screen

### Z-Index Stacking
- Clicking any window brings it to the front
- Global z-index counter starts at `100` and increments
- Counter persisted to `localStorage`

### Close & Reopen
- Close button (X-mark) in titlebar
- Closed state saved to `localStorage`
- Reopen via button with `data-action="open-window"`

### Persistence
All state is saved to `localStorage`:
- `window-{id}-position`: `{ x, y, zIndex }`
- `window-{id}-closed`: `boolean`
- `window-z-index-counter`: `number`

---

## Customization

### Styling

All styles are centralized in `src/styles/styles.ts`:

```typescript
export const draggableWindowStyle = "absolute";
export const titlebarCloseButtonStyle = "ml-auto p-1 hover:bg-bg-light rounded transition-colors cursor-pointer";
export const titlebarDragHandleStyle = "cursor-grab select-none";
```

Modify these to change appearance globally.

### Adding Resize Handles

To add resize functionality:
1. Add resize handles to `DragContainer.astro` (corners/edges)
2. Extend `draggable.ts` with `startResize()` method
3. Track resize state similar to drag state
4. Save dimensions to `localStorage`

### Adding Minimize

To add minimize functionality:
1. Add minimize button to `Titlebar.astro`
2. Add `data-action="minimize"` handler in `draggable.ts`
3. Collapse window to titlebar only
4. Save minimized state to `localStorage`

### Window Animations

Add CSS transitions to `DragContainer.astro`:
```css
transition: transform 0.1s ease-out;
```

Or use Astro's view transitions for open/close animations.

---

## Example: Multi-Window Setup

```astro
<section class={homeSectionStyle}>
  <!-- Home window - uncloseable, always visible -->
  <DragContainer id="home" title="home" closable={false}>
    <h1>Welcome</h1>
    <button data-action="open-window" data-target="projects">Projects</button>
    <button data-action="open-window" data-target="about">About</button>
  </DragContainer>

  <!-- Projects window - closable, starts hidden -->
  <DragContainer id="projects" title="projects" initialX={300} initialY={200} initiallyHidden>
    <h1>Projects</h1>
    <p>My project showcase</p>
  </DragContainer>

  <!-- About window - closable, starts hidden -->
  <DragContainer id="about" title="about" initialX={500} initialY={300} initiallyHidden>
    <h1>About Me</h1>
    <p>Developer, designer, creator</p>
  </DragContainer>
</section>

<script>
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-action="open-window"]');
    if (target) {
      const windowId = target.getAttribute('data-target');
      const windowEl = document.querySelector(`[data-window-id="${windowId}"]`);
      if (windowEl) {
        windowEl.style.display = 'block';
        localStorage.removeItem(`window-${windowId}-closed`);
      }
    }
  });
</script>
```

---

## Next Steps / Future Enhancements

- [ ] **Resize handles** - Drag edges/corners to resize
- [ ] **Minimize** - Collapse to titlebar only
- [ ] **Snap to grid** - Optional grid alignment
- [ ] **Viewport constraints** - Prevent dragging fully off-screen
- [ ] **Window animations** - Fade/slide on open/close
- [ ] **Dynamic window creation** - Spawn windows programmatically via JS API
- [ ] **Window content routing** - Load different content per window
- [ ] **Taskbar** - Show open windows, click to focus/minimize
- [ ] **Keyboard shortcuts** - Alt+Tab, Escape to close, etc.

---

## Troubleshooting

### Window doesn't drag
- Ensure `draggable.ts` is loaded (check browser console)
- Verify `data-window-id` attribute exists on wrapper div
- Check that `.titlebar` class is on the titlebar element

### Close button not visible
- Ensure `closable={true}` prop is set
- Check `titlebarCloseButtonStyle` in `styles.ts`
- Verify SVG icon is rendering

### Position not persisting
- Check browser localStorage (DevTools → Application → Local Storage)
- Ensure `id` prop is unique and consistent
- Clear localStorage to reset: `localStorage.clear()`

---

## Prompt for Next Phases

When continuing development, reference this document. Key context:

- Windows use `transform: translate()` for positioning (GPU-accelerated)
- Drag logic is delta-based (start position + mouse delta)
- Z-index is globally incremented and persisted
- All styles are in `src/styles/styles.ts`
- Astro deduplicates `<script>` imports automatically
- localStorage keys: `window-{id}-position`, `window-{id}-closed`, `window-z-index-counter`
