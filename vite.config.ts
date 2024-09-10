import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import {resolve} from "path";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: false,
      },
    }),
    dts({
      include: ["./src/lib"],
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: pkg.name,
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        globals: {
          svelte: 'Svelte',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
