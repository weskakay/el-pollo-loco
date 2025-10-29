/**
 * @fileoverview Defines the {@link Coin} class.
 * Represents a collectible coin object within the game world.
 * Coins continuously animate between two frames and can be collected
 * by the player to increase the coin counter or score.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a coin collectible object in the game.
 * Inherits from {@link MoveableObject} and animates between coin images.
 *
 * @class Coin
 * @extends MoveableObject
 */
class Coin extends MoveableObject {
    /**
     * The width of the coin sprite in pixels.
     * @type {number}
     */
    width = 80;
    /**
     * The height of the coin sprite in pixels.
     * @type {number}
     */
    height = 80;
    /**
     * Flag indicating whether this coin has been collected.
     * @type {boolean}
     */
    collected = false;
    /**
     * Array of image paths used for the coin's animation loop.
     * @type {string[]}
     */
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    /**
     * Creates a new {@link Coin} instance.
     * The coin is placed at a random horizontal and vertical position
     * within the level bounds and starts its animation loop immediately.
     *
     * @constructor
     * @param {number} [x] - Optional initial horizontal position of the coin.
     * @param {number} [y] - Optional initial vertical position of the coin.
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
     * Continuously alternates between the two coin images.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 100);
    }
}