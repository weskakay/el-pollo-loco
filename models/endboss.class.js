/**
 * Class representing the final boss enemy.
 * Extends MovableObject and plays a walking animation.
 */
class Endboss extends MovableObject {
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
    /**
     * Creates a new Endboss instance.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
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