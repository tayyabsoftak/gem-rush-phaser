import Phaser from 'phaser';
import { assetManifest } from '../assets/encoded/assetManifest.js';
import { GameConfig } from '../config/GameConfig.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const barWidth = GameConfig.width * 0.6;
    const barHeight = 24;
    const cx = GameConfig.width / 2;
    const cy = GameConfig.height / 2;

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.9);
    progressBox.fillRoundedRect(cx - barWidth / 2 - 8, cy - barHeight / 2 - 8, barWidth + 16, barHeight + 16, 8);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(cx, cy - 50, 'Loading...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      // Fix for the 2 dots issue: only draw when there's enough width for the rounded corners
      if (value > 0.05) {
        progressBar.fillStyle(0x00f0ff, 1);
        progressBar.fillRoundedRect(cx - barWidth / 2, cy - barHeight / 2, barWidth * value, barHeight, 6);
      }
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    for (const [key, dataUri] of Object.entries(assetManifest.images)) {
      this.load.image(key, dataUri);
    }

    for (const [key, dataUri] of Object.entries(assetManifest.audio)) {
      this.load.audio(key, dataUri);
    }
  }

  create() {
    this.scene.start('TitleScene');
  }
}
