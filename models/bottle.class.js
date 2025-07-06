/**
 * Class representing a collectible bottle on the ground.
 * Extends MoveableObject and contains logic for tracking collection and throw state.
 */
class Bottle extends MoveableObject {
    /**
     * The width of the bottle.
     * @type {number}
     */
    width = 80;
    /**
     * The height of the bottle.
     * @type {number}
     */
    height = 80;
    /**
     * The y-position of the bottle.
     * @type {number}
     */
    y = 360;
    /**
     * Whether the bottle has already been thrown.
     * @type {boolean}
     */
    isThrown = false;
    /**
     * Whether the bottle has been collected by the player.
     * @type {boolean}
     */
    collected = false;
    /**
     * Bottle image paths.
     * @type {string[]}
     */
    IMAGES = [
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    /**
     * Creates a new Bottle instance and places it at a random x-position.
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES);
        this.x = 400 + Math.random() * 1500;
    }
}