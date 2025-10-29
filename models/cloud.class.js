/**
 * @fileoverview Defines the {@link Cloud} class.
 * Represents a decorative cloud element in the background.
 * Clouds move slowly from right to left to create a sense of depth
 * and parallax scrolling in the game's sky layer.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see BackgroundObject
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a background cloud.
 * Extends {@link MoveableObject} and moves slowly to the left.
 *
 * @class Cloud
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    /**
     * The vertical position of the cloud.
     * Determines how high it appears in the sky.
     * @type {number}
     */
    y = 20;
    /**
     * The height of the cloud image in pixels.
     * @type {number}
     */
    height = 250;
    /**
     * The width of the cloud image in pixels.
     * @type {number}
     */
    width = 500;
    /**
     * Creates a new {@link Cloud} instance with a random horizontal start position.
     * The cloud image is loaded and the slow leftward animation begins.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 50 + Math.random() * 2500;
        this.animate();
    }
    /**
     * Animates the cloud by moving it slowly to the left.
     * The animation loop runs at ~60 frames per second.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.x -= 0.3;
        }, 1000 / 60);
    }
}