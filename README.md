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

```
├── src/
│   ├── main.js                 # Phaser game bootstrap
│   ├── config/GameConfig.js    # All tunable game values
│   ├── scenes/                 # Boot, Preload, Title, Game, End
│   ├── objects/                # Basket, FallingItem, Gem, Bomb, ScorePopup
│   ├── ui/                     # Button, HUD
│   ├── systems/                # Spawner, SaveState
│   └── assets/
│       ├── raw/                # Source audio/image files
│       └── encoded/            # Generated base64 manifest
├── scripts/
│   ├── encode-assets.js        # Builds assetManifest.js from raw/
│   └── size-check.js           # Validates dist/index.html size
├── dist/index.html             # Single-file production deliverable
├── vite.config.js
└── package.json
```

## Project Overview & Technical Decisions

This project was built as a mobile-first Phaser 3 arcade game for a technical assessment. The implementation focuses on clean architecture, performance, and meeting the assessment requirements while keeping the production build self-contained and lightweight.

* **Graphics:** All game visuals (basket, gems, bombs, particles, and UI elements) are procedurally drawn using Phaser `Graphics`, eliminating the need for external image assets and helping keep the build size under the required limit.
* **Performance:** Falling objects are managed using object pooling through Phaser Groups to minimize object creation and garbage collection during gameplay.
* **Configuration:** Gameplay values such as spawn rates, movement speed, timers, and scoring are centralized in `GameConfig.js` for easier maintenance and tuning.
* **State Management:** Player progress, including whether the instructional overlay has already been shown, is persisted using `localStorage` through the `SaveState` system.
* **Audio:** Sound effects are procedurally generated and embedded into the final build, allowing the game to run completely offline without external assets.
* **Offline Compatibility:** The production build is bundled into a single `dist/index.html` file using Rollup's IIFE output, enabling the game to be opened directly from the file system (`file://`) without requiring a web server.
* **Architecture:** The codebase is organized into scenes, game objects, UI components, and systems to keep responsibilities separated and the project easy to maintain.

## Asset Attribution

- **Visuals:** All in-game graphics are procedurally drawn with Phaser — no third-party image assets.
- **Audio:** Procedurally generated short WAV tones created by `scripts/encode-assets.js` (no external audio files required).
- **Framework:** [Phaser 3](https://phaser.io/) (MIT License).
