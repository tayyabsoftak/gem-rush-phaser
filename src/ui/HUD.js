import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class HUD extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);

    const pad = scene.scale.width * 0.04;
    const fontSize = Math.round(scene.scale.width * 0.045);
    const pillHeight = fontSize * 1.8;
    const pillRadius = pillHeight / 2;
    const textColor = GameConfig.colors.hudText;
    const bgColor = 0x8a2be2;
    const bgAlpha = 0.5;

    // Score Group
    this.scoreGroup = scene.add.container(pad, pad);
    this.scoreBg = scene.add.graphics();
    this.scoreGroup.add(this.scoreBg);
    this.scoreText = scene.add.text(pillRadius, pillHeight / 2, 'Gems: 0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: textColor,
      fontStyle: 'bold',
    });
    this.scoreText.setOrigin(0, 0.5);
    this.scoreGroup.add(this.scoreText);
    this.add(this.scoreGroup);

    // Timer Group
    this.timerGroup = scene.add.container(scene.scale.width / 2, pad);
    this.timerBg = scene.add.graphics();
    this.timerGroup.add(this.timerBg);
    this.timerText = scene.add.text(0, pillHeight / 2, '0:45', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: textColor,
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(0.5, 0.5);
    this.timerGroup.add(this.timerText);
    this.add(this.timerGroup);

    // Lives Group
    const initialHearts = '♥ '.repeat(GameConfig.startingLives).trim();
    this.livesGroup = scene.add.container(scene.scale.width - pad, pad);
    this.livesBg = scene.add.graphics();
    this.livesGroup.add(this.livesBg);
    this.livesText = scene.add.text(-pillRadius, pillHeight / 2, initialHearts, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: '#ff2a55',
      fontStyle: 'bold',
    });
    this.livesText.setOrigin(1, 0.5);
    this.livesGroup.add(this.livesText);
    this.add(this.livesGroup);

    this.pillRadius = pillRadius;
    this.pillHeight = pillHeight;
    this.bgColor = bgColor;
    this.bgAlpha = bgAlpha;

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
    
    // Initial draw
    this.updateScore(0, GameConfig.targetScore);
    this.updateTimer(GameConfig.gameDuration);
    this.updateLives(GameConfig.startingLives);
  }

  drawPill(graphics, width, height, radius, originX, originY) {
    graphics.clear();
    graphics.fillStyle(this.bgColor, this.bgAlpha);
    const x = -width * originX;
    const y = -height * originY;
    graphics.fillRoundedRect(x, 0, width, height, radius);
    graphics.lineStyle(2, GameConfig.colors.basketRim, 0.8);
    graphics.strokeRoundedRect(x, 0, width, height, radius);
  }

  updateScore(score, target) {
    this.scoreText.setText(`Gems: ${score}/${target}`);
    const w = this.scoreText.width + this.pillRadius * 2;
    this.drawPill(this.scoreBg, w, this.pillHeight, this.pillRadius, 0, 0);
  }

  updateTimer(secondsRemaining) {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = Math.max(0, Math.ceil(secondsRemaining % 60));
    this.timerText.setText(`${mins}:${secs.toString().padStart(2, '0')}`);
    const w = this.timerText.width + this.pillRadius * 2;
    this.drawPill(this.timerBg, w, this.pillHeight, this.pillRadius, 0.5, 0);

    if (secondsRemaining <= 10) {
      this.timerText.setColor('#ff2a55');
    } else {
      this.timerText.setColor(GameConfig.colors.hudText);
    }
  }

  updateLives(lives) {
    const hearts = '♥ '.repeat(Math.max(0, lives)).trim();
    this.livesText.setText(hearts || '—');
    const w = this.livesText.width + this.pillRadius * 2;
    this.drawPill(this.livesBg, w, this.pillHeight, this.pillRadius, 1, 0);
  }

  punchScore() {
    this.scene.tweens.killTweensOf(this.scoreGroup);
    this.scoreGroup.setScale(1);
    this.scene.tweens.add({
      targets: this.scoreGroup,
      scale: 1.3,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  punchLives() {
    this.scene.tweens.killTweensOf(this.livesGroup);
    this.livesGroup.setScale(1);
    this.scene.tweens.add({
      targets: this.livesGroup,
      scale: 1.3,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }
}
