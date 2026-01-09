/**
 * @fileoverview Defines the {@link Endboss} class.
 * Final boss with state machine (idle/alert/attack), hit/hurt/dead logic,
 * and sprite animations.
 *
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    height = 400;
    width = 250;

    y = 45;
    baseY = 55;

    hadFirstContact = false;
    energyEndBoss = 100;
    lastHitEndBoss = 0;

    /** @type {"idle" | "alert" | "attack"} */
    state = "idle";

    attackSpeed = 3;
    stopDistance = 30;

    alertDurationMs = 1200;
    lastStateChangeAt = 0;

    behaviourInterval = null;
    animationInterval = null;
    behaviourStarted = false;

    isJumping = false;
    jumpHeight = 80;
    jumpDurationMs = 600;
    jumpCooldownMs = 2000;
    jumpStartedAt = 0;
    lastJumpAt = 0;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

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

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * @param {number} [startX=2500] initial X position of the boss
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

    /** Called when a bottle hits the boss. Reduces HP and triggers hurt window. */
    hitEndBoss() {
        this.energyEndBoss -= 10;
        if (this.energyEndBoss < 0) this.energyEndBoss = 0;
        else this.lastHitEndBoss = Date.now();
    }

    /** @returns {boolean} true if boss was hit recently */
    isHurtEndBoss() {
        return Date.now() - this.lastHitEndBoss < 1000;
    }

    /** @returns {boolean} true if HP is 0 */
    isDeadEndBoss() {
        return this.energyEndBoss <= 0;
    }

    /**
     * Triggers first-contact behaviour (alert phase).
     * Called by world when player enters activation range.
     */
    endBossAnimation() {
        this.hadFirstContact = true;
        this.state = "alert";
        this.lastStateChangeAt = Date.now();
    }

    /** Backwards compatibility (older code called animate()). */
    animate() {
        this.startBehaviour();
    }

    /** Starts behaviour + animation loops once. */
    startBehaviour() {
        if (this.behaviourStarted) return;
        this.behaviourStarted = true;

        this.behaviourInterval = setInterval(() => this.updateBehaviour(), 1000 / 60);
        this.animationInterval = setInterval(() => this.updateAnimation(), 125);
    }

    /**
     * Updates movement/state each tick.
     * Looks up the global `world` instance for the current player position.
     */
    updateBehaviour() {
        if (this.isDeadEndBoss()) return;

        const character = (typeof world !== "undefined" && world?.character) ? world.character : null;
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

    /** Switches from alert → attack after a short delay. */
    updateAlertState(now) {
        if (now - this.lastStateChangeAt < this.alertDurationMs) return;
        this.state = "attack";
        this.lastStateChangeAt = now;
    }

    /**
     * Chase logic + occasional jump attempts.
     * @param {Character} character
     * @param {number} now
     */
    updateAttackState(character, now) {
        const dx = character.x - this.x;
        const distance = Math.abs(dx);
        const movingRight = dx > 0;

        this.otherDirection = movingRight;
        this.chaseCharacter(distance, movingRight);
        this.maybeTriggerJump(distance, now);
    }

    /** Moves horizontally toward the player until stopDistance is reached. */
    chaseCharacter(distance, movingRight) {
        if (distance <= this.stopDistance) return;
        this.x += movingRight ? this.attackSpeed : -this.attackSpeed;
    }

    /** Updates jump arc (sine curve). Keeps y at baseY when not jumping. */
    updateJumpPosition(now) {
        if (!this.isJumping) {
            this.y = this.baseY;
            return;
        }

        const t = (now - this.jumpStartedAt) / this.jumpDurationMs;
        if (t >= 1) {
            this.isJumping = false;
            this.y = this.baseY;
            return;
        }

        const jumpOffset = Math.sin(Math.PI * t) * this.jumpHeight;
        this.y = this.baseY - jumpOffset;
    }

    /** Starts a jump if cooldown passed and player is within mid-range distance. */
    maybeTriggerJump(distance, now) {
        if (this.isJumping) return;
        if (now - this.lastJumpAt < this.jumpCooldownMs) return;
        if (distance < 100 || distance > 450) return;

        this.isJumping = true;
        this.jumpStartedAt = now;
        this.lastJumpAt = now;
    }

    /**
     * Selects animation by priority:
     * dead > hurt > idle(walk) > alert > attack
     */
    updateAnimation() {
        if (this.isDeadEndBoss()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurtEndBoss()) return this.playAnimation(this.IMAGES_HURT);
        if (!this.hadFirstContact) return this.playAnimation(this.IMAGES_WALKING);
        if (this.state === "alert") return this.playAnimation(this.IMAGES_ALERT);
        this.playAnimation(this.IMAGES_ATTACK);
    }
}