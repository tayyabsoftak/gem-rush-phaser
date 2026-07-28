export const DEBUG = false;

export const GameConfig = {
  width: 720,
  height: 1280,

  targetScore: 20,
  startingLives: 3,
  gameDuration: 45,

  spawnIntervalMin: 900,
  spawnIntervalMax: 2200,
  fallSpeedMin: 180,
  fallSpeedMax: 320,
  difficultyRampRate: 0.035,
  bombChance: 0.22,

  basketWidth: 140,
  basketHeight: 44,
  itemSize: 52,

  poolSize: 24,

  colors: {
    background: 0x1a1a2e,
    gem: 0x00e5ff,
    gemHighlight: 0x80ffff,
    bomb: 0xff4444,
    bombFuse: 0xffaa00,
    basket: 0xc8a951,
    basketRim: 0x8b6914,
    hudText: '#ffffff',
    titleText: '#ffd700',
    winText: '#00ff88',
    loseText: '#ff4466',
  },
};
