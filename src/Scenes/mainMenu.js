class mainMenu extends Phaser.Scene {
    constructor() {
      super('MainMenu');
    }
  
    preload() {
      // load any menu assets here (e.g. background image, button sprites)
    }
  
    create() {
      const { width, height } = this.scale;
  
      // Title text
      this.add.text(width/2, height/3, 'SHMUP Demo', {
        fontSize: '48px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      // “Start” button
      const startBtn = this.add.text(width/2, height/2, '▶ Start', {
        fontSize: '32px',
        fill: '#0f0'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
      startBtn.on('pointerdown', () => {
        this.scene.start('oneD');    // go to the main game
      });
    }
  }
  
  // expose globally
  window.mainMenu = mainMenu;

  