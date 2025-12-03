/**
 * @fileoverview Defines the {@link SmallChicken} enemy class.
 * Represents a small chick enemy (baby chicken).
 * Behaves like a regular chicken but uses smaller sprites
 * and its own sound.
 *
 * @extends MoveableObject
 * @see Chicken
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

class SmallChicken extends MoveableObject {
    /**
     * Small chicken height in pixels.
     * @type {number}
     */
    height = 50;

    /**
     * Small chicken width in pixels.
     * @type {number}
     */
    width = 60;

    /**
     * Small chicken vertical position (ground).
     * @type {number}
     */
    y = 380;

    /**
     * Sound effect when the small chicken dies.
     * @type {HTMLAudioElement}
     */
    chickSound = new Audio('audio/small_chicken.mp3');

    /**
     * Walking animation frames for the small chicken.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /**
     * Dead animation frame.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new {@link SmallChicken} instance.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 400 + Math.random() * 1500;
        this.speed = 0.2 + Math.random() * 0.3;

        this.animate();
    }

    /**
     * Plays the small chicken's death animation & sound once.
     *
     * @returns {void}
     */
    playAnimationChickenDead() {
        if (this.chickenIsDead) return;

        this.chickenIsDead = true;
        this.loadImage(this.IMAGES_DEAD[0]);

        if (!this.deathSoundPlayed && typeof world !== 'undefined' && world?.sound) {
            this.deathSoundPlayed = true;
            world.sound.playSmallChickenDead();
        }

        setTimeout(() => {
            this.IMAGES_DEAD = [];
        }, 500);
    }


    /**
     * Runs the continuous movement + animation loop.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimationChickenDead();
            }
        }, 200);
    }
}