/**
 * @fileoverview Defines the {@link Endboss} class.
 * Represents the final boss enemy in the game world.
 * The Endboss has multiple animation states (walking, alert, attack, hurt, dead)
 * and reacts to player interactions such as being hit by bottles.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing the final boss enemy.
 * Extends {@link MoveableObject} and manages multiple animation states,
 * including walking, alert, attack, hurt, and death. The Endboss also
 * maintains its own health (`energyEndBoss`) and contact status.
 *
 * @class Endboss
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    /**
     * The height of the Endboss sprite in pixels.
     * @type {number}
     */
    height = 400;
    /**
     * The width of the Endboss sprite in pixels.
     * @type {number}
     */
    width = 250;
    /**
     * The vertical position (Y-axis) of the Endboss on the canvas.
     * @type {number}
     */
    y = 55;
    /**
     * Indicates whether the Endboss has already had its first contact
     * with the player character (starts attack phase).
     * @type {boolean}
     */
    hadFirstContact = false;
    /**
     * Current health (energy) of the Endboss, ranging from 0 to 100.
     * @type {number}
     */
    energyEndBoss = 100;
    /**
     * Timestamp of the last hit received by the Endboss (in ms).
     * Used to calculate recent hit detection.
     * @type {number}
     */
    lastHitEndBoss = 0;
    /**
     * Internal counter used for alert animation sequence control.
     * @type {number}
     */
    i = 0;
    /**
     * Image paths for the walking animation sequence.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    /**
     * Image paths for the alert animation sequence.
     * @type {string[]}
     */
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    /**
     * Image paths for the attack animation sequence.
     * @type {string[]}
     */
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    /**
     * Image paths for the hurt animation sequence.
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    /**
     * Image paths for the dead animation sequence.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    /**
     * Creates a new {@link Endboss} instance.
     * Loads all animation images, initializes speed and position,
     * and starts the animation loop.
     *
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 5;
        this.x = 2500;
        this.animate();
    }
    /**
     * Reduces the Endboss's energy by a fixed amount (10) when hit.
     * If energy drops below zero, it is clamped to zero.
     * Records the timestamp of the hit for visual feedback.
     *
     * @returns {void}
     */
    hitEndBoss() {
        this.energyEndBoss -= 10;
        if (this.energyEndBoss < 0) {
            this.energyEndBoss = 0;
        } else {
            this.lastHitEndBoss = new Date().getTime();
        }
    }
    /**
     * Determines whether the Endboss has been hit recently.
     * Used to trigger the "hurt" animation state.
     *
     * @returns {boolean} True if the Endboss was hit within the last second.
     */
    isHurtEndBoss() {
        const timePassed = new Date().getTime() - this.lastHitEndBoss;
        return (timePassed / 1000) < 1;
    }
    /**
     * Checks whether the Endboss is dead (energy has reached 0).
     *
     * @returns {boolean} True if the Endboss's energy is zero or below.
     */
    isDeadEndBoss() {
        return this.energyEndBoss <= 0;
    }
    /**
     * Handles the Endboss animation sequence depending on its current state:
     * - Dead → plays death animation and stops loop
     * - Hurt → plays hurt animation
     * - First contact → plays alert animation before attacking
     * - Attack → plays attack animation and moves left
     *
     * @returns {void}
     */
    endBossAnimation() {
        const interval = setInterval(() => {
            if (this.isDeadEndBoss()) {
                this.playAnimation(this.IMAGES_DEAD);
                clearInterval(interval);
            } else if (this.isHurtEndBoss()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.hadFirstContact && this.i < 15) {
                this.playAnimation(this.IMAGES_ALERT);
                this.i++;
            } else if (this.hadFirstContact) {
                this.playAnimation(this.IMAGES_ATTACK);
                this.x -= this.speed;
            }
        }, 200);
    }
    /**
     * Animates the Endboss when in idle or walking mode.
     * The boss only walks before first contact and if not hurt or dead.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.hadFirstContact && !this.isHurtEndBoss() && !this.isDeadEndBoss()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}