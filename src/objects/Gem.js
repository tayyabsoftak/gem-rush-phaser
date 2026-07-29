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

    const sides = 6;
    const getPoints = (scale) => {
      const pts = [];
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        pts.push(new Phaser.Math.Vector2(Math.cos(angle) * size * scale, Math.sin(angle) * size * scale));
      }
      return pts;
    };

    // Outer glow / refraction layer
    g.fillStyle(GameConfig.colors.gem, 0.4);
    g.fillPoints(getPoints(0.55), true);

    // Main body
    g.fillStyle(GameConfig.colors.gem, 1);
    g.fillPoints(getPoints(0.4), true);
    
    // Core highlight
    g.fillStyle(0xe0ffff, 0.9);
    g.fillPoints(getPoints(0.2), true);

    // Specular highlight
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(-size * 0.1, -size * 0.12, size * 0.05);
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

  // onCaught and onMissed are handled by FallingItem
}
