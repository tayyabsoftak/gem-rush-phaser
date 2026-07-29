import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, options = {}) {
    super(scene, x, y);

    const {
      width = 280,
      height = 72,
      fontSize = 28,
      fillColor = 0xff007f,
      hoverColor = 0xff3399,
      textColor = '#ffffff',
    } = options;

    this.buttonWidth = width;
    this.buttonHeight = height;
    this.fillColor = fillColor;
    this.hoverColor = hoverColor;
    this.onClick = onClick;
    this.isPressed = false;

    this.bg = scene.add.graphics();
    this.drawBackground(fillColor);
    this.add(this.bg);

    this.label = scene.add.text(0, 0, label, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: textColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.label.setOrigin(0.5);
    this.label.disableInteractive();
    this.add(this.label);

    this.hitZone = scene.add.zone(0, 0, width, height);
    this.hitZone.setInteractive({ useHandCursor: true });
    this.add(this.hitZone);

    this.hitZone.on('pointerover', () => {
      this.drawBackground(hoverColor);
      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scale: 1.05,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    this.hitZone.on('pointerout', () => {
      this.drawBackground(fillColor);
      this.isPressed = false;
      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scale: 1,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    this.hitZone.on('pointerdown', () => {
      this.isPressed = true;
      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scale: 0.95,
        duration: 50,
        ease: 'Quad.easeOut'
      });
    });

    this.hitZone.on('pointerup', () => {
      if (!this.isPressed) return;
      this.isPressed = false;
      scene.tweens.killTweensOf(this);
      scene.tweens.add({
        targets: this,
        scale: 1.05,
        duration: 100,
        ease: 'Quad.easeOut',
        onComplete: () => {
          if (onClick) onClick();
        }
      });
    });

    scene.add.existing(this);
    this.setDepth(10);
  }

  drawBackground(color) {
    const w = this.buttonWidth;
    const h = this.buttonHeight;
    this.bg.clear();
    
    // Outer glow
    this.bg.fillStyle(color, 0.4);
    this.bg.fillRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 18);
    
    // Main body
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    
    // Inner border
    this.bg.lineStyle(3, 0xffffff, 0.8);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
  }
}
