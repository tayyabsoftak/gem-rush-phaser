import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class ScorePopup extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, color = '#00e5ff') {
    super(scene, x, y);

    const label = scene.add.text(0, 0, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    });
    label.setOrigin(0.5);
    this.add(label);

    const particles = scene.add.graphics();
    const numericColor = Phaser.Display.Color.HexStringToColor(color).color;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 20 + Math.random() * 20;
      particles.fillStyle(numericColor, 0.8);
      particles.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 4 + Math.random() * 3);
    }
    this.add(particles);

    scene.add.existing(this);
    this.setDepth(50);

    scene.tweens.add({
      targets: this,
      y: y - 60,
      alpha: 0,
      scale: 1.3,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: () => this.destroy(),
    });
  }

  static spawnGem(scene, x, y) {
    return new ScorePopup(scene, x, y, '+1', GameConfig.colors.titleText); // Using cyan text
  }

  static spawnBomb(scene, x, y) {
    return new ScorePopup(scene, x, y, '-1', '#ff2a55'); // Using red text
  }
}
