/**
 * @fileoverview Defines the {@link Chicken} enemy class.
 * Represents a standard walking chicken enemy in the game world.
 * Chickens move horizontally across the level and switch between
 * walking and dead animation states. Each instance receives a
 * random starting position and movement speed.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing an enemy chicken.
 * Extends {@link MoveableObject} and handles its own animation and movement.
 *
 * @class Chicken
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    /**
     * Chicken height in pixels.
     * @type {number}
     */
    height = 55;
    /**
     * Chicken width in pixels.
     * @type {number}
     */
    width = 70;
    /**
     * Chicken's fixed vertical position (ground level).
     * @type {number}
     */
    y = 370;
    /**
     * Sound effect played when the chicken dies.
     * @type {HTMLAudioElement}
     */
    chickenSound = new Audio('audio/chicken.mp3');
    /**
     * Walking animation image paths for the chicken enemy.
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
     * Creates a new {@link Chicken} instance with a random position and speed.
     * Loads all necessary animation images and starts the animation loop.
     *
     * @constructor
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
     * The dead image remains visible for a short duration before being cleared.
     *
     * @returns {void}
     */
    playAnimationChickenDead() {
        this.loadImage(this.IMAGES_DEAD[0] || this.IMAGES_DEAD);
        this.chickenSound.play();
        setTimeout(() => {
            this.IMAGES_DEAD = [];
        }, 500);
    }
    /**
     * Handles the chicken's continuous animation:
     * - Moves the chicken to the left.
     * - Switches between walking and dead animation frames.
     *
     * @returns {void}
     */
    animate() {
        // Movement loop
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        // Animation frame loop
        setInterval(() => {
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimationChickenDead(this.IMAGES_DEAD);
            }
        }, 200);
    }
}