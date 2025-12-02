/**
 * @fileoverview Defines the {@link StatusBar} class.
 * Represents a generic percentage-based status bar UI element.
 * Displays visual progress (e.g., health, energy, or collected items)
 * through six image states ranging from 0% to 100%.
 *
 * This base class is reused by specific status bars such as:
 * - {@link StatusBarBottle}
 * - {@link StatusBarCoin}
 * - {@link StatusBarBoss}
 *
 * @extends DrawableObject
 * @see DrawableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Generic status bar showing a percentage-based indicator.
 * Used as a base class for all specific status bars.
 *
 * @class StatusBar
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /**
     * Array of image paths representing different status levels (0–100%).
     * Each image corresponds to a percentage step of 20%.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];
    /**
     * Current percentage displayed by the status bar.
     * Determines which image is shown.
     * @type {number}
     */
    percentage = 100;
    /**
     * Creates a new {@link StatusBar} instance.
     * Initializes position, dimensions, and loads all bar images.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    /**
     * Sets the percentage and updates the displayed image accordingly.
     * Automatically maps percentage ranges (0–100%) to a visual index (0–5).
     *
     * @param {number} percentage - The new percentage to display (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    /**
     * Determines the correct image index based on the current percentage.
     * Each 20% step corresponds to one of six available images.
     *
     * @returns {number} The index of the image to display from {@link StatusBar#IMAGES}.
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