import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class FallingItem extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.fallSpeed = GameConfig.fallSpeedMin;
    this.itemType = 'generic';

    scene.add.existing(this);
    this.setDepth(5);
    this.despawn();
  }

  spawn(x, fallSpeed) {
    this.setPosition(x, -GameConfig.itemSize);
    this.fallSpeed = fallSpeed;
    this.setVisible(true);
    this.setActive(true);
    this.startIdleAnimation();
    return this;
  }

  despawn() {
    this.setVisible(false);
    this.setActive(false);
    this.setPosition(-100, -100);
    this.stopIdleAnimation();
  }

  startIdleAnimation() {}
  stopIdleAnimation() {}

  preUpdate(time, delta) {
    if (!this.active) return;

    this.y += (this.fallSpeed * delta) / 1000;

    if (this.y > this.scene.scale.height + GameConfig.itemSize) {
      this.onMissed();
    }
  }

  onMissed() {
    this.despawn();
  }

  getHitRadius() {
    return GameConfig.itemSize * 0.45;
  }

  overlapsBasket(basket) {
    const bounds = basket.getHitBounds();
    const radius = this.getHitRadius();
    const closestX = Phaser.Math.Clamp(this.x, bounds.x, bounds.x + bounds.width);
    const closestY = Phaser.Math.Clamp(this.y, bounds.y, bounds.y + bounds.height);
    const dx = this.x - closestX;
    const dy = this.y - closestY;
    return dx * dx + dy * dy <= radius * radius;
  }
}
