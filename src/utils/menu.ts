export function toggleMenuState(isOpen: boolean): boolean {
  return !isOpen;
}

export function calculateMaxHeight(
  isOpen: boolean,
  element: HTMLElement,
): string {
  return isOpen ? element.scrollHeight + "px" : "0";
}

export function updateMenuUI(
  barsIcon: Element | null,
  xIcon: Element | null,
  isOpen: boolean,
): void {
  if (isOpen) {
    barsIcon?.classList.add("hidden");
    xIcon?.classList.remove("hidden");
  } else {
    barsIcon?.classList.remove("hidden");
    xIcon?.classList.add("hidden");
  }
}

export function setMenuMaxHeight(
  menu: HTMLElement | null,
  maxHeight: string,
): void {
  if (menu) {
    menu.style.maxHeight = maxHeight;
  }
}

export function closeMenuUI(
  menu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null,
): void {
  updateMenuUI(barsIcon, xIcon, false);
  setMenuMaxHeight(menu, "0");
}

export function toggleMenuUI(
  menu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null,
  isOpen: boolean,
): void {
  const newState = toggleMenuState(isOpen);
  updateMenuUI(barsIcon, xIcon, newState);
  setMenuMaxHeight(menu, calculateMaxHeight(newState, menu as HTMLElement));
}

export function setupMenuListeners(
  hamburgerBtn: HTMLElement | null,
  mobileMenu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null,
): void {
  let isOpen = false;

  hamburgerBtn?.addEventListener("click", () => {
    isOpen = toggleMenuState(isOpen);
    toggleMenuUI(mobileMenu, barsIcon, xIcon, isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      isOpen = false;
      closeMenuUI(mobileMenu, barsIcon, xIcon);
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInside = mobileMenu?.contains(event.target as Node);
    const clickedHamburger = hamburgerBtn?.contains(event.target as Node);

    if (!clickedInside && !clickedHamburger && isOpen) {
      isOpen = false;
      closeMenuUI(mobileMenu, barsIcon, xIcon);
    }
  });
}
