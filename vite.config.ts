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
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
