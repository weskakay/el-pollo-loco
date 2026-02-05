/**
 * @fileoverview Defines the {@link StatusBarBottle} class.
 * Displays the number of bottles collected by the player
 * using a graphical status bar. Each bar image represents
 * a different fill level (0–100%).
 *
 * Extends {@link StatusBar} to reuse shared percentage logic.
 *
 * @extends StatusBar
 * @see StatusBar
 * @see World
 *
 * @author KW
 * @version 1.1.0
 */

/**
 * Class representing the bottle status bar.
 * Displays the player's collected bottles as a percentage-based
 * progress bar, updated dynamically during gameplay.
 *
 * @class StatusBarBottle
 * @extends StatusBar
 */
class StatusBarBottle extends StatusBar {
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
        this.setPercentage(0);
    }
}