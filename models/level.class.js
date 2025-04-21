/**
 * Class representing a level in the game.
 * Contains enemies, clouds, and background objects.
 */
class Level {
    /**
     * Array of enemy objects.
     * @type {MovableObject[]}
     */
    enemies;
    /**
     * Array of cloud objects.
     * @type {Cloud[]}
     */
    clouds;
    /**
     * Array of background objects.
     * @type {BackgroundObject[]}
     */
    backgroundObjects;
    /**
     * X coordinate where the level ends.
     * @type {number}
     */
    level_end_x = 2200;
    /**
     * Creates a new Level instance.
     * @param {MovableObject[]} enemies - Array of enemy instances.
     * @param {Cloud[]} clouds - Array of cloud instances.
     * @param {BackgroundObject[]} backgroundObjects - Array of background object instances.
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}