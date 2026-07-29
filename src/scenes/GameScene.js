import Phaser from 'phaser';
import { DEBUG, GameConfig } from '../config/GameConfig.js';
import { Basket } from '../objects/Basket.js';
import { Bomb } from '../objects/Bomb.js';
import { Gem } from '../objects/Gem.js';
import { ScorePopup } from '../objects/ScorePopup.js';
import { SaveState } from '../systems/SaveState.js';
import { Spawner } from '../systems/Spawner.js';
import { AmbientBackground } from '../objects/AmbientBackground.js';
import { HUD } from '../ui/HUD.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.score = 0;
    this.lives = GameConfig.startingLives;
    this.timeRemaining = GameConfig.gameDuration;
    this.gameOver = false;
    this.isDragging = false;

    this.isDragging = false;

    this.cameras.main.fadeIn(500, 0, 0, 0);

    new AmbientBackground(this);

    this.basket = new Basket(this, this.scale.width / 2, this.scale.height * 0.88);

    this.gemGroup = this.add.group({ classType: Gem, maxSize: GameConfig.poolSize, runChildUpdate: true });
    this.bombGroup = this.add.group({ classType: Bomb, maxSize: GameConfig.poolSize, runChildUpdate: true });

    this.spawner = new Spawner(this, this.gemGroup, this.bombGroup);

    this.hud = new HUD(this);
    this.hud.updateScore(this.score, GameConfig.targetScore);
    this.hud.updateTimer(this.timeRemaining);
    this.hud.updateLives(this.lives);

    this.flashOverlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xff0000,
      0
    );
    this.flashOverlay.setDepth(200);
    this.flashOverlay.setScrollFactor(0);

    this.setupInput();
    this.spawner.start();

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickTimer(),
    });

    this.showInstructionsIfNeeded();

    this.events.once('shutdown', this.handleShutdown, this);

    if (DEBUG) console.log('[GameScene] Started');
  }

  handleShutdown() {
    this.input.off('pointerdown');
    this.input.off('pointermove');
    this.input.off('pointerup');

    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    if (this.spawner) {
      this.spawner.stop();
    }

    this.tweens.killAll();
  }

  // Removed createBackground in favor of AmbientBackground

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointerdown', (pointer) => {
      this.isDragging = true;
      this.basket.setPositionX(pointer.x);
      if (this.sound.locked) this.sound.unlock();
    });

    this.input.on('pointermove', (pointer) => {
      if (this.isDragging) {
        this.basket.setPositionX(pointer.x);
      }
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });
  }

  showInstructionsIfNeeded() {
    const save = SaveState.load();
    if (save.hasSeenInstructions) return;

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
    overlay.setDepth(150);
    overlay.setScrollFactor(0);

    const hint = this.add.text(width / 2, height * 0.45, 'Drag to move — catch gems, avoid bombs!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.045)}px`,
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width * 0.8 },
    });
    hint.setOrigin(0.5);
    hint.setDepth(151);
    hint.setScrollFactor(0);

    SaveState.markInstructionsSeen();

    this.tweens.add({
      targets: [overlay, hint],
      alpha: 0,
      delay: 2500,
      duration: 800,
      onComplete: () => {
        overlay.destroy();
        hint.destroy();
      },
    });
  }

  tickTimer() {
    if (this.gameOver) return;

    this.timeRemaining -= 1;
    this.hud.updateTimer(this.timeRemaining);

    if (this.timeRemaining > 0 && this.timeRemaining <= 10 && this.cache.audio.exists('tick')) {
      this.sound.play('tick', { volume: 0.35 });
    }

    if (this.timeRemaining <= 0) {
      this.endGame(false);
    }
  }

  update(time, delta) {
    if (this.gameOver) return;

    this.spawner.update(delta);

    let velocityX = 0;
    if (this.cursors.left.isDown) {
      this.basket.x -= 8;
      this.basket.setPositionX(this.basket.x);
      velocityX = -8;
    } else if (this.cursors.right.isDown) {
      this.basket.x += 8;
      this.basket.setPositionX(this.basket.x);
      velocityX = 8;
    } else if (this.isDragging) {
      velocityX = this.basket.x - (this.prevBasketX ?? this.basket.x);
    }
    this.prevBasketX = this.basket.x;

    if (velocityX < -2) this.basket.setTilt(-1);
    else if (velocityX > 2) this.basket.setTilt(1);
    else this.basket.setTilt(0);

    this.checkCollisions();
  }

  checkCollisions() {
    const groups = [this.gemGroup, this.bombGroup];

    for (const group of groups) {
      group.getChildren().forEach((item) => {
        if (!item.active || item.isCaught) return;
        if (item.overlapsBasket(this.basket)) {
          if (item.itemType === 'gem') {
            this.catchGem(item);
          } else if (item.itemType === 'bomb') {
            this.catchBomb(item);
          }
        }
      });
    }
  }

  catchGem(gem) {
    gem.onCaught(this.basket);
    this.basket.flash();
    this.score += 1;
    this.hud.updateScore(this.score, GameConfig.targetScore);
    ScorePopup.spawnGem(this, gem.x, gem.y);

    if (this.cache.audio.exists('catch')) {
      this.sound.play('catch', { volume: 0.5 });
    }

    if (this.score >= GameConfig.targetScore) {
      this.endGame(true);
    }
  }

  catchBomb(bomb) {
    bomb.onCaught(this.basket);
    this.lives -= 1;
    this.hud.updateLives(this.lives);
    this.hud.punchLives();
    ScorePopup.spawnBomb(this, bomb.x, bomb.y);

    if (this.cache.audio.exists('bomb')) {
      this.sound.play('bomb', { volume: 0.6 });
    }

    this.cameras.main.shake(200, 0.012);
    this.flashOverlay.setAlpha(0.35);
    this.tweens.add({
      targets: this.flashOverlay,
      alpha: 0,
      duration: 300,
    });

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  endGame(won) {
    if (this.gameOver) return;
    this.gameOver = true;

    this.spawner.stop();
    if (this.timerEvent) this.timerEvent.remove(false);

    if (won && this.cache.audio.exists('win')) {
      this.sound.play('win', { volume: 0.5 });
    } else if (!won && this.cache.audio.exists('lose')) {
      this.sound.play('lose', { volume: 0.5 });
    }

    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EndScene', { won, score: this.score });
    });
  }
}
