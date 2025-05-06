class Fighter extends Phaser.GameObjects.Container{
    constructor(scene, x, y){
        super(scene, x, y);

        // Give the scout a straight down pattern
        this.speed = 75;

        this.sprite = scene.add.sprite(0,0, 'fighter').setFlipY(true);;
        this.sprite.setScale(1.2);
        this.add(this.sprite);

        // This is a repeating shoot event
        this.shootEvent = scene.time.addEvent({
            delay: 2000,
            callback: this.shoot,
            callbackScope: this,
            loop: true
          });

        this.on('destroy', () => {
            this.shootEvent.remove();
        }, this);


        // Container to display/update list
        scene.add.existing(this);
    }

    shoot() {
        // spawn a bullet at the fighter’s bottom edge
        const bx = this.x;
        const by = this.y + this.sprite.displayHeight / 2;
        const bullet = this.scene.add.sprite(bx, by, 'emit').setFlipY(true);
        this.scene.my.fighterBullets.push(bullet);
    }

    update(time, delta){
        this.y += this.speed * (delta/1000);

        // Destroy object if it goes off-screen
        if (this.y > this.scene.scale.height + 50) {
            this.shootEvent.remove();
            this.destroy();
        }
    }
}

// It is now globally available
window.Fighter = Fighter;