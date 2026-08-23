# Spin Wars X

Vanilla HTML/CSS/JS Beyblade X–style stadium game. There is no package manager or build step.

## Cursor Cloud specific instructions

- Serve the repo root over HTTP (`python3 -m http.server 8080`) and open `index.html`. Scripts are cache-busted (`xrail-engine.js?v=5.2`, `app.js?v=5.2`); hard-refresh after pulling.
- Drop launches hang on the **top lip** of the X-Exit on the current stadium side (player/CPU swap every two rounds), stall, then fall through the V. Rail/closer contact is skipped until the Bey is below `y > -0.52`.
- Launch-phase and drop-falling collisions are softened so opening slams are not finish-level. Mid-fight knockback is higher but capped; attack bits hit harder than stamina/defense bits.
- X-Rail launches still start at the live lower corner via `SpinWarsXRailEngine.nearest`. Do not add a second invisible wall.
- Lint/test/build: there is no project linter or test runner. Prove changes with a browser battle (Drop and X-Rail) plus any one-off `node` geometry asserts against `xrail-engine.js`.
