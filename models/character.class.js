/**
 * @fileoverview Defines the {@link Character} class.
 * The player character (Pepe). Handles movement, animation state machine,
 * gravity/jumping and related sound effects. Reads input from {@link Keyboard}
 * via {@link World}.
 *
 * @extends MoveableObject
 * @see World
 * @see Keyboard
 * @see MoveableObject
 *
 * @author KW
 * @version 1.2.0
 */

class Character extends MoveableObject {
    height = 250;
    y = 180;
    speed = 6;

    standingTime = 0;
    idleTime = 0;
    isSleeping = false;

    coinsCollected = 0;
    bottlesCollected = 0;
    bottleThrown = false;

    movementIntervalId = null;
    animationIntervalId = null;

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

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {World} */
    world;

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
     * Starts movement + animation loops.
     * Call once per character instance (world reset should create a fresh instance
     * or call {@link stopLoops} before re-using).
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Movement loop (60 FPS).
     * Reads input, moves the character, triggers jump and keeps the camera centered.
     */
    startMovementLoop() {
        this.movementIntervalId = setInterval(() => {
            if (this.shouldSkipMovementLoop()) return;

            const movement = this.getMovementState();
            this.updateHorizontalMovement(movement.movingRight, movement.movingLeft);
            this.updateWalkingSound(movement.isWalking);
            this.handleJumpInput();
            this.updateCameraPosition();
        }, 1000 / 60);
    }

    /**
     * Animation loop (~10 FPS).
     * Updates sprite animation based on character state (dead/hurt/jump/walk/idle/sleep).
     */
    startAnimationLoop() {
        this.animationIntervalId = setInterval(() => {
            if (this.shouldSkipAnimationLoop()) return;
            this.updateAnimationState();
        }, 100);
    }

    /**
     * Stops both loops to prevent duplicate intervals (important on reset).
     */
    stopLoops() {
        if (this.movementIntervalId) clearInterval(this.movementIntervalId);
        if (this.animationIntervalId) clearInterval(this.animationIntervalId);
        this.movementIntervalId = null;
        this.animationIntervalId = null;
    }

    /**
     * Returns true if movement should not run (no world or gameOver).
     * Ensures walking sound is stopped when movement loop is inactive.
     *
     * @returns {boolean}
     */
    shouldSkipMovementLoop() {
        if (this.world && !this.world.gameOver) return false;
        this.stopWalkingSound();
        return true;
    }

    /**
     * Returns true if animation should not run (no world or gameOver).
     * Ensures sleep-related state is reset when animation loop is inactive.
     *
     * @returns {boolean}
     */
    shouldSkipAnimationLoop() {
        if (this.world && !this.world.gameOver) return false;
        this.resetSleepState();
        return true;
    }

    /**
     * Computes movement intent and bounds checks for current level.
     *
     * @returns {{movingRight: boolean, movingLeft: boolean, isWalking: boolean}}
     */
    getMovementState() {
        const movingRight = this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
        const movingLeft = this.world.keyboard.LEFT && this.x > 0;
        return { movingRight, movingLeft, isWalking: movingRight || movingLeft };
    }

    /**
     * Applies horizontal movement and direction flags.
     *
     * @param {boolean} movingRight
     * @param {boolean} movingLeft
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
     * Plays/stops walking sound depending on movement and grounded state.
     *
     * @param {boolean} isWalking
     */
    updateWalkingSound(isWalking) {
        if (!this.world || !this.world.sound) return;

        const shouldPlayWalking = isWalking && !this.isAboveGround();
        if (shouldPlayWalking) this.world.sound.playWalking();
        else this.world.sound.stopWalking();
    }

    /**
     * Triggers a jump if jump key is pressed and character is grounded.
     */
    handleJumpInput() {
        if (this.world.keyboard.JUMP && !this.isAboveGround()) {
            this.jump();
            this.resetStandingTime();
        }
    }

    /**
     * Keeps the camera centered relative to the character.
     * This drives the world render offset (camera_x).
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Resets sleeping state and snore sound when the world is inactive/game over.
     */
    resetSleepState() {
        if (this.world?.sound?.stopSnore) this.world.sound.stopSnore();
        this.isSleeping = false;
        this.standingTime = 0;
    }

    /**
     * Animation state machine: dead > hurt > air > walk > idle/sleep.
     */
    updateAnimationState() {
        if (this.isDead()) return this.handleDeadState();
        if (this.isHurt()) return this.handleHurtState();
        if (this.isAboveGround()) return this.handleAirState();
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) return this.handleWalkingState();
        this.handleIdleState();
    }

    /** Plays death animation and stops sleep sound/state. */
    handleDeadState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_DEAD);
    }

    /** Plays hurt animation and stops sleep sound/state. */
    handleHurtState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_HURT);
    }

    /** Plays jumping animation and stops sleep sound/state. */
    handleAirState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /** Plays walking animation and stops sleep sound/state. */
    handleWalkingState() {
        this.stopSnoreIfNecessary();
        this.isSleeping = false;
        this.standingTime = 0;
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles idle -> sleep transition after a timeout.
     * Idle time is tracked via standingTime.
     */
    handleIdleState() {
        this.standingTime += 150;

        if (this.standingTime >= 5000) {
            this.enterSleepState();
            return;
        }

        this.exitSleepState();
        this.playAnimation(this.IMAGES_STANDING);
    }

    /** Resets idle timer (called on any input/movement). */
    resetStandingTime() {
        this.standingTime = 0;
    }

    /**
     * Switches into sleep animation + starts snore sound (once).
     */
    enterSleepState() {
        this.isSleeping = true;
        if (this.world?.sound?.playSnore) this.world.sound.playSnore();
        this.playAnimation(this.IMAGES_SLEEPING);
    }

    /**
     * Leaves sleep state and ensures snore sound is stopped.
     */
    exitSleepState() {
        if (!this.isSleeping) {
            this.stopSnoreIfNecessary();
            return;
        }
        this.isSleeping = false;
        this.stopSnoreIfNecessary();
    }

    /** Stops snore sound if available. */
    stopSnoreIfNecessary() {
        if (this.world?.sound?.stopSnore) this.world.sound.stopSnore();
    }

    /** Stops walking sound if available. */
    stopWalkingSound() {
        if (this.world?.sound?.stopWalking) this.world.sound.stopWalking();
    }

    /**
     * Makes the character jump by applying upward velocity and playing sound.
     */
    jump() {
        this.speedY = 25;
        this.currentImage = 0;
        this.world.sound.playJump();
    }

    /**
     * Small bounce when stomping an enemy (feedback + prevents instant re-collision).
     * Also grants brief invulnerability to prevent damage from nearby enemies.
     */
    bounceOnEnemy() {
        this.speedY = 10;
        this.lastStompTime = new Date().getTime();
    }

    /**
     * Checks if the character recently stomped an enemy (within 300ms).
     * Used to grant brief invulnerability after a stomp kill.
     *
     * @returns {boolean}
     */
    isStompInvulnerable() {
        if (!this.lastStompTime) return false;
        const timePassed = new Date().getTime() - this.lastStompTime;
        return timePassed < 300;
    }

    /**
     * Applies heavier damage from the endboss by repeating the normal hit logic.
     *
     * @param {number} [multiplier=3] number of hit() calls to apply
     */
    hitByEndboss(multiplier = 3) {
        for (let i = 0; i < multiplier; i++) {
            this.hit();
        }
    }
}