/**
 * Class representing a coin collectible object in the game.
 * Inherits from MoveableObject and animates between coin images.
 */
class Coin extends MoveableObject {
    /**
     * The width of the coin.
     * @type {number}
     */
    width = 80;
    /**
     * The height of the coin.
     * @type {number}
     */
    height = 80;
    /**
     * Flag to check whether the coin has been collected.
     * @type {boolean}
     */
    collected = false;
    /**
     * Array of image paths used for coin animation.
     * @type {string[]}
     */
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    /**
     * Creates a new Coin instance at the given coordinates.
     * @param {number} x - The horizontal position of the coin.
     * @param {number} y - The vertical position of the coin.
     */
    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = 400 + Math.random() * 1500;
        this.y = 100 + Math.random() * 100;
        this.animate();
    }
    /**
     * Starts the animation cycle for the coin.
     * Continuously alternates between coin images.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 100);
    }
}
