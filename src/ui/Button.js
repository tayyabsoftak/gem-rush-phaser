import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, options = {}) {
    super(scene, x, y);

    const {
      width = 280,
      height = 72,
      fontSize = 28,
      fillColor = 0x4a90d9,
      hoverColor = 0x5aa0e9,
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
    });
    this.label.setOrigin(0.5);
    this.label.disableInteractive();
    this.add(this.label);

    // Zone origin defaults to 0.5/0.5 — matches background drawn around (0,0)
    this.hitZone = scene.add.zone(0, 0, width, height);
    this.hitZone.setInteractive({ useHandCursor: true });
    this.add(this.hitZone);

    this.hitZone.on('pointerover', () => {
      this.drawBackground(hoverColor);
    });

    this.hitZone.on('pointerout', () => {
      this.drawBackground(fillColor);
      this.isPressed = false;
      this.setScale(1);
    });

    this.hitZone.on('pointerdown', () => {
      this.isPressed = true;
      this.setScale(0.96);
    });

    this.hitZone.on('pointerup', () => {
      if (!this.isPressed) return;
      this.isPressed = false;
      this.setScale(1);
      if (onClick) onClick();
    });

    scene.add.existing(this);
    this.setDepth(10);
  }

  drawBackground(color) {
    const w = this.buttonWidth;
    const h = this.buttonHeight;
    this.bg.clear();
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    this.bg.lineStyle(3, 0xffffff, 0.3);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
  }
}
