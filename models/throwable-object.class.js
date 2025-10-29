/**
 * @fileoverview Defines the {@link ThrowableObject} class.
 * Represents a throwable in-game object such as a bottle.
 * Handles throwing mechanics including gravity, forward motion,
 * and animation during flight.
 *
 * Extends {@link MoveableObject} to inherit gravity, movement,
 * and rendering functionality.
 *
 * @extends MoveableObject
 * @see MoveableObject
 * @see Character
 * @see SoundManager
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a throwable object, such as a salsa bottle.
 * Handles the throwing motion, including upward force and forward trajectory.
 *
 * @class ThrowableObject
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
    /**
     * Creates a new {@link ThrowableObject} instance.
     * Initializes position, dimensions, and applies throwing physics.
     *
     * @constructor
     * @param {number} x - The initial horizontal position on the canvas.
     * @param {number} y - The initial vertical position on the canvas.
     */
    constructor(x, y) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
    }
    /**
     * Applies upward velocity and initiates forward motion to simulate a throw.
     * Uses {@link MoveableObject#applyGravity} for parabolic movement.
     *
     * @returns {void}
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}