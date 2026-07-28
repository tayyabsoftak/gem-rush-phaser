import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { Bomb } from '../objects/Bomb.js';
import { Gem } from '../objects/Gem.js';

export class Spawner {
  constructor(scene, gemGroup, bombGroup) {
    this.scene = scene;
    this.gemGroup = gemGroup;
    this.bombGroup = bombGroup;
    this.elapsed = 0;
    this.spawnEvent = null;
    this.difficulty = 0;
  }

  start() {
    this.elapsed = 0;
    this.difficulty = 0;
    this.scheduleNext();
  }

  stop() {
    if (this.spawnEvent) {
      this.spawnEvent.remove(false);
      this.spawnEvent = null;
    }
  }

  update(delta) {
    this.elapsed += delta;
    this.difficulty = Math.min(1, (this.elapsed / 1000) * GameConfig.difficultyRampRate);
  }

  scheduleNext() {
    if (this.spawnEvent) {
      this.spawnEvent.remove(false);
    }

    const interval = Phaser.Math.Linear(
      GameConfig.spawnIntervalMax,
      GameConfig.spawnIntervalMin,
      this.difficulty
    );

    this.spawnEvent = this.scene.time.addEvent({
      delay: interval,
      callback: () => {
        this.spawnItem();
        this.scheduleNext();
      },
    });
  }

  spawnItem() {
    const margin = GameConfig.itemSize;
    const x = Phaser.Math.Between(margin, this.scene.scale.width - margin);

    const fallSpeed = Phaser.Math.Linear(
      GameConfig.fallSpeedMin,
      GameConfig.fallSpeedMax,
      this.difficulty
    );

    const isBomb = Math.random() < GameConfig.bombChance;
    const group = isBomb ? this.bombGroup : this.gemGroup;

    let item = group.getFirstDead(false);
    if (!item) {
      if (group.getLength() >= GameConfig.poolSize) return;
      item = isBomb
        ? new Bomb(this.scene, x, -GameConfig.itemSize)
        : new Gem(this.scene, x, -GameConfig.itemSize);
      group.add(item);
    }

    item.spawn(x, fallSpeed);
  }
}
