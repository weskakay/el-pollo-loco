/**
 * @fileoverview Defines the {@link Endboss} class.
 * Represents the final boss enemy in the game world.
 * The Endboss has multiple animation states (walking, alert, attack, hurt, dead)
 * and reacts to player interactions such as being hit by bottles.
 *
 * It uses a small state machine:
 *   - "idle"  → before first contact with the player
 *   - "alert" → short alert phase after first contact
 *   - "attack" → actively chases the player
 *
 * Additionally, during the attack phase the boss performs
 * occasional jump moves to make the fight more challenging.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see World
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
     * This value defines on which “ground level” the boss stands.
     * Adjust this if he appears too high or too low.
     * @type {number}
     */
    y = 45;

    /**
     * Stores the default ground Y position for the boss.
     * Used to reset his position after a jump.
     * @type {number}
     */
    baseY = 55;

    /**
     * Indicates whether the Endboss has already had its first contact
     * with the player character (starts alert → attack phase).
     * @type {boolean}
     */
    hadFirstContact = false;

    /**
     * Current health (energy) of the Endboss, ranging from 0 to 100.
     * When this reaches 0, the boss is considered dead.
     * @type {number}
     */
    energyEndBoss = 100;

    /**
     * Timestamp of the last hit received by the Endboss (in ms).
     * Used to calculate whether he is currently in the "hurt" state.
     * @type {number}
     */
    lastHitEndBoss = 0;

    /**
     * Current behaviour state of the Endboss.
     * - "idle"  → before first contact
     * - "alert" → short warning phase after first contact
     * - "attack" → actively chasing the player
     * @type {"idle" | "alert" | "attack"}
     */
    state = "idle";

    /**
     * Horizontal speed of the Endboss while chasing the player.
     * Increase to make the boss more aggressive.
     * @type {number}
     */
    attackSpeed = 3;

    /**
     * Minimum distance to the player where the boss stops moving closer.
     * This defines how “close” the boss will stand when attacking.
     * @type {number}
     */
    stopDistance = 30;

    /**
     * Duration of the alert phase in milliseconds.
     * After this time, the boss switches from "alert" to "attack".
     * @type {number}
     */
    alertDurationMs = 1200;

    /**
     * Timestamp of the last state change (idle/alert/attack).
     * Used to determine when to leave the alert state.
     * @type {number}
     */
    lastStateChangeAt = 0;

    /**
     * Interval ID for behaviour updates (movement + state changes).
     * @type {?number}
     */
    behaviourInterval = null;

    /**
     * Interval ID for animation updates (sprite frames only).
     * @type {?number}
     */
    animationInterval = null;

    /**
     * Flag to ensure behaviour intervals are only started once.
     * @type {boolean}
     */
    behaviourStarted = false;

    /**
     * Indicates whether the boss is currently performing a jump arc.
     * @type {boolean}
     */
    isJumping = false;

    /**
     * Maximum vertical jump height in pixels.
     * Higher value → higher jump.
     * @type {number}
     */
    jumpHeight = 80;

    /**
     * Total duration of a jump in milliseconds.
     * @type {number}
     */
    jumpDurationMs = 600;

    /**
     * Minimum time between two jumps in milliseconds.
     * @type {number}
     */
    jumpCooldownMs = 2000;

    /**
     * Timestamp when the current jump started (in ms).
     * @type {number}
     */
    jumpStartedAt = 0;

    /**
     * Timestamp of the last jump (in ms).
     * Used together with {@link jumpCooldownMs}.
     * @type {number}
     */
    lastJumpAt = 0;

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
     * and starts the behaviour and animation loops.
     *
     * The boss does NOT use gravity here and stays on a fixed Y-level
     * defined by {@link Endboss#y}. Jumps are animated by temporarily
     * modifying his Y-position and then returning to {@link baseY}.
     *
     * @constructor
     */
    constructor(startX = 2500) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = startX;
        this.baseY = this.y;
        this.speed = this.attackSpeed;

        this.startBehaviour();
    }

    /**
     * Reduces the Endboss's energy by a fixed amount (10) when hit.
     * If energy drops below zero, it is clamped to zero.
     * Also records the timestamp of the hit for the "hurt" animation.
     *
     * @returns {void}
     */
    hitEndBoss() {
        this.energyEndBoss -= 10;
        if (this.energyEndBoss < 0) {
            this.energyEndBoss = 0;
        } else {
            this.lastHitEndBoss = Date.now();
        }
    }

    /**
     * Determines whether the Endboss has been hit recently.
     * Used to trigger the "hurt" animation state.
     *
     * @returns {boolean} True if the Endboss was hit within the last second.
     */
    isHurtEndBoss() {
        return Date.now() - this.lastHitEndBoss < 1000;
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
     * Called when the player enters the boss arena.
     * Switches the boss from "idle" into the "alert" state and
     * starts the alert timer.
     *
     * @returns {void}
     */
    endBossAnimation() {
        this.hadFirstContact = true;
        this.state = "alert";
        this.lastStateChangeAt = Date.now();
    }

    /**
     * Backwards compatibility wrapper.
     * In older versions, {@link Endboss#animate} started the boss behaviour.
     * Now it just calls {@link Endboss#startBehaviour}.
     *
     * @returns {void}
     */
    animate() {
        this.startBehaviour();
    }

    /**
     * Starts movement and animation loops.
     * Ensures they are only started once.
     *
     * @returns {void}
     */
    startBehaviour() {
        if (this.behaviourStarted) return;
        this.behaviourStarted = true;

        this.behaviourInterval = setInterval(
            () => this.updateBehaviour(),
            1000 / 60
        );

        this.animationInterval = setInterval(
            () => this.updateAnimation(),
            125
        );
    }

    /**
     * Updates Endboss state (idle, alert, attack), movement,
     * and vertical jump position.
     * Also safely looks up the global {@link world} instance.
     *
     * @returns {void}
     */
    updateBehaviour() {
        if (this.isDeadEndBoss()) return;

        let character = null;
        if (typeof world !== 'undefined' && world && world.character) {
            character = world.character;
        }
        if (!character || !this.hadFirstContact) return;

        const now = Date.now();

        this.updateJumpPosition(now);

        if (this.state === "alert") {
            this.updateAlertState(now);
            return;
        }

        if (this.state === "attack") {
            this.updateAttackState(character, now);
        }
    }

    /**
     * Handles the transition from "alert" to "attack".
     *
     * @param {number} now - Current timestamp in ms.
     * @returns {void}
     */
    updateAlertState(now) {
        const elapsed = now - this.lastStateChangeAt;
        if (elapsed < this.alertDurationMs) return;
        this.state = "attack";
        this.lastStateChangeAt = now;
    }

    /**
     * Updates the boss behaviour while in "attack" state:
     * facing direction, chasing and jump attempts.
     *
     * @param {Character} character - The player character.
     * @param {number} now - Current timestamp in ms.
     * @returns {void}
     */
    updateAttackState(character, now) {
        const dx = character.x - this.x;
        const distance = Math.abs(dx);
        const movingRight = dx > 0;

        this.updateFacingDirection(movingRight);
        this.chaseCharacter(distance, movingRight);
        this.maybeTriggerJump(distance, now);
    }

    /**
     * Updates the sprite flip based on movement direction.
     *
     * @param {boolean} movingRight - True if the boss moves to the right.
     * @returns {void}
     */
    updateFacingDirection(movingRight) {
        this.otherDirection = movingRight;
    }

    /**
     * Moves the boss horizontally towards the player
     * until {@link stopDistance} is reached.
     *
     * @param {number} distance - Horizontal distance to the character.
     * @param {boolean} movingRight - True if the character is to the right.
     * @returns {void}
     */
    chaseCharacter(distance, movingRight) {
        if (distance <= this.stopDistance) return;
        const step = this.attackSpeed;
        this.x += movingRight ? step : -step;
    }


    /**
     * Updates the boss' Y-position while a jump is active.
     * Uses a smooth sine curve for the jump arc.
     *
     * @param {number} now - Current timestamp in ms.
     * @returns {void}
     */
    updateJumpPosition(now) {
        if (!this.isJumping) {
            this.y = this.baseY;
            return;
        }

        const elapsed = now - this.jumpStartedAt;
        const t = elapsed / this.jumpDurationMs;

        if (t >= 1) {
            this.isJumping = false;
            this.y = this.baseY;
            return;
        }

        const jumpOffset = Math.sin(Math.PI * t) * this.jumpHeight;
        this.y = this.baseY - jumpOffset;
    }

    /**
     * Decides whether the boss should start a jump.
     * Conditions:
     *  - boss is not already jumping,
     *  - cooldown has passed,
     *  - player is within a reasonable horizontal distance.
     *
     * @param {number} distance - Horizontal distance to the player.
     * @param {number} now - Current timestamp in ms.
     * @returns {void}
     */
    maybeTriggerJump(distance, now) {
        if (this.isJumping) return;
        if (now - this.lastJumpAt < this.jumpCooldownMs) return;
        if (distance < 100 || distance > 450) return;

        this.isJumping = true;
        this.jumpStartedAt = now;
        this.lastJumpAt = now;
    }

    /**
     * Plays the correct animation based on the current boss state and damage.
     *
     * Priority:
     *  1. Dead
     *  2. Hurt
     *  3. Idle (before contact)
     *  4. Alert
     *  5. Attack
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDeadEndBoss()) {
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }

        if (this.isHurtEndBoss()) {
            this.playAnimation(this.IMAGES_HURT);
            return;
        }

        if (!this.hadFirstContact) {
            this.playAnimation(this.IMAGES_WALKING);
            return;
        }

        if (this.state === "alert") {
            this.playAnimation(this.IMAGES_ALERT);
            return;
        }

        this.playAnimation(this.IMAGES_ATTACK);
    }

}
