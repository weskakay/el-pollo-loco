/**
 * @fileoverview Defines the {@link StatusBarBoss} class.
 * Displays the Endboss's health as a graphical status bar.
 * The bar changes its visual representation based on the boss's
 * current health percentage (0–100%).
 *
 * Extends {@link StatusBar} to reuse shared percentage logic.
 *
 * @extends StatusBar
 * @see StatusBar
 * @see Endboss
 *
 * @author KW
 * @version 1.1.0
 */

/**
 * Class representing the Endboss health bar.
 * Responsible for displaying the Endboss's remaining energy visually
 * using a set of preloaded images representing different fill levels.
 *
 * @class StatusBarBoss
 * @extends StatusBar
 */
class StatusBarBoss extends StatusBar {
    /**
     * Array of image paths representing different Endboss health levels.
     * Each image corresponds to a percentage step (0–100).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

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
}