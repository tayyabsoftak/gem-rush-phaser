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
    this.isCaught = false;
    this.scene.tweens.killTweensOf(this);
    this.setScale(1);
    this.setAlpha(1);
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
    this.isCaught = false;
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

  onCaught(basket) {
    this.isCaught = true;
    this.stopIdleAnimation();

    if (basket) {
      this.scene.tweens.add({
        targets: this,
        x: basket.x,
        y: basket.y,
        scale: 0,
        alpha: 0.5,
        duration: 150,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.despawn();
          this.setScale(1);
          this.setAlpha(1);
        }
      });
    } else {
      this.despawn();
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
