/**
 * Class representing the final boss enemy.
 * Extends MoveableObject and plays a walking animation.
 */
class Endboss extends MoveableObject {
    /**
     * Endboss height.
     * @type {number}
     */
    height = 400;
    /**
     * Endboss width.
     * @type {number}
     */
    width = 250;
    /**
     * Endboss vertical position.
     * @type {number}
     */
    y = 55;
    hadFirstContact = false;
    energyEndBoss = 100;
    lastHitEndBoss = 0;
    i = 0;
    /**
     * Walking animation image paths.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
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
     * Creates a new Endboss instance.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 2;
        this.x = 2500;
        this.animate();
    }
    /**
     * Reduces the endboss's energy when hit (e.g. by a bottle).
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
     * Checks if the endboss was recently hit.
     * @returns {boolean} True if hit within the last second
     */
    isHurtEndBoss() {
        let timePassed = new Date().getTime() - this.lastHitEndBoss;
        return (timePassed / 1000) < 1;
    }
    /**
     * Checks if the endboss is dead.
     * @returns {boolean} True if energy is 0 or below
     */
    isDeadEndBoss() {
        return this.energyEndBoss <= 0;
    }
    /**
     * Handles endboss animation depending on state:
     * dead, hurt, alert or attack.
     */
    endBossAnimation() {
        let interval = setInterval(() => {
            if (this.isDeadEndBoss()) {
                console.log("Endboss is dead");
                this.playAnimation(this.IMAGES_DEAD);
                clearInterval(interval);
            } else if (this.isHurtEndBoss()) {
                console.log("Endboss is hurt");
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.hadFirstContact && this.i < 15) {
                console.log("Endboss is in alert state");
                this.playAnimation(this.IMAGES_ALERT);
                this.i++;
            } else if (this.hadFirstContact) {
                console.log("Endboss is attacking!");
                this.playAnimation(this.IMAGES_ATTACK);
                this.x -= this.speed;
            }
        }, 200);
    }
    /**
     * Animates the endboss: plays the walking animation.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}