/**
 * @fileoverview Defines the {@link StatusBarBottle} class.
 * Displays the number of bottles collected by the player
 * using a graphical status bar. Each bar image represents
 * a different fill level (0–100%).
 *
 * Extends {@link DrawableObject} to reuse shared image rendering
 * and loading functionality.
 *
 * @extends DrawableObject
 * @see DrawableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing the bottle status bar.
 * Displays the player’s collected bottles as a percentage-based
 * progress bar, updated dynamically during gameplay.
 *
 * @class StatusBarBottle
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
    /**
     * Array of image paths representing the bottle status levels.
     * Each image corresponds to a percentage range from 0% to 100%.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];
    /**
     * Current bottle collection percentage displayed by the bar.
     * @type {number}
     */
    percentage = 100;
    /**
     * Creates a new {@link StatusBarBottle} instance.
     * Initializes position, size, and loads all required images.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    /**
     * Updates the displayed percentage and selects the corresponding image.
     *
     * @param {number} percentage - New percentage value (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    /**
     * Determines which image index to display based on the percentage range.
     *
     * @returns {number} The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}