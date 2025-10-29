/**
 * @fileoverview Defines the {@link Bottle} class.
 * Represents a collectible bottle that can be picked up by the player
 * and later thrown as a projectile. Extends {@link MoveableObject}.
 * Bottles appear randomly across the ground within the level.
 *
 * @extends MoveableObject
 * @see ThrowableObject
 * @see World
 * 
 * @author KW
 * @version 1.0.0
 */

/**
 * Class representing a collectible salsa bottle on the ground.
 * Extends {@link MoveableObject} and manages both collection and
 * throw states for player interaction.
 *
 * @class Bottle
 * @extends MoveableObject
 */
class Bottle extends MoveableObject {
    /**
     * The width of the bottle sprite in pixels.
     * @type {number}
     */
    width = 80;
    /**
     * The height of the bottle sprite in pixels.
     * @type {number}
     */
    height = 80;
    /**
     * The vertical position (y-axis) where bottles rest on the ground.
     * @type {number}
     */
    y = 360;
    /**
     * Indicates whether the bottle has already been thrown.
     * Used to prevent multiple throws from the same instance.
     * @type {boolean}
     */
    isThrown = false;
    /**
     * Indicates whether the bottle has been collected by the player.
     * @type {boolean}
     */
    collected = false;
    /**
     * Image paths for the bottle’s animation or states.
     * @type {string[]}
     */
    IMAGES = [
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    /**
     * Creates a new {@link Bottle} instance and places it at a random horizontal position.
     * The bottle is loaded with its ground image and prepared for rendering.
     *
     * @constructor
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES);
        this.x = 400 + Math.random() * 1500;
    }
}