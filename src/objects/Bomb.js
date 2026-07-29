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
    // Inner pulsating core glow
    this.glowGraphics.fillStyle(GameConfig.colors.bombFuse, 0.6);
    this.glowGraphics.fillCircle(0, size * 0.05, size * 0.6);

    // Spiky outer shell (16 points, alternating radius)
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const radius = (i % 2 === 0) ? size * 0.45 : size * 0.35;
      pts.push(new Phaser.Math.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius + size * 0.05));
    }
    g.fillStyle(GameConfig.colors.bomb, 1);
    g.fillPoints(pts, true);
    g.lineStyle(2, 0xff0000, 0.8);
    g.strokePoints(pts, true);
    
    // Core (darker inside)
    g.fillStyle(0x330011, 1);
    g.fillCircle(0, size * 0.05, size * 0.2);

    // Fuse Base
    g.fillStyle(0x222222, 1);
    g.fillRect(-size * 0.06, -size * 0.4, size * 0.12, size * 0.18);

    // Fuse Wire
    g.lineStyle(4, GameConfig.colors.bombFuse, 1);
    g.beginPath();
    g.moveTo(0, -size * 0.4);
    g.lineTo(size * 0.15, -size * 0.55);
    g.strokePath();

    if (!this.sparkGraphics) {
      this.sparkGraphics = this.scene.add.graphics();
      this.add(this.sparkGraphics);
    }
    this.sparkGraphics.clear();
    this.sparkGraphics.fillStyle(0xffaa00, 1); // Orange/Yellow spark
    this.sparkGraphics.fillCircle(size * 0.15, -size * 0.55, size * 0.12);
    this.sparkGraphics.fillStyle(0xffffff, 1);
    this.sparkGraphics.fillCircle(size * 0.15, -size * 0.55, size * 0.06);
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
        alpha: { from: 0.2, to: 1 },
        scale: { from: 0.8, to: 1.1 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    if (this.sparkGraphics) {
      this.scene.tweens.add({
        targets: this.sparkGraphics,
        scale: { from: 0.6, to: 1.2 },
        alpha: { from: 0.5, to: 1 },
        duration: 60,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  stopIdleAnimation() {
    if (this.scene) {
      if (this.graphics) this.scene.tweens.killTweensOf(this.graphics);
      if (this.glowGraphics) this.scene.tweens.killTweensOf(this.glowGraphics);
      if (this.sparkGraphics) this.scene.tweens.killTweensOf(this.sparkGraphics);
    }
    if (this.graphics) this.graphics.setAngle(0);
    if (this.glowGraphics) this.glowGraphics.setAlpha(1);
  }

  // onCaught and onMissed are handled by FallingItem
}
