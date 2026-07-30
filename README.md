# Gem Rush

A mobile-first arcade game built with Phaser 3 for a technical assessment. Move the basket left and right to catch falling gems while avoiding bombs. Reach 20 gems within 45 seconds without losing all three lives to win.

## Installation & Running

```bash
npm install
npm run dev        # local development with hot reload
npm run build      # produces single-file dist/index.html
npm run size-check # verify built file is under 5 MB
```

Open `dist/index.html` in a browser after building — it runs fully offline with no external dependencies.

## Project Structure

```text
gem-rush-phaser/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & npm scripts
├── vite.config.js              # Vite build config (single-file output)
├── scripts/
│   ├── encode-assets.js        # Converts raw audio to base64 manifest
│   └── size-check.js           # Validates final build stays under 5MB
├── src/
│   ├── main.js                 # Phaser game bootstrap & scene registration
│   ├── config/
│   │   └── GameConfig.js       # Centralized tunable values (speeds, colors, scoring)
│   ├── assets/
│   │   ├── raw/                # Source .wav audio files
│   │   └── encoded/
│   │       └── assetManifest.js # Generated base64 audio manifest
│   ├── scenes/
│   │   ├── BootScene.js        # Initializes SaveState, transitions to Preload
│   │   ├── PreloadScene.js     # Loads base64 assets into Phaser cache
│   │   ├── TitleScene.js       # Title screen, high score, Play button
│   │   ├── GameScene.js        # Core gameplay loop, scoring, collisions
│   │   └── EndScene.js         # Win/loss screen, Play Again button
│   ├── objects/
│   │   ├── AmbientBackground.js # Procedural animated background
│   │   ├── Basket.js            # Player-controlled basket
│   │   ├── FallingItem.js       # Base class for falling objects
│   │   ├── Gem.js                # Collectible item (extends FallingItem)
│   │   ├── Bomb.js               # Hazard item (extends FallingItem)
│   │   └── ScorePopup.js         # Floating +1/-1 score feedback
│   ├── systems/
│   │   ├── Spawner.js           # Object pooling & timed item spawning
│   │   └── SaveState.js         # High score persistence via localStorage
│   └── ui/
│       ├── Button.js            # Reusable interactive button component
│       └── HUD.js                # Score, lives, and timer display
└── dist/
    └── index.html               # Final single-file production build
```


## Controls

- **Desktop:** Move the mouse left/right, or use the Left/Right arrow keys, to move the basket.
- **Mobile/Touch:** Drag your finger left/right anywhere on the screen to move the basket.
- Catch gems (+1 point) and avoid bombs (-1 life). Reach 20 gems within 45 seconds to win.
- A first-time tutorial overlay explains these controls in-game, and is only shown once (tracked via `localStorage`).

## Project Overview & Technical Decisions

This project was built as a mobile-first Phaser 3 arcade game for a technical assessment. The implementation focuses on clean architecture, performance, and meeting the assessment requirements while keeping the production build self-contained and lightweight.

* **Graphics:** All game visuals (basket, gems, bombs, particles, and UI elements) are procedurally drawn using Phaser `Graphics`, eliminating the need for external image assets and helping keep the build size under the required limit.
* **Performance:** Falling objects are managed using object pooling through Phaser Groups to minimize object creation and garbage collection during gameplay.
* **Configuration:** Gameplay values such as spawn rates, movement speed, timers, and scoring are centralized in `GameConfig.js` for easier maintenance and tuning.
* **State Management:** Player progress, including whether the instructional overlay has already been shown, is persisted using `localStorage` through the `SaveState` system.
* **Audio:** Sound effects are procedurally generated and embedded into the final build, allowing the game to run completely offline without external assets.
* **Offline Compatibility:** The production build is bundled into a single `dist/index.html` file using Rollup's IIFE output, enabling the game to be opened directly from the file system (`file://`) without requiring a web server.
* **Architecture:** The codebase is organized into scenes, game objects, UI components, and systems to keep responsibilities separated and the project easy to maintain.

## Assumptions, Trade-offs & Future Improvements

**Scaling approach:** The game uses `Phaser.Scale.FIT` with a fixed 720x1280 logical resolution rather than `Phaser.Scale.RESIZE`. This guarantees consistent gameplay balance (basket speed, spawn positions, and difficulty tuning) across all devices, at the cost of letterboxing/pillarboxing on very wide or unusually shaped screens (e.g. ultra-wide monitors or tablets). Given the time constraints of this assessment, this was a deliberate trade-off to avoid destabilizing carefully tuned difficulty values. With more time, I would migrate to `Phaser.Scale.RESIZE` combined with a clamped, percentage-anchored gameplay area (max ~720px wide, centered), so the UI fills the full viewport while gameplay balance remains untouched.

**Object pooling:** Falling items use Phaser Group pooling with an `isCaught` flag to prevent items from being recycled mid-animation while their "caught" tween is still playing. This was specifically hardened against a race condition where a caught item could otherwise be reused before its catch animation finished, causing visual glitches.

**Scene transitions:** Play/Play Again buttons are guarded with an `isTransitioning` flag and immediate `disableInteractive()` on click, preventing rapid double-clicks from queueing duplicate scene starts or corrupting game state.

**Delta time safety:** Falling item movement clamps `delta` to a maximum of 33ms per frame to prevent "tunneling" — where a lag spike or backgrounded browser tab could otherwise cause an item to jump far enough in a single frame to skip past the basket's collision bounds entirely.

**With more time, I would:**
- Implement full `RESIZE`-based responsive scaling with dynamic UI anchoring instead of the current FIT/letterbox approach.
- Add automated tests around the Spawner pooling logic and win/loss edge cases.
- Add more visual/audio variety (combo streaks, difficulty-based music layering).
- Add a settings menu (mute toggle, difficulty selection).
- Add a pause/resume feature for mobile background/foreground transitions.

## Asset Attribution

- **Visuals:** All in-game graphics are procedurally drawn with Phaser — no third-party image assets.
- **Audio:** Procedurally generated short WAV tones created by `scripts/encode-assets.js` (no external audio files required).
- **Framework:** [Phaser 3](https://phaser.io/) (MIT License).