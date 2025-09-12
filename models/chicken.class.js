/**
 * Class representing an enemy chicken.
 * Extends MoveableObject and handles its own animation and movement.
 */
class Chicken extends MoveableObject {
    /**
     * Chicken height.
     * @type {number}
     */
    height = 55;
    /**
     * Chicken width.
     * @type {number}
     */
    width = 70
    /**
     * Chicken vertical position.
     * @type {number}
     */
    y = 370
    chickenSound = new Audio('audio/chicken.mp3');
    /**
     * Walking animation image paths.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    /**
     * Dead animation image paths for the chicken enemy.
     * Used to display the dead state of the chicken.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];
    /**
     * Creates a new Chicken instance with random position and speed.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 600 + Math.random() * 1000;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }
    /**
     * Displays the dead animation of the chicken and plays the death sound once.
     */
    playAnimationChickenDead() {
        this.loadImage(this.IMAGES_DEAD[0] || this.IMAGES_DEAD);
        
        setTimeout(() => {
            this.IMAGES_DEAD = [];
        }, 500);
        
    }
    /**
     * Animates the chicken: moves it left and switches images.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            else {
                this.playAnimationChickenDead(this.IMAGES_DEAD);
            }      
            
        }, 200);
    }
}