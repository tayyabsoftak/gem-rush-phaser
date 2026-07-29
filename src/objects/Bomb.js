import { GameConfig } from '../config/GameConfig.js';
import { FallingItem } from './FallingItem.js';

export class Bomb extends FallingItem {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.itemType = 'bomb';

    this.graphics = scene.add.graphics();
    this.drawBomb();
    this.add(this.graphics);
  }

  drawBomb() {
    const size = GameConfig.itemSize;
    const g = this.graphics;
    g.clear();

    if (!this.glowGraphics) {
      this.glowGraphics = this.scene.add.graphics();
      this.addAt(this.glowGraphics, 0); // Put behind bomb
    }
    this.glowGraphics.clear();
    this.glowGraphics.fillStyle(GameConfig.colors.bomb, 0.5);
    this.glowGraphics.fillCircle(0, size * 0.05, size * 0.55);

    g.fillStyle(GameConfig.colors.bomb, 1);
    g.fillCircle(0, size * 0.05, size * 0.38);
    g.fillStyle(0x333333, 1);
    g.fillRect(-size * 0.06, -size * 0.35, size * 0.12, size * 0.18);

    g.lineStyle(3, GameConfig.colors.bombFuse, 1);
    g.beginPath();
    g.moveTo(0, -size * 0.35);
    g.lineTo(size * 0.12, -size * 0.48);
    g.strokePath();

    g.fillStyle(GameConfig.colors.bombFuse, 1);
    g.fillCircle(size * 0.12, -size * 0.48, size * 0.06);
  }

  startIdleAnimation() {
    this.scene.tweens.add({
      targets: this.graphics,
      angle: { from: -15, to: 15 },
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    if (this.glowGraphics) {
      this.scene.tweens.add({
        targets: this.glowGraphics,
        alpha: { from: 0.3, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  stopIdleAnimation() {
    if (this.scene) {
      if (this.graphics) this.scene.tweens.killTweensOf(this.graphics);
      if (this.glowGraphics) this.scene.tweens.killTweensOf(this.glowGraphics);
    }
    if (this.graphics) this.graphics.setAngle(0);
    if (this.glowGraphics) this.glowGraphics.setAlpha(1);
  }

  onCaught() {
    this.despawn();
  }

  onMissed() {
    this.despawn();
  }
}
