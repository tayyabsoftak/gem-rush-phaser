import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export class HUD extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);

    const pad = scene.scale.width * 0.04;
    const fontSize = Math.round(scene.scale.width * 0.045);

    this.scoreText = scene.add.text(pad, pad, 'Gems: 0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: GameConfig.colors.hudText,
      fontStyle: 'bold',
    });
    this.add(this.scoreText);

    this.timerText = scene.add.text(scene.scale.width / 2, pad, '0:45', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: GameConfig.colors.hudText,
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(0.5, 0);
    this.add(this.timerText);

    const initialHearts = '♥ '.repeat(GameConfig.startingLives).trim();
    this.livesText = scene.add.text(scene.scale.width - pad, pad, initialHearts, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      color: '#ff6688',
      fontStyle: 'bold',
    });
    this.livesText.setOrigin(1, 0);
    this.add(this.livesText);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
  }

  updateScore(score, target) {
    this.scoreText.setText(`Gems: ${score}/${target}`);
  }

  updateTimer(secondsRemaining) {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = Math.max(0, Math.ceil(secondsRemaining % 60));
    this.timerText.setText(`${mins}:${secs.toString().padStart(2, '0')}`);

    if (secondsRemaining <= 10) {
      this.timerText.setColor('#ffaa44');
    } else {
      this.timerText.setColor(GameConfig.colors.hudText);
    }
  }

  updateLives(lives) {
    const hearts = '♥ '.repeat(Math.max(0, lives)).trim();
    this.livesText.setText(hearts || '—');
  }
}
