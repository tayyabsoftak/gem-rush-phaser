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
    background: 0x110f1c,
    gem: 0x00f0ff,
    gemHighlight: 0xaaffff,
    bomb: 0xff2a55,
    bombFuse: 0xff007f,
    basket: 0x8a2be2,
    basketRim: 0xb026ff,
    hudText: '#ffffff',
    titleText: '#00f0ff',
    winText: '#00f0ff',
    loseText: '#ff2a55',
  },
};
