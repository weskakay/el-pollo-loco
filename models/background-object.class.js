/**
 * Class representing a background object (e.g., scenery).
 * Extends MoveableObject and stays fixed vertically at the bottom.
 */
class BackgroundObject extends MoveableObject {
    /**
     * Background object width.
     * @type {number}
     */
    width = 720;
    /**
     * Background object height.
     * @type {number}
     */
    height = 480;
    /**
     * Creates a new BackgroundObject instance.
     * @param {string} imagePath - The image source path.
     * @param {number} x - The initial horizontal position.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}