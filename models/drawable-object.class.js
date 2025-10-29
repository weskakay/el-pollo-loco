/**
 * @fileoverview Defines the {@link DrawableObject} base class.
 * This is the abstract root class for all visual game objects that can be
 * rendered on the canvas. It provides shared functionality for image loading,
 * drawing, and debug frame visualization.
 *
 * Every drawable element (e.g., Character, Chicken, Cloud, BackgroundObject)
 * inherits from this class directly or indirectly.
 *
 * @see MoveableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing, and frame rendering for debugging collisions.
 *
 * @class DrawableObject
 */
class DrawableObject {
    /**
     * Image element representing the current visual state of the object.
     * @type {HTMLImageElement}
     */
    img;
    /**
     * Cache that stores preloaded images by file path.
     * Enables quick swapping of animation frames.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};
    /**
     * Current image index for animation sequences.
     * Used to track which frame is being displayed.
     * @type {number}
     */
    currentImage = 0;
    /**
     * X-axis position of the object on the canvas.
     * @type {number}
     */
    x = 120;
    /**
     * Y-axis position of the object on the canvas.
     * @type {number}
     */
    y = 280;
    /**
     * Height of the object in pixels.
     * @type {number}
     */
    height = 150;
    /**
     * Width of the object in pixels.
     * @type {number}
     */
    width = 100;
    /**
     * Loads a single image into the object.
     *
     * @param {string} path - The path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    /**
     * Draws the object onto the given canvas rendering context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    /**
     * Draws a blue frame around the object for debugging collision boxes.
     * This frame is only rendered for {@link Character} and {@link Chicken} instances.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
    /**
     * Loads multiple images into the {@link DrawableObject#imageCache}.
     * Used primarily for animations to preload all frames before rendering.
     *
     * @param {string[]} arr - Array of image file paths to load.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            const img = new Image();
            img.src = path;
            img.style = 'transform: scaleX(-1)';
            this.imageCache[path] = img;
        });
    }
}