/**
 * Class representing a throwable object, like a bottle.
 * Extends MovableObject and handles throwing mechanics.
 */
class ThrowableObject extends MovableObject {
    /**
     * Creates a new ThrowableObject instance.
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     */
    constructor(x, y) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.trow();
    }
    /**
     * Applies an upward force and initiates forward movement.
     */
    trow() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}