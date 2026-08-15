/// <reference types="vitest/config" />
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'
import { ensureSimBundle } from './scripts/bundle-sim.mjs'

/* @pkmn/sim ships ~24 MB across 140 ESM modules — too heavy for rollup on
 * small CI boxes. We pre-bundle it once into a static vendor asset
 * (public/vendor/pkmn-sim.mjs, see scripts/bundle-sim.mjs) which the battle
 * engine loads at runtime via a dynamic import() URL. The sim therefore stays
 * completely outside the rollup graph and never enters any vite chunk. */
ensureSimBundle()

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [{ ...inspectAttr(), apply: 'serve' }, react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          /* React must be its own chunk. Named vendor chunks for gsap/motion
           * otherwise absorb react and the entry modulepreloads them. */
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react';
          }
          if (id.includes('node_modules/fuse.js')) return 'fuse';
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'gsap';
        },
      },
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
