class Scout extends Phaser.GameObjects.Container{
    constructor(scene, x, y){
        super(scene, x, y);

        // give the scout a straight down pattern
        this.speed = 100;
        const sign = (Math.random() < 0.5) ? -1 : 1;
        this.horizSpeed = 110 * sign;

        this.sprite = scene.add.sprite(0,0, 'scout').setFlipY(true);;
        this.sprite.setScale(1.2);
        this.add(this.sprite);

        // Add container to display/update list
        scene.add.existing(this);
    }
    
    update(time, delta){
        this.y += this.speed * (delta/1000);
        this.x += this.horizSpeed * (delta/1000);
        if (this.x < 0) {
            this.x = 0;
            this.horizSpeed *= -1;
            this.x += this.horizSpeed * (delta/1000);
            

        } else if (this.x > 480) {
            this.x = 480;
            this.horizSpeed *= -1;
            this.x += this.horizSpeed * (delta/1000);
        }

        // Destroy object if it goes off-screen
        if (this.y > this.scene.game.config.height + 50){
            this.destroy();
        }
    }
}

// It is now globally available
window.Scout = Scout;