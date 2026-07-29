import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import { Button } from '../ui/Button.js';
import { AmbientBackground } from '../objects/AmbientBackground.js';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.won = data.won ?? false;
    this.finalScore = data.score ?? 0;
  }

  create() {
    this.isTransitioning = false;
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(500, 0, 0, 0);

    new AmbientBackground(this);
    
    // Add extra tint for End Scene based on win/lose
    const overlayColor = this.won ? 0x00f0ff : 0xff2a55;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, overlayColor, 0.15);
    overlay.setBlendMode(Phaser.BlendModes.ADD);

    const titleColor = this.won ? GameConfig.colors.winText : GameConfig.colors.loseText;
    const titleText = this.won ? 'YOU WIN!' : 'GAME OVER';

    const title = this.add.text(width / 2, height * 0.3, titleText, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.1)}px`,
      color: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: titleColor, blur: 20, stroke: true, fill: true }
    });
    title.setOrigin(0.5);
    
    if (this.won) {
      // Confetti effect
      for (let i = 0; i < 40; i++) {
        const conf = this.add.rectangle(width / 2, height * 0.3, 10, 20, Math.random() > 0.5 ? 0x00f0ff : 0xff007f);
        this.tweens.add({
          targets: conf,
          x: width / 2 + Phaser.Math.Between(-200, 200),
          y: height + 50,
          angle: Phaser.Math.Between(180, 720),
          duration: Phaser.Math.Between(1500, 3000),
          ease: 'Cubic.easeOut'
        });
      }
      
      this.tweens.add({
        targets: title,
        scale: { from: 0.5, to: 1 },
        duration: 800,
        ease: 'Bounce.easeOut'
      });
    } else {
      // Glitch/Wobble effect
      this.tweens.add({
        targets: title,
        x: { from: title.x - 5, to: title.x + 5 },
        duration: 50,
        yoyo: true,
        repeat: 10,
        ease: 'Linear',
        onComplete: () => title.setX(width / 2)
      });
    }

    const message = this.won
      ? 'You caught enough gems in time!'
      : 'Time ran out or you lost all lives.';

    const msg = this.add.text(width / 2, height * 0.42, message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.04)}px`,
      color: '#e0f7fa',
      align: 'center',
      wordWrap: { width: width * 0.8 },
    });
    msg.setOrigin(0.5);

    const scoreLabel = this.add.text(width / 2, height * 0.52, `Final Score: ${this.finalScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(width * 0.055)}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    scoreLabel.setOrigin(0.5);

    const playButton = new Button(this, width / 2, height * 0.68, 'Play Again', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      playButton.hitZone.disableInteractive();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    }, {
      fillColor: this.won ? 0x8a2be2 : 0xff2a55, // Violet for win, Red for lose
      hoverColor: this.won ? 0xb026ff : 0xff4a75,
      textColor: this.won ? '#00f0ff' : '#ffffff' // Cyan text for win, White for lose
    });

    this.events.once('shutdown', this.handleShutdown, this);
  }

  handleShutdown() {
    this.tweens.killAll();
  }
}
