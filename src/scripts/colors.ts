// Color constants that match the centralized CSS variables
// These are used for THREE.js color specifications (hexadecimal format)

export const COLORS = {
  // Primary colors (matching CSS variables)
  BG_PRIMARY: 0xffffff, // #FFFFFF - white
  TEXT_PRIMARY: 0x000000, // #000000 - black
  ACCENT_PRIMARY: 0xe6ff00, // #E6FF00 - lime

  // Derived colors for 3D rendering
  LIGHT_WHITE: 0xffffff, // white light
  DARK_BLACK: 0x000000, // black background
} as const;

export type ColorKey = keyof typeof COLORS;
