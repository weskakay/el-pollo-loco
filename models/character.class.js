/**
 * @fileoverview Defines the {@link Character} class.
 * Represents the main player character of the game, controlling
 * movement, animations, input handling, and interactions such as jumping.
 * 
 * The character reacts to keyboard input, switches animation states
 * (walking, jumping, idle, sleeping, hurt, dead), and updates the
 * world camera based on movement.
 *
 * @extends MoveableObject
 * @see World
 * @see Keyboard
 * @see MoveableObject
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing the player character (Pepe).
 * Handles animation sequences, movement logic, gravity, and sound effects.
 *
 * @class Character
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    /**
     * Character height in pixels.
     * @type {number}
     */
    height = 250;

    /**
     * Initial vertical position of the character.
     * @type {number}
     */
    y = 180;

    /**
     * Horizontal walking speed of the character.
     * @type {number}
     */
    speed = 6;

    /**
     * Tracks how long the character has been standing still (in ms).
     * After 5000ms, the sleeping animation is triggered.
     * @type {number}
     */
    standingTime = 0;

    /**
     * Total number of coins collected by the player.
     * @type {number}
     */
    coinsCollected = 0;

    /**
     * Total number of bottles collected by the player.
     * @type {number}
     */
    bottlesCollected = 0;

    /**
     * Indicates whether a bottle has been thrown.
     * @type {boolean}
     */
    bottleThrown = false;

    /**
     * Animation frames for idle/standing state.
     * @type {string[]}
     */
    IMAGES_STANDING = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Animation frames for sleeping state.
     * @type {string[]}
     */
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Animation frames for walking state.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Animation frames for jumping state.
     * @type {string[]}
     */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Animation frames for the dead state.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Animation frames for the hurt state.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Reference to the active game world instance.
     * Used to access keyboard input, sound manager, and camera.
     * @type {World}
     */
    world;

    /**
     * Creates a new {@link Character} instance.
     * Loads all animation images, applies gravity, and starts animation loops.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.groundY = this.y;

        this.applyGravity();
        this.animate();
    }

    /**
     * Main animation loop for the character.
     * Handles movement (left/right/jump) and switches animations
     * depending on player input and current state (dead, hurt, idle, etc.).
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.world || this.world.gameOver) {
                if (this.world && this.world.sound && typeof this.world.sound.stopWalking === "function") {
                    this.world.sound.stopWalking();
                }
                return;
            }

            const movingRight = this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
            const movingLeft  = this.world.keyboard.LEFT  && this.x > 0;

            const walking = (movingRight || movingLeft) && !this.isAboveGround();

            if (movingRight) {
                this.moveRight();
                this.otherDirection = false;
                this.standingTime = 0;
            }

            if (movingLeft) {
                this.moveLeft();
                this.otherDirection = true;
                this.standingTime = 0;
            }

            if (walking) {
                this.world.sound.playWalking();
            } else {
                this.world.sound.stopWalking();
            }

            if (this.world.keyboard.JUMP && !this.isAboveGround()) {
                this.jump();
                this.standingTime = 0;
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (!this.world || this.world.gameOver) {
                return;
            }

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.standingTime = 0;
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                this.standingTime = 0;
            } else {
                this.playAnimation(this.IMAGES_STANDING);
                this.standingTime += 150;
                if (this.standingTime >= 5000) {
                    this.playAnimation(this.IMAGES_SLEEPING);
                }
            }
        }, 100);
    }


    /**
     * Makes the character jump by applying upward velocity
     * and triggering the jump sound effect.
     *
     * @returns {void}
     */
    jump() {
        this.speedY = 25;
        this.currentImage = 0;
        this.world.sound.playJump();
    }

    /**
     * Small bounce when landing on an enemy (e.g. chicken).
     * Prevents a full "double jump" but gives feedback on stomp.
     *
     * @returns {void}
     */
    bounceOnEnemy() {
        this.speedY = 10;
    }

    /**
     * Applies heavy damage when hit by the end boss.
     * Internally uses the normal hit logic multiple times.
     *
     * @param {number} [multiplier=3] - How many normal hits to apply.
     * @returns {void}
     */
    hitByEndboss(multiplier = 3) {
        for (let i = 0; i < multiplier; i++) {
            this.hit();
        }
    }
}
