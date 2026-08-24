# Spin Wars X

Vanilla HTML/CSS/JS Beyblade X–style stadium game. There is no package manager or build step.

## Cursor Cloud specific instructions

- Serve the repo root over HTTP (`python3 -m http.server 8080`) and open `index.html`. Scripts are cache-busted (`xrail-engine.js?v=7.6`, `app.js?v=7.6`, `movement-engine.js?v=7.6`); hard-refresh after pulling.
- If a requested feel tweak can be done by retuning an existing system, retune that system. Do not add another movement, knockback, or rail layer on top.
- Drop launches hang **under the top X-Rail, beside the X-Exit** (not on the rail lip and not inside the V). Stadium side still picks left vs right. Rail contact is skipped only while the drop is stalling.
- Knockback is the existing clash shove from incoming momentum plus the Bey's Knockback/Attack stats and remaining RPM. Do not zero a Bey's speed on contact. Hits should have weight and can knock someone back; do not restore the 0.128 stadium launch. `impactMomentumState` follows that shove. Speed-target damping must not eat impact velocity while `impactMomentumState` is high. Separating overlaps still must not stack.
- Xtreme/Over need a real knock into the opening (`lastImpactForce` plus speed/alignment), not a graze. They should be scoreable in a fight. A qualifying knock always rolls recovery: high remaining RPM often climbs out of a medium hit; a hard smash can still pocket. Show RECOVERED when it happens. Rail-exit finishes still use the stored-exit path.
- Live orbit follows Bit type, then stats. Home radius is a soft radial tendency, not a locked path. Free movement is a cartesian blend toward launch+RPM speed (`physicalSpeedTarget`); do not polar-rewrite heading or plant with bowl gravity. Attack hugs the X-Rail ring at high RPM, then walks in as spin drops. Defense/Stamina stay a little wider through high RPM, then drop into a tight center so two of them can actually meet. After a clash, wall bounce, or X-Exit, `impactMomentumState` starves orbit steering so leftover speed can still fly. X-Exit and free hits on the closer bounce toward center with leftover speed. While `railEngaged`, ride speed is owned by the X-Rail engine; do not cruise-damp it. Cruise accelerates up to `physicalSpeedTarget` and only bleeds excess; skip it while impact/exit is hot.
- X-Exit leaves the rail toward left-center, center, or right-center with a small heading change. Do not force every exit down the exact middle.
- Only the true pocket mouths and Xtreme chute can be left by a real outward smash. The rest of the lower X-Rail and wall stay solid. Light taps still should not score. A finish must actually cross the zone, not just graze the lip.
- X-Rail capture uses remaining CCW + inward bite, not peak RPM. Ride speed is the entry tangent with RPM friction only (no shared speed ceiling). Exit speed is the speed actually carried on the rail.
- Direct Clash aims at the opponent after both Beys spawn. Launch quality is aim accuracy (Perfect is tight, Horrible is wide). `impactMomentumState` stays high so they fly at each other instead of immediately orbiting.
- X-Rail launches still start at the live lower corner via `SpinWarsXRailEngine.nearest`. Do not add a second invisible wall.
- Lint/test/build: there is no project linter or test runner. Prove changes with a browser battle (Drop, Direct Clash, and X-Rail) plus any one-off `node` geometry asserts against `xrail-engine.js`.
