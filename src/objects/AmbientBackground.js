import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class AmbientBackground extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    this.scene = scene;
    const { width, height } = scene.scale;
    this.w = width;
    this.h = height;

    // Richer gradient background
    this.bg = scene.add.graphics();
    this.bg.fillGradientStyle(0x130a2b, 0x130a2b, 0x2d0b4e, 0x2d0b4e, 1);
    this.bg.fillRect(0, 0, width, height);
    this.add(this.bg);

    // Diagonal stripes graphics
    this.stripesGraphics = scene.add.graphics();
    this.stripesGraphics.setAlpha(0.15);
    this.add(this.stripesGraphics);
    this.stripeOffset = 0;

    // Sparkles group
    this.sparkles = scene.add.group();
    for (let i = 0; i < 12; i++) {
      this.spawnSparkle(true);
    }

    scene.add.existing(this);
    this.setDepth(-100);

    this.updateEvent = scene.time.addEvent({
      delay: 30, // ~33fps for background
      loop: true,
      callback: () => this.updateBackground(),
    });

    scene.events.once('shutdown', this.shutdown, this);
  }

  spawnSparkle(initial = false) {
    const x = Phaser.Math.Between(0, this.w);
    const y = Phaser.Math.Between(0, this.h);
    const isTeal = Math.random() > 0.5;
    const color = isTeal ? GameConfig.colors.gem : GameConfig.colors.bombFuse; // Teal or Pink
    const size = Phaser.Math.FloatBetween(4, 12);
    
    const sparkle = this.scene.add.graphics();
    sparkle.fillStyle(color, 1);
    
    // Draw 4-pointed star
    sparkle.beginPath();
    sparkle.moveTo(0, -size);
    sparkle.lineTo(size * 0.2, -size * 0.2);
    sparkle.lineTo(size, 0);
    sparkle.lineTo(size * 0.2, size * 0.2);
    sparkle.lineTo(0, size);
    sparkle.lineTo(-size * 0.2, size * 0.2);
    sparkle.lineTo(-size, 0);
    sparkle.lineTo(-size * 0.2, -size * 0.2);
    sparkle.closePath();
    sparkle.fillPath();

    sparkle.setPosition(x, y);
    sparkle.setAlpha(initial ? Phaser.Math.FloatBetween(0.1, 0.8) : 0);
    sparkle.scaleTimer = Math.random() * Math.PI * 2;
    sparkle.speed = Phaser.Math.FloatBetween(0.02, 0.05);

    this.sparkles.add(sparkle);
    this.add(sparkle);
  }

  updateBackground() {
    // 1. Animate stripes
    this.stripeOffset = (this.stripeOffset + 1) % 100;
    this.stripesGraphics.clear();
    this.stripesGraphics.lineStyle(40, GameConfig.colors.basketRim, 1);
    
    // Draw diagonal lines
    const step = 100;
    const maxDimension = this.w + this.h;
    for (let i = -this.h; i < maxDimension; i += step) {
      const pos = i + this.stripeOffset;
      this.stripesGraphics.beginPath();
      this.stripesGraphics.moveTo(pos, 0);
      this.stripesGraphics.lineTo(pos - this.h, this.h);
      this.stripesGraphics.strokePath();
    }

    // 2. Animate sparkles
    const children = this.sparkles.getChildren();
    for (let i = children.length - 1; i >= 0; i--) {
      const sp = children[i];
      sp.scaleTimer += sp.speed;
      
      // Sine wave for pulsing alpha and scale
      const pulse = Math.abs(Math.sin(sp.scaleTimer));
      sp.setAlpha(pulse * 0.8);
      sp.setScale(0.5 + pulse * 0.5);
      sp.rotation += 0.01;

      // Slowly float upwards
      sp.y -= 0.5;

      if (sp.y < -20 || sp.scaleTimer > Math.PI * 4) {
        this.sparkles.remove(sp, true, true);
        this.spawnSparkle(false);
      }
    }
  }

  shutdown() {
    if (this.updateEvent) {
      this.updateEvent.remove(false);
      this.updateEvent = null;
    }
    if (this.sparkles) {
      this.sparkles.destroy(true, true);
      this.sparkles = null;
    }
  }
}
