import { defineConfig } from 'vite';
import { resolve } from 'path'
import dts from "vite-plugin-dts";
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'

export default defineConfig({
  plugins: [
    libAssetsPlugin({
      include: /\.?wasm(\?.*)?$/,
      outputPath: "."
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        'wasm-avif-threads': './src/index.js',
        worker_threads_bg: './src/worker_threads_bg.js'
      },
      formats: ['es']
    },
  }
});
