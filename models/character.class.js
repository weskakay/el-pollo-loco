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
 * @version 1.1.0
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
     * Time the character has been idle (in milliseconds).
     * @type {number}
     */
    idleTime = 0;

    /**
     * Indicates whether the character is currently sleeping.
     * @type {boolean}
     */
    isSleeping = false;

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
     * Starts the movement and animation loops for the character.
     *
     * @returns {void}
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Sets up the main movement loop (position, input, camera, walking sound).
     *
     * @returns {void}
     */
    startMovementLoop() {
        setInterval(() => {
            if (!this.world || this.world.gameOver) {
                this.stopWalkingSound();
                return;
            }

            const movingRight = this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
            const movingLeft = this.world.keyboard.LEFT && this.x > 0;
            const isWalking = movingRight || movingLeft;

            this.updateHorizontalMovement(movingRight, movingLeft);
            this.updateWalkingSound(isWalking);
            this.handleJumpInput();
            this.updateCameraPosition();
        }, 1000 / 60);
    }

    /**
     * Sets up the main animation loop (visual state, sleep, snore).
     *
     * @returns {void}
     */
    startAnimationLoop() {
        setInterval(() => {
            if (!this.world || this.world.gameOver) {
                this.resetSleepState();
                return;
            }

            this.updateAnimationState();
        }, 100);
    }

    /**
     * Updates the horizontal movement based on keyboard input.
     *
     * @param {boolean} movingRight
     * @param {boolean} movingLeft
     * @returns {void}
     */
    updateHorizontalMovement(movingRight, movingLeft) {
        if (movingRight) {
            this.moveRight();
            this.otherDirection = false;
            this.resetStandingTime();
        }

        if (movingLeft) {
            this.moveLeft();
            this.otherDirection = true;
            this.resetStandingTime();
        }
    }

    /**
     * Updates the walking sound based on the movement state.
     *
     * @param {boolean} isWalking
     * @returns {void}
     */
    updateWalkingSound(isWalking) {
        if (!this.world || !this.world.sound) {
            return;
        }

        const shouldPlayWalking = isWalking && !this.isAboveGround();

        if (shouldPlayWalking) {
            this.world.sound.playWalking();
        } else {
            this.world.sound.stopWalking();
        }
    }

    /**
     * Handles jump input and triggers a jump if possible.
     *
     * @returns {void}
     */
    handleJumpInput() {
        if (this.world.keyboard.JUMP && !this.isAboveGround()) {
            this.jump();
            this.resetStandingTime();
        }
    }

    /**
     * Updates the camera position based on the character position.
     *
     * @returns {void}
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles animation state when the game is over or world is missing.
     *
     * @returns {void}
     */
    resetSleepState() {
        if (this.world && this.world.sound && typeof this.world.sound.stopSnore === "function") {
            this.world.sound.stopSnore();
        }
        this.isSleeping = false;
        this.standingTime = 0;
    }

    /**
     * Updates the current animation state based on character status.
     *
     * @returns {void}
     */
    updateAnimationState() {
        if (this.isDead()) {
            this.handleDeadState();
            return;
        }

        if (this.isHurt()) {
            this.handleHurtState();
            return;
        }

        if (this.isAboveGround()) {
            this.handleAirState();
            return;
        }

        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.handleWalkingState();
            return;
        }

        this.handleIdleState();
    }

    /**
     * Handles the dead animation state.
     *
     * @returns {void}
     */
    handleDeadState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Handles the hurt animation state.
     *
     * @returns {void}
     */
    handleHurtState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Handles the jumping (airborne) animation state.
     *
     * @returns {void}
     */
    handleAirState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Handles the walking animation state.
     *
     * @returns {void}
     */
    handleWalkingState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles the idle and sleeping animation states.
     *
     * @returns {void}
     */
    handleIdleState() {
        this.standingTime += 150;

        if (this.standingTime >= 5000) {
            this.enterSleepState();
        } else {
            this.exitSleepState();
            this.playAnimation(this.IMAGES_STANDING);
        }
    }

    /**
     * Resets the standing time counter.
     *
     * @returns {void}
     */
    resetStandingTime() {
        this.standingTime = 0;
    }

    /**
     * Enters the sleeping state and starts the snore sound.
     *
     * @returns {void}
     */
    enterSleepState() {
        this.isSleeping = true;

        if (this.world && this.world.sound && typeof this.world.sound.playSnore === "function") {
            this.world.sound.playSnore();
        }

        this.playAnimation(this.IMAGES_SLEEPING);
    }

    /**
     * Exits the sleeping state and stops the snore sound.
     *
     * @returns {void}
     */
    exitSleepState() {
        if (!this.isSleeping) {
            this.stopSnoreIfNecessary();
            return;
        }

        this.isSleeping = false;
        this.stopSnoreIfNecessary();
    }

    /**
     * Stops the snore sound if it is currently active.
     *
     * @returns {void}
     */
    stopSnoreIfNecessary() {
        if (this.world && this.world.sound && typeof this.world.sound.stopSnore === "function") {
            this.world.sound.stopSnore();
        }
    }

    /**
     * Stops the walking sound if available.
     *
     * @returns {void}
     */
    stopWalkingSound() {
        if (this.world && this.world.sound && typeof this.world.sound.stopWalking === "function") {
            this.world.sound.stopWalking();
        }
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