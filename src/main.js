// before: scene: [oneD]
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    render: { pixelArt: true },
    scene: [ MainMenu, oneD, GameOver ]
  };
  
  const game = new Phaser.Game(config);
  