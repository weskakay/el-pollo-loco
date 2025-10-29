/**
 * @fileoverview Defines the {@link BackgroundObject} class.
 * Represents a static background layer (e.g., scenery) for the game world.
 * Each background object fills the screen width and is positioned horizontally
 * to create a continuous parallax scrolling effect.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a background object (e.g., scenery layer).
 * Background objects are rendered as wide, non-interactive layers
 * that move horizontally with the camera but remain fixed vertically.
 *
 * @class BackgroundObject
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {
    /**
     * The fixed width of the background image in pixels.
     * @type {number}
     */
    width = 720;
    /**
     * The fixed height of the background image in pixels.
     * @type {number}
     */
    height = 480;
    /**
     * Creates a new {@link BackgroundObject} instance.
     *
     * @constructor
     * @param {string} imagePath - The path to the background image asset.
     * @param {number} x - The horizontal offset where the image is placed.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
