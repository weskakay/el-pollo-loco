/**
 * @fileoverview Defines the {@link StatusBarCoin} class.
 * Displays the number of coins collected by the player using a
 * graphical progress bar. Each image corresponds to a different
 * fill level from 0% to 100%.
 *
 * Extends {@link StatusBar} to reuse shared percentage logic.
 *
 * @extends StatusBar
 * @see StatusBar
 * @see World
 * @see Coin
 *
 * @author KW
 * @version 1.1.0
 */

/**
 * Class representing the coin status bar.
 * Visually displays how many coins the player has collected.
 * The bar dynamically updates as the player picks up coins.
 *
 * @class StatusBarCoin
 * @extends StatusBar
 */
class StatusBarCoin extends StatusBar {
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
        this.setPercentage(0);
    }
}