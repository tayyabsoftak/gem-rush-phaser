import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { FallingItem } from './FallingItem.js';

export class Gem extends FallingItem {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.itemType = 'gem';

    this.graphics = scene.add.graphics();
    this.drawGem();
    this.add(this.graphics);
  }

  drawGem() {
    const size = GameConfig.itemSize;
    const g = this.graphics;
    g.clear();

    const points = [];
    const sides = 6;
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      points.push(new Phaser.Math.Vector2(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4));
    }

    g.fillStyle(GameConfig.colors.gem, 1);
    g.fillPoints(points, true);
    g.lineStyle(2, GameConfig.colors.gemHighlight, 0.8);
    g.strokePoints(points, true);

    g.fillStyle(0xffffff, 0.35);
    g.fillCircle(-size * 0.1, -size * 0.12, size * 0.08);
  }

  startIdleAnimation() {
    this.scene.tweens.add({
      targets: this.graphics,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    this.scene.tweens.add({
      targets: this.graphics,
      scale: 1.15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  stopIdleAnimation() {
    if (this.scene && this.graphics) {
      this.scene.tweens.killTweensOf(this.graphics);
    }
    if (this.graphics) {
      this.graphics.setAngle(0);
      this.graphics.setScale(1);
    }
  }

  onCaught() {
    this.despawn();
  }

  onMissed() {
    this.despawn();
  }
}
