// Theme initialization
export function getSystemTheme(): string {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function initializeTheme(): string {
  const saved = localStorage.getItem("theme-preference");

  if (saved) {
    return saved;
  } else {
    return getSystemTheme();
  }
}

export function toggleTheme(currentTheme: string):string {
  return currentTheme === "light" ? "dark" : "light";
}

export function setTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme-preference", theme);
}

export function updateThemeUI(theme: string) {
  const allSunIcons = document.querySelectorAll("#sun-icon");
  const allMoonIcons = document.querySelectorAll("#moon-icon");
  if (theme === "light") {
    allSunIcons.forEach((icon) => icon.classList.remove("hidden"));
    allMoonIcons.forEach((icon) => icon.classList.add("hidden"));
  } else {
    allSunIcons.forEach((icon) => icon.classList.add("hidden"));
    allMoonIcons.forEach((icon) => icon.classList.remove("hidden"));
  }
}
