/**
 * Displays the health of the endboss.
 * @extends StatusBar
 */
class StatusBarBoss extends DrawableObject {
    /**
     * Array of image paths representing different status levels.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png', // 0
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png' // 5
    ];
    /**
     * Current percentage displayed by the status bar for endboss.
     * @type {number}
     */
    percentage = 100;
    /**
     * Creates a new StatusBar instance for endboss.
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
     * Sets the percentage and updates the displayed image accordingly.
     * @param {number} percentage - New percentage to display (0-100). setPercentage(50);
     */
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    /**
     * Resolves the correct image index based on the current percentage.
     * @returns {number} Index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
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

