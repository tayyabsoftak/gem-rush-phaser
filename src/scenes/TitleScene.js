import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { Button } from '../ui/Button.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, GameConfig.colors.background);

    const title = this.add.text(width / 2, height * 0.28, 'GEM RUSH', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.12)}px`,
      color: GameConfig.colors.titleText,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    title.setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height * 0.38, 'Catch 20 gems in 45 seconds!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.04)}px`,
      color: '#cccccc',
    });
    subtitle.setOrigin(0.5);

    this.drawDecorativeGem(width * 0.2, height * 0.5);
    this.drawDecorativeGem(width * 0.8, height * 0.55);
    this.drawDecorativeBomb(width * 0.5, height * 0.52);

    new Button(this, width / 2, height * 0.72, 'Play', () => {
      this.unlockAudio();
      this.scene.start('GameScene');
    });

    this.input.once('pointerdown', () => this.unlockAudio());
  }

  unlockAudio() {
    if (this.sound.locked) {
      this.sound.unlock();
    }
  }

  drawDecorativeGem(x, y) {
    const g = this.add.graphics();
    const size = 40;
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      points.push(new Phaser.Math.Vector2(x + Math.cos(angle) * size * 0.4, y + Math.sin(angle) * size * 0.4));
    }
    g.fillStyle(GameConfig.colors.gem, 0.7);
    g.fillPoints(points, true);
  }

  drawDecorativeBomb(x, y) {
    const g = this.add.graphics();
    g.fillStyle(GameConfig.colors.bomb, 0.7);
    g.fillCircle(x, y, 22);
  }
}
