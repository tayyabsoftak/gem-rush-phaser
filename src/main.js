import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig.js';
import BootScene from './scenes/BootScene.js';
import EndScene from './scenes/EndScene.js';
import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import TitleScene from './scenes/TitleScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GameConfig.width,
  height: GameConfig.height,
  backgroundColor: `#${GameConfig.colors.background.toString(16).padStart(6, '0')}`,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, TitleScene, GameScene, EndScene],
  audio: {
    disableWebAudio: true,
  },
  banner: false,
};

new Phaser.Game(config);