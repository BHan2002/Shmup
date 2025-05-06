class oneD extends Phaser.Scene {
    constructor() {
        super("oneD");
        this.my = {
            sprite: {},
            emitters: []    
        };  // Create an object to hold sprite bindings and emitter values/projectiles

        //Create constants for the monster location
        this.bodyX = 200;
        this.bodyY = 500;
        this.max_player_bullets = 3;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // 
        // Load BGM
        this.load.audio('bgm', './assets/ogg&m4a/ogg&m4a/Stage/stg_st001/stg_st001.m4a');

        // Load background
        this.load.setPath("./assets/Clouds/Clouds 1");
        this.load.image("bottomLayer", "1.png");
        this.load.image("backClouds", "2.png");
        this.load.image("lineClouds", "3.png");
        this.load.image("frontClouds", "4.png");

        this.load.setPath("./assets/Ships");
        // Load Enemies
        this.load.image("scout", "ship_0002.png")
        this.load.image("fighter", "ship_0003.png")

        // Load player sprites
        this.load.image("player1", "ship_0000.png");

        // Load Emit
        this.load.setPath("./assets/Tiles");
        this.load.image("emit", "tile_0000.png");

        // Load explosion effects
        this.load.image("ex1", "tile_0004.png");
        this.load.image("ex2", "tile_0005.png");
        this.load.image("ex3", "tile_0006.png");
        this.load.image("ex4", "tile_0007.png");

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>SHMUP!!!<br>A - move left // D - move right // SPACE - shoot</h2>'
    }
    // Check out the container, Check out phaser docs
    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        this.bgm = this.sound.add('bgm', {
            loop: true,
            volume: 0.25         // adjustable from 0.0 to 1.0
          });
          this.bgm.play();

        // Create background
        my.bg1_1 = this.add.tileSprite(0, 0, 4800, 6000, 'bottomLayer').setOrigin(0);
        my.bg1_2 = this.add.tileSprite(0, 0, 4800, 6000, 'backClouds').setOrigin(0);
        my.bg1_3 = this.add.tileSprite(0, 0, 4800, 6000, 'lineClouds').setOrigin(0);
        my.bg1_4 = this.add.tileSprite(0, 0, 4800, 6000, 'frontClouds').setOrigin(0);

        // Create the main body sprit
        my.sprite.player1 = this.add.sprite(this.bodyX, this.bodyY, "player1");
        my.sprite.player1.setScale(1.5);

        // Use container to group body parts

        this.my.container = this.add.container(100, 100);

        // Add all body parts to container
        this.my.container.add(my.sprite.player1);
        
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        // Scout container
        my.scouts = [];

        // Spawn Enemies
        this.spawnScout();
        this.spawnScout();
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnScout,
            callbackScope: this,
            loop: true
         });
        
        // arrays for fighters and their bullets
        my.fighters = [];
        my.fighterBullets = [];

        // periodically spawn a new Fighter
        this.time.addEvent({
           delay: 3000,
           callback: this.spawnFighter,
           callbackScope: this,
           loop: true
        });
        
        // Player
        this.playerText = this.add.text(375, 5, 'player_1');
        
        // Create Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '20px',
        fill: '#fff'
        });

        // Create Lives
        this.lives = 3;
        this.livesText = this.add.text(16, 40, 'Lives: 3', {
        fontSize: '20px',
        fill: '#f88'
        });

        // Enemy Explosion Animation
        this.anims.create({
            key: 'explode',
            frames: [
              { key: 'ex1' },
              { key: 'ex2' },
              { key: 'ex3' },
              { key: 'ex4' }
            ],
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
          });


    }

    update(time, delta) {

        let my = this.my;    // create an alias to this.my for readability

        // Scroll Background
        my.bg1_2.tilePositionX -= 0.5;   // far-back clouds: slow scroll
        my.bg1_3.tilePositionX -= 0.75;     // mid clouds: medium scroll
        my.bg1_4.tilePositionX -= 1;   // front clouds: fast scroll

        // Movement for player left and right
        if (this.keyA.isDown) {
            my.container.x -= 5;
            
        }else if (this.keyA.isUp) {
            my.container.x -= 0;
        }

        if (this.keyD.isDown) {
            my.container.x += 5;
            
        }else if (this.keyD.isUp) {
            my.container.x += 0;
        }        
        my.container.x = Phaser.Math.Clamp(my.container.x, -160, 250);

        // When Space is pressed down
        if (Phaser.Input.Keyboard.JustDown(this.keyS) && my.emitters.length < this.max_player_bullets) {
            let emitX = my.sprite.player1.x + my.container.x;
            let emitY = my.sprite.player1.y + my.container.y;
            // Create projectile
            let emitter = this.add.sprite(emitX, emitY, "emit").setScale(1.5);
            my.emitters.push(emitter);
        }

        // Move emitters upward
        for (let emitter of my.emitters) {
         emitter.y -= 10;
        }

        // Scouts
        // update every scout
        for (let s of my.scouts){
            s.update(time, delta)
        }

        for (let b of my.fighterBullets) {
            b.y += 150 * (delta / 1000);
        }


        // Handling Player Vs Enemy Laser hit detection
        for (let i = my.fighterBullets.length - 1; i >= 0; i--) {
            const bullet = my.fighterBullets[i];
            const bRect   = bullet.getBounds();
            const pRect = my.sprite.player1.getBounds();
          
            if (Phaser.Geom.Intersects.RectangleToRectangle(bRect, pRect)) {
              // destroy the bullet
              bullet.destroy();
              my.fighterBullets.splice(i, 1);
          
              // handle player hit:
              this.lives--;
              this.livesText.setText('Lives: ' + this.lives);
          
              if (this.lives <= 0) {
                // game over — restart scene (or whatever you prefer)
                this.scene.shutdown();
                this.bgm.stop();
                this.scene.start('GameOver', { score: this.score });
              }
          
              break;
            }
          }

          // The player’s world bounds (use the container, not the raw sprite)
        const playerBounds = this.my.container.getBounds();

        // 1) player vs. scouts
        for (let i = my.scouts.length - 1; i >= 0; i--) {
            const scout = my.scouts[i];
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, scout.getBounds())) {
            // explosion on player
            this.spawnExplosion(this.my.container.x, this.my.container.y);
            // explosion on scout
            this.spawnExplosion(scout.x, scout.y);

            // remove scout
            scout.destroy();
            my.scouts.splice(i, 1);

            // lose a life
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
            if (this.lives <= 0) {
                this.scene.shutdown();
                this.bgm.stop();
                this.scene.start('GameOver', { score: this.score });
            }

            // (optional) give invulnerability frames here
            break;
            }
        }

        // 2) player vs. fighters
        for (let i = my.fighters.length - 1; i >= 0; i--) {
            const fighter = my.fighters[i];
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, fighter.getBounds())) {
            // explosion on player
            this.spawnExplosion(this.my.container.x, this.my.container.y);
            // explosion on fighter
            this.spawnExplosion(fighter.x, fighter.y);

            // remove fighter
            fighter.destroy();
            my.fighters.splice(i, 1);

            // lose a life
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
            if (this.lives <= 0) {
                this.bgm.stop();
                this.scene.shutdown();
                this.scene.start('GameOver', { score: this.score });
            }

            break;
            }
        }

        // Collision check
        for (let i = my.emitters.length - 1; i >= 0; i--) {
            const bullet = my.emitters[i];
            const bRect  = bullet.getBounds();

            for (let j = my.scouts.length - 1; j >= 0; j--) {
                const scout = my.scouts[j];
                const sRect  = scout.getBounds();
                
                // Handle Hit
                if (Phaser.Geom.Intersects.RectangleToRectangle(bRect, sRect)) {
                    
                    bullet.destroy();
                    my.emitters.splice(i, 1);
                    
                    this.spawnExplosion(scout.x, scout.y);
                    
                    scout.destroy();
                    my.scouts.splice(j, 1);

                    // Increment score
                    this.score += 10;
                    this.scoreText.setText('Score: ' + this.score);

                    break;
                }
            }
        }
        // remove any elements that have been destroyed/off screen
        my.scouts = my.scouts.filter(s => s.active);
        my.fighterBullets = my.fighterBullets.filter(b => b.y < this.scale.height + 50);
        my.emitters = my.emitters.filter(emitter => emitter.y > -50);

        


    }
    
    spawnScout() {
        // pick an X between 50px in from each side
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = -50;
    
        // create & track it
        const scout = new Scout(this, x, y);
        this.my.scouts.push(scout);
    
        return scout;
      }

    spawnFighter() {
        // pick an X between 50px in from each side
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = -50;

        // create & track it
        const fighter = new Fighter(this, x, y);
        this.my.scouts.push(fighter);

        return fighter;
    }

    spawnExplosion(x, y) {
        const e = this.add.sprite(x, y, 'ex1')
            .setScale(1.5)
            .play('explode');
    }

    shutdown() {
        if (this.bgm && this.bgm.isPlaying) {
          this.bgm.stop();
        }
    }
}



