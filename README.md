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

## Assumptions, Trade-offs & Future Improvements

- **Graphics over bitmaps:** Gems, bombs, basket, and particles are drawn with Phaser `Graphics` to keep the single-file build well under the 5 MB limit. Only short procedural SFX WAV files are embedded.
- **Object pooling:** Gems and bombs reuse instances via Phaser Groups rather than create/destroy each spawn.
- **Instruction persistence:** First-visit hint text is stored in `localStorage` via `SaveState` so returning players aren't interrupted.
- **Audio:** Short tone-based WAV files are generated at build time if none exist in `raw/`. Mobile audio unlock happens on first tap in Title/Game scenes.
- **file:// delivery:** Production builds use Rollup `iife` output (not ES modules) so `dist/index.html` works when opened directly from disk, as required by playable-ad networks.
- **With more time:** Add sprite-based art from Kenney.nl, background music with careful compression, difficulty presets, touch-haptic feedback, and automated Playwright E2E tests for the full win/lose loop.

## Asset Attribution

- **Visuals:** All in-game graphics are procedurally drawn with Phaser — no third-party image assets.
- **Audio:** Procedurally generated short WAV tones created by `scripts/encode-assets.js` (no external audio files required).
- **Framework:** [Phaser 3](https://phaser.io/) (MIT License).
