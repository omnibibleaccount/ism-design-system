import { defineConfig } from 'tsup';

// The whole bundle is marked "use client": many components hold state (Accordion, Tabs, Modal …).
// Pure presentational ones also work as client components, and the CSS is plain, so SSR output is the same.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', '@ism/tokens'],
  banner: { js: '"use client";' },
});
