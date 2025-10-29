/**
 * @fileoverview Defines the {@link StatusBarCoin} class.
 * Displays the number of coins collected by the player using a
 * graphical progress bar. Each image corresponds to a different
 * fill level from 0% to 100%.
 *
 * Extends {@link DrawableObject} to reuse rendering and image-loading logic.
 *
 * @extends DrawableObject
 * @see DrawableObject
 * @see World
 * @see Coin
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing the coin status bar.
 * Visually displays how many coins the player has collected.
 * The bar dynamically updates as the player picks up coins.
 *
 * @class StatusBarCoin
 * @extends DrawableObject
 */
class StatusBarCoin extends DrawableObject {
    /**
     * Array of image paths representing different coin collection levels.
     * Each image corresponds to a percentage threshold (0–100%).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];
    /**
     * Current coin collection percentage displayed by the bar.
     * @type {number}
     */
    percentage = 100;
    /**
     * Creates a new {@link StatusBarCoin} instance.
     * Initializes its position, size, and loads all status images.
     *
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    /**
     * Updates the percentage and refreshes the displayed image accordingly.
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
     * Determines the correct image index based on the current percentage.
     * The bar visually decreases in increments of 20%.
     *
     * @returns {number} The index of the image to display from {@link StatusBarCoin#IMAGES}.
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