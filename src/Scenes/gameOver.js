class gameOver extends Phaser.Scene {
    constructor() {
      super('GameOver');
    }
  
    init(data) {
      // receive the final score from oneD
      this.finalScore = data.score || 0;
    }
  
    create() {
      const { width, height } = this.scale;
  
      // “Game Over” text
      this.add.text(width/2, height/3, 'Game Over', {
        fontSize: '48px',
        fill: '#f00'
      }).setOrigin(0.5);
  
      // display final score
      this.add.text(width/2, height/2, `Score: ${this.finalScore}`, {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      // “Retry” button
      const retryBtn = this.add.text(width/2, height*2/3, '↻ Retry', {
        fontSize: '28px',
        fill: '#ff0'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
      retryBtn.on('pointerdown', () => {
        this.scene.start('oneD');    // restart the game
      });
  
      // “Main Menu” button
      const menuBtn = this.add.text(width/2, height*2/3 + 50, '☰ Menu', {
        fontSize: '24px',
        fill: '#0ff'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
      menuBtn.on('pointerdown', () => {
        this.scene.start('MainMenu');
      });
    }
  }
  
  // expose globally
  window.gameOver = gameOver;
  