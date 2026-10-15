# Vendored for static previews only

`react.production.min.js` and `react-dom.production.min.js` are React 18.3.1 UMD builds (MIT, see REACT-LICENSE). `scripts/build-previews.mjs` copies them next to the generated previews so the few previews that render the legacy React bundle (`reference/bundle.legacy.js`) work offline. They are not used by any shipped package.
