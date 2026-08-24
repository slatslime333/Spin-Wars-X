# Spin Wars X

Vanilla HTML/CSS/JS Beyblade X–style stadium game. There is no package manager or build step.

## Cursor Cloud specific instructions

- Serve the repo root over HTTP (`python3 -m http.server 8080`) and open `index.html`. Scripts are cache-busted (`xrail-engine.js?v=6.9`, `app.js?v=6.9`, `movement-engine.js?v=6.9`); hard-refresh after pulling.
- Drop launches hang **under the top X-Rail, beside the X-Exit** (not on the rail lip and not inside the V). Stadium side still picks left vs right. Rail contact is skipped only while the drop is stalling.
- Knockback is one physical system: blade Attack/Knockback stats, mass, speed, and remaining RPM. There are no extra bit-pair or rail-exit knockback multipliers. Low RPM naturally hits softer because spin energy is lower, not because a second rule is applied. Speed-target damping must not eat impact velocity while `impactMomentumState` is high. Separating overlaps still must not stack.
- Xtreme/Over need a real knock into the opening (`lastImpactForce` plus speed/alignment), not a graze. They should be scoreable in a fight. A qualifying knock always rolls recovery: high remaining RPM often climbs out of a medium hit; a hard smash can still pocket. Show RECOVERED when it happens. Rail-exit finishes still use the stored-exit path.
- Live orbit follows Bit type, then stats. A launch should spiral into a visible circle: Attack wider and stays wide longer, Defense/Stamina smaller but still orbiting with less magnet-to-center. Attack can reach the X-Rail from leftover width or a clash, but a Center launch should not immediately hug and ride it. After a clash, `impactMomentumState` owns a short cartesian knockback fly, then bowl gravity plants them again — do not polar-correct the hit into a sway, and do not leave them ice-skating as a ragdoll. Knockback itself stays punchy but capped so they cannot be launched or chain-glitched across the stadium. While `railEngaged`, ride speed is owned by the X-Rail engine; do not cruise-damp it.
- X-Exit leaves the rail toward left-center, center, or right-center with a small heading change. Do not force every exit down the exact middle.
- Only the true pocket mouths and Xtreme chute can be left by a real outward smash. The rest of the lower X-Rail and wall stay solid. Light taps still should not score. A finish must actually cross the zone, not just graze the lip.
- X-Rail capture uses remaining CCW + inward bite, not peak RPM. Ride speed is the entry tangent with RPM friction only (no shared speed ceiling). Exit speed is the speed actually carried on the rail.
- Direct Clash aims at the opponent after both Beys spawn. Launch quality is aim accuracy (Perfect is tight, Horrible is wide). `impactMomentumState` stays high so they fly at each other instead of immediately orbiting.
- X-Rail launches still start at the live lower corner via `SpinWarsXRailEngine.nearest`. Do not add a second invisible wall.
- Lint/test/build: there is no project linter or test runner. Prove changes with a browser battle (Drop, Direct Clash, and X-Rail) plus any one-off `node` geometry asserts against `xrail-engine.js`.
