interface WindowState {
  x: number;
  y: number;
  zIndex: number;
}

function isOffScreen(x: number, y: number, windowEl: HTMLElement): boolean {
  const rect = windowEl.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const screenX = x + w / 2;
  const screenY = y + h / 2;
  return (
    screenX < 0 ||
    screenX > window.innerWidth ||
    screenY < 0 ||
    screenY > window.innerHeight
  );
}

function constrainToViewport(
  x: number,
  y: number,
  windowEl: HTMLElement,
  margin = 50,
): { x: number; y: number } {
  const rect = windowEl.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const minX = -(w - margin);
  const maxX = window.innerWidth - margin;
  const minY = -(h - margin);
  const maxY = window.innerHeight - margin;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

class DraggableWindowManager {
  private zIndexCounter: number;
  private windowStates: Map<string, WindowState> = new Map();
  private windowElements: Map<string, HTMLElement> = new Map();

  constructor() {
    this.zIndexCounter = parseInt(
      localStorage.getItem("window-z-index-counter") || "100",
    );
    this.init();
    window.addEventListener("resize", () => this.onResize());
  }

  init() {
    const windows = document.querySelectorAll("[data-window-id]");
    windows.forEach((win) => this.setupWindow(win as HTMLElement));
  }

  setupWindow(windowEl: HTMLElement) {
    const id = windowEl.dataset.windowId!;
    const titlebar = windowEl.querySelector(".titlebar");
    const closeBtn = windowEl.querySelector('[data-action="close"]');

    const saved = localStorage.getItem(`window-${id}-position`);
    const isClosable = windowEl.dataset.closable !== "false";
    const isClosed = isClosable && localStorage.getItem(`window-${id}-closed`) === "true";

    if (isClosed) {
      windowEl.style.display = "none";
    }

    const state: WindowState = saved
      ? JSON.parse(saved)
      : {
          x: parseFloat(
            windowEl.style.transform.match(/translate\(([-\d.]+)px/)?.[1] ||
              "100",
          ),
          y: parseFloat(
            windowEl.style.transform.match(/,\s*([-\d.]+)px\)/)?.[1] || "100",
          ),
          zIndex: this.zIndexCounter,
        };

    if (saved && isOffScreen(state.x, state.y, windowEl)) {
      state.x = parseFloat(
        windowEl.style.transform.match(/translate\(([-\d.]+)px/)?.[1] || "100",
      );
      state.y = parseFloat(
        windowEl.style.transform.match(/,\s*([-\d.]+)px\)/)?.[1] || "100",
      );
      localStorage.removeItem(`window-${id}-position`);
    }

    this.windowStates.set(id, state);
    this.windowElements.set(id, windowEl);

    windowEl.style.transform = `translate(${state.x}px, ${state.y}px)`;
    windowEl.style.zIndex = state.zIndex.toString();
    this.savePosition(id);

    windowEl.addEventListener("pointerdown", () =>
      this.bringToFront(windowEl, id),
    );

    if (titlebar) {
      (titlebar as HTMLElement).addEventListener(
        "pointerdown",
        (e: PointerEvent) => this.startDrag(e, windowEl, id),
      );
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeWindow(windowEl, id);
      });
    }
  }

  startDrag(e: PointerEvent, windowEl: HTMLElement, id: string) {
    const state = this.windowStates.get(id)!;
    const titlebar = e.currentTarget as HTMLElement;

    const startX = e.clientX;
    const startY = e.clientY;
    const startTransformX = state.x;
    const startTransformY = state.y;

    this.bringToFront(windowEl, id);
    titlebar.style.cursor = "grabbing";
    titlebar.setPointerCapture(e.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = startTransformX + deltaX;
      let newY = startTransformY + deltaY;

      const constrained = constrainToViewport(newX, newY, windowEl);
      newX = constrained.x;
      newY = constrained.y;

      state.x = newX;
      state.y = newY;
      windowEl.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const onEnd = () => {
      titlebar.style.cursor = "grab";
      this.savePosition(id);
      titlebar.removeEventListener("pointermove", onMove);
      titlebar.removeEventListener("pointerup", onEnd);
      titlebar.removeEventListener("pointercancel", onEnd);
    };

    titlebar.addEventListener("pointermove", onMove);
    titlebar.addEventListener("pointerup", onEnd);
    titlebar.addEventListener("pointercancel", onEnd);
  }

  private onResize() {
    for (const [id, windowEl] of this.windowElements) {
      const state = this.windowStates.get(id);
      if (!state || windowEl.style.display === "none") continue;

      const constrained = constrainToViewport(state.x, state.y, windowEl);
      state.x = constrained.x;
      state.y = constrained.y;
      windowEl.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
      this.savePosition(id);
    }
  }

  bringToFront(windowEl: HTMLElement, id: string) {
    this.zIndexCounter++;
    const state = this.windowStates.get(id)!;
    state.zIndex = this.zIndexCounter;
    windowEl.style.zIndex = this.zIndexCounter.toString();
    localStorage.setItem(
      "window-z-index-counter",
      this.zIndexCounter.toString(),
    );
  }

  closeWindow(windowEl: HTMLElement, id: string) {
    windowEl.style.display = "none";
    localStorage.setItem(`window-${id}-closed`, "true");
  }

  savePosition(id: string) {
    const state = this.windowStates.get(id)!;
    localStorage.setItem(`window-${id}-position`, JSON.stringify(state));
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => new DraggableWindowManager(),
  );
} else {
  new DraggableWindowManager();
}
