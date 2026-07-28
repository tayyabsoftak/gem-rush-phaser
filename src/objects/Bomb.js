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

  onCaught() {
    this.despawn();
  }

  onMissed() {
    this.despawn();
  }
}
