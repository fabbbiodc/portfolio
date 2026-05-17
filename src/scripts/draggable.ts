interface WindowState {
  x: number;
  y: number;
  zIndex: number;
}

class DraggableWindowManager {
  private zIndexCounter: number;
  private windowStates: Map<string, WindowState> = new Map();

  constructor() {
    this.zIndexCounter = parseInt(localStorage.getItem('window-z-index-counter') || '100');
    this.init();
  }

  init() {
    const windows = document.querySelectorAll('[data-window-id]');
    windows.forEach(win => this.setupWindow(win as HTMLElement));
  }

  setupWindow(windowEl: HTMLElement) {
    const id = windowEl.dataset.windowId!;
    const titlebar = windowEl.querySelector('.titlebar');
    const closeBtn = windowEl.querySelector('[data-action="close"]');

    const saved = localStorage.getItem(`window-${id}-position`);
    const isClosed = localStorage.getItem(`window-${id}-closed`) === 'true';

    if (isClosed) {
      windowEl.style.display = 'none';
    }

    const state: WindowState = saved
      ? JSON.parse(saved)
      : {
          x: parseFloat(windowEl.style.transform.match(/translate\(([-\d.]+)px/)?.[1] || '100'),
          y: parseFloat(windowEl.style.transform.match(/,\s*([-\d.]+)px\)/)?.[1] || '100'),
          zIndex: this.zIndexCounter
        };

    this.windowStates.set(id, state);
    windowEl.style.transform = `translate(${state.x}px, ${state.y}px)`;
    windowEl.style.zIndex = state.zIndex.toString();

    windowEl.addEventListener('mousedown', () => this.bringToFront(windowEl, id));

    if (titlebar) {
      titlebar.addEventListener('mousedown', (e) => this.startDrag(e, windowEl, id));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(windowEl, id);
      });
    }
  }

  startDrag(e: MouseEvent, windowEl: HTMLElement, id: string) {
    const state = this.windowStates.get(id)!;
    const titlebar = e.currentTarget as HTMLElement;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startTransformX = state.x;
    const startTransformY = state.y;

    this.bringToFront(windowEl, id);
    titlebar.style.cursor = 'grabbing';

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;
      
      const newX = startTransformX + deltaX;
      const newY = startTransformY + deltaY;

      state.x = newX;
      state.y = newY;
      windowEl.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const onMouseUp = () => {
      titlebar.style.cursor = 'grab';
      this.savePosition(id);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  bringToFront(windowEl: HTMLElement, id: string) {
    this.zIndexCounter++;
    const state = this.windowStates.get(id)!;
    state.zIndex = this.zIndexCounter;
    windowEl.style.zIndex = this.zIndexCounter.toString();
    localStorage.setItem('window-z-index-counter', this.zIndexCounter.toString());
  }

  closeWindow(windowEl: HTMLElement, id: string) {
    windowEl.style.display = 'none';
    localStorage.setItem(`window-${id}-closed`, 'true');
  }

  savePosition(id: string) {
    const state = this.windowStates.get(id)!;
    localStorage.setItem(`window-${id}-position`, JSON.stringify(state));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DraggableWindowManager());
} else {
  new DraggableWindowManager();
}
