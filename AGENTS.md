# Spin Wars X

Vanilla HTML/CSS/JS Beyblade X–style stadium game. There is no package manager or build step.

## Cursor Cloud specific instructions

- Serve the repo root over HTTP (`python3 -m http.server 8080`) and open `index.html`. Scripts are cache-busted (`xrail-engine.js?v=5.4`, `app.js?v=5.4`); hard-refresh after pulling.
- Drop launches hang **under the top X-Rail, beside the X-Exit** (not on the rail lip and not inside the V). Stadium side still picks left vs right. Rail contact is skipped only while the drop is stalling.
- Knockback comes from blade Attack/Knockback stats plus momentum. Parked or low-RPM Beys still have a spin-bite, but both-parked contacts are weaker and separating overlaps must not stack. Attack bits hit harder than stamina bits. Do not globally nerf launch knockback.
- X-Rail launches still start at the live lower corner via `SpinWarsXRailEngine.nearest`. Do not add a second invisible wall.
- Lint/test/build: there is no project linter or test runner. Prove changes with a browser battle (Drop and X-Rail) plus any one-off `node` geometry asserts against `xrail-engine.js`.
