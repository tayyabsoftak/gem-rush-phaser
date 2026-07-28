import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class Basket extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.basketWidth = GameConfig.basketWidth;
    this.basketHeight = GameConfig.basketHeight;

    this.graphics = scene.add.graphics();
    this.drawBasket();
    this.add(this.graphics);

    scene.add.existing(this);
    this.setDepth(10);
  }

  drawBasket() {
    const w = this.basketWidth;
    const h = this.basketHeight;
    const g = this.graphics;

    g.clear();
    g.fillStyle(GameConfig.colors.basketRim, 1);
    g.fillRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 8);
    g.fillStyle(GameConfig.colors.basket, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    g.lineStyle(2, 0xffffff, 0.4);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);
  }

  setPositionX(x) {
    const half = this.basketWidth / 2;
    const clamped = Phaser.Math.Clamp(x, half + 10, this.scene.scale.width - half - 10);
    this.x = clamped;
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
