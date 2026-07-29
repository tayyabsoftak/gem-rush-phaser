import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class Basket extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.basketWidth = GameConfig.basketWidth;
    this.basketHeight = GameConfig.basketHeight;

    // Outer glow for the catch zone
    this.catchGlow = scene.add.graphics();
    this.add(this.catchGlow);

    this.graphics = scene.add.graphics();
    this.drawBasket();
    this.add(this.graphics);

    this.currentTilt = 0;
    this.targetTilt = 0;

    this.updateListener = () => this.updateBasket();
    scene.events.on('update', this.updateListener);
    scene.events.once('shutdown', () => {
      scene.events.off('update', this.updateListener);
    });

    scene.add.existing(this);
    this.setDepth(10);
  }

  drawBasket() {
    const w = this.basketWidth;
    const h = this.basketHeight;
    const g = this.graphics;

    g.clear();

    // Draw trapezoid body
    // Extend the bottom visually so it looks like a deep basket, not a plate.
    const topW = w;
    const botW = w * 0.6;
    const topY = -h / 2;
    const botY = h * 1.5; 

    g.fillStyle(GameConfig.colors.basket, 1);
    g.beginPath();
    g.moveTo(-topW / 2, topY);
    g.lineTo(topW / 2, topY);
    g.lineTo(botW / 2, botY);
    g.lineTo(-botW / 2, botY);
    g.closePath();
    g.fillPath();

    // Draw some vertical "ribs" to make it look like a basket
    g.lineStyle(3, 0x000000, 0.3);
    for (let i = -2; i <= 2; i++) {
      const offsetXTop = i * (topW / 6);
      const offsetXBot = i * (botW / 6);
      g.beginPath();
      g.moveTo(offsetXTop, topY);
      g.lineTo(offsetXBot, botY);
      g.strokePath();
    }

    // Draw outer neon rim for the body
    g.lineStyle(4, GameConfig.colors.basketRim, 1);
    g.beginPath();
    g.moveTo(-topW / 2, topY);
    g.lineTo(topW / 2, topY);
    g.lineTo(botW / 2, botY);
    g.lineTo(-botW / 2, botY);
    g.closePath();
    g.strokePath();

    // Draw top opening (ellipse to give 3D bowl feel)
    g.fillStyle(0x3a1059, 1); // Darker inside
    g.fillEllipse(0, topY, topW, h * 0.6);
    g.lineStyle(4, GameConfig.colors.basketRim, 1);
    g.strokeEllipse(0, topY, topW, h * 0.6);
    g.lineStyle(2, 0xffffff, 0.6); // Specular highlight
    g.strokeEllipse(0, topY, topW, h * 0.6);

    // Initial state for catch glow
    this.catchGlow.clear();
    this.catchGlow.fillStyle(GameConfig.colors.gem, 0.6);
    this.catchGlow.fillEllipse(0, topY, topW * 1.2, h * 0.8);
    this.catchGlow.setAlpha(0);
  }

  setPositionX(x) {
    const half = this.basketWidth / 2;
    const clamped = Phaser.Math.Clamp(x, half + 10, this.scene.scale.width - half - 10);
    this.x = clamped;
  }

  setTilt(direction) {
    // direction: -1 (left), 0 (none), 1 (right)
    this.targetTilt = direction * 12; // 12 degrees max tilt
  }

  updateBasket() {
    // Smoothly interpolate current angle towards target tilt
    this.currentTilt = Phaser.Math.Linear(this.currentTilt, this.targetTilt, 0.15);
    this.setAngle(this.currentTilt);
  }

  flash() {
    this.scene.tweens.killTweensOf(this.catchGlow);
    this.catchGlow.setAlpha(1);
    this.catchGlow.setScale(1.2);
    
    this.scene.tweens.add({
      targets: this.catchGlow,
      alpha: 0,
      scale: 0.8,
      duration: 300,
      ease: 'Quad.easeOut'
    });
  }

  getHitBounds() {
    return new Phaser.Geom.Rectangle(
      this.x - this.basketWidth / 2,
      this.y - this.basketHeight / 2,
      this.basketWidth,
      this.basketHeight
    );
  }
}

