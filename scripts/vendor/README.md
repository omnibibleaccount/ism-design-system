# Vendored for static previews only

`react.production.min.js` and `react-dom.production.min.js` are React 18.3.1 UMD builds (MIT, see REACT-LICENSE). `scripts/build-previews.mjs` copies them next to the generated previews and bundles the current `@ism/ui` source (`packages/react/src`) with esbuild into `docs/previews/vendor/ism-ui.js` (global `window.ISMUI`, React left external and read from these globals), so the React specimens in the previews work offline. They are not used by any shipped package.
