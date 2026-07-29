import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { Button } from '../ui/Button.js';
import { AmbientBackground } from '../objects/AmbientBackground.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(500, 0, 0, 0);

    new AmbientBackground(this);

    const title = this.add.text(width / 2, height * 0.28, 'GEM RUSH', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.12)}px`,
      color: GameConfig.colors.titleText,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: GameConfig.colors.titleText, blur: 15, stroke: true, fill: true }
    });
    title.setOrigin(0.5);
    
    this.tweens.add({
      targets: title,
      y: title.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const subtitle = this.add.text(width / 2, height * 0.38, 'Catch 20 gems in 45 seconds!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.04)}px`,
      color: '#e0f7fa',
    });
    subtitle.setOrigin(0.5);

    new Button(this, width / 2, height * 0.72, 'Play', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });

    this.events.once('shutdown', this.handleShutdown, this);
  }

  handleShutdown() {
    this.tweens.killAll();
    this.input.off('pointerdown');
  }
}
