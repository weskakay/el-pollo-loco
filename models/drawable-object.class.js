/**
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing, and frame drawing for collision detection.
 */
class DrawableObject {
    /**
     * Image element for the object.
     * @type {HTMLImageElement}
     */
    img;
    /**
     * Cache for preloaded images.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};
    /**
     * Current image index for animations.
     * @type {number}
     */
    currentImage = 0;
    /**
     * X position on the canvas.
     * @type {number}
     */
    x = 120;
    /**
     * Y position on the canvas.
     * @type {number}
     */
    y = 280;
    /**
     * Height of the object.
     * @type {number}
     */
    height = 150;
    /**
     * Width of the object.
     * @type {number}
     */
    width = 100;
    /**
     * Loads a single image.
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="iamge" src>
        this.img.src = path;
    }
    /**
     * Draws the object on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    /**
     * Draws a frame around the object for debugging collisions.
     * Only visible for Character and Chicken objects.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
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
     * Loads multiple images into the cache.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.style = 'transform: scaleX(-1)';
            this.imageCache[path] = img;
        });
    }
}