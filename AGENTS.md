# Spin Wars X

Vanilla HTML/CSS/JS Beyblade X–style stadium game. There is no package manager or build step.

## Cursor Cloud specific instructions

- Serve the repo root over HTTP (`python3 -m http.server 8080`) and open `index.html`. Scripts are cache-busted (`xrail-engine.js?v=5.7`, `app.js?v=5.7`, `movement-engine.js?v=5.7`); hard-refresh after pulling.
- Drop launches hang **under the top X-Rail, beside the X-Exit** (not on the rail lip and not inside the V). Stadium side still picks left vs right. Rail contact is skipped only while the drop is stalling.
- Knockback is one physical system: blade Attack/Knockback stats, mass, speed, and remaining RPM. There are no extra bit-pair or rail-exit knockback multipliers. Low RPM naturally hits softer because spin energy is lower, not because a second rule is applied. Speed-target damping must not eat impact velocity while `impactMomentumState` is high. Separating overlaps still must not stack.
- Xtreme/Over need a real smash (`lastImpactForce` plus speed/alignment). Light taps that drift into a pocket should not score. Rail-exit finishes still use the stored-exit path.
- X-Rail capture uses remaining CCW + inward bite, not peak RPM. Ride speed is the entry tangent with RPM friction only (no shared speed ceiling). Exit speed is the speed actually carried on the rail.
- Direct Clash aims at the opponent after both Beys spawn. Launch quality is aim accuracy (Perfect is tight, Horrible is wide). `impactMomentumState` stays high so they fly at each other instead of immediately orbiting.
- X-Rail launches still start at the live lower corner via `SpinWarsXRailEngine.nearest`. Do not add a second invisible wall.
- Lint/test/build: there is no project linter or test runner. Prove changes with a browser battle (Drop, Direct Clash, and X-Rail) plus any one-off `node` geometry asserts against `xrail-engine.js`.
