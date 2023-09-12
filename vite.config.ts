import {defineConfig} from "vite";

/** @type {import('vite').UserConfig} */
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'InstantWallet',
      fileName: 'InstantWallet',
      formats: ['es', 'umd'],
    },
  },
  define: {
    'process.env.TEST_PRIVATE_KEY': JSON.stringify(process.env.TEST_PRIVATE_KEY),
  },
  optimizeDeps: {
    include: []
  },
  plugins: [
  ],
})