import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { Button } from '../ui/Button.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.won = data.won ?? false;
    this.finalScore = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    const bgColor = this.won ? 0x0d3320 : 0x331018;
    this.add.rectangle(width / 2, height / 2, width, height, bgColor);

    const titleColor = this.won ? GameConfig.colors.winText : GameConfig.colors.loseText;
    const titleText = this.won ? 'YOU WIN!' : 'GAME OVER';

    const title = this.add.text(width / 2, height * 0.3, titleText, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.1)}px`,
      color: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });
    title.setOrigin(0.5);

    const message = this.won
      ? 'You caught enough gems in time!'
      : 'Time ran out or you lost all lives.';

    const msg = this.add.text(width / 2, height * 0.42, message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.04)}px`,
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: width * 0.8 },
    });
    msg.setOrigin(0.5);

    const scoreLabel = this.add.text(width / 2, height * 0.52, `Final Score: ${this.finalScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.055)}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    });
    scoreLabel.setOrigin(0.5);

    new Button(this, width / 2, height * 0.68, 'Play Again', () => {
      this.scene.start('GameScene');
    }, {
      fillColor: this.won ? 0x2ecc71 : 0xe74c3c,
      hoverColor: this.won ? 0x3ddc81 : 0xf75c4c,
    });
  }
}
