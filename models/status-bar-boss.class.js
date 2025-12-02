/**
 * @fileoverview Defines the {@link StatusBarBoss} class.
 * Displays the Endboss's health as a graphical status bar.
 * The bar changes its visual representation based on the boss’s
 * current health percentage (0–100%).
 *
 * Extends {@link DrawableObject} to reuse image loading and rendering logic.
 *
 * @extends DrawableObject
 * @see DrawableObject
 * @see Endboss
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing the Endboss health bar.
 * Responsible for displaying the Endboss's remaining energy visually
 * using a set of preloaded images representing different fill levels.
 *
 * @class StatusBarBoss
 * @extends DrawableObject
 */
class StatusBarBoss extends DrawableObject {
    /**
     * Array of image paths representing different Endboss health levels.
     * Each image corresponds to a percentage step (0–100).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];
    /**
     * Current health percentage of the Endboss (0–100).
     * Determines which image from {@link StatusBarBoss#IMAGES} is displayed.
     * @type {number}
     */
    percentage = 100;
    /**
     * Creates a new {@link StatusBarBoss} instance.
     * Initializes position, size, and loads the appropriate images.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    /**
     * Sets the current percentage value and updates the displayed image.
     * Maps the given percentage to the corresponding image index.
     *
     * @param {number} percentage - New percentage value to display (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    /**
     * Determines the correct image index based on the current percentage.
     * Each range maps to a specific health bar image.
     *
     * @returns {number} The index of the image to display from {@link StatusBarBoss#IMAGES}.
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
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}