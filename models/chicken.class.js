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
    y = 360
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
     * Creates a new Chicken instance with random position and speed.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    }
    /**
     * Animates the chicken: moves it left and switches images.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}