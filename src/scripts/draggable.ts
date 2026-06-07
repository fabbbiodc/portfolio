interface WindowState {
  x: number;
  y: number;
  zIndex: number;
}

function isOffScreen(x: number, y: number, windowEl: HTMLElement): boolean {
  const w = windowEl.offsetWidth;
  const h = windowEl.offsetHeight;
  return (
    x < 0 ||
    x > window.innerWidth - w ||
    y < 0 ||
    y > window.innerHeight - h
  );
}

function constrainToBounds(
  x: number,
  y: number,
  windowEl: HTMLElement,
): { x: number; y: number } {
  const w = windowEl.offsetWidth;
  const h = windowEl.offsetHeight;
  const isMobile = window.innerWidth < 768;
  const rightMargin = isMobile ? 0 : 24;

  return {
    x: Math.max(0, Math.min(window.innerWidth - w - rightMargin, x)),
    y: Math.max(0, Math.min(window.innerHeight - h, y)),
  };
}

function constrainToViewport(
  x: number,
  y: number,
  windowEl: HTMLElement,
): { x: number; y: number } {
  const w = windowEl.offsetWidth;
  const h = windowEl.offsetHeight;
  const isMobile = window.innerWidth < 768;
  const rightMargin = isMobile ? 0 : 24;

  const minX = -(w / 2);
  const maxX = window.innerWidth - w / 2 - rightMargin;
  const minY = 0;
  const maxY = window.innerHeight - h / 2;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

function computeDefaultPosition(
  windowEl: HTMLElement,
): { x: number; y: number } {
  const w = windowEl.offsetWidth;
  const h = windowEl.offsetHeight;
  const isMobile = window.innerWidth < 768;
  const strategy =
    windowEl.getAttribute("data-position-strategy") || "home";

  let x: number;
  let y: number;

  if (isMobile) {
    x = (window.innerWidth - w) / 2;
    if (strategy === "home") {
      y = window.innerHeight - h - 24;
    } else {
      y = (window.innerHeight - h) / 2;
    }
  } else if (strategy === "child") {
    const parentId = windowEl.getAttribute("data-parent-id");
    const parentEl = parentId
      ? document.querySelector(`[data-window-id="${parentId}"]`)
      : null;
    if (parentEl) {
      const parentRect = parentEl.getBoundingClientRect();
      x = parentRect.right + 24;
    } else {
      x = 24;
    }
    y = (window.innerHeight - h) / 2;
  } else {
    x = 24;
    y = (window.innerHeight - h) / 2;
  }

  return constrainToBounds(x, y, windowEl);
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
    const isClosed =
      isClosable &&
      localStorage.getItem(`window-${id}-closed`) === "true";

    if (isClosed) {
      windowEl.style.display = "none";
    }

    const state: WindowState = { x: 0, y: 0, zIndex: this.zIndexCounter };
    let needsDeferredPosition = false;

    if (saved) {
      const parsed = JSON.parse(saved);
      if (!isOffScreen(parsed.x, parsed.y, windowEl)) {
        state.x = parsed.x;
        state.y = parsed.y;
        state.zIndex = parsed.zIndex;
      } else if (!isClosed) {
        const defaultPos = computeDefaultPosition(windowEl);
        state.x = defaultPos.x;
        state.y = defaultPos.y;
      }
    } else if (windowEl.offsetWidth > 0 && !isClosed) {
      const defaultPos = computeDefaultPosition(windowEl);
      state.x = defaultPos.x;
      state.y = defaultPos.y;
    } else if (!isClosed) {
      needsDeferredPosition = true;
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

    if (needsDeferredPosition) {
      this.waitForSize(windowEl, id);
    }
  }

  private waitForSize(windowEl: HTMLElement, id: string) {
    if (windowEl.offsetWidth > 0) {
      const defaultPos = computeDefaultPosition(windowEl);
      const state = this.windowStates.get(id)!;
      state.x = defaultPos.x;
      state.y = defaultPos.y;
      windowEl.style.transform = `translate(${defaultPos.x}px, ${defaultPos.y}px)`;
      this.savePosition(id);
      return;
    }
    requestAnimationFrame(() => this.waitForSize(windowEl, id));
  }

  startDrag(
    e: PointerEvent,
    windowEl: HTMLElement,
    id: string,
  ) {
    const closeBtn = windowEl.querySelector('[data-action="close"]');
    if (closeBtn && closeBtn.contains(e.target as Node)) return;

    const state = this.windowStates.get(id)!;
    const titlebar = e.currentTarget as HTMLElement;

    const startX = e.clientX;
    const startY = e.clientY;
    const startTransformX = state.x;
    const startTransformY = state.y;

    this.bringToFront(windowEl, id);
    titlebar.classList.add("is-dragging");
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
      titlebar.classList.remove("is-dragging");
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

      const constrained = constrainToViewport(
        state.x,
        state.y,
        windowEl,
      );
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

  openWindow(id: string) {
    const windowEl = this.windowElements.get(id);
    if (!windowEl) return;
    windowEl.style.display = "flex";
    this.bringToFront(windowEl, id);
    localStorage.removeItem(`window-${id}-closed`);

    // Reset scroll position to top
    const contentDiv = windowEl.querySelector(".overflow-y-auto");
    if (contentDiv) {
      contentDiv.scrollTop = 0;
    }

    const state = this.windowStates.get(id)!;
    const defaultPos = computeDefaultPosition(windowEl);
    state.x = defaultPos.x;
    state.y = defaultPos.y;
    windowEl.style.transform = `translate(${defaultPos.x}px, ${defaultPos.y}px)`;

    windowEl.dispatchEvent(
      new CustomEvent("window-opened", { detail: { id } }),
    );
  }

  closeWindow(windowEl: HTMLElement, id: string) {
    windowEl.style.display = "none";
    localStorage.setItem(`window-${id}-closed`, "true");
  }

  savePosition(id: string) {
    const state = this.windowStates.get(id)!;
    localStorage.setItem(
      `window-${id}-position`,
      JSON.stringify(state),
    );
  }
}

const manager = new DraggableWindowManager();
export { manager };
