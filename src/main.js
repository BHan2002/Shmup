// before: scene: [oneD]
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    render: { pixelArt: true },
    scene: [ mainMenu, oneD, gameOver ]
  };
  
  const game = new Phaser.Game(config);
  