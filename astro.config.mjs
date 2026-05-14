// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
// https://astro.build/config
export default defineConfig({
  site: 'https://fabbbiodc.github.io',
  base: '/portfolio',
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
