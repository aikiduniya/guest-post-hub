// TanStack Start in SPA mode: prerenders the root shell and emits a static
// dist/index.html + dist/assets/* build suitable for any static host.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: { enabled: true, crawlLinks: true },
    },
  },
  vite: {
    build: { outDir: "dist" },
  },
});
